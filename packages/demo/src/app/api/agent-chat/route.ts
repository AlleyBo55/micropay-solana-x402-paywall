// Agent Chat API - Main chat endpoint with autonomous payment logic
// This route handles chat messages and executes x402 payments when premium features are requested

import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { executeAgentPayment } from '@alleyboss/micropay-solana-x402-paywall/agent';
import { getAgentKeypair, getConnection, validateAgentWallet } from '@/lib/agent-wallet';
import { getCreatorWallet } from '@/lib/config';

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

// Premium action keywords that trigger payment
const PREMIUM_KEYWORDS = [
    'premium',
    'detailed report',
    'market report',
    'crypto analysis',
    'detailed analysis',
    'execute trade',
    'advanced',
    'pro analysis',
    'in-depth',
];

// Check if message requests a premium action
function isPremiumRequest(message: string): boolean {
    const lower = message.toLowerCase();
    return PREMIUM_KEYWORDS.some(keyword => lower.includes(keyword));
}

// Create a streaming response
function createStream() {
    const encoder = new TextEncoder();
    let controller: ReadableStreamDefaultController<Uint8Array>;

    const stream = new ReadableStream({
        start(c) {
            controller = c;
        },
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

// Generate AI response using OpenAI or fallback
async function generateAIResponse(
    message: string,
    isPremium: boolean,
    send: (data: object) => void
): Promise<void> {
    const systemPrompt = isPremium
        ? `You are a premium AI analyst providing detailed, expert-level analysis. 
           The user has paid for this response via x402 micropayment on Solana.
           Provide comprehensive, actionable insights with specific data points.
           Format your response with clear sections using markdown.
           Be thorough but concise. Include specific recommendations.`
        : `You are a helpful AI assistant demonstrating x402 micropayments on Solana.
           For free queries, give brief, helpful responses.
           Encourage users to try premium features by asking for "detailed analysis" or "premium report".
           Keep responses short and friendly.`;

    if (openai) {
        // Use real OpenAI
        try {
            const stream = await openai.chat.completions.create({
                model: isPremium ? 'gpt-4o' : 'gpt-4o-mini',
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
                    send({
                        type: 'content',
                        content,
                        isPremium,
                    });
                }
            }
        } catch (error) {
            // Fallback to mock if OpenAI fails
            console.error('OpenAI error:', error);
            await generateMockResponse(message, isPremium, send);
        }
    } else {
        // No OpenAI key, use mock
        await generateMockResponse(message, isPremium, send);
    }
}

// Mock response generator (fallback when OpenAI isn't configured)
async function generateMockResponse(
    message: string,
    isPremium: boolean,
    send: (data: object) => void
): Promise<void> {
    let response: string;

    if (isPremium) {
        response = `🎯 **Premium Analysis Report**

**Market Overview:**
The cryptocurrency market is showing mixed signals with Bitcoin consolidating around key support levels. Volume has decreased 12% over the past 24 hours, suggesting accumulation phase.

**Technical Indicators:**
- RSI (14): 52.3 - Neutral zone
- MACD: Bullish crossover forming on 4H chart
- Bollinger Bands: Price near middle band, low volatility

**Key Levels to Watch:**
- Support: $42,100, $40,500
- Resistance: $44,200, $46,000

**Recommendation:**
Wait for clear breakout above $44,200 before entering long positions. Set stop-loss at $41,800.

*This analysis was paid for via x402 micropayment on Solana.*`;
    } else {
        const lower = message.toLowerCase();
        if (lower.includes('hello') || lower.includes('hi')) {
            response = "Hello! I'm an AI agent that can pay for premium features using x402 micropayments on Solana. Try asking for 'premium crypto analysis' to see autonomous payments in action!";
        } else {
            response = `I understand you asked: "${message}"

I'm a demo AI agent showcasing x402 micropayments. For free queries like this, I give basic responses.

**Want to see payments in action?** Try asking for:
- "Give me premium crypto analysis"
- "Generate detailed market report"

These premium requests will trigger an automatic SOL payment!`;
        }
    }

    // Simulate streaming
    const words = response.split(' ');
    let chunk = '';
    for (let i = 0; i < words.length; i++) {
        chunk += words[i] + ' ';
        if (i % 5 === 4 || i === words.length - 1) {
            send({
                type: 'content',
                content: chunk,
                isPremium,
            });
            chunk = '';
            await new Promise(resolve => setTimeout(resolve, 20));
        }
    }
}

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();

        if (!message || typeof message !== 'string') {
            return new Response(JSON.stringify({ error: 'Message required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { stream, send, close } = createStream();

        // Process in background
        (async () => {
            try {
                const isPremium = isPremiumRequest(message);

                if (isPremium) {
                    // Step 1: Analyzing request
                    send({
                        type: 'thinking',
                        id: 'analyze',
                        stepType: 'thinking',
                        message: 'Analyzing request... detected premium action',
                    });

                    await new Promise(resolve => setTimeout(resolve, 500));

                    // Step 2: Validate wallet configuration first
                    const walletStatus = await validateAgentWallet();

                    if (!walletStatus.configured) {
                        send({
                            type: 'thinking',
                            id: 'wallet-error',
                            stepType: 'error',
                            message: `Wallet not configured: ${walletStatus.error}`,
                        });
                        send({
                            type: 'content',
                            content: `❌ **Payment Failed**\n\nAgent wallet is not configured properly.\n\n**Error:** ${walletStatus.error}\n\nPlease configure AGENT_KEYPAIR_SECRET in your .env.local file.`,
                            isPremium: false,
                        });
                        close();
                        return;
                    }

                    // Check balance
                    if (walletStatus.balance !== undefined && walletStatus.balance < 0.003) {
                        send({
                            type: 'thinking',
                            id: 'balance-error',
                            stepType: 'error',
                            message: `Insufficient balance: ${walletStatus.balance.toFixed(4)} SOL`,
                        });
                        send({
                            type: 'content',
                            content: `❌ **Payment Failed**\n\nInsufficient agent wallet balance.\n\n**Current Balance:** ${walletStatus.balance?.toFixed(4)} SOL\n**Required:** ~0.003 SOL (0.002 + fees)\n\n**Address:** \`${walletStatus.address}\`\n\nFund the wallet on Devnet:\n\`\`\`\nsolana airdrop 2 ${walletStatus.address} --url devnet\n\`\`\``,
                            isPremium: false,
                        });
                        close();
                        return;
                    }

                    // Step 3: Initiating payment
                    send({
                        type: 'thinking',
                        id: 'payment-start',
                        stepType: 'paying',
                        message: 'Paying 0.002 SOL for premium access...',
                        amount: '0.002 SOL',
                    });

                    // Execute actual payment
                    try {
                        const agentKeypair = getAgentKeypair();
                        const connection = getConnection();
                        const recipientWallet = getCreatorWallet();

                        const result = await executeAgentPayment({
                            connection,
                            agentKeypair,
                            recipientAddress: recipientWallet,
                            amountLamports: BigInt(2_000_000), // 0.002 SOL
                            priorityFee: { enabled: true, microLamports: 5000 },
                        });

                        if (result.success && result.signature) {
                            send({
                                type: 'thinking',
                                id: 'payment-confirmed',
                                stepType: 'confirmed',
                                message: `Payment confirmed! Tx: ${result.signature.slice(0, 8)}...`,
                                signature: result.signature,
                                amount: '0.002 SOL',
                            });
                        } else {
                            // Payment failed - show error only, NO content
                            send({
                                type: 'thinking',
                                id: 'payment-error',
                                stepType: 'error',
                                message: `Payment failed: ${result.error || 'Unknown error'}`,
                            });
                            send({
                                type: 'content',
                                content: `❌ **Payment Failed**\n\nCould not complete the payment transaction.\n\n**Reason:** ${result.error || 'Unknown error'}\n\nPlease try again or check your wallet configuration.`,
                                isPremium: false,
                            });
                            close();
                            return;
                        }
                    } catch (paymentError) {
                        // Payment error - show error only, NO content
                        const errorMessage = paymentError instanceof Error ? paymentError.message : 'Unknown error';
                        send({
                            type: 'thinking',
                            id: 'payment-error',
                            stepType: 'error',
                            message: `Payment error: ${errorMessage}`,
                        });
                        send({
                            type: 'content',
                            content: `❌ **Payment Failed**\n\n${errorMessage}\n\nPlease check your wallet configuration and try again.`,
                            isPremium: false,
                        });
                        close();
                        return;
                    }

                    // Step 4: Generating premium content (only if payment succeeded)
                    send({
                        type: 'thinking',
                        id: 'generating',
                        stepType: 'complete',
                        message: 'Generating premium content...',
                    });

                    await new Promise(resolve => setTimeout(resolve, 300));
                }

                // Generate and stream AI response
                await generateAIResponse(message, isPremium, send);

                close();
            } catch (error) {
                send({
                    type: 'thinking',
                    id: 'error',
                    stepType: 'error',
                    message: error instanceof Error ? error.message : 'Unknown error',
                });
                close();
            }
        })();

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
