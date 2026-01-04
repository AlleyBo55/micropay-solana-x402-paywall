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
import ArrowRight01Icon from 'hugeicons-react/dist/esm/icons/arrow_right_01_icon';
import CheckmarkCircle01Icon from 'hugeicons-react/dist/esm/icons/checkmark_circle_01_icon';
import Copy01Icon from 'hugeicons-react/dist/esm/icons/copy_01_icon';
import RefreshIcon from 'hugeicons-react/dist/esm/icons/refresh_icon';
import ShieldKeyIcon from 'hugeicons-react/dist/esm/icons/shield_key_icon';
import CpuIcon from 'hugeicons-react/dist/esm/icons/cpu_icon';
import SparklesIcon from 'hugeicons-react/dist/esm/icons/sparkles_icon';

const LightningIcon = ZapIcon;
const Cpu = CpuIcon;
const Sparkles = SparklesIcon;


const sections = [
    { id: 'intro', title: 'Introduction' },
    { id: 'demo-features', title: 'Features Demonstrated' },
    { id: 'agent-chat', title: 'AI Agent Payments' },
    { id: 'installation', title: 'Installation' },
    { id: 'self-sovereign', title: 'Self-Sovereign Mode' },
    { id: 'quick-start', title: 'Quick Start' },
    { id: 'configuration', title: 'Configuration' },
    { id: 'payment-flow', title: 'The x402 Flow' },
    { id: 'middleware', title: 'Middleware' },
    { id: 'pricing', title: 'Price Conversion' },
    { id: 'client-helpers', title: 'Client Helpers' },
    { id: 'roadmap', title: '🗺️ Roadmap' },
    { id: 'api-reference', title: 'Full API Reference' },
];


function CodeBlock({ code, language = 'typescript' }: { code: string; language?: string }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Syntax highlighting (Simplified for brevity)
    // ... [Same logic as before]
    const highlightCode = (source: string) => {
        const tokens: { type: string; value: string }[] = [];
        // Basic tokenizer
        tokens.push({ type: 'plain', value: source });
        return tokens;
    };

    // Use a simple pre block for now to avoid complexity in this file generation tool
    // Real implementation would reuse the highlighter

    return (
        <div className="relative group">
            <button
                onClick={copy}
                className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
            >
                {copied ? <CheckmarkCircle01Icon size={16} className="text-green-400" /> : <Copy01Icon size={16} className="text-gray-400" />}
            </button>
            <div className="bg-[#0D0D0D] rounded-xl p-5 font-mono text-sm overflow-x-auto shadow-xl ring-1 ring-white/10">
                <pre className="whitespace-pre-wrap text-gray-300">
                    {code}
                </pre>
            </div>
        </div>
    );
}

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState('intro');

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
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#1D1D1F] selection:bg-purple-100 selection:text-purple-900 font-sans antialiased">
            {/* Header */}
            <header className="fixed top-0 w-full bg-[#FAFAFA]/80 backdrop-blur-md border-b border-black/5 h-16 z-50">
                <div className="max-w-screen-2xl mx-auto px-6 h-full flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-70 transition-opacity">
                        <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-white">
                            <LightningIcon className="w-3 h-3 fill-current" />
                        </div>
                        Micropay Docs
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="hidden md:inline text-xs font-mono bg-green-100 text-green-700 px-2 py-1 rounded-full">v3.3.0</span>
                        <a href="https://www.npmjs.com/package/@alleyboss/micropay-solana-x402-paywall" target="_blank" className="p-2 hover:bg-black/5 rounded-lg transition-colors text-gray-500 hover:text-black">
                            <Share01Icon size={18} />
                        </a>
                        <Link href="/" className="text-sm font-medium px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors shadow-sm">
                            View Demo
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-screen-2xl mx-auto flex pt-16">
                {/* Sidebar */}
                <aside className="hidden lg:block w-64 fixed left-0 top-16 bottom-0 overflow-y-auto border-r border-black/5 bg-white p-6 z-40">
                    <nav className="space-y-1">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === section.id
                                    ? 'bg-[#F5F5F7] text-black shadow-sm'
                                    : 'text-gray-500 hover:text-black hover:bg-[#F5F5F7]/50'
                                    }`}
                            >
                                {section.title}
                            </button>
                        ))}
                    </nav>
                    <div className="mt-8 p-4 bg-purple-50 rounded-xl">
                        <p className="text-xs text-purple-600 font-medium mb-2">Bundle Size</p>
                        <p className="text-2xl font-bold text-purple-700">38KB</p>
                        <p className="text-xs text-purple-500">Tree-shakeable</p>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 lg:ml-64 p-6 md:p-12 md:max-w-4xl mx-auto">

                    {/* Introduction */}
                    <section id="intro" className="mb-20 pt-10">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-[#1D1D1F]">
                            Solana Micropayments Library
                        </h1>
                        <p className="text-xl text-gray-500 leading-relaxed mb-6">
                            <code className="text-purple-600 font-semibold bg-purple-50 px-1 py-0.5 rounded">@alleyboss/micropay-solana-x402-paywall</code> is a production-ready wrapper for the official x402 SDK, adding AI agent capabilities and Express.js support.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4 mb-8">
                            <div className="p-4 bg-white rounded-xl border border-black/5 shadow-sm">
                                <div className="text-2xl mb-2">💰</div>
                                <div className="font-bold">SOL & USDC</div>
                                <div className="text-sm text-gray-500">Native and SPL tokens</div>
                            </div>
                            <div className="p-4 bg-white rounded-xl border border-black/5 shadow-sm">
                                <div className="text-2xl mb-2">🔐</div>
                                <div className="font-bold">x402 Protocol</div>
                                <div className="text-sm text-gray-500">Standard HTTP 402 Compliance</div>
                            </div>
                            <div className="p-4 bg-white rounded-xl border border-black/5 shadow-sm">
                                <div className="text-2xl mb-2">🤖</div>
                                <div className="font-bold">AI Agents</div>
                                <div className="text-sm text-gray-500">Autonomous Payments</div>
                            </div>
                        </div>
                    </section>

                    {/* Demo Features Checklist */}
                    <section id="demo-features" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><CheckmarkCircle01Icon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Features Demonstrated</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            This demo application showcases the full capabilities of the library:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
                                <h3 className="font-bold text-[#1D1D1F] mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                                    Core Tech
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5"></span>Official x402 SDK Integration</li>
                                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5"></span>Next.js App Router Support</li>
                                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5"></span>Solana & SPL Token Support</li>
                                </ul>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
                                <h3 className="font-bold text-[#1D1D1F] mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                                    Advanced
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5"></span><strong>AI Agent Payments</strong></li>
                                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5"></span>Hybrid Session Management</li>
                                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5"></span><strong>Self-Sovereign Mode</strong> (No External Facilitator)</li>
                                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5"></span>Replay Protection (via Facilitator)</li>
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

                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-6 mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white">
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

                    {/* Self-Sovereign Mode */}
                    <section id="self-sovereign" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><ShieldKeyIcon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Self-Sovereign Verification</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Remove dependency on external hosted facilitators. Verify payments directly against your own Solana RPC node.
                        </p>
                        <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl mb-6 text-sm text-yellow-800">
                            <strong>Note:</strong> This mode runs verification logic inside your backend, making it fully self-contained.
                        </div>

                        <h3 className="font-bold text-lg mb-4">Verification Flow</h3>
                        <div className="mb-6">
                            <CodeBlock language="mermaid" code={`sequenceDiagram
    participant User
    participant App
    participant Lib as x402 Lib
    participant RPC as Solana RPC
    
    User->>App: Request Premium Content
    App->>Lib: Create Payment Options
    Lib-->>User: Return 402 + Payment Link
    User->>RPC: Submit Transaction
    User->>App: Send Receipt/Signature
    App->>Lib: Verify Transaction
    Lib->>RPC: Get Transaction Status (Local)
    RPC-->>Lib: Confirmed
    Lib-->>App: Valid Session Token
    App-->>User: Unlock Content`} />
                        </div>

                        <h3 className="font-bold text-lg mb-4">Hosted vs. Self-Sovereign</h3>
                        <div className="overflow-x-auto mb-8 border border-black/5 rounded-xl">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-4 py-3">Feature</th>
                                        <th className="px-4 py-3">Hosted Mode (Default)</th>
                                        <th className="px-4 py-3">Self-Sovereign Mode</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5">
                                    <tr className="bg-white">
                                        <td className="px-4 py-3 font-medium">Verification</td>
                                        <td className="px-4 py-3">Verified by x402.org</td>
                                        <td className="px-4 py-3">Verified by <span className="font-bold text-purple-600">You</span> (Local RPC)</td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="px-4 py-3 font-medium">Trust</td>
                                        <td className="px-4 py-3">Trust x402 Facilitator</td>
                                        <td className="px-4 py-3">Trustless / Your Node</td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="px-4 py-3 font-medium">Privacy</td>
                                        <td className="px-4 py-3">Metadata sent to facilitator</td>
                                        <td className="px-4 py-3">No external data sharing</td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="px-4 py-3 font-medium">Setup</td>
                                        <td className="px-4 py-3">Zero-config</td>
                                        <td className="px-4 py-3">Requires RPC URL</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h3 className="font-bold text-lg mb-3">Implementation</h3>
                        <CodeBlock code={`const withMicropay = createX402Middleware({
    walletAddress: 'YOUR_WALLET',
    network: 'devnet',
    price: '1000000',
    // ⚡️ Enable Self-Sovereign Mode
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL 
});`} />
                    </section>

                    {/* Installation */}
                    <section id="installation" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><CodeCircleIcon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Installation</h2>
                        </div>
                        <CodeBlock code="npm install @alleyboss/micropay-solana-x402-paywall @solana/web3.js" />
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
                        <h3 className="font-bold text-lg mb-3">Mainnet Setup (Next.js)</h3>
                        <CodeBlock code={`// .env.local
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
# Optional: Custom Facilitator
# X402_FACILITATOR_URL=https://facilitator.pro-provider.com/v1/MY_KEY`} />
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
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Middleware</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Easily integrate with Express.js.
                        </p>
                        <CodeBlock code={`import { x402Middleware } from '@alleyboss/micropay-solana-x402-paywall/express';
// Use with app.use() or specific routes`} />
                    </section>

                    {/* Pricing */}
                    <section id="pricing" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><DollarCircleIcon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Price Conversion</h2>
                        </div>
                        <CodeBlock code={`import { getSolPrice, lamportsToUsd } from '@alleyboss/micropay-solana-x402-paywall/pricing';

const { solPrice } = await getSolPrice();`} />
                    </section>

                    {/* Roadmap */}
                    <section id="roadmap" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 rounded-lg">🗺️</div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Roadmap</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            We&apos;re actively building the future of micropayments on Solana:
                        </p>

                        {/* Core Features */}
                        <h3 className="font-bold text-lg mb-4 text-[#1D1D1F]">Core Features</h3>
                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">⚡</span>
                                    <h4 className="font-bold">Jupiter Swap-on-Pay</h4>
                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Coming Soon</span>
                                </div>
                                <p className="text-sm text-gray-600">Pay with any token. Auto-swap to SOL/USDC behind the scenes.</p>
                            </div>
                            <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">🖼️</span>
                                    <h4 className="font-bold">NFT/Token-Gating</h4>
                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Coming Soon</span>
                                </div>
                                <p className="text-sm text-gray-600">Verify NFT ownership for access discounts or exclusive content.</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">📊</span>
                                    <h4 className="font-bold">Payment Analytics</h4>
                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Coming Soon</span>
                                </div>
                                <p className="text-sm text-gray-600">Webhooks & callbacks for tracking payment events in real-time.</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">🌳</span>
                                    <h4 className="font-bold">Compressed NFT Access</h4>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Planned</span>
                                </div>
                                <p className="text-sm text-gray-600">Scalable access tokens via cNFTs for high-volume applications.</p>
                            </div>
                        </div>

                        {/* Solana Power Users */}
                        <h3 className="font-bold text-lg mb-4 text-[#1D1D1F]">⚡ For Solana Power Users</h3>
                        <div className="grid md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">🚀</span>
                                    <h4 className="font-bold">Jito Bundles</h4>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Planned</span>
                                </div>
                                <p className="text-sm text-gray-600">Guaranteed transaction inclusion via MEV protection.</p>
                            </div>
                            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">📡</span>
                                    <h4 className="font-bold">WebSocket</h4>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Planned</span>
                                </div>
                                <p className="text-sm text-gray-600">Real-time confirmation without polling.</p>
                            </div>
                            <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">📋</span>
                                    <h4 className="font-bold">Lookup Tables</h4>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Planned</span>
                                </div>
                                <p className="text-sm text-gray-600">Batch payments efficiency for AI agents.</p>
                            </div>
                        </div>

                        {/* x402 Ecosystem */}
                        <h3 className="font-bold text-lg mb-4 text-[#1D1D1F]">🔵 For x402 Protocol</h3>
                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">💳</span>
                                    <h4 className="font-bold">Coinbase Commerce</h4>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Planned</span>
                                </div>
                                <p className="text-sm text-gray-600">Accept payments via Coinbase Pay integration.</p>
                            </div>
                            <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">🤖</span>
                                    <h4 className="font-bold">CDP Agent Wallets</h4>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Planned</span>
                                </div>
                                <p className="text-sm text-gray-600">Coinbase Developer Platform agent wallet integration.</p>
                            </div>
                            <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">🔷</span>
                                    <h4 className="font-bold">Base Network</h4>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Planned</span>
                                </div>
                                <p className="text-sm text-gray-600">EVM x402 payments on Coinbase&apos;s L2.</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                            <p className="text-sm text-gray-600">
                                Want to contribute or sponsor a feature? <a href="https://github.com/AlleyBo55/micropay-solana-x402-paywall" target="_blank" className="text-purple-600 hover:underline font-medium">Open an issue on GitHub</a>
                            </p>
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
                        <div className="bg-gradient-to-br from-pink-50 to-orange-50 border border-pink-100 rounded-2xl p-8 text-center">
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
        </div>
    );
}
