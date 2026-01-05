'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Rocket01Icon,
    Settings01Icon,
    CheckmarkCircle01Icon,
    ArrowLeft01Icon,
    Copy01Icon,
    ShieldKeyIcon,
    ZapIcon
} from 'hugeicons-react';

const LightningIcon = ZapIcon;

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

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
    const [copied, setCopied] = useState(false);

    const copy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group w-full my-4">
            <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={copy}
                    className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-xs text-gray-300 font-medium backdrop-blur-md flex items-center gap-1.5"
                >
                    {copied ? <CheckmarkCircle01Icon size={12} /> : <Copy01Icon size={12} />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
            <div className="bg-[#0F1117] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                    </div>
                    <div className="ml-2 text-xs font-mono text-gray-500 opacity-70">bash</div>
                </div>
                <div className="p-4 overflow-x-auto">
                    <pre className="font-mono text-sm text-gray-300 whitespace-pre">{code}</pre>
                </div>
            </div>
        </div>
    );
}

export default function DeployDocsPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#111827] selection:bg-blue-500/10 selection:text-blue-700 font-sans">
            {/* Header */}
            <header className="sticky top-0 w-full bg-[#FAFAFA]/80 backdrop-blur-xl border-b border-gray-200/50 h-16 z-50">
                <div className="max-w-5xl mx-auto px-6 h-full flex items-center justify-between">
                    <Link href="/docs" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group">
                        <ArrowLeft01Icon size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Docs
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-semibold tracking-wide uppercase text-gray-400">One-Click Deploy</span>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12 md:py-20">
                {/* Hero Section */}
                <div className="mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
                        <Rocket01Icon size={14} />
                        deployment
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#111827] mb-6 leading-[1.1]">
                        Deploy Your Own <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                            x402 Facilitator
                        </span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
                        Spin up a dedicated, high-performance verification node in seconds.
                        Zero config files to edit—just bring your RPC URL.
                    </p>
                </div>

                {/* Platform Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-24">
                    {[
                        {
                            name: 'Railway',
                            desc: 'Recommended for production. Auto-scaling & zero-downtime deploys.',
                            color: 'from-purple-500 to-pink-500',
                            icon: RailwayIcon,
                            link: 'https://railway.app/template?template=https://github.com/AlleyBo55/oneclickfacilitator'
                        },
                        {
                            name: 'Heroku',
                            desc: 'Easiest for quick prototypes. One-click setup with dyno management.',
                            color: 'from-violet-500 to-indigo-500',
                            icon: HerokuIcon,
                            link: 'https://heroku.com/deploy?template=https://github.com/AlleyBo55/oneclickfacilitator'
                        },
                        {
                            name: 'Render',
                            desc: 'Best price-performance. Fully managed docker containers.',
                            color: 'from-blue-500 to-cyan-500',
                            icon: RenderIcon,
                            link: 'https://render.com/deploy?repo=https://github.com/AlleyBo55/oneclickfacilitator'
                        }
                    ].map((platform) => (
                        <a
                            key={platform.name}
                            href={platform.link}
                            target="_blank"
                            className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 hover:-translate-y-1 block"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-[0.03] transition-opacity rounded-3xl`} />
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
                                <platform.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                {platform.name}
                                <ArrowLeft01Icon size={16} className="rotate-180 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-gray-400" />
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{platform.desc}</p>
                        </a>
                    ))}
                </div>

                {/* Configuration Flow */}
                <div className="mb-24">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white shadow-lg shadow-gray-900/20">
                            <Settings01Icon size={20} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Configuration Workflow</h2>
                    </div>

                    <div className="relative">
                        <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-gray-100" />

                        {/* Step 1 */}
                        <div className="relative pl-24 mb-16 group">
                            <div className="absolute left-0 top-0 w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-xl font-bold text-gray-400 shadow-sm z-10 group-hover:border-blue-500 group-hover:text-blue-600 transition-colors duration-300">
                                01
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Initiate Deployment</h3>
                            <p className="text-gray-500 mb-6">Select your preferred cloud provider above. You'll be redirected to their setup wizard.</p>
                            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 inline-block text-sm text-gray-500">
                                💡 No account? Railway allows guest deployments for testing.
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative pl-24 mb-16 group">
                            <div className="absolute left-0 top-0 w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-xl font-bold text-gray-400 shadow-sm z-10 group-hover:border-purple-500 group-hover:text-purple-600 transition-colors duration-300">
                                02
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Configure RPC Endpoint</h3>
                            <p className="text-gray-500 mb-6 max-w-2xl">
                                The wizard will ask for <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800 font-mono text-sm">SOLANA_RPC_URL</code>.
                                This is the only critical configuration.
                            </p>

                            <div className="bg-[#1C1C1E] text-white rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden max-w-2xl">
                                <div className="absolute top-0 right-0 p-32 bg-purple-500/20 blur-[80px] rounded-full -mr-16 -mt-16 pointer-events-none" />
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Environment Variables</h4>

                                <div className="space-y-6 relative z-10">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">SOLANA_RPC_URL <span className="text-red-400">*</span></label>
                                        <div className="bg-white/10 border border-white/10 rounded-lg p-3 font-mono text-sm text-blue-300">
                                            https://mainnet.helius-rpc.com/?api-key=...
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Get a high-performance RPC from Helius, QuickNode, or Triton.</p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">SOLANA_NETWORK</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-white/10 border border-blue-500/50 rounded-lg p-3 text-sm text-center font-medium ring-2 ring-blue-500/20">mainnet-beta</div>
                                            <div className="bg-transparent border border-white/10 rounded-lg p-3 text-sm text-center text-gray-500">devnet</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative pl-24 group">
                            <div className="absolute left-0 top-0 w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-xl font-bold text-gray-400 shadow-sm z-10 group-hover:border-green-500 group-hover:text-green-600 transition-colors duration-300">
                                03
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Verify & Connect</h3>
                            <p className="text-gray-500 mb-6">Once deployed, your facilitator will be live at a public URL.</p>

                            <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
                                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-green-400/50 transition-colors">
                                    <div className="flex items-center gap-3 mb-3 text-green-600">
                                        <ShieldKeyIcon size={20} />
                                        <span className="font-bold">Health Check</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">Verify your node is active and syncing.</p>
                                    <code className="text-xs bg-gray-50 px-2 py-1 rounded border border-gray-100 block w-fit">GET /health</code>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-blue-400/50 transition-colors">
                                    <div className="flex items-center gap-3 mb-3 text-blue-600">
                                        <Database01Icon size={20} />
                                        <span className="font-bold">Metrics</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">Monitor performance via Prometheus.</p>
                                    <code className="text-xs bg-gray-50 px-2 py-1 rounded border border-gray-100 block w-fit">GET /metrics</code>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Integration */}
                <div className="bg-[#F5F5F7] rounded-[40px] p-8 md:p-16 text-center border border-white/50 shadow-inner">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-gray-200/50 text-[#111827]">
                        <LightningIcon size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Integrate?</h2>
                    <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
                        Point your middleware to your new facilitator URL to start accepting self-sovereign payments.
                    </p>
                    <CodeBlock
                        code={`const middleware = createX402Middleware({
  facilitatorUrl: 'https://your-app.up.railway.app', // Your new URL
  walletAddress: 'YOUR_WALLET',
  price: '10000000'
});`}
                        language="typescript"
                    />
                </div>

            </main>
        </div>
    );
}
