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
        <div className="relative w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse" />
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
                <div className="flex items-center gap-1.5 sm:gap-3">
                    <motion.button
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.5 }}
                        onClick={fetchBalance}
                        className="group p-1 sm:p-1.5 rounded-full hover:bg-black/5 transition-colors"
                    >
                        <RefreshCw size={12} className={`sm:w-3.5 sm:h-3.5 text-gray-400 group-hover:text-gray-600 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                    </motion.button>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Wallet size={12} className="sm:w-3.5 sm:h-3.5 text-gray-400" />
                        <span className="text-[10px] sm:text-xs font-medium tabular-nums whitespace-nowrap">
                            {walletBalance?.balanceSol?.toFixed(4) ?? '0.000'} SOL
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
                                    className="w-24 h-24 rounded-3xl bg-black/5 shadow-2xl flex items-center justify-center mb-8 relative overflow-hidden group cursor-pointer"
                                >
                                    <SiriOrb variant={demoMode === 'agent-to-agent' ? 'dual' : 'single'} />
                                </motion.div>

                                <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F] mb-3">
                                    {demoMode === 'agent-to-agent' ? 'Agent Collaboration' : 'Micropayment Intelligence'}
                                </h1>
                                <p className="text-gray-500 max-w-sm mx-auto text-base leading-relaxed mb-12">
                                    {demoMode === 'agent-to-agent' ? (
                                        <span className="block text-sm max-w-md mx-auto mt-2 text-gray-500">
                                            This demo simulates an <strong>Autonomous Agent Economy</strong>.
                                            <br className="mb-2" />
                                            You are chatting with a <strong>Research Agent</strong>. If you ask for expert advice, it will autonomously <strong>hire & pay</strong> a specialized <strong>Analysis Agent</strong> (0.001 SOL) to do the work.
                                        </span>
                                    ) : (
                                        <span className="block text-sm max-w-md mx-auto mt-2 text-gray-500">
                                            This demo simulates <strong>Consumer-to-Agent Payments</strong>.
                                            <br className="mb-2" />
                                            Ask for <strong>"Premium Analysis"</strong> and the AI will autonomously request a <strong>micropayment</strong> (0.002 SOL) from your wallet before generating high-value insights.
                                        </span>
                                    )}
                                </p>

                                {/* Quick Prompts */}
                                <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                                    {examplePrompts.map((prompt, i) => (
                                        <motion.button
                                            key={i}
                                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.9)" }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setInput(prompt)}
                                            className="px-4 py-3 bg-white/60 border border-white/60 shadow-sm rounded-2xl text-xs font-medium text-gray-600 hover:text-black transition-colors text-left"
                                        >
                                            {prompt}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Chat Messages */}
                    <div className="space-y-8 flex flex-col w-full relative z-10">
                        {messages.map((message) => (
                            <motion.div
                                layout
                                key={message.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
                                className={`relative z-10 ${message.role === 'user' ? 'self-end' : 'self-start w-full'}`}
                            >
                                {message.role === 'user' ? (
                                    // User Message: Solid Color (Apple gray)
                                    <motion.div
                                        layoutId={`message-${message.id}`}
                                        className="bg-[#2C2C2E] text-white px-5 py-3 rounded-[1.5rem] shadow-sm max-w-[85%] ml-auto text-[15px] leading-relaxed font-medium tracking-wide"
                                    >
                                        {message.content}
                                    </motion.div>
                                ) : (
                                    // Agent Message: Clean Glass/Solid
                                    <div className="max-w-full group">
                                        <div className="flex items-center gap-3 mb-3 pl-4">
                                            {/* Agent Identity: Solid Colors */}
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${message.agentName === 'Analysis Agent'
                                                ? 'bg-orange-500 text-white'
                                                : 'bg-black text-white'
                                                }`}>
                                                {message.agentName === 'Analysis Agent' ? <Cpu size={12} /> : <Sparkles size={12} />}
                                            </div>
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                {message.agentName || 'Intelligence'}
                                            </span>
                                        </div>

                                        <motion.div
                                            layout
                                            className="relative bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[2rem] p-8 w-fit min-w-0 max-w-full"
                                        >
                                            {/* Glowing edge only for active thinking, simplified */}
                                            <AnimatePresence>
                                                {(message.thinkingSteps?.some(s => s.type === 'thinking' || s.type === 'paying') || message.isPremium) && (
                                                    <motion.div
                                                        key="glow"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                    >
                                                        <SiriGlow />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Content */}
                                            <div className="relative z-10 w-full">
                                                {/* Collapsible Thinking Process */}
                                                {message.thinkingSteps && message.thinkingSteps.length > 0 && (
                                                    <ThinkingProcess steps={message.thinkingSteps} />
                                                )}


                                                {/* Markdown Content */}
                                                {message.content ? (
                                                    <motion.div layout className="prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-gray-900 prose-p:text-gray-700">
                                                        {message.content.split('\n').map((line, i) => (
                                                            <div key={i}>
                                                                {line.startsWith('**') ? (
                                                                    <p className="mt-4 mb-2 font-semibold text-black">{line.replace(/\*\*/g, '')}</p>
                                                                ) : (
                                                                    <p className="mb-2">{line}</p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                ) : !message.thinkingSteps?.length && (
                                                    <OrbLoader />
                                                )}

                                                {/* Premium Footer: Solid Color */}
                                                {message.isPremium && (
                                                    <motion.div
                                                        layout
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="mt-6 flex items-center gap-2 pt-4 border-t border-black/5"
                                                    >
                                                        <div className="h-5 px-2 bg-black rounded text-[10px] font-bold text-white flex items-center tracking-wide uppercase">
                                                            Premium
                                                        </div>
                                                        <span className="text-[10px] text-gray-400 font-medium">Unlocked via x402 Micropayment</span>
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
                <div className={`max-w-2xl mx-auto transition-all duration-500 ${isLoading ? 'scale-95 opacity-80 pointer-events-none' : 'scale-100 opacity-100'}`}>
                    <form
                        onSubmit={handleSubmit}
                        className="relative group bg-white/80 hover:bg-white/90 focus-within:bg-white backdrop-blur-[20px] rounded-[2rem] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12)] border border-white/20 ring-1 ring-black/5 transition-all duration-300 overflow-hidden"
                    >
                        {/* Glowing Border Animation on Focus/Active */}
                        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

                        <div className="relative flex items-center px-2 py-2">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-focus-within:text-purple-600 transition-colors">
                                <Command size={18} />
                            </div>

                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={demoMode === 'agent-to-agent' ? "Ask the Research Agent..." : "Ask x402 Intelligence..."}
                                className="flex-1 bg-transparent px-4 py-3 text-[17px] placeholder-gray-400 text-gray-900 focus:outline-none font-medium tracking-tight"
                                disabled={isLoading}
                                autoFocus
                            />

                            <motion.button
                                type="submit"
                                disabled={!input.trim()}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center disabled:opacity-0 disabled:scale-75 transition-all duration-200 shadow-lg shadow-black/20"
                            >
                                <ArrowUp size={20} strokeWidth={2.5} />
                            </motion.button>
                        </div>
                    </form>
                    <p className="text-center text-[10px] text-gray-400 mt-4 font-medium tracking-wide uppercase opacity-60">
                        x402 Protocol · Solana Devnet
                    </p>
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
        <div className="mb-6 w-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-black transition-colors mb-2 group"
            >
                {isError ? (
                    <XCircle size={14} className="text-red-500" />
                ) : isComplete ? (
                    <CheckCircle2 size={14} className="text-green-500" />
                ) : (
                    <Loader2 size={14} className="animate-spin text-blue-500" />
                )}
                <span>
                    {isError ? 'Process failed' : isComplete ? 'Process complete' : 'Thinking...'}
                </span>
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-2 border-l-2 border-gray-100 space-y-2 overflow-hidden"
                    >
                        {steps.map((step, idx) => (
                            <motion.div
                                key={step.id || idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3 py-1"
                            >
                                <div className="text-gray-400">
                                    {step.type === 'thinking' && <Loader2 size={12} className="animate-spin" />}
                                    {step.type === 'paying' && <CreditCard size={12} className="text-purple-500" />}
                                    {step.type === 'confirmed' && <CheckCircle2 size={12} className="text-green-500" />}
                                    {step.type === 'error' && <XCircle size={12} className="text-red-500" />}
                                    {step.type === 'complete' && <Sparkles size={12} className="text-blue-500" />}
                                </div>
                                <span className="text-xs text-gray-600">
                                    {step.agent && <strong className="text-gray-900 mr-1">{step.agent}</strong>}
                                    {step.message}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
