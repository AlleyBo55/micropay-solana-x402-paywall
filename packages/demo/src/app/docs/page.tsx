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

const LightningIcon = ZapIcon;
const Cpu = CpuIcon;
const Sparkles = SparklesIcon;


const sections = [
    { id: 'intro', title: 'Introduction', Icon: RocketIcon },
    { id: 'why', title: 'Why This Library?', Icon: Idea01Icon },
    { id: 'demo-features', title: 'Live Demos', Icon: GameController01Icon },
    { id: 'installation', title: 'Installation', Icon: PackageIcon },
    { id: 'quick-start', title: 'Quick Start', Icon: ZapIcon },
    { id: 'payment-flow', title: 'How It Works', Icon: WorkflowCircle03Icon },
    { id: 'agent-chat', title: 'AI Agent Payments', Icon: AiBrain01Icon },
    { id: 'payai-format', title: 'PayAI Format', Icon: Globe02Icon },
    { id: 'self-sovereign', title: 'Verification Modes', Icon: ShieldKeyIcon },
    { id: 'configuration', title: 'Configuration', Icon: Settings01Icon },
    { id: 'middleware', title: 'Middleware', Icon: SecurityCheckIcon },
    { id: 'pricing', title: 'Price Conversion', Icon: MoneyBag02Icon },
    { id: 'security', title: 'Security', Icon: LockIcon },
    { id: 'troubleshooting', title: 'Troubleshooting', Icon: Wrench01Icon },
    { id: 'roadmap', title: 'Roadmap', Icon: Route01Icon },
    { id: 'api-reference', title: 'API Reference', Icon: FileScriptIcon },
];


function CodeBlock({ code, language = 'typescript' }: { code: string; language?: string }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const renderLine = (line: string, lang: string) => {
        if (lang === 'bash' || lang === 'shell') {
            if (line.startsWith('#')) return <span className="text-gray-500">{line}</span>;
            const parts = line.split(/([A-Z_]+=)/);
            return parts.map((p, i) => /^[A-Z_]+=$/.test(p) ? <span key={i} className="text-yellow-400">{p}</span> : p);
        }
        
        const tokens: JSX.Element[] = [];
        let i = 0;
        const keywords = /\b(import|from|const|let|var|function|async|await|return|if|else|export|interface|type|class|new|throw|try|catch|default|as)\b/;
        
        while (i < line.length) {
            if (line.slice(i).match(/^\/\/.*/)) {
                tokens.push(<span key={i} className="text-gray-500">{line.slice(i)}</span>);
                break;
            }
            if (line[i].match(/['"`]/)) {
                const quote = line[i];
                let end = i + 1;
                while (end < line.length && line[end] !== quote) end++;
                tokens.push(<span key={i} className="text-green-400">{line.slice(i, end + 1)}</span>);
                i = end + 1;
                continue;
            }
            const word = line.slice(i).match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
            if (word && keywords.test(word[0])) {
                tokens.push(<span key={i} className="text-purple-400">{word[0]}</span>);
                i += word[0].length;
                continue;
            }
            const num = line.slice(i).match(/^\d+/);
            if (num) {
                tokens.push(<span key={i} className="text-blue-400">{num[0]}</span>);
                i += num[0].length;
                continue;
            }
            tokens.push(<span key={i}>{line[i]}</span>);
            i++;
        }
        return tokens;
    };

    return (
        <div className="relative group w-full">
            <button onClick={copy} className="absolute top-2 right-2 md:top-3 md:right-3 z-10 p-1.5 md:p-2 rounded-md md:rounded-lg bg-white/10 hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100">
                {copied ? <CheckmarkCircle01Icon size={14} className="text-green-400 md:w-4 md:h-4" /> : <Copy01Icon size={14} className="text-gray-400 md:w-4 md:h-4" />}
            </button>
            <div className="bg-[#1D1D1F] rounded-lg md:rounded-xl p-3 md:p-6 border border-white/10 overflow-x-auto w-full">
                <pre className="font-mono text-[11px] md:text-[13px] leading-relaxed text-gray-300">
                    {code.split('\n').map((line, i) => (
                        <div key={i} className="min-h-[16px] md:min-h-[20px]">
                            {language === 'bash' && !line.startsWith('#') && <span className="text-green-400 select-none">$ </span>}
                            {renderLine(line, language)}
                        </div>
                    ))}
                </pre>
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
        <div className="min-h-screen bg-white text-black selection:bg-blue-100 selection:text-blue-900">
            {/* Header */}
            <header className="sticky top-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 h-14 md:h-16 z-50">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-semibold text-base hover:opacity-70 transition-opacity">
                        <div className="w-6 h-6 md:w-7 md:h-7 bg-black rounded-md flex items-center justify-center">
                            <LightningIcon size={14} className="text-white md:w-4 md:h-4" />
                        </div>
                        <span className="text-sm md:text-[15px]">Micropay</span>
                    </Link>
                    <div className="flex items-center gap-2 md:gap-3">
                        <span className="hidden sm:inline text-[10px] md:text-xs font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 md:px-2.5 md:py-1 rounded-md border border-emerald-200">v3.3.0</span>
                        <a href="https://www.npmjs.com/package/@alleyboss/micropay-solana-x402-paywall" target="_blank" className="hidden sm:flex p-1.5 md:p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600 hover:text-black">
                            <Share01Icon size={16} className="md:w-[18px] md:h-[18px]" />
                        </a>
                        <Link href="/" className="hidden sm:inline-flex text-xs md:text-[13px] font-medium px-2.5 md:px-3.5 py-1 md:py-1.5 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
                            Demo
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <Cancel01Icon size={20} /> : <Menu01Icon size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-14 md:top-16 z-40 bg-white">
                    <nav className="h-full overflow-y-auto px-4 py-6">
                        <div className="space-y-1">
                            {sections.map((section) => {
                                const Icon = section.Icon;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all flex items-center gap-3 ${
                                            activeSection === section.id ? 'bg-gray-100 text-black' : 'text-gray-600 hover:text-black hover:bg-gray-50'
                                        }`}
                                    >
                                        <Icon size={18} className="flex-shrink-0" />
                                        {section.title}
                                    </button>
                                );
                            })}
                        </div>
                    </nav>
                </div>
            )}

            <div className="max-w-7xl mx-auto flex">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-56 fixed left-[max(0px,calc(50%-45rem))] top-14 md:top-16 bottom-0 overflow-y-auto py-10 pr-8">
                    <nav className="space-y-0.5">
                        {sections.map((section) => {
                            const Icon = section.Icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`w-full text-left px-3 py-2 text-[13px] font-medium rounded-md transition-all duration-150 flex items-center gap-2.5 ${activeSection === section.id
                                        ? 'bg-gray-100 text-black'
                                        : 'text-gray-600 hover:text-black hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon size={16} className="flex-shrink-0" />
                                    {section.title}
                                </button>
                            );
                        })}
                    </nav>
                    <div className="mt-10 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-[11px] text-gray-500 font-medium mb-1.5">Bundle Size</p>
                        <p className="text-2xl font-bold text-black">38KB</p>
                        <p className="text-[11px] text-gray-500">Tree-shakeable</p>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 lg:ml-64 px-4 sm:px-6 md:px-8 lg:px-12 py-4 md:py-6 lg:py-12 w-full overflow-x-hidden">

                    {/* Hero Introduction */}
                    <section id="intro" className="mb-16 md:mb-24 pt-6 md:pt-10">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 md:px-3 md:py-1.5 bg-gray-50 border border-purple-100 rounded-full text-xs md:text-sm font-medium text-purple-700 mb-4 md:mb-6">
                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="whitespace-nowrap">Production Ready • v3.3.0</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6 text-[#1D1D1F] leading-tight">
                            Build Micropayment Apps
                            <span className="block mt-1 md:mt-0">in Minutes, Not Weeks</span>
                        </h1>
                        <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed mb-6 md:mb-8">
                            Production-ready Solana micropayments with <strong>x402 protocol</strong>. Enable AI agents to pay autonomously, accept SOL/USDC, and protect your APIs with zero-config middleware.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 mb-8 md:mb-12">
                            <Link href="/agent-chat" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all text-sm md:text-base">
                                <Sparkles size={18} />
                                Try AI Agent Demo
                            </Link>
                            <a href="#installation" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-white text-black border border-black/10 rounded-full font-medium hover:bg-gray-50 transition-all text-sm md:text-base">
                                Get Started
                                <ArrowRight01Icon size={14} />
                            </a>
                            <a href="https://github.com/AlleyBo55/micropay-solana-x402-paywall" target="_blank" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-white text-gray-600 border border-black/10 rounded-full font-medium hover:bg-gray-50 transition-all text-sm md:text-base">
                                <Share01Icon size={14} />
                                GitHub
                            </a>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
                            <div className="p-5 md:p-6 bg-gray-50 rounded-xl md:rounded-2xl border border-purple-100">
                                <div className="text-2xl md:text-3xl mb-2 md:mb-3">💰</div>
                                <div className="font-bold text-base md:text-lg mb-1.5 md:mb-2">Multi-Token Support</div>
                                <div className="text-sm text-gray-600">Accept SOL, USDC, USDT, and any SPL token</div>
                            </div>
                            <div className="p-5 md:p-6 bg-gray-50 rounded-xl md:rounded-2xl border border-indigo-100">
                                <div className="text-2xl md:text-3xl mb-2 md:mb-3">🔐</div>
                                <div className="font-bold text-base md:text-lg mb-1.5 md:mb-2">x402 Protocol</div>
                                <div className="text-sm text-gray-600">HTTP 402 with on-chain verification</div>
                            </div>
                            <div className="p-5 md:p-6 bg-gray-50 rounded-xl md:rounded-2xl border border-pink-100">
                                <div className="text-2xl md:text-3xl mb-2 md:mb-3">🤖</div>
                                <div className="font-bold text-base md:text-lg mb-1.5 md:mb-2">AI Agent Ready</div>
                                <div className="text-sm text-gray-600">Autonomous payments for AI agents</div>
                            </div>
                        </div>

                        <div className="bg-[#1D1D1F] text-white rounded-xl md:rounded-2xl p-5 md:p-8">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-0 mb-4 md:mb-6">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Quick Install</h3>
                                    <p className="text-gray-400 text-xs md:text-sm">Get started in 30 seconds</p>
                                </div>
                                <span className="px-2.5 py-0.5 md:px-3 md:py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium whitespace-nowrap">38KB gzipped</span>
                            </div>
                            <CodeBlock language="bash" code="npm install @alleyboss/micropay-solana-x402-paywall @solana/web3.js" />
                        </div>
                    </section>

                    {/* Why This Library */}
                    <section id="why" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">💡</div>
                            <h2 className="text-3xl font-bold text-[#1D1D1F]">Why This Library?</h2>
                        </div>
                        <p className="text-lg text-gray-600 mb-8">
                            Building crypto payment systems is complex. We've done the heavy lifting so you don't have to.
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-white text-xl">⚡</div>
                                    <h3 className="font-bold text-xl">Save 100+ Hours</h3>
                                </div>
                                <p className="text-gray-600 mb-4">Don't reinvent the wheel. We've handled wallet connections, transaction signing, on-chain verification, and session management.</p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Pre-built React components</li>
                                    <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Zero-config middleware</li>
                                    <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Production-tested code</li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-white text-xl">🛡️</div>
                                    <h3 className="font-bold text-xl">Bank-Grade Security</h3>
                                </div>
                                <p className="text-gray-600 mb-4">Full x402 standard implementation with server-side validation and comprehensive security measures.</p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><span className="text-green-500">✓</span> On-chain verification</li>
                                    <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Anti-replay protection</li>
                                    <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Non-custodial design</li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-white text-xl">🧩</div>
                                    <h3 className="font-bold text-xl">Plug & Play</h3>
                                </div>
                                <p className="text-gray-600 mb-4">Drop-in components for Next.js and Express. Get running in minutes with minimal configuration.</p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Next.js App Router ready</li>
                                    <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Express middleware</li>
                                    <li className="flex items-center gap-2"><span className="text-green-500">✓</span> TypeScript support</li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-white text-xl">📱</div>
                                    <h3 className="font-bold text-xl">Mobile Optimized</h3>
                                </div>
                                <p className="text-gray-600 mb-4">Built-in Solana Pay QR support for seamless mobile wallet payments across all devices.</p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><span className="text-green-500">✓</span> QR code generation</li>
                                    <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Deep linking support</li>
                                    <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Responsive UI</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-gray-50 border border-orange-200 rounded-2xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="text-3xl">🎯</div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Perfect For</h3>
                                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <div className="font-medium mb-1">Content Creators</div>
                                            <div className="text-gray-600">Paywalls, premium articles, exclusive content</div>
                                        </div>
                                        <div>
                                            <div className="font-medium mb-1">API Providers</div>
                                            <div className="text-gray-600">Pay-per-request APIs, AI model access</div>
                                        </div>
                                        <div>
                                            <div className="font-medium mb-1">SaaS Builders</div>
                                            <div className="text-gray-600">Usage-based billing, micropayments</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Live Demos */}
                    <section id="demo-features" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gray-50 text-purple-600 rounded-lg">🎮</div>
                            <h2 className="text-3xl font-bold text-[#1D1D1F]">Live Demos</h2>
                        </div>
                        <p className="text-lg text-gray-600 mb-8">
                            Experience the full power of the library through interactive demos. See real transactions on Solana Devnet.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {/* Demo 1: Article Paywall */}
                            <Link href="/article/solana-defi-guide" className="group block bg-gray-50 border border-purple-200 rounded-2xl p-6 hover:shadow-xl transition-all hover:scale-[1.02]">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-white text-xl">📝</div>
                                    <div>
                                        <h3 className="font-bold text-lg">Article Paywall</h3>
                                        <p className="text-sm text-purple-600">Pay 0.01 SOL to unlock</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">Experience a real paywall protecting premium content. Connect your wallet, pay with SOL, and unlock the article instantly.</p>
                                <div className="flex items-center gap-2 text-purple-600 font-medium text-sm">
                                    Try Demo <ArrowRight01Icon size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>

                            {/* Demo 2: AI Agent Chat */}
                            <Link href="/agent-chat" className="group block bg-gray-50 border border-pink-200 rounded-2xl p-6 hover:shadow-xl transition-all hover:scale-[1.02]">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-white text-xl">🤖</div>
                                    <div>
                                        <h3 className="font-bold text-lg">AI Agent Payments</h3>
                                        <p className="text-sm text-pink-600">Autonomous transactions</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">Watch an AI agent autonomously pay for premium API access. No human intervention required - the agent handles everything.</p>
                                <div className="flex items-center gap-2 text-pink-600 font-medium text-sm">
                                    Try Demo <ArrowRight01Icon size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </div>

                        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                                Features Demonstrated
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-2 text-sm">Core Features</h4>
                                    <ul className="space-y-1.5 text-sm text-gray-600">
                                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-purple-400"></span>x402 Protocol Integration</li>
                                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-purple-400"></span>Wallet Adapter Support</li>
                                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-purple-400"></span>SOL & SPL Tokens</li>
                                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-purple-400"></span>Session Management</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2 text-sm">Advanced</h4>
                                    <ul className="space-y-1.5 text-sm text-gray-600">
                                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-indigo-400"></span>AI Agent Payments</li>
                                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-indigo-400"></span>PayAI Format Support</li>
                                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-indigo-400"></span>Priority Fees</li>
                                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-indigo-400"></span>RPC Fallback</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2 text-sm">Security</h4>
                                    <ul className="space-y-1.5 text-sm text-gray-600">
                                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-green-400"></span>On-Chain Verification</li>
                                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-green-400"></span>Anti-Replay Protection</li>
                                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-green-400"></span>JWT Sessions</li>
                                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-green-400"></span>Signature Store</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Installation */}
                    <section id="installation" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">📦</div>
                            <h2 className="text-3xl font-bold text-[#1D1D1F]">Installation</h2>
                        </div>
                        <p className="text-lg text-gray-600 mb-6">
                            Get started in seconds with npm or yarn.
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <span className="text-lg">1️⃣</span> Install the package
                                </h3>
                                <CodeBlock language="bash" code="npm install @alleyboss/micropay-solana-x402-paywall @solana/web3.js" />
                            </div>

                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <span className="text-lg">2️⃣</span> Set up environment variables
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

                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <span className="text-lg">3️⃣</span> Start building!
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">Jump to <a href="#quick-start" className="text-purple-600 hover:underline font-medium">Quick Start</a> to see code examples.</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                            <div className="flex items-start gap-3">
                                <div className="text-xl">💡</div>
                                <div>
                                    <h4 className="font-semibold text-sm mb-1">Pro Tip</h4>
                                    <p className="text-sm text-gray-700">Use Devnet for testing. Get free SOL from the <a href="https://faucet.solana.com" target="_blank" className="text-blue-600 hover:underline">Solana Faucet</a>.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quick Start */}
                    <section id="quick-start" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-100 text-green-600 rounded-lg">⚡</div>
                            <h2 className="text-3xl font-bold text-[#1D1D1F]">Quick Start</h2>
                        </div>
                        <p className="text-lg text-gray-600 mb-8">
                            Protect your API routes with x402 middleware in just a few lines of code.
                        </p>

                        <div className="space-y-8">
                            {/* Next.js Example */}
                            <div>
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
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold">E</div>
                                    <div>
                                        <h3 className="font-bold text-xl">Express.js</h3>
                                        <p className="text-sm text-gray-500">Add middleware to any route</p>
                                    </div>
                                </div>
                                <CodeBlock code={`import express from 'express';
import { x402ResourceServer } from '@x402/core/server';
import { x402Middleware } from '@alleyboss/micropay-solana-x402-paywall/express';

const app = express();
const server = new x402ResourceServer({
  facilitator: new LocalSvmFacilitator(process.env.RPC_URL!),
  walletAddress: process.env.CREATOR_WALLET_ADDRESS!
});

app.get('/api/premium', 
  x402Middleware(server, {
    accepts: { scheme: 'exact', amount: '10000000' },
    description: 'Premium API Access'
  }), 
  (req, res) => {
    res.json({ data: 'Premium content!' });
  }
);

app.listen(3000);`} />
                            </div>

                            {/* Client-Side Example */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-white font-bold">R</div>
                                    <div>
                                        <h3 className="font-bold text-xl">React Client</h3>
                                        <p className="text-sm text-gray-500">Connect wallet and make payments</p>
                                    </div>
                                </div>
                                <CodeBlock code={`import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction, SystemProgram, PublicKey } from '@solana/web3.js';

function PaymentButton() {
  const { publicKey, signTransaction } = useWallet();
  const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL!);

  const handlePayment = async () => {
    // Create transaction
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey!,
        toPubkey: new PublicKey('CREATOR_WALLET'),
        lamports: 10_000_000 // 0.01 SOL
      })
    );

    // Sign and send
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = publicKey!;
    
    const signed = await signTransaction!(tx);
    const signature = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(signature);

    // Call protected API
    const response = await fetch('/api/premium', {
      headers: {
        'Authorization': \`x402 \${btoa(JSON.stringify({ signatures: [signature] }))}
      }
    });
    
    const data = await response.json();
    console.log(data); // Premium content!
  };

  return <button onClick={handlePayment}>Pay 0.01 SOL</button>;
}`} />
                            </div>
                        </div>

                        <div className="bg-gray-50 border border-green-200 rounded-2xl p-6 mt-8">
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

                    {/* How It Works */}
                    <section id="payment-flow" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">🔄</div>
                            <h2 className="text-3xl font-bold text-[#1D1D1F]">How It Works</h2>
                        </div>
                        <p className="text-lg text-gray-600 mb-8">
                            Understanding the x402 payment flow from request to content unlock.
                        </p>

                        {/* Article Paywall Flow */}
                        <div className="mb-12">
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <span>📝</span> Article Paywall Flow
                            </h3>
                            <p className="text-gray-600 mb-6">How users unlock premium content with one-time payments:</p>
                            
                            <div className="bg-white border-2 border-indigo-100 rounded-2xl p-8 shadow-lg mb-6">
                                <div className="space-y-4">
                                    {[
                                        { step: '1', icon: '👤', title: 'User Visits Article', desc: 'User navigates to /article/premium-content', tech: 'Next.js routing detects locked content' },
                                        { step: '2', icon: '🔒', title: 'Paywall Displayed', desc: 'Blurred content + payment modal shown', tech: 'Session check fails → render paywall overlay' },
                                        { step: '3', icon: '👛', title: 'Connect Wallet', desc: 'User clicks "Unlock" and connects Phantom/Solflare', tech: '@solana/wallet-adapter-react' },
                                        { step: '4', icon: '✍️', title: 'Sign Transaction', desc: 'User approves 0.01 SOL payment to creator', tech: 'SystemProgram.transfer() → signTransaction()' },
                                        { step: '5', icon: '⚡', title: 'Verify On-Chain', desc: 'Server fetches tx from Solana and validates', tech: 'connection.getTransaction(signature)' },
                                        { step: '6', icon: '🍪', title: 'Create Session', desc: 'JWT cookie issued with 24h expiry', tech: 'jwt.sign({ articleId, signature })' },
                                        { step: '7', icon: '✅', title: 'Content Unlocked', desc: 'Paywall removed, full article visible', tech: 'Page refresh → session valid → render content' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-4 group">
                                            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm">
                                                {item.step}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-lg">{item.icon}</span>
                                                    <h4 className="font-bold">{item.title}</h4>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-1">{item.desc}</p>
                                                <code className="text-xs bg-gray-50 px-2 py-1 rounded text-purple-600">{item.tech}</code>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Visual Diagram */}
                            <div className="bg-gray-50 border border-indigo-100 rounded-2xl p-6">
                                <h4 className="font-bold mb-4 text-center">Visual Flow Diagram</h4>
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                                    <div className="flex-1">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-2">🌐</div>
                                        <div className="font-semibold text-sm">Browser</div>
                                        <div className="text-xs text-gray-500">User visits article</div>
                                    </div>
                                    <div className="text-2xl text-gray-400 md:hidden">↓</div>
                                    <div className="text-2xl text-gray-400 hidden md:block">→</div>
                                    <div className="flex-1">
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-2">🔒</div>
                                        <div className="font-semibold text-sm">Paywall</div>
                                        <div className="text-xs text-gray-500">Session check</div>
                                    </div>
                                    <div className="text-2xl text-gray-400 md:hidden">↓</div>
                                    <div className="text-2xl text-gray-400 hidden md:block">→</div>
                                    <div className="flex-1">
                                        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-2">👛</div>
                                        <div className="font-semibold text-sm">Wallet</div>
                                        <div className="text-xs text-gray-500">Sign & send tx</div>
                                    </div>
                                    <div className="text-2xl text-gray-400 md:hidden">↓</div>
                                    <div className="text-2xl text-gray-400 hidden md:block">→</div>
                                    <div className="flex-1">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-2">⚡</div>
                                        <div className="font-semibold text-sm">Solana</div>
                                        <div className="text-xs text-gray-500">Verify on-chain</div>
                                    </div>
                                    <div className="text-2xl text-gray-400 md:hidden">↓</div>
                                    <div className="text-2xl text-gray-400 hidden md:block">→</div>
                                    <div className="flex-1">
                                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-2">✅</div>
                                        <div className="font-semibold text-sm">Unlocked</div>
                                        <div className="text-xs text-gray-500">Content visible</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white border border-black/5 rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    <span className="text-xl">🛡️</span>
                                    Security Measures
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span><span><strong>On-chain verification:</strong> Every payment is verified on Solana</span></li>
                                    <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span><span><strong>Anti-replay:</strong> Signatures can only be used once</span></li>
                                    <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span><span><strong>Non-custodial:</strong> No private keys stored</span></li>
                                    <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span><span><strong>JWT sessions:</strong> Cryptographically sealed tokens</span></li>
                                </ul>
                            </div>

                            <div className="bg-white border border-black/5 rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    <span className="text-xl">⚡</span>
                                    Performance Features
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span><strong>Priority fees:</strong> Faster transaction confirmation</span></li>
                                    <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span><strong>RPC fallback:</strong> Automatic failover on errors</span></li>
                                    <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span><strong>Versioned tx:</strong> Full v0 transaction support</span></li>
                                    <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span><strong>Tree-shakeable:</strong> Import only what you need</span></li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* AI Agent Payments - NEW */}
                    <section id="agent-chat" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Cpu size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">AI Agent Payments</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Enable autonomous AI agents to pay for premium API access without user intervention.
                        </p>

                        <div className="bg-gray-50 border border-purple-100 rounded-2xl p-6 mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#1D1D1F]">Try the Live Demo</h3>
                                    <p className="text-sm text-gray-500">Watch an AI agent pay in real-time</p>
                                </div>
                            </div>
                            <Link href="/agent-chat" className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                                Open Agent Chat Demo
                                <ArrowRight01Icon size={16} />
                            </Link>
                        </div>

                        {/* Agent Payment Flow */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span>🤖</span> Autonomous Agent Payment Flow
                            </h3>
                            <p className="text-gray-600 mb-6">Complete step-by-step breakdown of how AI agents autonomously pay for API access:</p>
                            
                            <div className="bg-white border-2 border-purple-100 rounded-2xl p-4 md:p-8 shadow-lg mb-6">
                                <div className="space-y-2 md:space-y-4">
                                    {[
                                        { step: '1', icon: '💬', title: 'User Query', desc: 'User asks: "Give me premium crypto analysis"', tech: 'Chat interface sends message to API' },
                                        { step: '2', icon: '🧠', title: 'Agent Detects Premium', desc: 'AI detects premium request via keyword matching', tech: 'if (message.includes("premium")) → trigger payment' },
                                        { step: '3', icon: '🔑', title: 'Load Agent Wallet', desc: 'Server loads agent keypair from env', tech: 'Keypair.fromSecretKey(AGENT_SECRET)' },
                                        { step: '4', icon: '💸', title: 'Execute Payment', desc: 'Agent autonomously sends 0.002 SOL', tech: 'executeAgentPayment({ amountLamports: 2000000 })' },
                                        { step: '5', icon: '⚡', title: 'Confirm On-Chain', desc: 'Wait for Solana confirmation', tech: 'connection.confirmTransaction(signature)' },
                                        { step: '6', icon: '🎫', title: 'Call Premium API', desc: 'Agent calls protected endpoint with signature', tech: 'fetch("/api/premium", { headers: { Authorization } })' },
                                        { step: '7', icon: '✨', title: 'Return Premium Data', desc: 'User receives premium analysis', tech: 'Stream response back to chat UI' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-2 md:gap-4">
                                            <div className="w-7 h-7 md:w-10 md:h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white text-xs md:text-base font-bold flex-shrink-0 shadow-sm">
                                                {item.step}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
                                                    <span className="text-sm md:text-lg">{item.icon}</span>
                                                    <h4 className="font-bold text-sm md:text-base">{item.title}</h4>
                                                </div>
                                                <p className="text-xs md:text-sm text-gray-600 mb-1">{item.desc}</p>
                                                <code className="text-[10px] md:text-xs bg-gray-50 px-1.5 md:px-2 py-0.5 md:py-1 rounded text-purple-600 break-all">{item.tech}</code>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Agent Visual Diagram */}
                            <div className="bg-gray-50 border border-purple-100 rounded-xl p-3 md:p-6 mb-6">
                                <h4 className="font-bold mb-2 md:mb-4 text-center text-xs md:text-base">Agent-to-API Payment Flow</h4>
                                <div className="space-y-2 md:space-y-0 md:flex md:flex-row md:items-center md:justify-between md:gap-4 text-center">
                                    <div className="w-full md:flex-1">
                                        <div className="w-10 h-10 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center text-base md:text-2xl mx-auto mb-1">👤</div>
                                        <div className="font-semibold text-[10px] md:text-sm">User</div>
                                    </div>
                                    <div className="text-sm md:text-2xl text-gray-400 md:hidden">↓</div>
                                    <div className="text-lg md:text-2xl text-gray-400 hidden md:block">→</div>
                                    <div className="w-full md:flex-1">
                                        <div className="w-10 h-10 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center text-base md:text-2xl mx-auto mb-1">🤖</div>
                                        <div className="font-semibold text-[10px] md:text-sm">AI Agent</div>
                                    </div>
                                    <div className="text-sm md:text-2xl text-gray-400 md:hidden">↓</div>
                                    <div className="text-lg md:text-2xl text-gray-400 hidden md:block">→</div>
                                    <div className="w-full md:flex-1">
                                        <div className="w-10 h-10 md:w-16 md:h-16 bg-pink-100 rounded-full flex items-center justify-center text-base md:text-2xl mx-auto mb-1">💸</div>
                                        <div className="font-semibold text-[10px] md:text-sm">Payment</div>
                                    </div>
                                    <div className="text-sm md:text-2xl text-gray-400 md:hidden">↓</div>
                                    <div className="text-lg md:text-2xl text-gray-400 hidden md:block">→</div>
                                    <div className="w-full md:flex-1">
                                        <div className="w-10 h-10 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center text-base md:text-2xl mx-auto mb-1">🔓</div>
                                        <div className="font-semibold text-[10px] md:text-sm">API Access</div>
                                    </div>
                                    <div className="text-sm md:text-2xl text-gray-400 md:hidden">↓</div>
                                    <div className="text-lg md:text-2xl text-gray-400 hidden md:block">→</div>
                                    <div className="w-full md:flex-1">
                                        <div className="w-10 h-10 md:w-16 md:h-16 bg-indigo-100 rounded-full flex items-center justify-center text-base md:text-2xl mx-auto mb-1">✨</div>
                                        <div className="font-semibold text-[10px] md:text-sm">Response</div>
                                    </div>
                                </div>
                            </div>

                            {/* Agent-to-Agent Flow */}
                            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 md:p-6 mb-6">
                                <h4 className="font-bold mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                                    <span className="text-lg md:text-xl">🤝</span> Agent-to-Agent Payments
                                </h4>
                                <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4">AI agents can pay other AI agents for services - enabling a fully autonomous AI economy:</p>
                                <div className="flex items-center justify-center gap-2 md:gap-3 text-center mb-3 md:mb-4">
                                    <div className="flex-1 bg-white p-2 md:p-4 rounded-xl">
                                        <div className="text-lg md:text-2xl mb-1 md:mb-2">🤖</div>
                                        <div className="font-semibold text-xs md:text-sm">Agent A</div>
                                        <div className="text-[10px] md:text-xs text-gray-500">Needs data analysis</div>
                                    </div>
                                    <div className="text-base md:text-xl">💸</div>
                                    <div className="flex-1 bg-white p-2 md:p-4 rounded-xl">
                                        <div className="text-lg md:text-2xl mb-1 md:mb-2">🤖</div>
                                        <div className="font-semibold text-xs md:text-sm">Agent B</div>
                                        <div className="text-[10px] md:text-xs text-gray-500">Provides analysis API</div>
                                    </div>
                                </div>
                                <p className="text-[10px] md:text-xs text-gray-600">Both agents have their own wallets and can transact autonomously using the same executeAgentPayment() function.</p>
                            </div>

                            {/* Detailed Agent-to-Agent Flow */}
                            <div className="bg-white border-2 border-orange-100 rounded-2xl p-4 md:p-8 shadow-lg">
                                <h4 className="font-bold text-base md:text-lg mb-3 md:mb-4 flex items-center gap-2">
                                    <span className="text-lg md:text-xl">🔄</span>
                                    Agent-to-Agent Transaction Flow
                                </h4>
                                <div className="space-y-2 md:space-y-4">
                                    {[
                                        { step: '1', icon: '🤖', title: 'Agent A Needs Service', desc: 'Agent A detects it needs premium data from Agent B', tech: 'if (needsPremiumData) → initiate payment' },
                                        { step: '2', icon: '🔍', title: 'Discover Agent B API', desc: 'Agent A queries Agent B\'s endpoint and receives 402', tech: 'fetch("/api/agent-b/premium") → 402 Payment Required' },
                                        { step: '3', icon: '💰', title: 'Check Balance', desc: 'Agent A verifies it has sufficient SOL', tech: 'connection.getBalance(agentA.publicKey)' },
                                        { step: '4', icon: '✍️', title: 'Execute Payment', desc: 'Agent A autonomously sends SOL to Agent B', tech: 'executeAgentPayment({ recipientAddress: agentB })' },
                                        { step: '5', icon: '⚡', title: 'Confirm Transaction', desc: 'Wait for Solana confirmation', tech: 'connection.confirmTransaction(signature)' },
                                        { step: '6', icon: '🎫', title: 'Retry with Proof', desc: 'Agent A retries request with payment signature', tech: 'fetch("/api/agent-b/premium", { headers: { Authorization } })' },
                                        { step: '7', icon: '✅', title: 'Agent B Verifies', desc: 'Agent B verifies payment on-chain', tech: 'x402Middleware verifies signature' },
                                        { step: '8', icon: '📊', title: 'Data Delivered', desc: 'Agent B returns premium data to Agent A', tech: 'res.json({ premiumData: ... })' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-2 md:gap-4">
                                            <div className="w-7 h-7 md:w-10 md:h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white text-xs md:text-base font-bold flex-shrink-0 shadow-sm">
                                                {item.step}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
                                                    <span className="text-sm md:text-lg">{item.icon}</span>
                                                    <h5 className="font-bold text-sm md:text-base">{item.title}</h5>
                                                </div>
                                                <p className="text-xs md:text-sm text-gray-600 mb-1">{item.desc}</p>
                                                <code className="text-[10px] md:text-xs bg-gray-50 px-1.5 md:px-2 py-0.5 md:py-1 rounded text-orange-600 break-all">{item.tech}</code>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <h3 className="font-bold text-lg mb-4">Server-Side Agent Payment</h3>
                        <CodeBlock code={`import { executeAgentPayment } from '@alleyboss/micropay-solana-x402-paywall/agent';
import { Keypair, Connection } from '@solana/web3.js';

// Server-side: Load agent keypair
const agentKeypair = Keypair.fromSecretKey(
  Uint8Array.from(process.env.AGENT_SECRET.split(',').map(Number))
);

// Execute autonomous payment
const result = await executeAgentPayment({
  connection: new Connection('https://api.mainnet-beta.solana.com'),
  agentKeypair,
  recipientAddress: 'CREATOR_WALLET',
  amountLamports: 2_000_000n, // 0.002 SOL
  priorityFee: { enabled: true, microLamports: 5000 },
});

if (result.success) {
  console.log('Payment confirmed:', result.signature);
}`} />
                    </section>

                    {/* PayAI Format - NEW */}
                    <section id="payai-format" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Globe02Icon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">PayAI Format Support</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Native support for the <strong>PayAI payment format</strong> - a universal payment protocol that works across Solana, Ethereum, Base, and other chains. The middleware automatically detects and transforms PayAI format to x402.
                        </p>

                        <div className="bg-gray-50 border border-indigo-100 rounded-2xl p-6 mb-6">
                            <h3 className="font-bold mb-2">✨ Features</h3>
                            <ul className="text-sm space-y-1">
                                <li>✅ Automatic format detection and transformation</li>
                                <li>✅ Multi-chain ready (Solana, Ethereum, Base)</li>
                                <li>✅ Full TypeScript support</li>
                                <li>✅ Backward compatible with x402 format</li>
                            </ul>
                        </div>

                        <h3 className="font-bold text-lg mb-4">PayAI Format Structure</h3>
                        <CodeBlock code={`{
  "scheme": "exact-svm",
  "networkId": "solana-devnet",
  "paymentDetails": {
    "amount": "10000000",
    "recipient": "YourWalletAddress..."
  },
  "authorization": {
    "signatures": ["5j8..."]
  }
}`} />

                        <h3 className="font-bold text-lg mb-4 mt-6">Client Implementation</h3>
                        <CodeBlock code={`import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction, SystemProgram, PublicKey } from '@solana/web3.js';

async function payWithPayAI() {
  const { publicKey, signTransaction } = useWallet();
  const connection = new Connection('https://api.devnet.solana.com');
  
  // Create and sign transaction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: publicKey!,
      toPubkey: new PublicKey('CREATOR_WALLET'),
      lamports: 10_000_000
    })
  );
  
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = publicKey!;
  
  const signed = await signTransaction!(transaction);
  const signature = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction(signature);
  
  // Build PayAI payload
  const payaiPayload = {
    scheme: 'exact-svm',
    networkId: 'solana-devnet',
    authorization: { signatures: [signature] }
  };
  
  // Call protected API
  const response = await fetch('/api/premium', {
    headers: {
      'Authorization': \`x402 \${btoa(JSON.stringify(payaiPayload))}\`
    }
  });
}`} />

                        <h3 className="font-bold text-lg mb-4 mt-6">Server Configuration</h3>
                        <p className="text-gray-600 mb-4">No changes needed! The middleware automatically handles PayAI format:</p>
                        <CodeBlock code={`import { createX402Middleware } from '@alleyboss/micropay-solana-x402-paywall/next';

const withPayment = createX402Middleware({
  walletAddress: process.env.CREATOR_WALLET_ADDRESS!,
  price: '10000000',
  network: 'devnet',
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL
});

export const GET = withPayment(async (req) => {
  return new Response('Premium content unlocked!');
});`} />

                        <h3 className="font-bold text-lg mb-4 mt-6">Network Mapping</h3>
                        <div className="overflow-x-auto border border-black/5 rounded-xl">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">PayAI Network</th>
                                        <th className="px-4 py-3 text-left font-medium">CAIP-2 Format</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5">
                                    <tr className="bg-white">
                                        <td className="px-4 py-3 font-mono text-xs">solana</td>
                                        <td className="px-4 py-3 font-mono text-xs">solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp</td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="px-4 py-3 font-mono text-xs">solana-devnet</td>
                                        <td className="px-4 py-3 font-mono text-xs">solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h3 className="font-bold text-lg mb-4 mt-6">Verification Modes</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white p-5 rounded-xl border border-black/5">
                                <h4 className="font-bold mb-2">🔐 Local Verification</h4>
                                <p className="text-sm text-gray-600 mb-3">Verify on your own RPC node</p>
                                <CodeBlock code={`createX402Middleware({
  walletAddress: 'YOUR_WALLET',
  rpcUrl: process.env.RPC_URL
});`} />
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-black/5">
                                <h4 className="font-bold mb-2">🌐 Remote Verification</h4>
                                <p className="text-sm text-gray-600 mb-3">Use PayAI facilitator</p>
                                <CodeBlock code={`createX402Middleware({
  walletAddress: 'YOUR_WALLET',
  facilitatorUrl: 'https://payai.network'
});`} />
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-6">
                            <p className="text-sm text-blue-800">
                                <strong>💡 Tip:</strong> PayAI format is automatically detected. Both x402 and PayAI formats work with the same middleware configuration.
                            </p>
                        </div>

                        <h3 className="font-bold text-lg mb-4 mt-6">TypeScript Types</h3>
                        <CodeBlock code={`import type { 
  PayAIPayload, 
  PayAISvmAuthorization,
  PayAINetworkId 
} from '@alleyboss/micropay-solana-x402-paywall';

const payload: PayAIPayload = {
  scheme: 'exact-svm',
  networkId: 'solana-devnet',
  authorization: {
    signatures: ['...']
  }
};`} />
                    </section>

                    {/* Self-Sovereign Mode */}
                    <section id="self-sovereign" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><ShieldKeyIcon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Verification Modes</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            The library supports two distinct verification modes to suit your infrastructure needs.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-8">
                            {/* Mode 1: Sovereign */}
                            <div className="bg-white p-4 md:p-6 rounded-2xl border border-black/5 shadow-sm min-w-0">
                                <h3 className="text-base md:text-lg md:text-xl font-bold mb-2 md:mb-3 flex flex-col md:flex-row md:items-center gap-2">
                                    <span className="p-1.5 bg-yellow-100 rounded-lg inline-block"><ShieldKeyIcon size={16} className="text-yellow-700" /></span>
                                    <span className="break-words text-sm md:text-lg">Self-Sovereign</span>
                                </h3>
                                <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
                                    Verify payments locally on your own backend using a direct connection to a Solana RPC node.
                                </p>
                                <ul className="text-xs md:text-sm space-y-1.5 md:space-y-2 mb-3 md:mb-4">
                                    <li className="flex gap-2"><span className="text-green-500 flex-shrink-0">✓</span><span>No external dependency</span></li>
                                    <li className="flex gap-2"><span className="text-green-500 flex-shrink-0">✓</span><span>Maximum privacy</span></li>
                                    <li className="flex gap-2"><span className="text-red-500 flex-shrink-0">✗</span><span>Requires RPC management</span></li>
                                </ul>
                                <CodeBlock code={`import { LocalSvmFacilitator } from '@alleyboss/micropay-solana-x402-paywall';
const facilitator = new LocalSvmFacilitator(RPC_URL);`} />
                            </div>

                            {/* Mode 2: Remote / Public */}
                            <div className="bg-white p-4 md:p-6 rounded-2xl border border-black/5 shadow-sm min-w-0">
                                <h3 className="text-base md:text-lg md:text-xl font-bold mb-2 md:mb-3 flex flex-col md:flex-row md:items-center gap-2">
                                    <span className="p-1.5 bg-blue-100 rounded-lg inline-block"><Globe02Icon size={16} className="text-blue-700" /></span>
                                    <span className="break-words text-sm md:text-lg">Public Facilitator</span>
                                </h3>
                                <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
                                    Offload verification to a public x402 facilitator network (e.g. PayAI).
                                </p>
                                <ul className="text-xs md:text-sm space-y-1.5 md:space-y-2 mb-3 md:mb-4">
                                    <li className="flex gap-2"><span className="text-green-500 flex-shrink-0">✓</span><span>Zero config (No RPC)</span></li>
                                    <li className="flex gap-2"><span className="text-green-500 flex-shrink-0">✓</span><span>Advanced features (Swaps)</span></li>
                                    <li className="flex gap-2"><span className="text-red-500 flex-shrink-0">✗</span><span>Relies on 3rd party</span></li>
                                </ul>
                                <CodeBlock code={`import { RemoteSvmFacilitator } from '@alleyboss/micropay-solana-x402-paywall';
const facilitator = new RemoteSvmFacilitator('https://facilitator.payai.network');`} />
                            </div>
                        </div>

                        <h3 className="font-bold text-lg mb-4">Comparison Table</h3>
                        <div className="overflow-x-auto mb-8 border border-black/5 rounded-xl">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-4 py-3">Feature</th>
                                        <th className="px-4 py-3">Public Facilitator</th>
                                        <th className="px-4 py-3">Self-Sovereign</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5">
                                    <tr className="bg-white">
                                        <td className="px-4 py-3 font-medium">Verification</td>
                                        <td className="px-4 py-3">Remote API Call</td>
                                        <td className="px-4 py-3">Local RPC Call</td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="px-4 py-3 font-medium">Complexity</td>
                                        <td className="px-4 py-3">Low (Zero Config)</td>
                                        <td className="px-4 py-3">Medium (RPC Node)</td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="px-4 py-3 font-medium">Privacy</td>
                                        <td className="px-4 py-3">Metadata sent to facilitator</td>
                                        <td className="px-4 py-3">No external data sharing</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h3 className="font-bold text-lg mb-4">Manual Verification (Self-Sovereign)</h3>
                        <p className="text-gray-600 mb-4">Complete implementation for verifying payments on your own RPC:</p>
                        <CodeBlock code={`import { Connection, PublicKey } from '@solana/web3.js';
import { x402ResourceServer } from '@x402/core/server';
import { LocalSvmFacilitator } from '@alleyboss/micropay-solana-x402-paywall';

// Initialize connection
const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL!);
const facilitator = new LocalSvmFacilitator(process.env.NEXT_PUBLIC_RPC_URL!);

// Create x402 server
const server = new x402ResourceServer({
  facilitator,
  walletAddress: process.env.CREATOR_WALLET_ADDRESS!
});

// Manual verification function
async function verifyPayment(signature: string) {
  // 1. Fetch transaction from blockchain
  const tx = await connection.getTransaction(signature, {
    maxSupportedTransactionVersion: 0
  });
  
  if (!tx || tx.meta?.err) {
    throw new Error('Transaction not found or failed');
  }
  
  // 2. Verify recipient
  const recipientPubkey = new PublicKey(process.env.CREATOR_WALLET_ADDRESS!);
  const preBalance = tx.meta.preBalances[1]; // Recipient index
  const postBalance = tx.meta.postBalances[1];
  const amountReceived = postBalance - preBalance;
  
  // 3. Verify amount
  const expectedAmount = 10_000_000; // 0.01 SOL
  if (amountReceived < expectedAmount) {
    throw new Error('Insufficient payment amount');
  }
  
  // 4. Check signature not already used (anti-replay)
  if (await signatureStore.has(signature)) {
    throw new Error('Signature already used');
  }
  await signatureStore.add(signature);
  
  return { verified: true, amount: amountReceived };
}`} />

                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-6">
                            <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                                <span>⚡</span> Pro Tip: RPC Fallback
                            </h4>
                            <p className="text-sm text-gray-700 mb-3">Enable automatic failover for 99.9% uptime:</p>
                            <CodeBlock language="bash" code={`ENABLE_RPC_FALLBACK=true
FALLBACK_RPC_URLS=https://api.devnet.solana.com,https://rpc.ankr.com/solana_devnet`} />
                        </div>
                    </section>

                    {/* Installation */}
                    <section id="installation" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><CodeCircleIcon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Installation</h2>
                        </div>
                        <CodeBlock language="bash" code="npm install @alleyboss/micropay-solana-x402-paywall @solana/web3.js" />
                    </section>

                    {/* Configuration */}
                    <section id="configuration" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Settings01Icon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Configuration</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Configure your environment for Mainnet or custom x402 facilitators.
                        </p>
                        <h3 className="font-bold text-lg mb-3">Environment Variables</h3>
                        <CodeBlock language="bash" code={`# Network
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com

# Payment
CREATOR_WALLET_ADDRESS=your_wallet_address

# Session
SESSION_SECRET=your_32_character_secret_key
SESSION_DURATION_HOURS=24

# Pricing
DEFAULT_ARTICLE_PRICE_LAMPORTS=10000000

# Optional: RPC Fallback
ENABLE_RPC_FALLBACK=true
FALLBACK_RPC_URLS=https://rpc.ankr.com/solana_devnet

# Optional: AI Agent
OPENAI_API_KEY=sk-...
AGENT_KEYPAIR_SECRET=[...]

# Optional: Custom Facilitator
X402_FACILITATOR_URL=https://x402.org/facilitator`} />
                    </section>

                    {/* Quick Start */}
                    <section id="quick-start" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><LightningIcon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Quick Start</h2>
                        </div>
                        <p className="text-gray-600 mb-6">Protect your API with x402 middleware (Express example):</p>
                        <CodeBlock code={`import { x402ResourceServer } from '@x402/core/server';
import { x402Middleware } from '@alleyboss/micropay-solana-x402-paywall/express';

const server = new x402ResourceServer({ ... });

app.get('/premium', x402Middleware(server, {
    accepts: { scheme: 'exact', amount: '1000' },
    description: 'Premium'
}), (req, res) => res.send('Paid content'));`} />
                    </section>

                    {/* Middleware */}
                    <section id="middleware" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><ShieldKeyIcon size={20} /></div>
                            <h2 className="text-3xl font-bold text-[#1D1D1F]">Middleware Integration</h2>
                        </div>
                        <p className="text-lg text-gray-600 mb-8">
                            Drop-in middleware for both Express.js and Next.js with identical security guarantees.
                        </p>

                        {/* Express.js Section */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-white font-bold text-xl">E</div>
                                <div>
                                    <h3 className="text-2xl font-bold">Express.js Middleware</h3>
                                    <p className="text-sm text-gray-500">For Node.js backends and REST APIs</p>
                                </div>
                            </div>

                            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm mb-6">
                                <h4 className="font-bold text-lg mb-4">Basic Setup</h4>
                                <CodeBlock code={`import express from 'express';
import { x402ResourceServer } from '@x402/core/server';
import { x402Middleware } from '@alleyboss/micropay-solana-x402-paywall/express';
import { LocalSvmFacilitator } from '@alleyboss/micropay-solana-x402-paywall';

const app = express();
app.use(express.json());

// Initialize x402 server with local verification
const facilitator = new LocalSvmFacilitator(process.env.RPC_URL!);
const server = new x402ResourceServer({
  facilitator,
  walletAddress: process.env.CREATOR_WALLET_ADDRESS!
});

// Protect specific routes
app.get('/api/premium', 
  x402Middleware(server, {
    accepts: { 
      scheme: 'exact', 
      amount: '10000000' // 0.01 SOL in lamports
    },
    description: 'Premium API Access'
  }), 
  (req, res) => {
    // Payment verified! Access granted
    res.json({ 
      data: 'Premium content',
      payer: req.x402?.payer 
    });
  }
);

app.listen(3000, () => console.log('Server running on port 3000'));`} />
                            </div>

                            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm mb-6">
                                <h4 className="font-bold text-lg mb-4">Multiple Protected Routes</h4>
                                <CodeBlock code={`// Different prices for different endpoints
app.get('/api/basic', 
  x402Middleware(server, {
    accepts: { scheme: 'exact', amount: '5000000' }, // 0.005 SOL
    description: 'Basic API'
  }), 
  (req, res) => res.json({ tier: 'basic' })
);

app.get('/api/premium', 
  x402Middleware(server, {
    accepts: { scheme: 'exact', amount: '10000000' }, // 0.01 SOL
    description: 'Premium API'
  }), 
  (req, res) => res.json({ tier: 'premium' })
);

app.get('/api/enterprise', 
  x402Middleware(server, {
    accepts: { scheme: 'exact', amount: '50000000' }, // 0.05 SOL
    description: 'Enterprise API'
  }), 
  (req, res) => res.json({ tier: 'enterprise' })
);`} />
                            </div>

                            <div className="bg-gray-50 border border-blue-100 rounded-xl p-6">
                                <h4 className="font-bold mb-3 flex items-center gap-2">
                                    <span className="text-xl">🔄</span>
                                    Express Middleware Flow
                                </h4>
                                <div className="space-y-3 text-sm">
                                    {[
                                        { step: '1', desc: 'Request hits protected route', tech: 'app.get("/api/premium", x402Middleware(...))' },
                                        { step: '2', desc: 'Middleware checks Authorization header', tech: 'req.headers.authorization' },
                                        { step: '3', desc: 'If no payment → Return 402 with payment instructions', tech: 'res.status(402).json({ ... })' },
                                        { step: '4', desc: 'If payment present → Verify on-chain', tech: 'facilitator.verify(payload, spec)' },
                                        { step: '5', desc: 'If valid → Attach to req.x402 and call next()', tech: 'req.x402 = result; next()' },
                                        { step: '6', desc: 'Route handler executes with verified payment', tech: '(req, res) => res.json({ ... })' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{item.step}</div>
                                            <div className="flex-1">
                                                <p className="text-gray-700 mb-1">{item.desc}</p>
                                                <code className="text-xs bg-white px-2 py-1 rounded text-blue-600">{item.tech}</code>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Next.js Section */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xl">N</div>
                                <div>
                                    <h3 className="text-2xl font-bold">Next.js Middleware</h3>
                                    <p className="text-sm text-gray-500">For App Router API routes</p>
                                </div>
                            </div>

                            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm mb-6">
                                <h4 className="font-bold text-lg mb-4">Basic Setup</h4>
                                <CodeBlock code={`// app/api/premium/route.ts
import { createX402Middleware } from '@alleyboss/micropay-solana-x402-paywall/next';

// Create middleware wrapper
const withPayment = createX402Middleware({
  walletAddress: process.env.CREATOR_WALLET_ADDRESS!,
  price: '10000000', // 0.01 SOL in lamports
  network: 'devnet',
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL // Local verification
});

// Wrap your handler
export const GET = withPayment(async (req) => {
  return new Response(JSON.stringify({ 
    data: 'Premium content unlocked!',
    timestamp: Date.now()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});

export const POST = withPayment(async (req) => {
  const body = await req.json();
  return new Response(JSON.stringify({ 
    received: body,
    processed: true 
  }));
});`} />
                            </div>

                            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm mb-6">
                                <h4 className="font-bold text-lg mb-4">Multiple Routes with Different Prices</h4>
                                <CodeBlock code={`// app/api/basic/route.ts
const withBasic = createX402Middleware({
  walletAddress: process.env.CREATOR_WALLET_ADDRESS!,
  price: '5000000', // 0.005 SOL
  network: 'devnet',
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL
});

export const GET = withBasic(async (req) => {
  return Response.json({ tier: 'basic' });
});

// app/api/premium/route.ts
const withPremium = createX402Middleware({
  walletAddress: process.env.CREATOR_WALLET_ADDRESS!,
  price: '10000000', // 0.01 SOL
  network: 'devnet',
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL
});

export const GET = withPremium(async (req) => {
  return Response.json({ tier: 'premium' });
});`} />
                            </div>

                            <div className="bg-gray-50 border border-purple-100 rounded-xl p-6">
                                <h4 className="font-bold mb-3 flex items-center gap-2">
                                    <span className="text-xl">🔄</span>
                                    Next.js Middleware Flow
                                </h4>
                                <div className="space-y-3 text-sm">
                                    {[
                                        { step: '1', desc: 'Request hits API route', tech: 'GET /api/premium' },
                                        { step: '2', desc: 'withPayment wrapper intercepts request', tech: 'createX402Middleware({ ... })' },
                                        { step: '3', desc: 'Check Authorization header for payment', tech: 'req.headers.get("authorization")' },
                                        { step: '4', desc: 'If no payment → Return 402 Payment Required', tech: 'Response with X-Payment-Required header' },
                                        { step: '5', desc: 'If payment → Verify signature on-chain', tech: 'facilitator.verify() or RPC check' },
                                        { step: '6', desc: 'If valid → Execute handler with verified payment', tech: 'await handler(req, ctx)' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{item.step}</div>
                                            <div className="flex-1">
                                                <p className="text-gray-700 mb-1">{item.desc}</p>
                                                <code className="text-xs bg-white px-2 py-1 rounded text-purple-600">{item.tech}</code>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-xl mb-4">Express vs Next.js Comparison</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold">Feature</th>
                                            <th className="px-4 py-3 text-left font-semibold">Express.js</th>
                                            <th className="px-4 py-3 text-left font-semibold">Next.js</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/5">
                                        <tr>
                                            <td className="px-4 py-3 font-medium">Import Path</td>
                                            <td className="px-4 py-3"><code className="text-xs bg-gray-50 px-2 py-1 rounded">@.../express</code></td>
                                            <td className="px-4 py-3"><code className="text-xs bg-gray-50 px-2 py-1 rounded">@.../next</code></td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">Function</td>
                                            <td className="px-4 py-3"><code className="text-xs bg-gray-50 px-2 py-1 rounded">x402Middleware()</code></td>
                                            <td className="px-4 py-3"><code className="text-xs bg-gray-50 px-2 py-1 rounded">createX402Middleware()</code></td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">Setup</td>
                                            <td className="px-4 py-3">Requires x402ResourceServer</td>
                                            <td className="px-4 py-3">Auto-configured</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">Usage</td>
                                            <td className="px-4 py-3">app.get(path, middleware, handler)</td>
                                            <td className="px-4 py-3">export const GET = withPayment(handler)</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">Verification</td>
                                            <td className="px-4 py-3">✅ Local & Remote</td>
                                            <td className="px-4 py-3">✅ Local & Remote</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">PayAI Support</td>
                                            <td className="px-4 py-3">✅ Automatic</td>
                                            <td className="px-4 py-3">✅ Automatic</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Security */}
                    <section id="security" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-100 text-red-600 rounded-lg">🔒</div>
                            <h2 className="text-3xl font-bold text-[#1D1D1F]">Security</h2>
                        </div>
                        <p className="text-lg text-gray-600 mb-8">
                            Bank-grade security built into every layer of the payment flow.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-8">
                            <div className="bg-gray-50 border border-red-100 rounded-2xl p-4 md:p-6 min-w-0">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-3 md:mb-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-xl flex items-center justify-center text-lg md:text-xl flex-shrink-0">🛡️</div>
                                    <h3 className="font-bold text-sm md:text-base md:text-lg break-words">Zero-Trust Verification</h3>
                                </div>
                                <p className="text-xs md:text-sm text-gray-700 mb-3">Never trust the client. All payment signatures are verified on-chain by your backend before issuing access tokens.</p>
                                <CodeBlock code={`// Server verifies on Solana blockchain
const tx = await connection.getTransaction(signature);
if (!tx || tx.meta?.err) {
  throw new Error('Invalid transaction');
}`} />
                            </div>

                            <div className="bg-gray-50 border border-purple-100 rounded-2xl p-4 md:p-6 min-w-0">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-3 md:mb-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-xl flex items-center justify-center text-lg md:text-xl flex-shrink-0">🚫</div>
                                    <h3 className="font-bold text-sm md:text-base md:text-lg break-words">Anti-Replay Protection</h3>
                                </div>
                                <p className="text-xs md:text-sm text-gray-700 mb-3">Signature Store ensures every transaction signature can only be used ONCE, preventing replay attacks.</p>
                                <CodeBlock code={`// Check if signature already used
if (await signatureStore.has(signature)) {
  throw new Error('Signature already used');
}
await signatureStore.add(signature);`} />
                            </div>

                            <div className="bg-gray-50 border border-blue-100 rounded-2xl p-4 md:p-6 min-w-0">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-3 md:mb-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-xl flex items-center justify-center text-lg md:text-xl flex-shrink-0">🍪</div>
                                    <h3 className="font-bold text-sm md:text-base md:text-lg break-words">Stateless JWT Sessions</h3>
                                </div>
                                <p className="text-xs md:text-sm text-gray-700 mb-3">Access granted via signed HTTP-only cookies. No database required. Proof of payment is cryptographically sealed.</p>
                                <CodeBlock code={`// Create secure session
const token = jwt.sign(
  { articleId, signature },
  SESSION_SECRET,
  { expiresIn: '24h' }
);`} />
                            </div>

                            <div className="bg-gray-50 border border-green-100 rounded-2xl p-4 md:p-6 min-w-0">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-3 md:mb-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-xl flex items-center justify-center text-lg md:text-xl flex-shrink-0">🔑</div>
                                    <h3 className="font-bold text-sm md:text-base md:text-lg break-words">Non-Custodial Design</h3>
                                </div>
                                <p className="text-xs md:text-sm text-gray-700 mb-3">No private keys stored. Users sign transactions directly with their wallets. Your server only needs public keys.</p>
                                <ul className="text-xs md:text-sm space-y-1 text-gray-700">
                                    <li className="flex items-center gap-2"><span className="text-green-600 flex-shrink-0">✓</span><span>No hardcoded private keys</span></li>
                                    <li className="flex items-center gap-2"><span className="text-green-600 flex-shrink-0">✓</span><span>HTTP-only secure cookies</span></li>
                                    <li className="flex items-center gap-2"><span className="text-green-600 flex-shrink-0">✓</span><span>Environment-based config</span></li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl">
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">⚠️</div>
                                <div>
                                    <h3 className="font-bold mb-2">SPL Token Validation Note</h3>
                                    <p className="text-sm text-gray-700">The library validates that tokens are sent to a valid token account, but does not perform an extra RPC call to verify that token account is owned by <code className="bg-yellow-100 px-1 py-0.5 rounded">expectedRecipient</code>. For high-value transactions, implement strict server-side verification.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Troubleshooting */}
                    <section id="troubleshooting" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">🔧</div>
                            <h2 className="text-3xl font-bold text-[#1D1D1F]">Troubleshooting</h2>
                        </div>
                        <p className="text-lg text-gray-600 mb-8">
                            Common issues and how to fix them.
                        </p>

                        <div className="space-y-6">
                            {/* Issue 1 */}
                            <div className="bg-white border border-black/5 rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                    <span className="text-red-500">❌</span>
                                    Payment Not Verifying
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <div className="font-semibold text-gray-700 mb-1">Possible Causes:</div>
                                        <ul className="space-y-1 text-gray-600 ml-4">
                                            <li className="flex items-start gap-2"><span className="mt-1">•</span> RPC endpoint not responding</li>
                                            <li className="flex items-start gap-2"><span className="mt-1">•</span> Transaction signature is invalid</li>
                                            <li className="flex items-start gap-2"><span className="mt-1">•</span> Recipient address doesn't match CREATOR_WALLET_ADDRESS</li>
                                            <li className="flex items-start gap-2"><span className="mt-1">•</span> Amount doesn't match article price</li>
                                            <li className="flex items-start gap-2"><span className="mt-1">•</span> Signature already used (replay attack)</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-700 mb-1">Solutions:</div>
                                        <CodeBlock code={`// Enable RPC fallback
ENABLE_RPC_FALLBACK=true
FALLBACK_RPC_URLS=https://api.devnet.solana.com,https://devnet.helius-rpc.com

// Check transaction on Solana Explorer
https://explorer.solana.com/tx/[signature]?cluster=devnet`} />
                                    </div>
                                </div>
                            </div>

                            {/* Issue 2 */}
                            <div className="bg-white border border-black/5 rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                    <span className="text-red-500">❌</span>
                                    Session Not Persisting
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <div className="font-semibold text-gray-700 mb-1">Possible Causes:</div>
                                        <ul className="space-y-1 text-gray-600 ml-4">
                                            <li className="flex items-start gap-2"><span className="mt-1">•</span> SESSION_SECRET not set</li>
                                            <li className="flex items-start gap-2"><span className="mt-1">•</span> Cookie settings incorrect</li>
                                            <li className="flex items-start gap-2"><span className="mt-1">•</span> JWT token expired</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-700 mb-1">Solutions:</div>
                                        <CodeBlock code={`// Verify environment variables
SESSION_SECRET=your_32_character_minimum_secret_key
SESSION_DURATION_HOURS=24

// Check cookie settings (production)
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000
};`} />
                                    </div>
                                </div>
                            </div>

                            {/* Issue 3 */}
                            <div className="bg-white border border-black/5 rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                    <span className="text-red-500">❌</span>
                                    RPC Errors
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <div className="font-semibold text-gray-700 mb-1">Possible Causes:</div>
                                        <ul className="space-y-1 text-gray-600 ml-4">
                                            <li className="flex items-start gap-2"><span className="mt-1">•</span> Rate limits exceeded</li>
                                            <li className="flex items-start gap-2"><span className="mt-1">•</span> RPC node down</li>
                                            <li className="flex items-start gap-2"><span className="mt-1">•</span> Network congestion</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-700 mb-1">Solutions:</div>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Enable RPC fallback with multiple URLs</li>
                                            <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Upgrade to paid RPC tier (Helius, QuickNode)</li>
                                            <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Implement retry logic with exponential backoff</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">👥</div>
                                <div>
                                    <h3 className="font-bold mb-2">Need More Help?</h3>
                                    <p className="text-sm text-gray-700 mb-3">Join our community or open an issue on GitHub.</p>
                                    <div className="flex gap-3">
                                        <a href="https://github.com/AlleyBo55/micropay-solana-x402-paywall/issues" target="_blank" className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                                            Open Issue
                                            <ArrowRight01Icon size={14} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Pricing */}
                    <section id="pricing" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-100 text-green-600 rounded-lg">💰</div>
                            <h2 className="text-3xl font-bold text-[#1D1D1F]">Price Conversion</h2>
                        </div>
                        <p className="text-lg text-gray-600 mb-8">
                            Built-in USD to SOL conversion with multi-provider fallback for accurate pricing.
                        </p>

                        <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm mb-6">
                            <h3 className="font-bold text-lg mb-4">Get Current SOL Price</h3>
                            <CodeBlock code={`import { getSolPrice, lamportsToUsd, usdToLamports } from '@alleyboss/micropay-solana-x402-paywall/pricing';

// Get current SOL price in USD
const { solPrice, source } = await getSolPrice();
console.log(\`1 SOL = $\${solPrice} (from \${source})\`);

// Convert lamports to USD
const usdAmount = lamportsToUsd(10_000_000, solPrice); // 0.01 SOL
console.log(\`Price: $\${usdAmount}\`);

// Convert USD to lamports
const lamports = usdToLamports(1.00, solPrice); // $1 USD
console.log(\`Amount: \${lamports} lamports\`);`} />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
                            <div className="bg-gray-50 border border-blue-100 rounded-xl p-4 md:p-5">
                                <h3 className="font-bold mb-2 md:mb-3 flex flex-col md:flex-row md:items-center gap-2 text-xs md:text-sm md:text-base">
                                    <span className="text-base md:text-lg md:text-xl">🔄</span>
                                    <span className="break-words">Multi-Provider Fallback</span>
                                </h3>
                                <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3">Automatic failover across multiple price providers for 99.9% uptime.</p>
                                <ul className="text-xs md:text-sm space-y-1 text-gray-600">
                                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span><span>CoinGecko (Primary)</span></li>
                                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span><span>Jupiter (Fallback 1)</span></li>
                                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span><span>Binance (Fallback 2)</span></li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 border border-purple-100 rounded-xl p-4 md:p-5">
                                <h3 className="font-bold mb-2 md:mb-3 flex flex-col md:flex-row md:items-center gap-2 text-xs md:text-sm md:text-base">
                                    <span className="text-base md:text-lg md:text-xl">⏱️</span>
                                    <span className="break-words">Caching Built-In</span>
                                </h3>
                                <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3">Prices cached for 60 seconds to reduce API calls and improve performance.</p>
                                <CodeBlock code={`// Cached automatically
const price1 = await getSolPrice(); // API call
const price2 = await getSolPrice(); // From cache`} />
                            </div>
                        </div>

                        <div className="bg-gray-50 border border-green-100 rounded-xl p-6">
                            <h3 className="font-bold mb-3">Dynamic Pricing Example</h3>
                            <p className="text-sm text-gray-600 mb-4">Set prices in USD and automatically convert to lamports:</p>
                            <CodeBlock code={`// Set article price in USD
const ARTICLE_PRICE_USD = 0.10; // 10 cents

// Convert to lamports dynamically
const { solPrice } = await getSolPrice();
const priceLamports = usdToLamports(ARTICLE_PRICE_USD, solPrice);

// Use in middleware
const withPayment = createX402Middleware({
  walletAddress: process.env.CREATOR_WALLET_ADDRESS!,
  price: priceLamports.toString(),
  network: 'mainnet-beta',
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL
});`} />
                        </div>
                    </section>

                    {/* Roadmap - Enhanced */}
                    <section id="roadmap" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gray-50 text-purple-600 rounded-lg">🗺️</div>
                            <h2 className="text-3xl font-bold text-[#1D1D1F]">Roadmap</h2>
                        </div>
                        <p className="text-xl text-gray-600 mb-4">
                            We're building the future of micropayments on Solana. Here's what's coming next.
                        </p>
                        <p className="text-lg text-purple-600 font-medium mb-8">
                            🚀 Get ready for features that will blow your mind.
                        </p>

                        {/* Coming Soon - High Priority */}
                        <div className="mb-12">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="px-3 py-1 bg-gray-50 text-white rounded-full text-sm font-bold shadow-lg">COMING SOON</span>
                                <h3 className="text-2xl font-bold">Next Quarter</h3>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="group bg-gray-50 border-2 border-purple-200 rounded-2xl p-6 hover:shadow-2xl transition-all hover:scale-[1.02] relative overflow-hidden">

                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">⚡</div>
                                            <div>
                                                <h4 className="font-bold text-xl">Jupiter Swap-on-Pay</h4>
                                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Q2 2024</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-4">Pay with ANY token. The library automatically swaps to SOL/USDC behind the scenes using Jupiter aggregator. No more "I don't have SOL" excuses!</p>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">Any SPL Token</span>
                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">Best Rates</span>
                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">Zero Config</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="group bg-gray-50 border-2 border-pink-200 rounded-2xl p-6 hover:shadow-2xl transition-all hover:scale-[1.02] relative overflow-hidden">

                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">🖼️</div>
                                            <div>
                                                <h4 className="font-bold text-xl">NFT/Token Gating</h4>
                                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Q2 2024</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-4">Verify NFT ownership for access discounts or exclusive content. Hold a Mad Lads NFT? Get 50% off. The possibilities are endless.</p>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full">NFT Verification</span>
                                            <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full">Dynamic Pricing</span>
                                            <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full">Loyalty Rewards</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="group bg-gray-50 border-2 border-green-200 rounded-2xl p-6 hover:shadow-2xl transition-all hover:scale-[1.02] relative overflow-hidden">

                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">📊</div>
                                            <div>
                                                <h4 className="font-bold text-xl">Payment Analytics</h4>
                                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Q2 2024</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-4">Real-time webhooks and callbacks for tracking payment events. Know exactly when users pay, how much, and from where.</p>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">Webhooks</span>
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">Dashboard</span>
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">Export Data</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="group bg-gray-50 border-2 border-blue-200 rounded-2xl p-6 hover:shadow-2xl transition-all hover:scale-[1.02] relative overflow-hidden">

                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">🌳</div>
                                            <div>
                                                <h4 className="font-bold text-xl">Compressed NFT Access</h4>
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">Q3 2024</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-4">Scalable access tokens via cNFTs for high-volume applications. Mint millions of access passes for pennies.</p>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Ultra Cheap</span>
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Scalable</span>
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Transferable</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Solana Power Users */}
                        <div className="mb-12">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-2xl">⚡</span>
                                <h3 className="text-2xl font-bold">For Solana Power Users</h3>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                {[
                                    { icon: '🚀', title: 'Jito Bundles', desc: 'Guaranteed transaction inclusion via MEV protection. Never worry about failed txs again.', tags: ['MEV Protection', 'Guaranteed Inclusion'] },
                                    { icon: '📡', title: 'WebSocket Streaming', desc: 'Real-time confirmation without polling. Know instantly when payments land.', tags: ['Real-time', 'Low Latency'] },
                                    { icon: '📋', title: 'Lookup Tables', desc: 'Batch payment efficiency for AI agents. Process 100s of payments in one tx.', tags: ['Batch Payments', 'Cost Efficient'] },
                                ].map((item, i) => (
                                    <div key={i} className="bg-gray-50 border border-orange-200 rounded-xl p-5 hover:shadow-lg transition-all">
                                        <div className="text-3xl mb-3">{item.icon}</div>
                                        <h4 className="font-bold mb-2">{item.title}</h4>
                                        <p className="text-sm text-gray-600 mb-3">{item.desc}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {item.tags.map((tag, j) => (
                                                <span key={j} className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* x402 Ecosystem */}
                        <div className="mb-12">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-2xl">🌐</span>
                                <h3 className="text-2xl font-bold">Multi-Chain Future</h3>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                {[
                                    { icon: '💳', title: 'Coinbase Commerce', desc: 'Accept payments via Coinbase Pay. Fiat on-ramp built-in.', color: 'from-blue-50 to-indigo-50 border-blue-200' },
                                    { icon: '🤖', title: 'CDP Agent Wallets', desc: 'Coinbase Developer Platform agent wallet integration for AI agents.', color: 'from-slate-50 to-gray-50 border-slate-200' },
                                    { icon: '🔷', title: 'Base Network', desc: 'EVM x402 payments on Coinbase\'s L2. Ethereum ecosystem access.', color: 'from-sky-50 to-blue-50 border-sky-200' },
                                ].map((item, i) => (
                                    <div key={i} className="bg-gray-50 border border-black/10 rounded-xl p-5 hover:shadow-sm transition-all">
                                        <div className="text-3xl mb-3">{item.icon}</div>
                                        <h4 className="font-bold mb-2">{item.title}</h4>
                                        <p className="text-sm text-gray-600">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="bg-gray-50 text-white rounded-2xl p-8 text-center shadow-2xl">
                            <h3 className="text-2xl font-bold mb-3">🚀 Want to Shape the Future?</h3>
                            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                                We're building in public and love community feedback. Have a feature request? Want to sponsor development? Let's talk!
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <a href="https://github.com/AlleyBo55/micropay-solana-x402-paywall/issues" target="_blank" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg hover:scale-105">
                                    Request Feature
                                    <ArrowRight01Icon size={16} />
                                </a>
                                <a href="https://github.com/AlleyBo55/micropay-solana-x402-paywall" target="_blank" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-full font-bold hover:bg-purple-400 transition-all">
                                    Star on GitHub ⭐
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* API Reference */}
                    <section id="api-reference" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gray-100 text-gray-600 rounded-lg"><SecurityCheckIcon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">API Reference</h2>
                        </div>
                        <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-semibold mb-4">Module Exports</h3>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                {[
                                    { path: '@.../agent', fns: 'executeAgentPayment, getAgentBalance' },
                                    { path: '@.../express', fns: 'x402Middleware, ExpressAdapter' },
                                    { path: '@.../session', fns: 'createSession, validateSession' },
                                    { path: '@.../client', fns: 'createPaymentFlow' },
                                    { path: '@.../pricing', fns: 'getSolPrice, lamportsToUsd' },
                                ].map((mod) => (
                                    <div key={mod.path} className="p-3 bg-gray-50 rounded-lg">
                                        <div className="font-mono text-xs text-purple-600 mb-1">{mod.path}</div>
                                        <div className="text-gray-600 text-xs">{mod.fns}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Support */}
                    <section id="support" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-pink-100 text-pink-600 rounded-lg"><DollarCircleIcon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Support</h2>
                        </div>
                        <div className="bg-gray-50 border border-pink-100 rounded-2xl p-8 text-center">
                            <h3 className="text-xl font-bold mb-4">☕ Buy Me a Coffee</h3>
                            <p className="text-gray-600 mb-6">
                                If you find this library useful, consider sending some SOL to support development:
                            </p>
                            <div className="bg-white px-4 py-3 rounded-xl border border-pink-100 inline-flex items-center gap-3 shadow-sm mx-auto max-w-full overflow-hidden">
                                <code className="font-mono text-sm text-pink-600 break-all">7fPjNJaEHtepp1ZRr6GsaW1k22U1FupQtwuHUkTb6Xg9</code>
                                <button
                                    onClick={() => navigator.clipboard.writeText('7fPjNJaEHtepp1ZRr6GsaW1k22U1FupQtwuHUkTb6Xg9')}
                                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                                    title="Copy Address"
                                >
                                    <Copy01Icon size={16} />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="text-center py-12 border-t border-black/5">
                        <p className="text-gray-400 text-sm">
                            MIT © AlleyBoss · Built for Solana
                        </p>
                        <div className="mt-4 flex justify-center gap-4">
                            <a href="https://www.npmjs.com/package/@alleyboss/micropay-solana-x402-paywall" target="_blank" className="text-purple-600 hover:underline text-sm">npm</a>
                            <a href="https://github.com/AlleyBo55/micropay-solana-x402-paywall" target="_blank" className="text-purple-600 hover:underline text-sm">GitHub</a>
                        </div>
                    </footer>
                </main>
            </div>
        </div >
    );
}
