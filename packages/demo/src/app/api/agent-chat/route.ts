// Agent Chat API - Main chat endpoint with autonomous payment logic
// Supports: standard chat, agent-to-agent workflows
// This route handles chat messages and executes x402 payments when premium features are requested

import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { createPayingAgent } from '@alleyboss/micropay-solana-x402-paywall/agent';
import bs58 from 'bs58';
import { getAgentKeypair, getConnection, validateAgentWallet } from '@/lib/agent-wallet';
import { getCreatorWallet } from '@/lib/config';
import { AGENTS } from '@/config/agents';

// Initialize OpenAI client
// SAFETY: API Key is strict server-side environment variable. Never exposed to client.
const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

console.log('[Agent Chat] OpenAI configured:', !!openai);

// Rate Limiting (Simple In-Memory)
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;
const requestLog = new Map<string, { count: number; expires: number }>();

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = requestLog.get(ip);

    // Cleanup old record
    if (record && now > record.expires) {
        requestLog.delete(ip);
    }

    if (!requestLog.has(ip)) {
        requestLog.set(ip, { count: 1, expires: now + RATE_LIMIT_WINDOW });
        return true;
    }

    const current = requestLog.get(ip)!;
    if (current.count >= MAX_REQUESTS) return false;

    current.count++;
    return true;
}

// Strict Topic Filtering (Save OpenAI Costs)
const ALLOWED_TOPICS = [
    'x402', 'solana', 'crypto', 'payment', 'blockchain', 'agent', 'analysis',
    'bitcoin', 'btc', 'eth', 'price', 'market', 'token', 'wallet', 'demo',
    'devnet', 'micropay', 'ai', 'research', 'report', 'hello', 'hi', 'help',
    'what', 'how', 'why', 'who', 'test', 'try'
];

async function generateAIResponse(message: string, isPremium: boolean, send: (v: any) => void) {
    if (!openai) {
        // Fallback for demo without API Key
        await new Promise(r => setTimeout(r, 800));
        send({
            type: 'content',
            content: "I'm in demo mode (no OpenAI key). I can simulate agent payments!",
            isPremium: false
        });
        return;
    }

    const systemPrompt = `You are a specialized AI Agent demonstrating the x402 payment protocol on Solana.
    Context:
    - User is in a "Paywall Demo"
    - You handle micropayments autonomously
    - Current Mode: ${isPremium ? 'PREMIUM (Payment Verified)' : 'STANDARD (Restricted)'}
    
    Style:
    - Professional but enthusiastic about crypto/agents
    - Keep answers short and demo-focused
    ${!isPremium ? '- If user asks complex questions, mention you need a 0.001 SOL payment to "think deep"' : ''}
    `;

    try {
        const stream = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            stream: true,
        });

        let fullContent = '';
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                fullContent += content;
                send({ type: 'token', content });
            }
        }
    } catch (e: any) {
        console.error('OpenAI Error:', e);
        send({ type: 'content', content: "I'm having trouble connecting to my brain (OpenAI). Try again?", isPremium: false });
    }
}

async function generateAnalysisAgentResponse(message: string, send: (v: any) => void) {
    if (!openai) {
        await new Promise(r => setTimeout(r, 1000));
        send({
            type: 'content',
            content: `**Analysis Report (Demo)**\n\nI have analyzed the request: "${message}"\n\n**Findings:**\n- Market Sentiment: Bullish 🟢\n- On-Chain Volume: High 📊\n- Recommendation: **Accumulate**\n\n*Payment verified on-chain via x402.*`,
            isPremium: true,
            agentName: 'Analysis Agent'
        });
        return;
    }

    const systemPrompt = `You are an Expert Analysis Agent that has just been PAID 0.001 SOL to perform a deep dive.
    Act like a high-end financial consultant or senior crypto researcher.
    Format your response with Markdown.
    Include sections: 📊 Analysis, 💡 Insight, 🔮 Prediction.
    Keep it concise but valuable.
    `;

    try {
        const stream = await openai.chat.completions.create({
            model: 'gpt-4o', // Use smarter model for premium
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            stream: true,
        });

        let fullContent = '';
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                fullContent += content;
                send({ type: 'token', content, agentName: 'Analysis Agent' });
            }
        }
    } catch (e) {
        send({ type: 'content', content: "Analysis failed due to API error.", isPremium: true, agentName: 'Analysis Agent' });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { message, history, mode } = await req.json();

        // Debug Env Vars
        console.log('[AgentChat] PLATFORM_FACILITATOR_URL:', process.env.PLATFORM_FACILITATOR_URL);
        console.log('[AgentChat] PAYAI_FACILITATOR_URL:', process.env.PAYAI_FACILITATOR_URL);
        console.log('[AgentChat] Mode:', mode);

        // Rate Limit Check
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        if (!checkRateLimit(ip)) {
            return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again later." }), { status: 429 });
        }

        // Topic Filter
        const isTopicAllowed = ALLOWED_TOPICS.some(t => message.toLowerCase().includes(t));
        // We act leniently for demo

        const isPremiumRequest = message.toLowerCase().includes('analyze') ||
            message.toLowerCase().includes('report') ||
            message.toLowerCase().includes('expert') ||
            message.toLowerCase().includes('prediction');

        // FORCE Private Flow if mode is 'agent-to-agent' (User Request)
        // Otherwise fallback to keyword detection
        const needsAgentPayment = mode === 'agent-to-agent' || isPremiumRequest;

        // ENABLE standard Agent-to-API payments for all OTHER requests
        // If it's NOT agent-to-agent flow, it is Standard flow.
        const isPremium = !needsAgentPayment;

        // Create Stream
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                const send = (data: any) => {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
                }

                const close = () => {
                    controller.close();
                }

                if (needsAgentPayment) {
                    // Agent-to-Agent Workflow (Refactored for v3.5.1)
                    const thoughtDelay = 1200;

                    // 1. Initial Thinking
                    send({ type: 'thinking', id: 'init', stepType: 'thinking', message: 'Research Agent: Interpreting request...' });
                    await new Promise(r => setTimeout(r, thoughtDelay));

                    // 2. Routing Decision
                    send({ type: 'thinking', id: 'route', stepType: 'thinking', message: 'Routing: Request requires [Analysis Agent] capability.' });
                    await new Promise(r => setTimeout(r, thoughtDelay));

                    // 3. Wallet Check
                    const walletStatus = await validateAgentWallet();
                    if (!walletStatus.configured || (walletStatus.balance && walletStatus.balance < 0.003)) {
                        send({ type: 'thinking', id: 'err', stepType: 'error', message: 'Wallet Error: Insufficient funds.' });
                        send({ type: 'content', content: `❌ **Agent Error:** My wallet is empty. Please fund me!`, isPremium: false });
                        close();
                        return;
                    }

                    // 4. Quotation / Negotiation
                    send({ type: 'thinking', id: 'neg', stepType: 'thinking', message: `Negotiation: Analysis Agent demands payment (402).` });
                    await new Promise(r => setTimeout(r, thoughtDelay));

                    // 5. Execution via createPayingAgent
                    send({ type: 'thinking', id: 'exec', stepType: 'paying', message: 'Action: Paying via x402 Protocol...', amount: '0.002 SOL' });

                    try {
                        // Dynamic URL resolution based on request host (solves IPv4/IPv6 loopback issues)
                        const host = req.headers.get('host') || 'localhost:3000';
                        const protocol = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('[::1]') ? 'http' : 'https';
                        const APP_URL = `${protocol}://${host}`;
                        const SERVICE_URL = `${APP_URL}/api/analysis-agent`;
                        console.log('[AgentChatDebug] Target SERVICE_URL:', SERVICE_URL);

                        // Init Agent
                        const keypair = getAgentKeypair();
                        const privateKey = bs58.encode(keypair.secretKey);
                        const agent = createPayingAgent(privateKey, {
                            network: (process.env.NEXT_PUBLIC_SOLANA_NETWORK as any) || 'devnet',
                            maxPaymentPerRequest: 100_000_000n, // 0.1 SOL safety cap
                            rpcUrl: process.env.NEXT_PUBLIC_RPC_URL
                        });

                        // Call Service (Handles 402 -> Pay -> Retry)
                        const res = await agent.post(SERVICE_URL, { context: message });
                        const data = await res.json();

                        if (!res.ok) throw new Error(data.error || 'Agent call failed');

                        send({ type: 'thinking', id: 'cnf', stepType: 'confirmed', message: `Success: Analysis Agent paid & responded.`, signature: 'Auto-Signed', agent: 'Research Agent' });
                        await new Promise(r => setTimeout(r, thoughtDelay));

                        send({ type: 'thinking', id: 'sw', stepType: 'confirmed', message: 'Handover: Context switching to [Analysis Agent]...', agent: 'Research Agent' });
                        await new Promise(r => setTimeout(r, thoughtDelay));

                        send({ type: 'thinking', id: 'an1', stepType: 'thinking', message: 'Analysis Agent: Processing paid request...', agent: 'Analysis Agent' });
                        await new Promise(r => setTimeout(r, thoughtDelay));

                        // Inject findings
                        await generateAnalysisAgentResponse(message + `\n\n[Input: ${data.insight}]`, send);

                    } catch (e: any) {
                        console.error('Agent-to-Agent Fail:', e);
                        send({ type: 'thinking', id: 'err', stepType: 'error', message: `Payment Failed: ${e.message}` });
                        send({ type: 'content', content: `❌ Error: ${e.message}`, isPremium: false });
                    }
                    close();
                    return;
                }

                if (isPremium) {
                    const d = 500;
                    send({ type: 'thinking', id: 't1', stepType: 'thinking', message: 'Thinking: Identifying intent...' });
                    await new Promise(r => setTimeout(r, d));

                    send({ type: 'thinking', id: 't2', stepType: 'thinking', message: 'Intent: Premium API resource request.' });
                    await new Promise(r => setTimeout(r, d));

                    const walletStatus = await validateAgentWallet();
                    if (!walletStatus.configured || (walletStatus.balance && walletStatus.balance < 0.003)) {
                        send({ type: 'thinking', id: 'err', stepType: 'error', message: 'Wallet Check: Failed (Low Balance).' });
                        send({ type: 'content', content: `❌ **Failed:** Check agent wallet.`, isPremium: false });
                        close();
                        return;
                    }

                    // --- NEW: The "Sexiest Way" (v3.5) ---
                    // We use the createPayingAgent helper to handle the entire negotiation/payment loops automatically.

                    // Dynamic URL resolution based on request host (solves IPv4/IPv6 loopback issues)
                    const host = req.headers.get('host') || 'localhost:3000';
                    const protocol = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('[::1]') ? 'http' : 'https';
                    const APP_URL = `${protocol}://${host}`;

                    const ORACLE_URL = `${APP_URL}/api/agent-oracle`;
                    console.log('[AgentChatDebug] Target ORACLE_URL:', ORACLE_URL);

                    send({ type: 'thinking', id: 'p1', stepType: 'paying', message: `Action: Fetching premium data via createPayingAgent()...`, amount: 'Auto' });

                    try {
                        // 1. Initialize Agent (One Liner)
                        const keypair = getAgentKeypair();
                        const privateKey = bs58.encode(keypair.secretKey);

                        const agent = createPayingAgent(privateKey, {
                            network: (process.env.NEXT_PUBLIC_SOLANA_NETWORK as any) || 'devnet',
                            maxPaymentPerRequest: 100_000_000n, // 0.1 SOL safety cap
                            rpcUrl: process.env.NEXT_PUBLIC_RPC_URL
                        });

                        // 2. Fetch (Handles 402 -> Pay -> Retry automatically)
                        send({ type: 'thinking', id: 'p2', stepType: 'paying', message: `Network: Negotiating 402 Payment...` });

                        const res = await agent.get(ORACLE_URL);

                        if (!res.ok) {
                            throw new Error(`Oracle returned ${res.status}: ${res.statusText}`);
                        }

                        const data = await res.json();

                        // 3. Success
                        send({ type: 'thinking', id: 'cnf', stepType: 'confirmed', message: `Success: Payment verified. Data retrieved!`, signature: 'Auto-Signed' });
                        await new Promise(r => setTimeout(r, d));

                        send({ type: 'thinking', id: 'gen', stepType: 'complete', message: 'Generation: Streaming response from Oracle...' });
                        await new Promise(r => setTimeout(r, d));

                        // Inject Oracle findings into context
                        const oracleContext = `ORACLE DATA: ${JSON.stringify(data.data)}. Use this to answer the user validation request.`;
                        await generateAIResponse(oracleContext + "\n\n" + message, isPremium, send);

                        close();
                        return;

                    } catch (e: any) {
                        console.error('Agent Payment Error:', e);
                        send({ type: 'thinking', id: 'err', stepType: 'error', message: `Payment Error: ${e.message}` });
                        send({ type: 'content', content: `❌ Error: ${e.message}`, isPremium: false });
                        close();
                        return;
                    }
                }

                await generateAIResponse(message, isPremium, send);
                close();
            }
        });

        return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
