'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    CheckCircle2,
    XCircle,
    Loader2,
    Cpu,
    ChevronDown,
    ChevronRight,
    ArrowUp,
    Users,
    Wallet,
    RefreshCw,
    Command,
    CreditCard
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SiriOrb } from '@/components/ui/SiriOrb';

// --- Apple Intelligence Visuals ---

const SiriGlow = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem] opacity-40">
        <motion.div
            animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
            }}
            transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
            }}
            className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,#3b82f6_60deg,#8b5cf6_120deg,#ec4899_180deg,#8b5cf6_240deg,#3b82f6_300deg,transparent_360deg)] blur-[60px] opacity-30"
        />
        <motion.div
            animate={{
                rotate: [360, 0],
                scale: [1.2, 1, 1.2],
            }}
            transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
            }}
            className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_180deg,transparent_0deg,#06b6d4_60deg,#3b82f6_120deg,#6366f1_180deg,#3b82f6_240deg,#06b6d4_300deg,transparent_360deg)] blur-[60px] opacity-30 mix-blend-overlay"
        />
    </div>
);

const OrbLoader = () => (
    <div className="relative w-8 h-8 flex items-center justify-center">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 blur-sm opacity-60"
        />
        <div className="relative w-2 h-2 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)] animate-pulse" />
    </div>
);

// --- Types ---

interface ThinkingStep {
    id: string;
    type: 'thinking' | 'paying' | 'confirmed' | 'error' | 'complete';
    message: string;
    signature?: string;
    amount?: string;
    agent?: string;
}

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'agent';
    agentName?: string;
    content: string;
    thinkingSteps?: ThinkingStep[];
    isPremium?: boolean;
}

interface WalletBalance {
    configured: boolean;
    address: string | null;
    balanceSol: number;
    error?: string;
}

type DemoMode = 'chat' | 'agent-to-agent';

export default function AgentChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [demoMode, setDemoMode] = useState<DemoMode>('chat');
    const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null);
    const [isLoadingBalance, setIsLoadingBalance] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch wallet balance
    const fetchBalance = useCallback(async () => {
        setIsLoadingBalance(true);
        try {
            const res = await fetch('/api/agent-balance');
            const data = await res.json();
            setWalletBalance(data);
        } catch {
            setWalletBalance({ configured: false, address: null, balanceSol: 0, error: 'Failed to fetch' });
        } finally {
            setIsLoadingBalance(false);
        }
    }, []);

    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);

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

        const assistantId = crypto.randomUUID();
        const assistantMessage: Message = {
            id: assistantId,
            role: 'assistant',
            agentName: demoMode === 'agent-to-agent' ? 'Research Agent' : undefined,
            content: '',
            thinkingSteps: [],
        };
        setMessages(prev => [...prev, assistantMessage]);

        try {
            const response = await fetch('/api/agent-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.content,
                    mode: demoMode
                }),
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
                                                agent: parsed.agent,
                                            }
                                        ],
                                    };
                                } else if (parsed.type === 'content') {
                                    return {
                                        ...msg,
                                        content: msg.content + parsed.content,
                                        isPremium: parsed.isPremium,
                                        agentName: parsed.agentName || msg.agentName,
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
            fetchBalance();
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
    }, [input, isLoading, demoMode, fetchBalance]);

    const examplePrompts = demoMode === 'agent-to-agent'
        ? ["Analyze SOL trends", "Research Memecoin trending", "Audit NFT project (name)", "Check token (address)"]
        : ["Premium analysis x402?", "Premium Analysis of BTC", "Premium Crypto Market Report", "Premium knowledge solana eco"];

    return (
        // Apple Intelligence: Edge-to-edge glass canvas
        <div className="fixed inset-0 bg-[#F5F5F7] text-[#1D1D1F] font-sans overflow-hidden">

            {/* Background Mesh (Subtle) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-50/50 via-purple-50/20 to-transparent pointer-events-none" />

            {/* Header: Transparent Glass Pill */}
            <header className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[95%] sm:w-[90%] max-w-4xl h-12 sm:h-14 bg-white/60 backdrop-blur-xl rounded-full border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] z-50 flex items-center justify-between px-3 sm:px-6 transition-all ring-1 ring-black/5">
                <div className="flex items-center gap-2 sm:gap-4">
                    <Link href="/" className="group flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/5 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                            <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 -rotate-90 text-gray-600 group-hover:text-black" />
                        </div>
                    </Link>
                </div>

                {/* Mode Switcher - Responsive */}
                <div className="flex bg-gray-200/50 p-0.5 sm:p-1 rounded-full backdrop-blur-md">
                    <button
                        onClick={() => { setDemoMode('chat'); setMessages([]); }}
                        className={`relative z-10 px-2 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold rounded-full transition-colors duration-200 ${demoMode === 'chat' ? 'text-black' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {demoMode === 'chat' && (
                            <motion.div
                                layoutId="active-mode-pill"
                                className="absolute inset-0 bg-white shadow-sm rounded-full -z-10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        Chat
                    </button>
                    <button
                        onClick={() => { setDemoMode('agent-to-agent'); setMessages([]); }}
                        className={`relative z-10 px-2 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold rounded-full transition-colors duration-200 whitespace-nowrap ${demoMode === 'agent-to-agent' ? 'text-black' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {demoMode === 'agent-to-agent' && (
                            <motion.div
                                layoutId="active-mode-pill"
                                className="absolute inset-0 bg-white shadow-sm rounded-full -z-10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="hidden xs:inline">Agent-to-Agent</span>
                        <span className="xs:hidden">Agent to Agent</span>
                    </button>
                </div>

                {/* Wallet Balance */}
                <div className="flex items-center gap-1 sm:gap-3">
                    <motion.button
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.5 }}
                        onClick={fetchBalance}
                        className="group p-1 sm:p-1.5 rounded-full hover:bg-black/5 transition-colors"
                    >
                        <RefreshCw size={12} className={`sm:w-3.5 sm:h-3.5 text-gray-400 group-hover:text-gray-600 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                    </motion.button>
                    <div className="flex items-center gap-1 sm:gap-2 bg-black/5 px-2.5 py-1 rounded-full border border-black/5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                        <Wallet size={10} className="sm:w-3 sm:h-3 text-gray-400" />
                        <span className="text-[10px] sm:text-xs font-semibold tabular-nums whitespace-nowrap text-black/80">
                            {walletBalance?.balanceSol?.toFixed(3) ?? '0.000'} <span className="text-[8px] opacity-40">SOL</span>
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Chat Area */}
            <main className="absolute inset-0 top-0 bottom-32 overflow-y-auto px-4 md:px-0">
                <div className="max-w-2xl mx-auto pt-32 pb-10 min-h-full flex flex-col justify-end relative">
                    {/* Welcome Screen */}
                    <AnimatePresence mode="wait">
                        {messages.length === 0 && (
                            <motion.div
                                key="welcome"
                                layout
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)', position: 'absolute', inset: 0, pointerEvents: 'none' }}
                                transition={{ type: "spring", bounce: 0.3 }}
                                className="flex flex-col items-center justify-center text-center my-auto w-full h-full"
                            >


                                {/* Hero Icon */}
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] sm:rounded-3xl bg-black/5 shadow-2xl flex items-center justify-center mb-8 relative overflow-hidden group cursor-pointer"
                                >
                                    <SiriOrb variant={demoMode === 'agent-to-agent' ? 'dual' : 'single'} />
                                </motion.div>

                                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1D1D1F] mb-3 px-4">
                                    {demoMode === 'agent-to-agent' ? 'Agent Collaboration' : 'Micropayment Intelligence'}
                                </h1>
                                <p className="text-gray-500 max-w-sm mx-auto text-sm sm:text-base leading-relaxed mb-8 sm:mb-12 px-6">
                                    {demoMode === 'agent-to-agent' ? (
                                        <span className="block text-xs sm:text-sm max-w-md mx-auto mt-2 text-gray-500">
                                            This demo simulates an <strong>Autonomous Agent Economy</strong>.
                                            <br className="mb-2" />
                                            Ask for expert advice, and the agent will autonomously <strong>hire & pay</strong> specialists (0.001 SOL).
                                            <br className="mb-2" />
                                            <span className="text-blue-600 font-semibold">Payments are verified via your Custom Facilitator</span> - ensuring you own the infrastructure.
                                        </span>
                                    ) : (
                                        <span className="block text-xs sm:text-sm max-w-md mx-auto mt-2 text-gray-500">
                                            This demo simulates <strong>Consumer-to-Agent Payments</strong>.
                                            <br className="mb-2" />
                                            Ask for <strong>"Premium Analysis"</strong> and the AI will request a <strong>micropayment</strong> (0.002 SOL) before delivering.
                                        </span>
                                    )}
                                </p>

                                {/* Quick Prompts */}
                                <div className="grid grid-cols-2 gap-2 sm:gap-3 w-[90%] sm:w-full max-w-sm">
                                    {examplePrompts.map((prompt, i) => (
                                        <motion.button
                                            key={i}
                                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.9)" }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setInput(prompt)}
                                            className="px-3 py-2.5 sm:px-4 sm:py-3 bg-white/60 border border-white/60 shadow-sm rounded-2xl text-[10px] sm:text-xs font-semibold text-gray-600 hover:text-black transition-colors text-left"
                                        >
                                            {prompt}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Chat Messages */}
                    <div className="space-y-12 flex flex-col w-full relative z-10 pb-12">
                        {messages.map((message) => (
                            <motion.div
                                layout
                                key={message.id}
                                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
                                className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} w-full transition-all duration-500`}
                            >
                                {message.role === 'user' ? (
                                    <div className="max-w-[85%] group">
                                        <div className="flex items-center gap-2 mb-2 justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">You</span>
                                        </div>
                                        <motion.div
                                            layoutId={`message-${message.id}`}
                                            className="bg-white/90 backdrop-blur-md text-[#1D1D1F] px-6 py-4 rounded-[2rem] shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-[16px] leading-[1.5] font-semibold tracking-tight border border-black/5"
                                        >
                                            {message.content}
                                        </motion.div>
                                    </div>
                                ) : (
                                    <div className="w-full group">
                                        <div className="flex items-center gap-3 mb-4 pl-1">
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 ${message.agentName === 'Research Agent'
                                                ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                                                : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                                                }`}>
                                                {message.agentName === 'Research Agent' ? <Users size={16} className="text-[#1D1D1F]" /> : <Sparkles size={16} className="text-[#1D1D1F]" />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-[#1D1D1F] uppercase tracking-widest">
                                                    {message.agentName || 'x402 Intelligence'}
                                                </span>
                                                <span className="text-[9px] text-[#1D1D1F]/40 font-medium tracking-wide">AI AGENT · SOLANA PROTOCOL</span>
                                            </div>
                                        </div>

                                        <motion.div
                                            layout
                                            className="relative bg-white/70 backdrop-blur-2xl border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-6 sm:p-10 w-full overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] ring-1 ring-black/5"
                                        >
                                            {/* Gemini-style subtle aurora shimmer */}
                                            <AnimatePresence>
                                                {(isLoading || message.isPremium) && (
                                                    <motion.div
                                                        key="aurora"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="absolute inset-0 pointer-events-none overflow-hidden"
                                                    >
                                                        <div className="absolute -inset-[100%] opacity-[0.08] animate-[spin_20s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,#3b82f6_60deg,#8b5cf6_120deg,#ec4899_180deg,#8b5cf6_240deg,#3b82f6_300deg,transparent_360deg)] blur-[100px]" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <div className="relative z-10">
                                                {/* Perplexity-style Thinking Process */}
                                                {message.thinkingSteps && message.thinkingSteps.length > 0 && (
                                                    <ThinkingProcess steps={message.thinkingSteps} />
                                                )}

                                                {/* OpenAI-style Crisp Content */}
                                                {message.content ? (
                                                    <div
                                                        className="prose-chat prose-lg max-w-none"
                                                    >
                                                        {message.content.split('\n').map((line, i) => {
                                                            const trimmedLine = line.trim();
                                                            if (!trimmedLine) return <div key={i} className="h-4" />;

                                                            if (trimmedLine.startsWith('###')) {
                                                                return <h3 key={i} className="text-[19px] sm:text-xl mt-10 mb-5 tracking-tight">{trimmedLine.replace('###', '').trim()}</h3>;
                                                            }
                                                            if (trimmedLine.startsWith('##')) {
                                                                return <h2 key={i} className="text-[22px] sm:text-2xl mt-12 mb-6 tracking-tight">{trimmedLine.replace('##', '').trim()}</h2>;
                                                            }
                                                            if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
                                                                return (
                                                                    <div key={i} className="flex gap-4 items-start mb-4 group/item">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-[11px] transition-transform group-hover/item:scale-125 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                                                                        <p className="m-0 flex-1 font-medium">
                                                                            {trimmedLine.substring(2).split(/(\*\*.*?\*\*)/).map((part, j) => {
                                                                                if (part.startsWith('**') && part.endsWith('**')) {
                                                                                    return <strong key={j}>{part.slice(2, -2)}</strong>;
                                                                                }
                                                                                return part;
                                                                            })}
                                                                        </p>
                                                                    </div>
                                                                );
                                                            }
                                                            return (
                                                                <p key={i} className="mb-5 font-medium leading-relaxed">
                                                                    {trimmedLine.split(/(\*\*.*?\*\*)/).map((part, j) => {
                                                                        if (part.startsWith('**') && part.endsWith('**')) {
                                                                            return <strong key={j} className="tracking-tight">{part.slice(2, -2)}</strong>;
                                                                        }
                                                                        return part;
                                                                    })}
                                                                </p>
                                                            );
                                                        })}
                                                    </div>
                                                ) : !message.thinkingSteps?.length && (
                                                    <div className="flex items-center gap-4 text-[#1D1D1F]/40">
                                                        <OrbLoader />
                                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] animate-pulse">Initializing Neural Link...</span>
                                                    </div>
                                                )}

                                                {/* Premium Footer with x402 Branding */}
                                                {message.isPremium && (
                                                    <motion.div
                                                        layout
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="mt-12 flex items-center justify-between pt-6 border-t border-black/5"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="px-3 py-1 bg-[#1D1D1F] rounded-lg text-[10px] font-black text-gray-400 tracking-tighter uppercase">
                                                                x402 UNLOCKED
                                                            </div>
                                                            <span className="text-[11px] text-[#1D1D1F]/50 font-bold tracking-tight">PREMIUM INTELLIGENCE</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity">
                                                            <CheckCircle2 size={12} className="text-green-600" />
                                                            <span className="text-[9px] font-bold uppercase tracking-widest">
                                                                {message.agentName ? 'Custom Verified' : 'Verified on Solana'}
                                                            </span>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </main>

            {/* Input Floating Bar (Apple Intelligence Style) */}
            <div className="fixed bottom-8 left-0 right-0 px-4 md:px-0 z-50">
                <div className={`max-w-2xl mx-auto transition-all duration-700 ${isLoading ? 'scale-[0.98] opacity-80' : 'scale-100 opacity-100'}`}>
                    <form
                        onSubmit={handleSubmit}
                        className="relative group bg-white/70 hover:bg-white/80 focus-within:bg-white/90 backdrop-blur-[32px] rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-white/40 ring-1 ring-black/5 transition-all duration-500"
                    >
                        <div className="relative flex items-center px-3 py-2.5">
                            <div className="w-12 h-12 rounded-full bg-black/[0.03] flex items-center justify-center text-gray-400 group-focus-within:text-indigo-600 transition-all duration-500">
                                <Command size={20} className="transform group-focus-within:rotate-12" />
                            </div>

                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={demoMode === 'agent-to-agent' ? "Analyze market and collaborate..." : "Request premium intelligence..."}
                                className="flex-1 bg-transparent px-5 py-4 text-[17px] placeholder-gray-500 text-[#1D1D1F] focus:outline-none font-medium leading-relaxed tracking-tight"
                                disabled={isLoading}
                                autoFocus
                            />

                            <motion.button
                                type="submit"
                                disabled={!input.trim()}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-12 h-12 rounded-full bg-[#1D1D1F] text-gray-400 flex items-center justify-center disabled:opacity-0 disabled:scale-75 transition-all duration-300 shadow-xl shadow-black/20 group-hover:shadow-black/30"
                            >
                                <ArrowUp size={22} strokeWidth={3} />
                            </motion.button>
                        </div>
                    </form>
                    <div className="flex justify-center gap-6 mt-6">
                        <p className="text-[10px] text-gray-400 font-black tracking-[0.2em] uppercase opacity-40">
                            Powered by x402 Protocol
                        </p>
                        <div className="h-3 w-px bg-gray-300 opacity-20" />
                        <p className="text-[10px] text-gray-400 font-black tracking-[0.2em] uppercase opacity-40">
                            Solana Mainnet Parity
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}

const ThinkingProcess = ({ steps }: { steps: ThinkingStep[] }) => {
    const [isOpen, setIsOpen] = useState(true);
    const isComplete = steps.some(s => s.type === 'confirmed' || s.type === 'complete');
    const isError = steps.some(s => s.type === 'error');

    return (
        <div className="mb-10 w-full group/process">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 py-2 px-4 rounded-xl bg-black/[0.03] hover:bg-black/[0.06] transition-all duration-300 w-fit border border-black/[0.02]"
            >
                <div className="flex items-center justify-center w-5 h-5">
                    {isError ? (
                        <XCircle size={14} className="text-red-500" />
                    ) : isComplete ? (
                        <CheckCircle2 size={14} className="text-green-500" />
                    ) : (
                        <Loader2 size={14} className="animate-spin text-blue-500" />
                    )}
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[#1D1D1F]/50 group-hover/process:text-[#1D1D1F] transition-colors">
                    {isError ? 'PROCESS FAILED' : isComplete ? 'CHAIN EXECUTION COMPLETE' : 'AI THOUGHT PROCESS'}
                </span>
                <div className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                    <ChevronDown size={14} className="text-[#1D1D1F]/40" />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pl-4 space-y-3 overflow-hidden"
                    >
                        {steps.map((step, idx) => (
                            <motion.div
                                key={step.id || idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-start gap-4 py-1.5 relative group/step"
                            >
                                {/* Vertical Connecting Line */}
                                {idx !== steps.length - 1 && (
                                    <div className="absolute left-[9px] top-6 bottom-[-12px] w-px bg-gradient-to-b from-gray-200 to-gray-200/20" />
                                )}

                                <div className={`relative z-10 flex items-center justify-center w-[18px] h-[18px] rounded-full bg-gray-100 shadow-sm ring-1 ring-black/5 transition-transform group-hover/step:scale-110 shrink-0 mt-0.5`}>
                                    {step.type === 'thinking' && <Loader2 size={10} className="animate-spin text-blue-500" />}
                                    {step.type === 'paying' && <CreditCard size={10} className="text-purple-500" />}
                                    {step.type === 'confirmed' && <CheckCircle2 size={10} className="text-green-500" />}
                                    {step.type === 'error' && <XCircle size={10} className="text-red-500" />}
                                    {step.type === 'complete' && <Sparkles size={10} className="text-blue-500" />}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        {step.agent && (
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-1.5 py-0.5 rounded">
                                                {step.agent}
                                            </span>
                                        )}
                                        <span className="text-[13px] text-gray-700 font-medium leading-none">
                                            {step.message}
                                        </span>
                                    </div>
                                    {step.signature && (
                                        <div className="mt-1 font-mono text-[9px] text-gray-500 group-hover/step:text-blue-500 transition-colors">
                                            TX: {step.signature.slice(0, 16)}...
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
