'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Send,
    CheckCircle2,
    XCircle,
    Loader2,
    Cpu,
    Zap,
    ArrowUpRight,
    Search,
    CreditCard
} from 'lucide-react';
import Link from 'next/link';

// Apple-style typography components
const GradientText = ({ children }: { children: React.ReactNode }) => (
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        {children}
    </span>
);

interface ThinkingStep {
    id: string;
    type: 'thinking' | 'paying' | 'confirmed' | 'error' | 'complete';
    message: string;
    signature?: string;
    amount?: string;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    thinkingSteps?: ThinkingStep[];
    isPremium?: boolean;
}

export default function AgentChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content: input.trim(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Create placeholder for assistant response
        const assistantId = crypto.randomUUID();
        const assistantMessage: Message = {
            id: assistantId,
            role: 'assistant',
            content: '',
            thinkingSteps: [],
        };
        setMessages(prev => [...prev, assistantMessage]);


        try {
            const response = await fetch('/api/agent-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage.content }),
            });

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No reader');

            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);

                            setMessages(prev => prev.map(msg => {
                                if (msg.id !== assistantId) return msg;

                                if (parsed.type === 'thinking') {
                                    return {
                                        ...msg,
                                        thinkingSteps: [
                                            ...(msg.thinkingSteps || []),
                                            {
                                                id: parsed.id,
                                                type: parsed.stepType,
                                                message: parsed.message,
                                                signature: parsed.signature,
                                                amount: parsed.amount,
                                            }
                                        ],
                                    };
                                } else if (parsed.type === 'content') {
                                    return {
                                        ...msg,
                                        content: msg.content + parsed.content,
                                        isPremium: parsed.isPremium,
                                    };
                                }
                                return msg;
                            }));
                        } catch {
                            // Ignore parse errors
                        }
                    }
                }
            }
        } catch (error) {
            setMessages(prev => prev.map(msg => {
                if (msg.id !== assistantId) return msg;
                return {
                    ...msg,
                    content: 'Sorry, something went wrong. Please try again.',
                    thinkingSteps: [
                        ...(msg.thinkingSteps || []),
                        {
                            id: 'error',
                            type: 'error',
                            message: error instanceof Error ? error.message : 'Unknown error',
                        }
                    ],
                };
            }));
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading]);

    const examplePrompts = [
        "Generate detailed market report",
        "Give me premium crypto analysis",
        "Execute advanced technical scan",
        "Deep dive on SOL ecosystem",
    ];

    return (
        <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] font-sans selection:bg-purple-100 selection:text-purple-900">
            {/* Header - Minimalist, Glassmorphic */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white/70 backdrop-blur-xl border-b border-black/5 z-50 flex items-center justify-between px-6 transition-all">
                <div className="flex items-center gap-4">
                    <Link href="/" className="group flex items-center gap-2 text-gray-500 hover:text-black transition-colors rounded-full px-3 py-1.5 hover:bg-gray-100/50">
                        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                        <span className="text-sm font-medium">Exit Demo</span>
                    </Link>
                </div>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)] animate-pulse" />
                    <span className="text-sm font-semibold tracking-tight">Agent Active</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-yellow-50 text-yellow-700 text-[10px] font-bold tracking-wide uppercase border border-yellow-100/50">
                        <Zap size={10} />
                        Self-Sovereign Mode
                    </span>
                </div>
            </header>

            {/* Main Chat Area */}
            <main className="max-w-3xl mx-auto px-6 pt-32 pb-40">
                <AnimatePresence mode="wait">
                    {/* Welcome State */}
                    {messages.length === 0 && (
                        <motion.div
                            key="welcome"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
                        >
                            <div className="relative mb-10 group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                                <div className="relative w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center">
                                    <Sparkles size={40} className="text-purple-600" strokeWidth={1.5} />
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 text-[#1D1D1F]">
                                How can I help you?
                            </h1>
                            <p className="text-xl text-gray-400 max-w-xl font-light leading-relaxed mb-12">
                                I can access premium data by autonomously dealing with <GradientText>micropayments</GradientText>.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                                {examplePrompts.map((prompt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInput(prompt)}
                                        className="group relative px-6 py-4 text-left bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-purple-100 transition-all duration-300"
                                    >
                                        <span className="block text-sm font-medium text-gray-900 group-hover:text-purple-700 transition-colors">{prompt}</span>
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-purple-400">
                                            <ArrowUpRight size={16} />
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Chat Messages */}
                    <div className="space-y-10">
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-6 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                {/* Avatar */}
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm border border-black/5 ${message.role === 'user'
                                    ? 'bg-gray-100'
                                    : 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white'
                                    }`}>
                                    {message.role === 'user' ? (
                                        <div className="w-4 h-4 rounded-full bg-gray-400" />
                                    ) : (
                                        <Sparkles size={16} />
                                    )}
                                </div>

                                <div className={`flex flex-col gap-2 max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    {/* Thinking Process - Only for Assistant */}
                                    {message.thinkingSteps && message.thinkingSteps.length > 0 && (
                                        <div className="flex flex-col gap-2 mb-2 w-full">
                                            {message.thinkingSteps.map((step) => (
                                                <motion.div
                                                    key={step.id}
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="flex items-center gap-3 text-xs font-medium text-gray-500 bg-white px-3 py-2 rounded-lg border border-gray-100 shadow-sm w-fit"
                                                >
                                                    {step.type === 'thinking' && <Loader2 size={12} className="animate-spin text-blue-500" />}
                                                    {step.type === 'paying' && <CreditCard size={12} className="text-purple-500 animate-pulse" />}
                                                    {step.type === 'confirmed' && <CheckCircle2 size={12} className="text-green-500" />}
                                                    {step.type === 'error' && <XCircle size={12} className="text-red-500" />}

                                                    <span className={step.type === 'paying' ? 'text-purple-600' : ''}>{step.message}</span>

                                                    {step.signature && (
                                                        <a
                                                            href={`https://solscan.io/tx/${step.signature}?cluster=devnet`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="ml-auto text-[10px] uppercase tracking-wider text-gray-300 hover:text-purple-500 transition-colors flex items-center gap-1"
                                                        >
                                                            Verify <ArrowUpRight size={10} />
                                                        </a>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Message Bubble */}
                                    <div className={`rounded-2xl px-6 py-4 shadow-sm text-[15px] leading-relaxed ${message.role === 'user'
                                        ? 'bg-black text-white rounded-tr-sm'
                                        : message.isPremium
                                            ? 'bg-white border border-purple-100 shadow-purple-100/50 rounded-tl-sm ring-1 ring-purple-50'
                                            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                                        }`}>
                                        {message.isPremium && (
                                            <div className="flex items-center gap-1.5 mb-3 pb-3 border-b border-purple-50/50">
                                                <div className="px-2 py-0.5 rounded-full bg-purple-50 text-[10px] font-bold uppercase tracking-wider text-purple-600 border border-purple-100">
                                                    Premium Content
                                                </div>
                                                <span className="text-[10px] text-gray-300">|</span>
                                                <span className="text-[10px] text-gray-400 font-medium">Verified Purchase</span>
                                            </div>
                                        )}

                                        {message.content ? (
                                            <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:font-semibold prose-strong:text-current">
                                                {message.content.split('\n').map((line, i) => (
                                                    <p key={i} className={line.startsWith('**') ? 'mt-4 mb-2' : 'mb-2'}>{line.replace(/\*\*/g, '')}</p>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex gap-1 items-center h-6">
                                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </AnimatePresence>
            </main>

            {/* Input Area - Floating Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FBFBFD] via-[#FBFBFD] to-transparent">
                <div className="max-w-3xl mx-auto">
                    <form
                        onSubmit={handleSubmit}
                        className={`relative group bg-white rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border transition-all duration-300 ${isLoading ? 'border-gray-100 opacity-80' : 'border-gray-100 hover:border-gray-200 focus-within:border-gray-300 focus-within:shadow-[0_12px_48px_rgba(0,0,0,0.12)]'}`}
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything..."
                            className="w-full bg-transparent px-6 py-5 text-lg placeholder-gray-400 focus:outline-none rounded-[2rem]"
                            disabled={isLoading}
                        />

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {isLoading ? (
                                <div className="p-3">
                                    <Loader2 className="w-5 h-5 text-gray-300 animate-spin" />
                                </div>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="p-3 rounded-full bg-black text-white disabled:bg-gray-100 disabled:text-gray-300 transition-all hover:scale-105 active:scale-95 shadow-md"
                                >
                                    <ArrowUpRight size={20} />
                                </button>
                            )}
                        </div>
                    </form>
                    <p className="text-center text-xs text-gray-400 mt-4 font-medium tracking-wide">
                        Powered by <span className="text-gray-600">x402 Protocol</span> on Solana Devnet
                    </p>
                </div>
            </div>
        </div>
    );
}
