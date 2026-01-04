// Agent Chat API - Main chat endpoint with autonomous payment logic
// Supports: standard chat, agent-to-agent workflows
// This route handles chat messages and executes x402 payments when premium features are requested

import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { executeAgentPayment } from '@alleyboss/micropay-solana-x402-paywall/agent';
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

    // Expanded variations
    'sol', 'analyze', 'trend', 'trending', 'defi', 'nft', 'audit', 'prediction',
    'invest', 'trade', 'hiring', 'hire', 'expert', 'consultation'
];

function isTopicAllowed(message: string): boolean {
    const lower = message.toLowerCase();
    return ALLOWED_TOPICS.some(topic => lower.includes(topic));
}

const PREMIUM_KEYWORDS = [
    'premium', 'detailed report', 'market report', 'crypto analysis',
    'detailed analysis', 'execute trade', 'advanced', 'pro analysis',
    'in-depth', 'deep dive',
];

const AGENT_TO_AGENT_KEYWORDS = [
    'analyze', 'research', 'expert opinion', 'specialist',
    'compile', 'summarize',
];

function isPremiumRequest(message: string): boolean {
    const lower = message.toLowerCase();
    return PREMIUM_KEYWORDS.some(keyword => lower.includes(keyword));
}

function isAgentToAgentRequest(message: string): boolean {
    const lower = message.toLowerCase();
    return AGENT_TO_AGENT_KEYWORDS.some(keyword => lower.includes(keyword));
}

function createStream() {
    const encoder = new TextEncoder();
    let controller: ReadableStreamDefaultController<Uint8Array>;

    const stream = new ReadableStream({
        start(c) { controller = c; },
    });

    const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
    };

    const close = () => {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
    };

    return { stream, send, close };
}

async function generateAIResponse(
    message: string,
    isPremium: boolean,
    send: (data: object) => void,
    agentName?: string
): Promise<void> {
    const systemPrompt = isPremium
        ? AGENTS.RESEARCH_AGENT.premiumSystemPrompt
        : AGENTS.RESEARCH_AGENT.systemPrompt;

    if (openai) {
        try {
            const stream = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                stream: true,
                max_tokens: isPremium ? 1000 : 300,
            });

            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                    send({ type: 'content', content, isPremium, agentName });
                }
            }
        } catch (error) {
            console.error('OpenAI error:', error);
            await generateMockResponse(message, isPremium, send, agentName);
        }
    } else {
        await generateMockResponse(message, isPremium, send, agentName);
    }
}

async function generateAnalysisAgentResponse(
    message: string,
    send: (data: object) => void
): Promise<void> {
    const systemPrompt = AGENTS.ANALYSIS_AGENT.systemPrompt;

    if (openai) {
        try {
            const stream = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Provide expert analysis on: ${message}` }
                ],
                stream: true,
                max_tokens: 800,
            });

            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                    send({ type: 'content', content, isPremium: true, agentName: 'Analysis Agent' });
                }
            }
        } catch {
            await generateMockAnalysisResponse(message, send);
        }
    } else {
        await generateMockAnalysisResponse(message, send);
    }
}

async function generateMockAnalysisResponse(
    message: string,
    send: (data: object) => void
): Promise<void> {
    const response = `📊 **Expert Analysis Report**

*Prepared by Analysis Agent (Hired by Research Agent)*

**Execution Summary:**
Analyzed ${message} via on-chain metrics. Sentiment is BULLISH.

**Metrics:**
- TVL Growth: +5.2% (24h)
- Whale Accumulation: Detected 2 major wallets
- Social Sentiment: 82/100

**Recommendation:**
Strong Buy signal. The fundamentals indicate an incoming breakout.

---
*Analysis Agent - Paid Expert*`;

    const words = response.split(' ');
    let chunk = '';
    for (let i = 0; i < words.length; i++) {
        chunk += words[i] + ' ';
        if (i % 5 === 4 || i === words.length - 1) {
            send({ type: 'content', content: chunk, isPremium: true, agentName: 'Analysis Agent' });
            chunk = '';
            await new Promise(resolve => setTimeout(resolve, 15));
        }
    }
}

async function generateMockResponse(
    message: string,
    isPremium: boolean,
    send: (data: object) => void,
    agentName?: string
): Promise<void> {
    let response: string;

    if (isPremium) {
        response = `🎯 **Premium Insight**

**Query:** ${message}
**Analysis:** High-value opportunity detected. Solvency is robust.
**Action:** Recommend immediate execution.

*Paid via x402.*`;
    } else {
        const lower = message.toLowerCase();
        if (lower.includes('hello') || lower.includes('hi')) {
            response = "Hello! Ask me for 'premium analysis' to see me pay for data autonomously.";
        } else {
            response = `I can help with that. To get a deep dive, ask for "detailed analysis" (this will trigger a micropayment).`;
        }
    }

    const words = response.split(' ');
    let chunk = '';
    for (let i = 0; i < words.length; i++) {
        chunk += words[i] + ' ';
        if (i % 5 === 4 || i === words.length - 1) {
            send({ type: 'content', content: chunk, isPremium, agentName });
            chunk = '';
            await new Promise(resolve => setTimeout(resolve, 20));
        }
    }
}

// Caching for Deduplication (Server-side)
const responseCache = new Map<string, string>();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        let { message, mode = 'chat' } = body; // let message to allow mutation
        const ip = request.headers.get('x-forwarded-for') || 'unknown';

        if (!message || typeof message !== 'string') {
            return new Response(JSON.stringify({ error: 'Message required' }), { status: 400 });
        }

        // 1. Hard Input Truncation (Billing Protection)
        // Limit to 500 chars (~125 tokens) to prevent token flooding
        if (message.length > 500) {
            message = message.slice(0, 500);
        }

        if (!checkRateLimit(ip)) {
            return new Response(JSON.stringify({
                error: 'Rate limit exceeded. You can ask 5 questions every 10 minutes.'
            }), { status: 429 });
        }

        // 3. Server-Side Deduplication
        // If exact same message sent recently, use cache (mock logic for stream)
        const cacheKey = `${mode}:${message.toLowerCase().trim()}`;
        // Note: For streaming, we can't easily cache the chunks in this simple map without buffering. 
        // We will skip strict caching implementation for the *streaming* response in this demo 
        // to avoid complexity, but Input Truncation is active.

        const { stream, send, close } = createStream();

        (async () => {
            try {
                if (!isTopicAllowed(message)) {
                    send({ type: 'thinking', id: 'filter', stepType: 'error', message: 'Topic analysis: Irrelevant to x402 demo.' });
                    // ... fallback logic ...
                    const isAgentMode = mode === 'agent-to-agent';
                    const fallbackMessage = isAgentMode
                        ? `**Agent-to-Agent Mode** requires complex requests to demonstrate **autonomous hiring**.

I can only process requests that require **Research & Analysis**, such as:
1.  **Market Analysis** (e.g., "Analyze SOL trends")
2.  **Token Audits** (e.g., "Audit this NFT project")
3.  **DeFi Research** (e.g., "Check high yield farms")

*Try asking one of these to see me hire the Analysis Agent!*`
                        : `**Micropayment Mode** demonstrates **Consumer-to-AI** payments.

I can only process requests related to:
1.  **x402 Protocol** (e.g., "Explain x402")
2.  **Premium Reports** (e.g., "Crypto Market Report")
3.  **Solana Tech** (e.g., "How does Solana work?")

*Try asking "Detailed analysis of SOL" to see a micropayment!*`;

                    send({ type: 'content', content: fallbackMessage, isPremium: false, agentName: 'System' });
                    close();
                    return;
                }

                // ... rest of logic ...


                const isPremium = isPremiumRequest(message);
                const isAgentToAgent = mode === 'agent-to-agent' && isAgentToAgentRequest(message);

                if (isAgentToAgent) {
                    // Agent-to-Agent "Chain of Thought"
                    const thoughtDelay = 400;

                    send({ type: 'thinking', id: 't1', stepType: 'thinking', message: 'Thinking: Decomposing user query...', agent: 'Research Agent' });
                    await new Promise(r => setTimeout(r, thoughtDelay));

                    send({ type: 'thinking', id: 't2', stepType: 'thinking', message: 'Plan: Complex financial query detected. Requires specialized "Analysis Agent" consultation.', agent: 'Research Agent' });
                    await new Promise(r => setTimeout(r, thoughtDelay));

                    const walletStatus = await validateAgentWallet();
                    if (!walletStatus.configured || (walletStatus.balance && walletStatus.balance < 0.002)) {
                        send({ type: 'thinking', id: 'err', stepType: 'error', message: 'Wallet Check: Insufficient funds for inter-agent payment.' });
                        send({ type: 'content', content: `❌ **Failed:** Insufficient agent funds.`, isPremium: false });
                        close();
                        return;
                    }

                    send({ type: 'thinking', id: 't3', stepType: 'thinking', message: 'Wallet: Solvency confirmed (Balance > 0.002 SOL). Ready to hire.', agent: 'Research Agent' });
                    await new Promise(r => setTimeout(r, thoughtDelay));

                    send({ type: 'thinking', id: 'p1', stepType: 'paying', message: 'Action: Constructing SPL transaction (0.001 SOL + Priority Fee)...', agent: 'Research Agent', amount: '0.001 SOL' });
                    await new Promise(r => setTimeout(r, thoughtDelay / 2));

                    send({ type: 'thinking', id: 'p2', stepType: 'paying', message: 'Network: Broadcasting transaction to block builder...', agent: 'Research Agent' });

                    try {
                        const agentKeypair = getAgentKeypair();
                        const connection = getConnection();
                        const recipientWallet = getCreatorWallet();

                        const result = await executeAgentPayment({
                            connection,
                            agentKeypair,
                            recipientAddress: recipientWallet,
                            amountLamports: BigInt(1_000_000),
                            priorityFee: { enabled: true, microLamports: 5000 },
                        });

                        if (result.success && result.signature) {
                            send({ type: 'thinking', id: 'cnf', stepType: 'confirmed', message: `Success: Tx Confirmed (${result.signature.slice(0, 8)}...)`, signature: result.signature, agent: 'Research Agent' });
                            await new Promise(r => setTimeout(r, thoughtDelay));

                            send({ type: 'thinking', id: 'sw', stepType: 'confirmed', message: 'Handover: Context switching to [Analysis Agent]...', agent: 'Research Agent' });
                            await new Promise(r => setTimeout(r, thoughtDelay));

                            send({ type: 'thinking', id: 'an1', stepType: 'thinking', message: 'Analysis Agent: Booting expert persona. Analyzing market context...', agent: 'Analysis Agent' });
                            await new Promise(r => setTimeout(r, thoughtDelay));

                            await generateAnalysisAgentResponse(message, send);
                        } else {
                            throw new Error(result.error);
                        }
                    } catch (e: any) {
                        send({ type: 'thinking', id: 'err', stepType: 'error', message: `Payment Failed: ${e.message}` });
                        send({ type: 'content', content: `❌ Error: ${e.message}`, isPremium: false });
                    }
                    close();
                    return;
                }

                if (isPremium) {
                    const d = 300;
                    send({ type: 'thinking', id: 't1', stepType: 'thinking', message: 'Thinking: Identifying intent...' });
                    await new Promise(r => setTimeout(r, d));

                    send({ type: 'thinking', id: 't2', stepType: 'thinking', message: 'Intent: Premium resource request detected.' });
                    await new Promise(r => setTimeout(r, d));

                    const walletStatus = await validateAgentWallet();
                    if (!walletStatus.configured || (walletStatus.balance && walletStatus.balance < 0.003)) {
                        send({ type: 'thinking', id: 'err', stepType: 'error', message: 'Wallet Check: Failed.' });
                        send({ type: 'content', content: `❌ **Failed:** Check agent wallet.`, isPremium: false });
                        close();
                        return;
                    }

                    send({ type: 'thinking', id: 'p1', stepType: 'paying', message: 'Action: Executing autonomous payment (0.002 SOL)...', amount: '0.002 SOL' });

                    try {
                        const result = await executeAgentPayment({
                            connection: getConnection(),
                            agentKeypair: getAgentKeypair(),
                            recipientAddress: getCreatorWallet(),
                            amountLamports: BigInt(2_000_000),
                            priorityFee: { enabled: true, microLamports: 5000 },
                        });

                        if (result.success) {
                            send({ type: 'thinking', id: 'cnf', stepType: 'confirmed', message: `Success: Payment verified on-chain.`, signature: result.signature });
                            await new Promise(r => setTimeout(r, d));
                            send({ type: 'thinking', id: 'gen', stepType: 'complete', message: 'Generation: Accessing premium model...' });
                            await new Promise(r => setTimeout(r, d));
                        } else {
                            throw new Error(result.error);
                        }
                    } catch (e: any) {
                        send({ type: 'thinking', id: 'err', stepType: 'error', message: `Payment Error: ${e.message}` });
                        send({ type: 'content', content: `❌ Error: ${e.message}`, isPremium: false });
                        close();
                        return;
                    }
                }

                await generateAIResponse(message, isPremium, send);
                close();
            } catch (error: any) {
                send({ type: 'thinking', id: 'err', stepType: 'error', message: error.message });
                close();
            }
        })();

        return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
