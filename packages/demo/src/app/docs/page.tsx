'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BookOpen01Icon from 'hugeicons-react/dist/esm/icons/book_open_01_icon';
import CodeCircleIcon from 'hugeicons-react/dist/esm/icons/code_circle_icon';
import CreditCardValidationIcon from 'hugeicons-react/dist/esm/icons/credit_card_validation_icon';
import ZapIcon from 'hugeicons-react/dist/esm/icons/zap_icon';
import SecurityCheckIcon from 'hugeicons-react/dist/esm/icons/security_check_icon';
import Share01Icon from 'hugeicons-react/dist/esm/icons/share_01_icon';
import Settings01Icon from 'hugeicons-react/dist/esm/icons/settings_01_icon';
import Database01Icon from 'hugeicons-react/dist/esm/icons/database_01_icon';
import DollarCircleIcon from 'hugeicons-react/dist/esm/icons/dollar_circle_icon';
import Globe02Icon from 'hugeicons-react/dist/esm/icons/globe_02_icon';
import ArrowRight01Icon from 'hugeicons-react/dist/esm/icons/arrow_right_01_icon';
import ArrowLeft01Icon from 'hugeicons-react/dist/esm/icons/arrow_left_01_icon';
import CheckmarkCircle01Icon from 'hugeicons-react/dist/esm/icons/checkmark_circle_01_icon';
import Copy01Icon from 'hugeicons-react/dist/esm/icons/copy_01_icon';
import RefreshIcon from 'hugeicons-react/dist/esm/icons/refresh_icon';
import ShieldKeyIcon from 'hugeicons-react/dist/esm/icons/shield_key_icon';
import CpuIcon from 'hugeicons-react/dist/esm/icons/cpu_icon';
import SparklesIcon from 'hugeicons-react/dist/esm/icons/sparkles_icon';
import Cancel01Icon from 'hugeicons-react/dist/esm/icons/cancel_01_icon';
import Menu01Icon from 'hugeicons-react/dist/esm/icons/menu_01_icon';
import PackageIcon from 'hugeicons-react/dist/esm/icons/package_icon';
import RocketIcon from 'hugeicons-react/dist/esm/icons/rocket_icon';
import Idea01Icon from 'hugeicons-react/dist/esm/icons/idea_01_icon';
import GameController01Icon from 'hugeicons-react/dist/esm/icons/game_controller_01_icon';
import WorkflowCircle03Icon from 'hugeicons-react/dist/esm/icons/workflow_circle_03_icon';
import AiBrain01Icon from 'hugeicons-react/dist/esm/icons/ai_brain_01_icon';
import MoneyBag02Icon from 'hugeicons-react/dist/esm/icons/money_bag_02_icon';
import LockIcon from 'hugeicons-react/dist/esm/icons/lock_icon';
import Wrench01Icon from 'hugeicons-react/dist/esm/icons/wrench_01_icon';
import Route01Icon from 'hugeicons-react/dist/esm/icons/route_01_icon';
import FileScriptIcon from 'hugeicons-react/dist/esm/icons/file_script_icon';
import Search01Icon from 'hugeicons-react/dist/esm/icons/search_01_icon';
import SignatureIcon from 'hugeicons-react/dist/esm/icons/signature_icon';
import DatabaseSecurity01Icon from 'hugeicons-react/dist/esm/icons/database_locked_icon';
import AnalyticsUp01Icon from 'hugeicons-react/dist/esm/icons/analytics_up_icon';
import AiCloud01Icon from 'hugeicons-react/dist/esm/icons/ai_cloud_01_icon';
import Key01Icon from 'hugeicons-react/dist/esm/icons/key_01_icon';
import Shield01Icon from 'hugeicons-react/dist/esm/icons/shield_01_icon';
import UserLock01Icon from 'hugeicons-react/dist/esm/icons/user_lock_01_icon';
import AlertCircleIcon from 'hugeicons-react/dist/esm/icons/alert_circle_icon';
import Clock01Icon from 'hugeicons-react/dist/esm/icons/clock_01_icon';
import BrainIcon from 'hugeicons-react/dist/esm/icons/brain_icon';
import Coins01Icon from 'hugeicons-react/dist/esm/icons/coins_01_icon';
import FingerprintScanIcon from 'hugeicons-react/dist/esm/icons/fingerprint_scan_icon';

const LightningIcon = ZapIcon;
const Cpu = CpuIcon;
const Sparkles = SparklesIcon;

// Custom Brand Icons
const RailwayIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M4 3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V3ZM12 4.5L12 19.5M4 12H20M4 7H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const HerokuIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M3 3H8.25V21H3V3Z" fill="currentColor" />
        <path d="M15.75 3H21V21H15.75V3Z" fill="currentColor" />
        <path d="M3 15.375C3 15.375 7.02758 12.1624 12 12C16.9724 11.8376 21 15.375 21 15.375" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const RenderIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" />
        <path d="M12 21V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M3.5 10L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M20.5 10L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);


const sections = [
    { id: 'intro', title: 'Introduction', Icon: RocketIcon },
    { id: 'why', title: 'Why x402?', Icon: Idea01Icon },
    { id: 'demo-features', title: 'Demos', Icon: GameController01Icon },
    { id: 'installation', title: 'Installation', Icon: PackageIcon },
    { id: 'quick-start', title: 'Quick Start', Icon: ZapIcon },
    { id: 'deployment', title: 'Deployment', Icon: RocketIcon },
    { id: 'payment-flow', title: 'How It Works', Icon: WorkflowCircle03Icon },
    { id: 'wallet-topology', title: 'Wallet Topology', Icon: Database01Icon },
    { id: 'agent-chat', title: 'AI Payments', Icon: AiBrain01Icon },
    { id: 'payai-format', title: 'PayAI Format', Icon: Globe02Icon },
    { id: 'self-sovereign', title: 'Verification', Icon: ShieldKeyIcon },
    { id: 'configuration', title: 'Configuration', Icon: Settings01Icon },
    { id: 'middleware', title: 'Middleware', Icon: SecurityCheckIcon },
    { id: 'pricing', title: 'Pricing', Icon: MoneyBag02Icon },
    { id: 'security', title: 'Security', Icon: LockIcon },
    { id: 'troubleshooting', title: 'Troubleshooting', Icon: Wrench01Icon },
    { id: 'roadmap', title: 'Roadmap', Icon: Route01Icon },
    { id: 'api-reference', title: 'Reference', Icon: FileScriptIcon },
];


function CodeBlock({ code, language = 'typescript' }: { code: string; language?: string }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const highlight = (text: string) => {
        if (!text) return '';
        // Highlighting rules
        const rules = [
            { name: 'comment', regex: /\/\/.*/ },
            { name: 'string', regex: /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|`(?:\\`|[^`])*`/ },
            { name: 'keyword', regex: /\b(?:export|default|function|const|let|var|return|import|from|async|await|try|catch|if|else|for|while|switch|case|break|continue|new|throw|type|interface|class|private|public|protected|readonly|static|get|set|in|of|as|any|unknown|never|void|undefined|null|string|number|boolean|object)\b/ },
            { name: 'number', regex: /\b\d+(?:\.\d+)?\b/ },
            { name: 'boolean', regex: /\b(?:true|false)\b/ },
            { name: 'function', regex: /\b[a-z][a-zA-Z0-9]+(?=\s*\()/ },
            { name: 'class', regex: /\b[A-Z][a-zA-Z0-9]+\b/ },
        ];

        if (language === 'bash' || language === 'sh') {
            rules.unshift(
                { name: 'command', regex: /\b(?:npm|npx|pnpm|yarn|git|node|ls|cd|mkdir|touch|rm)\b/ },
                { name: 'flag', regex: /(?:^|\s)-[\w-]+/ }
            );
        }

        const combinedRegex = new RegExp(
            rules.map(r => `(${r.regex.source})`).join('|'),
            'g'
        );

        const styles: Record<string, string> = {
            comment: 'text-[#8B949E] italic',
            string: 'text-[#A5D6FF]',
            keyword: 'text-[#FF7B72]',
            number: 'text-[#79C0FF]',
            boolean: 'text-[#79C0FF]',
            function: 'text-[#D2A8FF]',
            class: 'text-[#FFA657]',
            command: 'text-[#4DFF88]',
            flag: 'text-[#FF80FF]',
        };

        // Escape HTML
        let escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        return escaped.replace(combinedRegex, (...args) => {
            const captures = args.slice(1, rules.length + 1);
            const index = captures.findIndex(c => c !== undefined);
            if (index !== -1) {
                const match = captures[index];
                return `<span class="${styles[rules[index].name]}">${match}</span>`;
            }
            return args[0];
        });
    };

    const dedent = (text: string) => {
        const lines = text.split('\n');
        while (lines.length > 0 && lines[0].trim() === '') lines.shift();
        while (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();
        if (lines.length === 0) return '';
        const minIndent = lines.reduce((min, line) => {
            if (line.trim() === '') return min;
            const indent = line.match(/^\s*/)?.[0].length ?? 0;
            return Math.min(min, indent);
        }, Infinity);
        return lines.map(line => line.slice(minIndent)).join('\n');
    };

    const displayCode = dedent(code);

    return (
        <div className="relative group w-full my-6 max-w-full">
            <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={copy}
                    className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] transition-all text-[10px] text-gray-400 font-bold uppercase tracking-widest backdrop-blur-md"
                >
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
            <div className="bg-[#0D0D0F] rounded-2xl md:rounded-[24px] border border-white/[0.08] overflow-x-auto shadow-2xl relative max-w-full">
                <div className="flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 bg-white/[0.02] border-b border-white/[0.03]">
                    <div className="w-2 h-2 rounded-full bg-[#FF5F56]/40" />
                    <div className="w-2 h-2 rounded-full bg-[#FFBD2E]/40" />
                    <div className="w-2 h-2 rounded-full bg-[#27C93F]/40" />
                    <div className="ml-2 text-[9px] font-black text-gray-500/50 uppercase tracking-[0.2em]">Source Code</div>
                </div>
                <div className="p-4 md:p-7 overflow-x-auto custom-scrollbar min-w-0">
                    <pre
                        className="font-mono text-[12px] md:text-[14px] leading-relaxed text-gray-300 whitespace-pre w-fit min-w-full"
                        dangerouslySetInnerHTML={{ __html: highlight(displayCode) }}
                    />
                </div>
            </div>
        </div>
    );
}

function Callout({ type = 'note', children }: { type?: 'note' | 'warning' | 'tip'; children: React.ReactNode }) {
    const styles = {
        note: 'bg-gray-50 border-gray-100 text-gray-700',
        warning: 'bg-amber-50/50 border-amber-100/50 text-amber-900',
        tip: 'bg-blue-50/50 border-blue-100/50 text-blue-900',
    };

    return (
        <div className={`p-4 md:p-6 rounded-2xl border ${styles[type]} my-8 text-[13px] md:text-[15px] leading-relaxed font-medium`}>
            <div className="flex gap-4">
                <span className="opacity-50 mt-1 flex-shrink-0">
                    {type === 'warning' ? '!' : type === 'tip' ? '→' : 'i'}
                </span>
                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
}

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState('intro');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Scroll listener logic ...
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;
            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
                    setActiveSection(section.id);
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveSection(id);
            setMobileMenuOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F7] text-black selection:bg-blue-100 selection:text-blue-900">
            <header className="sticky top-0 w-full bg-[#F5F5F7]/90 backdrop-blur-xl border-b border-[#D2D2D7] h-14 md:h-16 z-50">
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 font-semibold text-base hover:opacity-70 transition-all active:scale-95">
                        <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center shadow-sm">
                            <LightningIcon size={16} className="text-white" />
                        </div>
                        <span className="text-[15px] tracking-tight text-[#1D1D1F]">Micropay <span className="text-gray-400 font-normal">Docs</span></span>
                    </Link>
                    <div className="flex items-center gap-3 md:gap-4">
                        <span className="hidden sm:inline-flex text-[11px] font-mono bg-gray-50 text-gray-500 px-2 py-1 rounded-md border border-gray-100">v3.3.14</span>
                        <Link href="/" className="hidden sm:inline-flex text-[13px] font-medium px-4 py-1.5 bg-[#1D1D1F] text-white rounded-full hover:bg-black transition-all shadow-sm active:scale-95">
                            Live Demo
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 hover:bg-gray-50 rounded-full transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <Cancel01Icon size={20} /> : <Menu01Icon size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-14 md:top-16 z-40 bg-[#F5F5F7]/95 backdrop-blur-2xl">
                    <nav className="h-full overflow-y-auto px-6 py-8">
                        <div className="space-y-1">
                            {sections.map((section) => {
                                const Icon = section.Icon;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className={`w-full text-left px-4 py-3 text-[15px] font-medium rounded-xl transition-all flex items-center gap-4 ${activeSection === section.id ? 'bg-gray-100 text-[#1D1D1F]' : 'text-gray-500 hover:text-[#1D1D1F]'
                                            }`}
                                    >
                                        <Icon size={18} className={`flex-shrink-0 ${activeSection === section.id ? 'opacity-100' : 'opacity-40'}`} />
                                        {section.title}
                                    </button>
                                );
                            })}
                        </div>
                    </nav>
                </div>
            )}

            <div className="max-w-7xl mx-auto flex px-0 md:px-8">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-64 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-10 pr-6 border-r border-[#D2D2D7]">
                    <nav className="space-y-0.5">
                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-4">Core Documentation</div>
                        {sections.map((section) => {
                            const Icon = section.Icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`w-full text-left px-3 py-2 text-[14px] font-medium rounded-lg transition-all duration-150 flex items-center justify-between group ${activeSection === section.id
                                        ? 'bg-gray-50 text-[#1D1D1F]'
                                        : 'text-gray-500 hover:text-[#1D1D1F] hover:bg-gray-50/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={16} className={`flex-shrink-0 transition-opacity ${activeSection === section.id ? 'opacity-100' : 'opacity-30 group-hover:opacity-60'}`} />
                                        {section.title}
                                    </div>
                                    {activeSection === section.id && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                    <div className="mt-12 p-5 bg-white rounded-2xl border border-[#D2D2D7] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-1000" />
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Bundle Size</p>
                        <p className="text-3xl font-bold text-[#1D1D1F] tracking-tight">38KB</p>
                        <p className="text-[11px] text-gray-500 mt-1">Ready for Production</p>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 lg:pl-10 py-10 px-5 md:px-0 w-full overflow-hidden min-w-0">
                    {/* Hero Section */}
                    <section id="intro" className="mb-16 md:mb-24 mt-4 scroll-mt-24">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#D2D2D7] rounded-full mb-6 md:mb-8 shadow-sm">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">Production Ready • v3.3.14</span>
                        </div>

                        <h1 className="text-[32px] md:text-[64px] font-bold tracking-tight text-[#1D1D1F] leading-[1.1] mb-6 md:mb-8">
                            Build Payment Apps <br className="hidden md:block" />
                            <span className="text-gray-400">in Minutes, Not Weeks.</span>
                        </h1>

                        <p className="text-base md:text-xl text-gray-500 leading-relaxed max-w-2xl mb-10 md:mb-12 font-medium">
                            Micropay is a high-performance Solana SDK for implementing friction-free
                            <span className="text-[#1D1D1F]"> x402 protocol</span> payments. Secure, stateless, and built for the future.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-16 md:mb-20">
                            <Link href="/agent-chat" className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#1D1D1F] text-white rounded-full font-semibold hover:bg-black transition-all shadow-lg active:scale-95 text-[14px] md:text-[15px]">
                                <Sparkles size={18} />
                                Try AI Agent Demo
                            </Link>
                            <a href="https://github.com/AlleyBo55/micropay-solana-x402-paywall" target="_blank" className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#FAFAFA] text-[#1D1D1F] border border-gray-100 rounded-full font-semibold hover:bg-gray-50 transition-all shadow-sm active:scale-95">
                                <Copy01Icon size={16} className="text-gray-400" />
                                Star on GitHub
                            </a>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
                            {[
                                { icon: Shield01Icon, color: 'text-blue-500', title: 'Stateless Auth', desc: 'Secure x402 error handling using cryptographic signatures.' },
                                { icon: Coins01Icon, color: 'text-purple-500', title: 'SOL & SPL Tokens', desc: 'Native support for any SPL token via Jupiter integration.' },
                                { icon: BrainIcon, color: 'text-amber-500', title: 'AI Optimized', desc: 'Designed for autonomous agents with local keypair support.' },
                            ].map((card, i) => (
                                <div key={i} className="group p-4 md:p-1 border-b border-[#D2D2D7] bg-transparent hover:bg-white/50 transition-colors">
                                    <div className={`mb-3 md:mb-4 ${card.color} opacity-60 group-hover:opacity-100 transition-opacity`}>
                                        <card.icon size={20} />
                                    </div>
                                    <h3 className="text-[16px] md:text-[17px] font-bold text-[#1D1D1F] mb-1.5 tracking-tight">{card.title}</h3>
                                    <p className="text-[13px] md:text-[14px] text-gray-500 leading-relaxed font-medium">{card.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Why x402? */}
                    <section id="why" className="mb-16 md:mb-24 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-8 md:mb-10">
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#1D1D1F]">Why x402?</h2>
                            <div className="flex-1 h-[1px] bg-[#D2D2D7]" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                            <div className="space-y-6">
                                <h3 className="text-2xl md:text-3xl font-bold text-[#1D1D1F] tracking-tight leading-tight">
                                    Micropayments, <br />
                                    <span className="text-gray-400">Architected for Velocity.</span>
                                </h3>
                                <p className="text-gray-500 text-sm md:text-base leading-relaxed font-medium">
                                    Traditional payments are too slow for the AI era. x402 provides a standardized
                                    human-and-machine-readable bridge for value transfer.
                                </p>
                                <div className="space-y-4 pt-2 md:pt-4">
                                    {[
                                        { title: 'Standardization', desc: 'Native HTTP 402 error handling.', icon: Share01Icon },
                                        { title: 'AI Integration', desc: 'Secure agent-to-agent keypair support.', icon: CpuIcon },
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center text-[#1D1D1F]">
                                                <item.icon size={18} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[14px] md:text-[15px] text-[#1D1D1F]">{item.title}</h4>
                                                <p className="text-[12px] md:text-[13px] text-gray-500 font-medium">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative group min-w-0">
                                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                <div className="relative bg-[#0A0A0A] rounded-2xl md:rounded-3xl p-4 md:p-8 border border-white/[0.06] shadow-2xl overflow-hidden scale-100 group-hover:scale-[1.02] transition-transform duration-500 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-4 md:mb-6 opacity-40">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                    </div>
                                    <CodeBlock code={`// The x402 Magic
const res = await api.get('/premium');

if (res.status === 402) {
  const { paymentUrl } = await res.json();
  // Simply pay via SDK
  await pay(paymentUrl);
}`} />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Live Demos */}
                    <section id="demo-features" className="mb-16 md:mb-24 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-8 md:mb-10">
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#1D1D1F]">Live Demos</h2>
                            <div className="flex-1 h-[1px] bg-[#D2D2D7]" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 flex-wrap">
                            {[
                                {
                                    href: '/article/ai-future',
                                    label: 'CONSUMER FLOW',
                                    title: 'Content Paywall',
                                    desc: 'Unlock premium reading experiences with sub-second wallet signatures.',
                                    icon: BookOpen01Icon,
                                    color: 'blue'
                                },
                                {
                                    href: '/agent-chat',
                                    label: 'AGENT FLOW',
                                    title: 'Autonomous Payments',
                                    desc: 'Watch specialists negotiate and pay via cryptographically verified links.',
                                    icon: AiBrain01Icon,
                                    color: 'purple'
                                }
                            ].map((demo, i) => (
                                <Link key={i} href={demo.href} className="group relative bg-white border border-[#D2D2D7] p-6 md:p-8 rounded-[32px] hover:border-gray-300 transition-all hover:shadow-[0_24px_48px_rgba(0,0,0,0.03)] overflow-hidden active:scale-[0.98] min-w-0">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-500 scale-100 group-hover:scale-110">
                                        <demo.icon size={120} />
                                    </div>
                                    <div className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest mb-6 border border-${demo.color}-200 bg-${demo.color}-50 text-${demo.color}-600`}>
                                        {demo.label}
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold mb-3 text-[#1D1D1F] tracking-tight">{demo.title}</h3>
                                    <p className="text-gray-500 text-[14px] md:text-[15px] leading-relaxed mb-8 max-w-[280px] font-medium">
                                        {demo.desc}
                                    </p>
                                    <div className={`flex items-center gap-2 text-${demo.color}-600 text-sm font-bold group-hover:gap-4 transition-all`}>
                                        Launch Project <ArrowRight01Icon size={16} />
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="bg-white border border-[#D2D2D7] rounded-[32px] p-6 md:p-12 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20" />
                            <h3 className="text-lg md:text-xl font-bold mb-8 text-[#1D1D1F] flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                Features Demonstrated
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
                                {[
                                    { category: 'Protocol', items: ['x402 Implementation', 'SOL & SPL Tokens', 'Stateless Sessions'] },
                                    { category: 'Automation', items: ['AI Agent Wallets', 'PayAI Formats', 'Priority Fees'] },
                                    { category: 'Reliability', items: ['On-Chain Verification', 'RPC Fallback', 'Replay Protection'] }
                                ].map((group, i) => (
                                    <div key={i}>
                                        <h4 className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">{group.category}</h4>
                                        <ul className="space-y-3">
                                            {group.items.map((item, j) => (
                                                <li key={j} className="flex items-center gap-3 text-[13px] md:text-[14px] text-gray-600 font-medium leading-tight">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200 flex-shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="installation" className="mb-16 md:mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg text-lg">📦</div>
                            <h2 className="text-2xl md:text-3xl font-bold text-[#1D1D1F]">Installation</h2>
                        </div>
                        <p className="text-[17px] md:text-lg text-gray-600 mb-8 font-medium">
                            Get started in seconds with npm or yarn.
                        </p>

                        <div className="space-y-8">
                            <div>
                                <h3 className="font-bold mb-4 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">1</span> Install the package
                                </h3>
                                <CodeBlock language="bash" code="npm install @alleyboss/micropay-solana-x402-paywall @solana/web3.js" />
                            </div>

                            <div>
                                <h3 className="font-bold mb-4 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">2</span> Set up environment variables
                                </h3>
                                <CodeBlock language="bash" code={`# .env.local
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
CREATOR_WALLET_ADDRESS=your_wallet_address
SESSION_SECRET=your_32_character_secret_key
SESSION_DURATION_HOURS=24
DEFAULT_ARTICLE_PRICE_LAMPORTS=10000000

# Optional: AI Agent Demo
OPENAI_API_KEY=sk-...
AGENT_KEYPAIR_SECRET=[...]`} />
                            </div>
                        </div>

                        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 mt-10">
                            <div className="flex items-start gap-4">
                                <div className="text-xl">💡</div>
                                <div>
                                    <h4 className="font-bold text-sm mb-1 text-blue-900">Pro Tip</h4>
                                    <p className="text-sm text-blue-800/80 font-medium">Use Devnet for testing. Get free SOL from the <a href="https://faucet.solana.com" target="_blank" className="text-blue-600 hover:underline">Solana Faucet</a>.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="quick-start" className="mb-16 md:mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-100 text-green-600 rounded-lg text-lg">⚡</div>
                            <h2 className="text-2xl md:text-3xl font-bold text-[#1D1D1F]">Quick Start</h2>
                        </div>
                        <p className="text-[17px] md:text-lg text-gray-600 mb-10 font-medium">
                            Protect your API routes with x402 middleware in just a few lines of code.
                        </p>

                        <div className="space-y-12 overflow-hidden">
                            {/* Next.js Example */}
                            <div className="overflow-hidden">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-bold">N</div>
                                    <div>
                                        <h3 className="font-bold text-xl">Next.js App Router</h3>
                                        <p className="text-sm text-gray-500">Protect API routes with middleware</p>
                                    </div>
                                </div>
                                <CodeBlock code={`// app/api/premium/route.ts
import { createX402Middleware } from '@alleyboss/micropay-solana-x402-paywall/next';

const withPayment = createX402Middleware({
  walletAddress: process.env.CREATOR_WALLET_ADDRESS!,
  price: '10000000', // 0.01 SOL in lamports
  network: 'devnet',
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL
});

export const GET = withPayment(async (req) => {
  return new Response(JSON.stringify({ 
    data: 'Premium content unlocked!' 
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});`} />
                            </div>

                            {/* Express Example */}
                            <div className="overflow-hidden">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-900 font-bold border border-gray-200 shadow-sm">E</div>
                                    <div>
                                        <h4 className="font-bold text-[17px]">Express.js</h4>
                                        <p className="text-xs text-gray-500 font-medium">Add middleware to any route</p>
                                    </div>
                                </div>
                                <CodeBlock code={`import express from 'express';
import { x402Middleware } from '@alleyboss/micropay-solana-x402-paywall/express';

const app = express();
const server = new x402ResourceServer({
  facilitator: new LocalSvmFacilitator(process.env.RPC_URL!),
  walletAddress: process.env.CREATOR_WALLET_ADDRESS!
});

app.get('/api/premium', 
  x402Middleware(server, {
    accepts: { scheme: 'exact', amount: '10000000' }
  }), 
  (req, res) => res.json({ data: 'Unlocked!' })
);`} />
                            </div>

                            {/* Client-Side Example */}
                            <div className="overflow-hidden">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">R</div>
                                    <div>
                                        <h4 className="font-bold text-[17px]">React Client</h4>
                                        <p className="text-xs text-gray-500 font-medium">Connect wallet and make payments</p>
                                    </div>
                                </div>
                                <CodeBlock code={`import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction, SystemProgram, PublicKey } from '@solana/web3.js';

function PaymentButton() {
  const { publicKey, signTransaction } = useWallet();

  const handlePayment = async () => {
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey!,
        toPubkey: new PublicKey('CREATOR_WALLET'),
        lamports: 10_000_000 // 0.01 SOL
      })
    );

    const signed = await signTransaction!(tx);
    const signature = await connection.sendRawTransaction(signed.serialize());
    
    // Call protected API with X402 Auth
    const response = await fetch('/api/premium', {
      headers: {
        'Authorization': \`x402 \${btoa(JSON.stringify({ signatures: [signature] }))}\`
      }
    });
  };

  return <button onClick={handlePayment}>Pay 0.01 SOL</button>;
}`} />
                            </div>
                        </div>

                        <div className="bg-[#F5F5F7] border border-green-200/50 rounded-2xl p-6 mt-8">
                            <h3 className="font-bold mb-3 flex items-center gap-2">
                                <span className="text-xl">✨</span>
                                That's it!
                            </h3>
                            <p className="text-gray-700 mb-4">You now have a fully functional micropayment system. The middleware handles:</p>
                            <div className="grid md:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2"><span className="text-green-600">✓</span> Payment verification</div>
                                <div className="flex items-center gap-2"><span className="text-green-600">✓</span> Session management</div>
                                <div className="flex items-center gap-2"><span className="text-green-600">✓</span> Anti-replay protection</div>
                                <div className="flex items-center gap-2"><span className="text-green-600">✓</span> Error handling</div>
                            </div>
                        </div>
                    </section>

                    {/* Deployment Section */}
                    <section id="deployment" className="mb-16 md:mb-24 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-8 md:mb-10">
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#1D1D1F]">Deployment</h2>
                            <div className="flex-1 h-[1px] bg-[#D2D2D7]" />
                        </div>

                        {/* New Hero */}
                        <div className="mb-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-bold uppercase tracking-wider mb-6">
                                <RocketIcon size={14} />
                                One-Click Deploy
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1D1D1F] mb-4">
                                Deploy Your Own Facilitator
                            </h3>
                            <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
                                For production, spin up a high-performance verification node in seconds.
                                Zero config files to edit—just bring your RPC URL.
                            </p>
                        </div>

                        {/* Platform Grid */}
                        <div className="grid md:grid-cols-3 gap-6 mb-16">
                            {[
                                {
                                    name: 'Railway',
                                    desc: 'Recommended for production. Auto-scaling & zero-downtime deploys.',
                                    color: 'from-purple-500 to-pink-500',
                                    icon: RailwayIcon,
                                    link: 'https://railway.app/template/https://github.com/AlleyBo55/oneclick-x402-facilitator-solana'
                                },
                                {
                                    name: 'Heroku',
                                    desc: 'Easiest for quick prototypes. One-click setup with dyno management.',
                                    color: 'from-violet-500 to-indigo-500',
                                    icon: HerokuIcon,
                                    link: 'https://heroku.com/deploy?template=https://github.com/AlleyBo55/oneclick-x402-facilitator-solana'
                                },
                                {
                                    name: 'Render',
                                    desc: 'Best price-performance. Fully managed docker containers.',
                                    color: 'from-blue-500 to-cyan-500',
                                    icon: RenderIcon,
                                    link: 'https://render.com/deploy?repo=https://github.com/AlleyBo55/oneclick-x402-facilitator-solana'
                                }
                            ].map((platform) => (
                                <a
                                    key={platform.name}
                                    href={platform.link}
                                    target="_blank"
                                    className="group relative bg-white border border-[#D2D2D7] rounded-3xl p-6 md:p-8 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 hover:-translate-y-1 block overflow-hidden"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
                                        <platform.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#1D1D1F] mb-2 flex items-center gap-2">
                                        {platform.name}
                                        <ArrowLeft01Icon size={16} className="rotate-180 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-gray-400" />
                                    </h3>
                                    <p className="text-gray-500 text-[13px] md:text-[14px] leading-relaxed font-medium">{platform.desc}</p>
                                </a>
                            ))}
                        </div>

                        {/* Config Workflow */}
                        <div className="mb-16">
                            <h3 className="text-xl font-bold text-[#1D1D1F] mb-8 flex items-center gap-3">
                                <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">2</span>
                                Configuration Workflow
                            </h3>

                            <div className="relative pl-8 md:pl-12 border-l-2 border-dashed border-gray-200 space-y-12">
                                {/* Step 1 */}
                                <div className="relative">
                                    <div className="absolute -left-[39px] md:-left-[55px] top-0 w-5 h-5 bg-blue-500 rounded-full border-4 border-white shadow-sm" />
                                    <h4 className="font-bold text-[#1D1D1F] mb-2">Initiate Deployment</h4>
                                    <p className="text-sm text-gray-500 mb-4">Select your preferred cloud provider above. You'll be redirected to their setup wizard.</p>
                                    <div className="bg-gray-50 rounded-lg border border-gray-200 px-3 py-2 inline-block text-[13px] text-gray-500 font-medium">
                                        💡 No account? Railway allows guest deployments.
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="relative">
                                    <div className="absolute -left-[39px] md:-left-[55px] top-0 w-5 h-5 bg-purple-500 rounded-full border-4 border-white shadow-sm" />
                                    <h4 className="font-bold text-[#1D1D1F] mb-2">Configure RPC Endpoint</h4>
                                    <p className="text-sm text-gray-500 mb-6">
                                        The only critical environment variable is <code className="bg-gray-100 px-1 py-0.5 rounded text-[#1D1D1F] font-mono text-xs">SOLANA_RPC_URL</code>.
                                    </p>
                                    <div className="bg-[#1C1C1E] text-white rounded-2xl p-6 shadow-xl max-w-xl border border-white/10">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">SOLANA_RPC_URL <span className="text-red-400">*</span></label>
                                                <div className="bg-white/10 border border-white/10 rounded-lg p-3 font-mono text-[13px] text-blue-300 break-all">
                                                    https://mainnet.helius-rpc.com/?api-key=...
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">SOLANA_NETWORK</label>
                                                <div className="flex gap-2">
                                                    <div className="bg-white/10 border border-blue-500/50 rounded-md px-3 py-2 text-[13px] font-medium ring-1 ring-blue-500/50">mainnet-beta</div>
                                                    <div className="bg-transparent border border-white/10 rounded-md px-3 py-2 text-[13px] text-gray-500">devnet</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="relative">
                                    <div className="absolute -left-[39px] md:-left-[55px] top-0 w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow-sm" />
                                    <h4 className="font-bold text-[#1D1D1F] mb-2">Verify & Connect</h4>
                                    <p className="text-sm text-gray-500 mb-6">Once deployed, verify your node is active with the health check.</p>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="bg-white border border-[#D2D2D7] px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm">
                                            <ShieldKeyIcon size={16} className="text-green-600" />
                                            <code className="text-[13px] font-mono text-[#1D1D1F]">GET /health</code>
                                        </div>
                                        <div className="bg-white border border-[#D2D2D7] px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm">
                                            <Database01Icon size={16} className="text-blue-600" />
                                            <code className="text-[13px] font-mono text-[#1D1D1F]">GET /metrics</code>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="bg-white rounded-[32px] p-8 md:p-10 border border-[#D2D2D7]">
                            <h3 className="text-xl font-bold text-[#1D1D1F] mb-8">Deployment FAQ</h3>
                            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                                <div>
                                    <h4 className="font-bold text-[#1D1D1F] text-[15px] mb-3 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        What happens when I click Deploy?
                                    </h4>
                                    <p className="text-[14px] text-gray-500 leading-relaxed font-medium">
                                        The platform (Railway/Heroku/Render) will automatically fork this open-source repository into your own account. It will then pause to ask for your Environment Variables before building the Go binaries.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1D1D1F] text-[15px] mb-3 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                        Can I change networks later?
                                    </h4>
                                    <p className="text-[14px] text-gray-500 leading-relaxed font-medium">
                                        Yes. Simply go to your project dashboard's "Variables" or "Settings" tab and update <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800 font-mono text-xs">SOLANA_NETWORK</code> to <code className="font-mono text-xs">mainnet-beta</code> or <code className="font-mono text-xs">devnet</code>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How It Works */}
                    <section id="payment-flow" className="mb-16 md:mb-24 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-8 md:mb-10">
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#1D1D1F]">How It Works</h2>
                            <div className="flex-1 h-[1px] bg-[#D2D2D7]" />
                        </div>

                        <div className="space-y-16">
                            <div>
                                <h3 className="text-[17px] font-bold mb-6 text-[#1D1D1F] flex items-center gap-2">
                                    <span className="w-5 h-5 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center text-[10px]">01</span>
                                    Lifecycle of a Payment
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { title: 'Request', desc: 'Client hits a protected endpoint.', icon: Globe02Icon },
                                        { title: 'Challenge', desc: 'Server returns 402 + payment URL.', icon: LockIcon },
                                        { title: 'Payment', desc: 'Wallet signs and sends SOL.', icon: CreditCardValidationIcon },
                                        { title: 'Unlock', desc: 'Server verifies and issues session.', icon: CheckmarkCircle01Icon },
                                    ].map((step, i) => (
                                        <div key={i} className="p-5 bg-white border border-[#D2D2D7] rounded-2xl relative group">
                                            {i < 3 && <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-[1px] bg-gray-100 z-10" />}
                                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                                                <step.icon size={18} />
                                            </div>
                                            <h4 className="font-bold text-[14px] text-[#1D1D1F] mb-1">{step.title}</h4>
                                            <p className="text-[12px] text-gray-500 leading-normal font-medium">{step.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white border border-[#D2D2D7] rounded-[40px] p-8 md:p-16 shadow-sm">
                                <h3 className="text-xl md:text-2xl font-bold mb-12 text-[#1D1D1F] text-center tracking-tight">Protocol Architecture</h3>
                                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0">
                                    {/* Client Box */}
                                    <div className="flex-1 flex flex-col items-center group">
                                        <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-50 border border-gray-100 rounded-[24px] md:rounded-[36px] flex items-center justify-center shadow-sm mb-5 group-hover:bg-white group-hover:border-blue-100 transition-all duration-500">
                                            <Globe02Icon size={32} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <p className="text-sm md:text-base font-bold text-[#1D1D1F]">Client</p>
                                        <p className="text-[9px] md:text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1.5 px-3 py-1 bg-gray-100/50 rounded-full">Browser / Agent</p>
                                    </div>

                                    {/* Connector 1 */}
                                    <div className="flex flex-col items-center justify-center py-2 md:py-0 md:w-24">
                                        <div className="w-[1px] h-6 md:w-full md:h-[1px] bg-gray-200 relative">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-white text-[8px] md:text-[9px] text-gray-400 font-bold uppercase tracking-tighter whitespace-nowrap border border-gray-100 rounded-full">x402</div>
                                        </div>
                                    </div>

                                    {/* Middleware Box */}
                                    <div className="flex-1 flex flex-col items-center group">
                                        <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-50 border border-gray-100 rounded-[24px] md:rounded-[36px] flex items-center justify-center shadow-sm mb-5 group-hover:bg-white group-hover:border-purple-100 transition-all duration-500">
                                            <SecurityCheckIcon size={32} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
                                        </div>
                                        <p className="text-sm md:text-base font-bold text-[#1D1D1F]">Middleware</p>
                                        <p className="text-[9px] md:text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1.5 px-3 py-1 bg-gray-100/50 rounded-full">Next.js / Bun</p>
                                    </div>

                                    {/* Connector 2 */}
                                    <div className="flex flex-col items-center justify-center py-2 md:py-0 md:w-24">
                                        <div className="w-[1px] h-6 md:w-full md:h-[1px] bg-gray-200 relative">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-white text-[8px] md:text-[9px] text-gray-400 font-bold uppercase tracking-tighter whitespace-nowrap border border-gray-100 rounded-full">RPC</div>
                                        </div>
                                    </div>

                                    {/* Solana Box */}
                                    <div className="flex-1 flex flex-col items-center group">
                                        <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-50 border border-gray-100 rounded-[24px] md:rounded-[36px] flex items-center justify-center shadow-sm mb-5 group-hover:bg-white group-hover:border-amber-100 transition-all duration-500">
                                            <Database01Icon size={32} className="text-gray-400 group-hover:text-amber-500 transition-colors" />
                                        </div>
                                        <p className="text-sm md:text-base font-bold text-[#1D1D1F]">Solana</p>
                                        <p className="text-[9px] md:text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1.5 px-3 py-1 bg-gray-100/50 rounded-full">Mainnet / Devnet</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Wallet Topology */}
                    <section id="wallet-topology" className="mb-16 md:mb-24 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-8 md:mb-10">
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#1D1D1F]">Wallet Topology</h2>
                            <div className="flex-1 h-[1px] bg-[#D2D2D7]" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            {[
                                {
                                    title: 'Consumer to API',
                                    desc: 'Standard paywall flow for web users.',
                                    icon: Globe02Icon,
                                    from: 'User Wallet',
                                    to: 'CREATOR_WALLET',
                                    color: 'blue'
                                },
                                {
                                    title: 'Agent to Agent',
                                    desc: 'Autonomous machine payments.',
                                    icon: AiBrain01Icon,
                                    from: 'Agent Wallet',
                                    to: 'CREATOR_WALLET',
                                    color: 'purple'
                                }
                            ].map((archetype, i) => (
                                <div key={i} className="bg-white border border-[#D2D2D7] rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all group">
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 mb-6 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all`}>
                                        <archetype.icon size={20} />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-[#1D1D1F] mb-2">{archetype.title}</h3>
                                    <p className="text-[13px] md:text-sm text-gray-500 mb-8 font-medium">{archetype.desc}</p>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                            <div className="min-w-0">
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payer</p>
                                                <p className="text-[12px] md:text-[13px] font-bold text-[#1D1D1F] truncate">{archetype.from}</p>
                                            </div>
                                            <ArrowRight01Icon size={14} className="text-gray-300 mx-2 flex-shrink-0" />
                                            <div className="text-right min-w-0">
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Receiver</p>
                                                <p className="text-[12px] md:text-[13px] font-bold text-[#1D1D1F] truncate">{archetype.to}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-[#1D1D1F] text-white rounded-[32px] p-8 md:p-12 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Settings01Icon size={20} className="text-blue-400" />
                                    Configuration Checklist
                                </h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Consumer Setup</h4>
                                        <ul className="space-y-3">
                                            {['CREATOR_WALLET_ADDRESS is set', 'RPC_URL is reachable', 'Devnet SOL in user wallet'].map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Agent Setup</h4>
                                        <ul className="space-y-3">
                                            {['AGENT_KEYPAIR_SECRET is set', 'Fund agent wallet with SOL', 'Configure agent fee tier'].map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* AI Agent Payments */}
                    <section id="agent-chat" className="mb-16 md:mb-24 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-8 md:mb-10">
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#1D1D1F]">AI Agent Payments</h2>
                            <div className="flex-1 h-[1px] bg-[#D2D2D7]" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-12 items-start mb-16">
                            <div className="md:col-span-2 space-y-6 md:space-y-8">
                                <h3 className="text-2xl md:text-[32px] font-bold text-[#1D1D1F] tracking-tight leading-[1.1]">
                                    Machines playing <br />
                                    <span className="text-gray-400">by human rules.</span>
                                </h3>
                                <p className="text-gray-500 text-sm md:text-base leading-relaxed font-medium">
                                    x402 allows AI agents to negotiate and fulfill payments autonomously. By using standard HTTP error 402,
                                    agents can identify payment requirements and resolve them using their own keypairs.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link href="/agent-chat" className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#1D1D1F] text-white rounded-full font-semibold hover:bg-black transition-all shadow-lg active:scale-95 text-[14px]">
                                        <SparklesIcon size={18} />
                                        Try AI Agent Demo
                                    </Link>
                                    <div className="px-4 py-3 bg-gray-50 rounded-full border border-gray-100 flex items-center justify-center">
                                        <span className="text-[11px] md:text-[12px] font-bold text-gray-500 uppercase tracking-widest">Latency: 140ms</span>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-3 bg-white border border-[#D2D2D7] rounded-3xl md:rounded-[40px] p-6 md:p-12 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
                                <div className="space-y-8 md:space-y-10">
                                    {[
                                        { title: 'Detect 402 Challenge', desc: 'Agent receives 402 Payment Required with metadata.', icon: Search01Icon },
                                        { title: 'Sign & Authorize', desc: 'Agent signs tx with AGENT_KEYPAIR_SECRET.', icon: SignatureIcon },
                                        { title: 'Validation', desc: 'Resource server validates the on-chain signature.', icon: DatabaseSecurity01Icon },
                                    ].map((step, i) => (
                                        <div key={i} className="flex gap-4 md:gap-6 relative">
                                            {i < 2 && <div className="absolute left-4 md:left-5 top-10 w-[1px] h-10 bg-gray-200" />}
                                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-white border border-gray-100 flex-shrink-0 flex items-center justify-center text-[#1D1D1F] shadow-sm group-hover:border-purple-200 transition-colors">
                                                <step.icon size={16} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[14px] md:text-[15px] text-[#1D1D1F] mb-1">{step.title}</h4>
                                                <p className="text-[12px] md:text-[13px] text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-12">
                            <h3 className="text-lg md:text-xl font-bold mb-8 text-[#1D1D1F]">Technical Implementation</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { title: 'Autonomous Wallets', desc: 'Agents manage their own SOL balances for pay-per-request.', icon: Key01Icon },
                                    { title: 'Cloud Integration', desc: 'Deploy agents on Vercel AI SDK or similar stacks.', icon: AiCloud01Icon },
                                    { title: 'Usage Metrics', desc: 'Track spending and efficiency per agent session.', icon: AnalyticsUp01Icon },
                                ].map((feature, i) => (
                                    <div key={i} className="space-y-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                            <feature.icon size={20} />
                                        </div>
                                        <h4 className="font-bold text-[15px] md:text-[16px] text-[#1D1D1F]">{feature.title}</h4>
                                        <p className="text-[13px] md:text-[14px] text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* PayAI Format */}
                    <section id="payai-format" className="mb-16 md:mb-24 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-8 md:mb-10">
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#1D1D1F]">PayAI Format</h2>
                            <div className="flex-1 h-[1px] bg-[#D2D2D7]" />
                        </div>

                        <div className="bg-[#F5F5F7] border border-[#D2D2D7] rounded-3xl md:rounded-[32px] p-6 md:p-12 mb-10 md:mb-12">
                            <div className="max-w-3xl text-center md:text-left mx-auto md:mx-0">
                                <h3 className="text-xl md:text-2xl font-bold text-[#1D1D1F] mb-4">The Universal Standard.</h3>
                                <p className="text-gray-500 text-sm md:text-base leading-relaxed font-medium mb-6">
                                    Native support for the <a href="https://payai.network" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">PayAI payment format</a> - a universal protocol that enables cross-chain payment discovery.
                                    Micropay automatically detects and transforms PayAI payloads into x402 compliant authorizations.
                                </p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                                    {['Multi-chain', 'Stateless', 'Async', 'Universal'].map((tag) => (
                                        <div key={tag} className="px-3 py-1.5 md:px-4 md:py-2 bg-white rounded-xl border border-gray-100 text-[9px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center shadow-sm">
                                            {tag}
                                        </div>
                                    ))}
                                </div>
                                <a href="https://payai.network" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-[12px] font-bold text-[#1D1D1F] hover:bg-gray-50 transition-all shadow-sm">
                                    Learn more at payai.network
                                    <ArrowRight01Icon size={14} />
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-12">
                            <div className="space-y-6 md:space-y-8">
                                <div>
                                    <h4 className="text-[13px] md:text-sm font-bold text-[#1D1D1F] mb-4 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                        PayAI Payload Structure
                                    </h4>
                                    <CodeBlock code={`{
  "scheme": "exact-svm",
  "networkId": "solana-devnet",
  "paymentDetails": {
    "amount": "10000000",
    "recipient": "YourWallet..."
  }
}`} />
                                </div>
                                <div className="p-5 md:p-6 bg-indigo-50/30 rounded-2xl border border-indigo-100/50">
                                    <h5 className="text-[12px] md:text-[13px] font-bold text-indigo-900 mb-2">Protocol Note</h5>
                                    <p className="text-[12px] md:text-[13px] text-indigo-700/80 leading-relaxed font-medium">
                                        The <code>exact-svm</code> scheme ensures sub-second verification by matching transactions directly.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8">
                                <h4 className="text-[13px] md:text-sm font-bold text-[#1D1D1F] mb-6">Network Mapping</h4>
                                <div className="space-y-3">
                                    {[
                                        { network: 'solana', caip: 'solana:5eykt...pY1vz' },
                                        { network: 'solana-devnet', caip: 'solana:EtWTR...U2xqa' },
                                        { network: 'base', caip: 'eip155:8453' },
                                    ].map((row, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-2xl group hover:bg-gray-100 transition-colors">
                                            <div className="min-w-0">
                                                <p className="text-[12px] md:text-[13px] font-bold text-[#1D1D1F]">{row.network}</p>
                                                <p className="text-[10px] font-mono text-gray-400 mt-0.5 truncate">{row.caip}</p>
                                            </div>
                                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${i < 2 ? 'bg-green-500' : 'bg-gray-300'}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 md:p-10 bg-gray-900 rounded-3xl md:rounded-[32px] text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                            <h4 className="text-[17px] md:text-[18px] font-bold mb-4 md:mb-6 relative z-10 text-center md:text-left">Cross-Chain Discovery</h4>
                            <p className="text-gray-400 text-[13px] md:text-[14px] mb-8 max-w-2xl relative z-10 font-medium text-center md:text-left">
                                Enable users to pay on one chain and unlock on another. Micropay handles bridging confirmation automatically.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                                {[
                                    { title: 'Payment Request', desc: '402 response includes PayAI bridge link.' },
                                    { title: 'Verification', desc: 'Oracle network confirms cross-chain state.' },
                                    { title: 'Settlement', desc: 'Resource server issues localized session.' }
                                ].map((step, i) => (
                                    <div key={i} className="p-4 md:p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                                        <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">0{i + 1}</div>
                                        <h5 className="font-bold text-[13px] md:text-[14px] mb-1">{step.title}</h5>
                                        <p className="text-[11px] md:text-[12px] text-gray-400 leading-relaxed font-medium">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Self-Sovereign Verification */}
                    <section id="self-sovereign" className="mb-16 md:mb-24 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-8 md:mb-10">
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#1D1D1F]">Self-Sovereign Verification</h2>
                            <div className="flex-1 h-[1px] bg-[#D2D2D7]" />
                        </div>

                        <div className="bg-[#F5F5F7] border border-[#D2D2D7] rounded-3xl md:rounded-[32px] p-6 md:p-12 mb-10">
                            <div className="max-w-3xl">
                                <h3 className="text-xl md:text-2xl font-bold text-[#1D1D1F] mb-4">Verify Payments Yourself.</h3>
                                <p className="text-gray-500 text-sm md:text-base leading-relaxed font-medium mb-6">
                                    By default, the library uses the x402.org hosted facilitator. However, you can enable <strong>Self-Sovereign Mode</strong> to verify payments directly against your own Solana RPC node, removing reliance on any external API services.
                                </p>
                                <CodeBlock code={`const withMicropay = createX402Middleware({
    walletAddress: 'YOUR_WALLET',
    network: 'devnet',
    price: '1000000',
    // Enable Self-Sovereign Mode
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL 
});`} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8">
                                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">Hosted Mode (Default)</h4>
                                <ul className="space-y-4">
                                    {['Verified by x402.org', 'Zero-config setup', 'Best for quick startups'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-[13px] text-gray-600 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8">
                                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">Self-Sovereign Mode</h4>
                                <ul className="space-y-4">
                                    {['Verified by your RPC node', 'No external data sharing', 'Best for production'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-[13px] text-gray-600 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 mb-8">
                            <h3 className="text-[17px] font-bold text-[#1D1D1F] mb-6">Signature Registry</h3>
                            <p className="text-gray-500 text-[14px] leading-relaxed mb-10 font-medium">
                                Micropay uses an internal registry to track and verify on-chain signatures. This prevents replay attacks and ensures each payment is only used once.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { title: 'Deterministic', desc: 'Signatures are hashed and stored for lookup.', icon: LockIcon },
                                    { title: 'High Performance', desc: 'LRU caching for sub-millisecond lookups.', icon: ZapIcon },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                                            <item.icon size={16} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[13px] text-[#1D1D1F]">{item.title}</h4>
                                            <p className="text-[11px] text-gray-500 font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <CodeBlock code={`// Manual Verification Example
const isValid = await server.verify(signature);
if (!isValid) throw new Error('Payment already claimed!');`} />
                    </section>

                    {/* Installation */}
                    <section id="installation" className="mb-24 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-10">
                            <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">Installation</h2>
                            <div className="flex-1 h-[1px] bg-[#D2D2D7]" />
                        </div>
                        <div className="bg-[#F5F5F7] border border-[#D2D2D7] rounded-[32px] p-8 md:p-12">
                            <h3 className="text-lg font-bold text-[#1D1D1F] mb-6">Start Building Today.</h3>
                            <CodeBlock language="bash" code="npm install @alleyboss/micropay-solana-x402-paywall @solana/web3.js" />
                            <div className="mt-8 flex flex-wrap gap-4">
                                {['Typescript Ready', 'Tree Shakeable', 'Small Bundle'].map((tag: string) => (
                                    <div key={tag} className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Configuration */}
                    <section id="configuration" className="mb-16 md:mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg text-lg">⚙️</div>
                            <h2 className="text-2xl md:text-3xl font-bold text-[#1D1D1F]">Configuration</h2>
                        </div>
                        <p className="text-[17px] md:text-lg text-gray-600 mb-10 font-medium">
                            Tweak the resource server to match your security and performance needs.
                        </p>

                        <div className="space-y-6">
                            <div className="bg-white border border-[#D2D2D7] rounded-3xl overflow-hidden">
                                <div className="p-5 md:p-6 border-b border-[#D2D2D7] bg-[#F5F5F7]/50">
                                    <h3 className="font-bold text-gray-900">Resource Server Options</h3>
                                </div>
                                <div className="p-6 md:p-8">
                                    <CodeBlock code={`const server = new x402ResourceServer({
  // Use your own self-hosted facilitator
  facilitator: new RemoteFacilitator('https://my-facilitator.railway.app'), 
  walletAddress: CREATOR_ADDR,
  
  // Optional config
  registry: new RedisRegistry(), // Custom storage
  ttl: 3600, // Session duration in seconds
  network: 'devnet'
});`} />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quick Start */}
                    <section id="quick-start" className="mb-24 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-10">
                            <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">Quick Start</h2>
                            <div className="flex-1 h-[1px] bg-[#D2D2D7]" />
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative bg-white border border-gray-100 rounded-[32px] p-8 md:p-12">
                                <h3 className="text-xl font-bold text-[#1D1D1F] mb-6">The 1-Minute Protection.</h3>
                                <p className="text-gray-500 mb-8 font-medium">Protect any API route with just a few lines of code. Micropay handles the 402 response, verification, and session persistence.</p>

                                <CodeBlock code={`import { createX402Middleware } from '@alleyboss/micropay-solana-x402-paywall/next';

const withPayment = createX402Middleware({
  walletAddress: process.env.CREATOR_WALLET_ADDRESS!,
  price: '10000000', // 0.01 SOL
  network: 'devnet',
  // Optional: Use your self-hosted facilitator
  facilitatorUrl: 'https://my-facilitator.railway.app'
});

export const GET = withPayment(async (req) => {
  return Response.json({ status: 'Unlocked!' });
});`} />
                            </div>
                        </div>
                    </section>

                    {/* Middleware */}
                    <section id="middleware" className="mb-24 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-10">
                            <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">Middleware</h2>
                            <div className="flex-1 h-[1px] bg-[#D2D2D7]" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-12 overflow-hidden">
                            {/* Express.js */}
                            <div className="bg-white border border-gray-100 rounded-[32px] p-8 md:p-12 group hover:shadow-2xl transition-all overflow-hidden">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-bold text-xl">E</div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#1D1D1F]">Express.js</h3>
                                        <p className="text-[13px] text-gray-500 font-medium">For Node backends</p>
                                    </div>
                                </div>
                                <CodeBlock code={`import { x402Middleware } from '@alleyboss/micropay-solana-x402-paywall/express';\n\napp.get('/api/data', x402Middleware(server, {\n  accepts: { amount: '1000' }\n}), handler);`} />
                            </div>

                            {/* Next.js */}
                            <div className="bg-white border border-gray-100 rounded-[32px] p-8 md:p-12 group hover:shadow-2xl transition-all overflow-hidden">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white font-bold text-xl">N</div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#1D1D1F]">Next.js</h3>
                                        <p className="text-[13px] text-gray-500 font-medium">For App Router</p>
                                    </div>
                                </div>
                                <CodeBlock code={`import { createX402Middleware } from '@alleyboss/micropay-solana-x402-paywall/next';\n\nexport const GET = withPayment(async (req) => {\n  return Response.json({ ok: true });\n});`} />
                            </div>
                        </div>

                        <div className="bg-[#1D1D1F] rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                            <h3 className="text-xl font-bold mb-8 relative z-10 flex items-center gap-2">
                                <AnalyticsUp01Icon size={20} className="text-purple-400" />
                                The Execution Flow
                            </h3>
                            <div className="space-y-6 relative z-10">
                                {[
                                    { step: '01', title: 'Interception', desc: 'Middleware catches request & checks for Authorization header.' },
                                    { step: '02', title: 'Validation', desc: 'On-chain verification or PayAI facilitator check.' },
                                    { step: '03', title: 'Persistence', desc: 'Verified session is stored in an HTTP-only cookie.' },
                                    { step: '04', title: 'Grant', desc: 'Downstream handler receives the verified payer object.' }
                                ].map((item: { step: string, title: string, desc: string }, i: number) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="text-[11px] font-black text-purple-400/50 mt-1">{item.step}</div>
                                        <div>
                                            <h4 className="font-bold text-[15px] mb-1">{item.title}</h4>
                                            <p className="text-[13px] text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Security Section */}
                    <section id="security" className="mb-16 md:mb-24 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-8 md:mb-10">
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#1D1D1F]">Security</h2>
                            <div className="flex-1 h-[1px] bg-[#D2D2D7]" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8">
                                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                                    <Shield01Icon size={20} />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-[#1D1D1F] mb-3">Replay Protection</h3>
                                <p className="text-gray-500 text-[13px] md:text-[14px] leading-relaxed font-medium">
                                    Every transaction signature is registered and can only be used once per session. This prevents malicious actors from "replaying" a valid payment to unlock multiple resources.
                                </p>
                            </div>

                            <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8">
                                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                                    <FingerprintScanIcon size={20} />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-[#1D1D1F] mb-3">Stateless Verification</h3>
                                <p className="text-gray-500 text-[13px] md:text-[14px] leading-relaxed font-medium">
                                    By using Solana as the source of truth, the middleware doesn't need to maintain a database of users. If the on-chain data matches the request, access is granted.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-900 rounded-3xl p-6 md:p-12 text-white overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-amber-500 opacity-50" />
                            <div className="flex flex-col md:flex-row gap-10 items-center">
                                <div className="md:flex-1 space-y-6">
                                    <h3 className="text-xl md:text-2xl font-bold">Priority Fees Support</h3>
                                    <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium">
                                        Under high network congestion, Micropay supports Compute Budget instructions to ensure your payment transactions land on-chain without delay.
                                    </p>
                                    <div className="flex items-center gap-4 text-sm font-bold text-amber-500">
                                        <div className="px-3 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20 uppercase tracking-widest text-[10px]">Activated</div>
                                        <span>Always sub-second landing</span>
                                    </div>
                                </div>
                                <div className="md:w-64 flex-shrink-0">
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                                        <CodeBlock code={`// SDK adds automatically
tx.add(ComputeBudgetProgram.setComputeUnitPrice({
  microLamports: 1000
}));`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Troubleshooting */}
                    <section id="troubleshooting" className="mb-16 md:mb-24 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-8 md:mb-10">
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#1D1D1F]">Troubleshooting</h2>
                            <div className="flex-1 h-[1px] bg-[#D2D2D7]" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            {[
                                {
                                    issue: 'Payment Not Verifying',
                                    solution: 'Check CREATOR_WALLET_ADDRESS and lamport decimals. Use a better RPC provider if hits rate limits.',
                                    icon: AlertCircleIcon,
                                    tags: ['RPC', 'Verification']
                                },
                                {
                                    issue: 'Session Expired',
                                    solution: 'Increase SESSION_DURATION_HOURS or ensure SESSION_SECRET is stable across deployments.',
                                    icon: Clock01Icon,
                                    tags: ['Sessions', 'JWT']
                                }
                            ].map((item: any, i: number) => (
                                <div key={i} className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 hover:shadow-lg transition-all group">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <item.icon size={20} />
                                        </div>
                                        <h3 className="font-bold text-[#1D1D1F] text-[15px] md:text-lg">{item.issue}</h3>
                                    </div>
                                    <p className="text-[13px] md:text-[14px] text-gray-500 leading-relaxed font-medium mb-6">{item.solution}</p>
                                    <div className="flex gap-2">
                                        {item.tags.map((tag: string) => (
                                            <span key={tag} className="px-2 py-1 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest rounded-md">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gray-900 rounded-[32px] p-6 md:p-12 text-white">
                            <h3 className="text-lg md:text-xl font-bold mb-6">Common Error Codes</h3>
                            <div className="space-y-4">
                                {[
                                    { code: '402 Payment Required', desc: 'Resource protected by x402. Payer must provide auth header.' },
                                    { code: '403 Forbidden', desc: 'Invalid session or verified payment does not match price.' },
                                    { code: '503 Service Unavailable', desc: 'RPC node failed or facilitator is offline.' }
                                ].map((error: any, i: number) => (
                                    <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 gap-2">
                                        <code className="text-[12px] md:text-[13px] font-bold text-blue-400">{error.code}</code>
                                        <span className="text-[12px] md:text-[13px] text-gray-400 font-medium">{error.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Pricing */}
                    <section id="pricing" className="mb-16 md:mb-24 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-8 md:mb-10">
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#1D1D1F]">Pricing</h2>
                            <div className="flex-1 h-[1px] bg-[#D2D2D7]" />
                        </div>

                        <div className="max-w-xl">
                            <div className="bg-white border border-gray-100 rounded-[32px] md:rounded-[40px] p-8 md:p-12 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                    <ZapIcon size={160} />
                                </div>
                                <div className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold tracking-widest bg-blue-50 text-blue-600 border border-blue-100 mb-8 uppercase">Developer-First</div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-[#1D1D1F] tracking-tight">Free & Open Source</h3>
                                <p className="text-gray-500 mb-10 leading-relaxed font-medium text-base md:text-lg">
                                    Micropay is MIT licensed and free to use. Zero platform fees, zero middleman. You keep 100% of your earnings.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        { title: 'Platform Fees', value: '0%' },
                                        { title: 'Network Fees', value: 'Solana Gas Only' },
                                        { title: 'Support', value: 'Community Driven' }
                                    ].map((row, i) => (
                                        <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                                            <span className="text-sm md:text-base text-gray-400 font-medium">{row.title}</span>
                                            <span className="text-sm md:text-base font-bold text-[#1D1D1F]">{row.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Roadmap */}
                    <section id="roadmap" className="mb-16 md:mb-24 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-8 md:mb-10">
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#1D1D1F]">Roadmap</h2>
                            <div className="flex-1 h-[1px] bg-[#D2D2D7]" />
                        </div>

                        <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-gray-100 hidden md:block" />
                            <div className="space-y-8 md:space-y-12">
                                {[
                                    { quarter: 'Q1 2024', status: 'COMPLETED', title: 'Core Protocol', desc: 'Initial x402 implementation with SVM support.', color: 'gray' },
                                    { quarter: 'Q2 2024', status: 'IN PROGRESS', title: 'SPL Standard', desc: 'Native support for USDC and major SPL tokens.', color: 'blue' },
                                    { quarter: 'Q3 2024', status: 'PLANNED', title: 'EVM Briding', desc: 'Expanding the x402 standard to Base and Arbitrum.', color: 'purple' },
                                ].map((item, i) => (
                                    <div key={i} className="relative pl-0 md:pl-12 flex flex-col md:flex-row gap-4 md:gap-12 group">
                                        <div className="hidden md:block absolute left-4 top-1 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white bg-blue-500 shadow-md group-hover:scale-125 transition-transform" />
                                        <div className="md:w-32 pt-1">
                                            <div className="px-2.5 py-1 rounded-lg bg-gray-50 text-[10px] md:text-[11px] font-bold text-gray-400 inline-block border border-gray-100 mb-2 md:mb-0">{item.quarter}</div>
                                        </div>
                                        <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-5 md:p-6 group-hover:border-gray-200 transition-all shadow-sm">
                                            <h4 className="font-bold text-[#1D1D1F] mb-1">{item.title}</h4>
                                            <p className="text-[13px] md:text-[14px] text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* API Reference */}
                    <section id="api-reference" className="mb-16 md:mb-24 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-8 md:mb-10">
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#1D1D1F]">API Reference</h2>
                            <div className="flex-1 h-[1px] bg-[#D2D2D7]" />
                        </div>
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                {[
                                    { mod: '@.../agent', fns: ['executeAgentPayment', 'getAgentBalance'] },
                                    { mod: '@.../express', fns: ['x402Middleware', 'ExpressAdapter'] },
                                    { mod: '@.../next', fns: ['createX402Middleware'] },
                                    { mod: '@.../pricing', fns: ['getSolPrice', 'usdToLamports'] }
                                ].map((item: any, i: number) => (
                                    <div key={i} className="p-5 md:p-6 bg-gray-50 rounded-[24px]">
                                        <div className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">{item.mod}</div>
                                        <div className="flex flex-wrap gap-2">
                                            {item.fns.map((fn: string) => (
                                                <code key={fn} className="text-[11px] md:text-[12px] font-bold text-blue-600 bg-white px-2 py-1 rounded border border-gray-100">{fn}</code>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Support */}
                    <section id="support" className="mb-16 md:mb-24 scroll-mt-24 text-center">
                        <div className="max-w-2xl mx-auto bg-[#F5F5F7] border border-[#D2D2D7] rounded-[32px] md:rounded-[40px] p-6 md:p-12">
                            <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center text-2xl md:text-3xl shadow-xl mx-auto mb-6 md:mb-8">☕</div>
                            <h3 className="text-xl md:text-2xl font-bold text-[#1D1D1F] mb-4">Support Dev.</h3>
                            <p className="text-gray-500 font-medium mb-8 md:mb-10 leading-relaxed text-sm md:text-base">
                                Micropay is open source. If you find it useful, consider supporting core development with a small donation.
                            </p>
                            <div className="group bg-white p-3 md:p-4 rounded-xl md:rounded-2xl border border-[#D2D2D7] flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:border-blue-200">
                                <code className="text-[11px] md:text-[12px] font-mono text-gray-400 break-all px-2 md:px-4 leading-relaxed">7fPjNJaEHtepp1ZRr6GsaW1k22U1FupQtwuHUkTb6Xg9</code>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText('7fPjNJaEHtepp1ZRr6GsaW1k22U1FupQtwuHUkTb6Xg9');
                                    }}
                                    className="w-full sm:w-auto p-3 bg-gray-900 text-white rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="sm:hidden text-xs font-bold uppercase tracking-wider">Copy Address</span>
                                    <Copy01Icon size={18} />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="text-center py-24 border-t border-[#D2D2D7]">
                        <div className="flex justify-center gap-8 mb-4">
                            <a href="#" className="text-[13px] font-bold text-[#1D1D1F] hover:text-blue-500 transition-colors">Documentation</a>
                            <a href="https://github.com/AlleyBo55/micropay-solana-x402-paywall" target="_blank" className="text-[13px] font-bold text-[#1D1D1F] hover:text-blue-500 transition-colors">GitHub</a>
                            <a href="https://www.npmjs.com/package/@alleyboss/micropay-solana-x402-paywall" target="_blank" className="text-[13px] font-bold text-[#1D1D1F] hover:text-blue-500 transition-colors">npm</a>
                        </div>
                        <p className="text-[12px] text-gray-400 font-medium">MIT © 2024 AlleyBoss · Built with passion for the Solana ecosystem.</p>
                    </footer>
                </main>
            </div>
        </div >
    );
}
