'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import ArrowRight01Icon from 'hugeicons-react/dist/esm/icons/arrow_right_01_icon';
import ZapIcon from 'hugeicons-react/dist/esm/icons/zap_icon';
import SourceCodeIcon from 'hugeicons-react/dist/esm/icons/source_code_icon';
import Shield02Icon from 'hugeicons-react/dist/esm/icons/shield_02_icon';
import Share01Icon from 'hugeicons-react/dist/esm/icons/share_01_icon';
import Settings01Icon from 'hugeicons-react/dist/esm/icons/settings_01_icon';
import Database01Icon from 'hugeicons-react/dist/esm/icons/database_01_icon';
import Globe02Icon from 'hugeicons-react/dist/esm/icons/globe_02_icon';
import LockPasswordIcon from 'hugeicons-react/dist/esm/icons/lock_password_icon';
import Copy01Icon from 'hugeicons-react/dist/esm/icons/copy_01_icon';
import Tick01Icon from 'hugeicons-react/dist/esm/icons/tick_01_icon';
import SparklesIcon from 'hugeicons-react/dist/esm/icons/sparkles_icon';

const LightningIcon = ZapIcon;

import { getAllArticles } from '@/config';
import { lamportsToSol } from '@alleyboss/micropay-solana-x402-paywall';

export default function Home() {
    const articles = getAllArticles();
    const [copied, setCopied] = useState(false);

    const codeString = `import { verifyX402Payment } from '@alleyboss/micropay';

export async function POST(req) {
  const { signature } = await req.json();
  
  // 1. Verify Payment on Solana
  const { valid } = await verifyX402Payment({ 
    price: 0.01, 
    recipient: 'WALLET_ADDR' 
  }, signature);

  if (!valid) {
    return new Response('Payment Required', { 
      status: 402 
    });
  }

  // 2. Deliver Content
  return Response.json({ 
    secret: 'AI_DATA_PAYLOAD' 
  });
}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(codeString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#1D1D1F] selection:bg-black selection:text-white font-sans antialiased">

            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-[#FAFAFA]/80 backdrop-blur-md border-b border-black/5 transition-all">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-70 transition-opacity">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white shadow-sm">
                            <LightningIcon className="w-5 h-5 text-white fill-current" />
                        </div>
                        Micropay
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/agent-chat" className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors hidden sm:block">🤖 Agent Demo</Link>
                        <Link href="/docs" className="text-sm font-medium text-gray-500 hover:text-black transition-colors hidden sm:block">Documentation</Link>
                        <a href="https://github.com/AlleyBo55/micropay-solana-x402-paywall" target="_blank" className="text-sm font-medium text-gray-500 hover:text-black transition-colors hidden sm:block">GitHub</a>
                        <Link href="/docs" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 duration-200">
                            Start Building
                        </Link>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/5 mb-8 shadow-sm backdrop-blur-sm"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-medium text-gray-600">v3.1.0 · Self-Sovereign Mode</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-[#1D1D1F] mb-8 max-w-5xl mx-auto leading-[0.95]"
                        >
                            Monetize the <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 animate-gradient">
                                AI Agent Economy
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed"
                        >
                            The standard for HTTP 402 Micropayments. <br className="hidden sm:block" />
                            Streamline API billing, gate premium content, and enable autonomous agent-to-agent transactions on Solana.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link href="/docs" className="h-12 px-8 rounded-full bg-black text-white font-medium flex items-center justify-center hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 duration-200 shadow-xl shadow-black/10">
                                Start Integration
                                <ArrowRight01Icon className="w-5 h-5 ml-2" />
                            </Link>
                            <button onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })} className="h-12 px-8 rounded-full bg-white text-[#1D1D1F] border border-black/10 font-medium flex items-center justify-center hover:bg-gray-50 transition-all hover:border-black/20 shadow-sm">
                                View Demo
                            </button>
                        </motion.div>

                        {/* Tech Stack Strip */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="mt-24 pt-10 border-t border-black/5 flex items-center justify-center gap-12 sm:gap-16 opacity-30 grayscale"
                        >
                            <div className="flex items-center gap-2 font-bold text-xl"><span className="w-6 h-6 bg-black rounded-full block" />SOLANA</div>
                            <div className="flex items-center gap-2 font-bold text-xl"><span className="w-6 h-6 border-2 border-black rounded-full block" />Next.js</div>
                            <div className="flex items-center gap-2 font-bold text-xl"><span className="w-6 h-6 bg-gray-400 rounded-full block" />Typescript</div>
                        </motion.div>
                    </div>
                </section>

                {/* Bento Grid Features - Apple Style */}
                <section className="py-32 bg-white rounded-[3rem] shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.05)] mx-4 md:mx-8">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="max-w-2xl mb-16">
                            <h2 className="text-4xl font-bold tracking-tight mb-4 text-[#1D1D1F]">Built for the machine economy.</h2>
                            <p className="text-lg text-gray-500 leading-relaxed">Traditional subscriptions don't work for AI agents or casual users. Micropay opens up a new revenue model: Pay-per-task.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Feature 1 */}
                            <div className="md:col-span-2 bg-[#FAFAFA] rounded-3xl p-10 border border-black/5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
                                    <SourceCodeIcon size={300} className="text-black" />
                                </div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-black/10">
                                        <SourceCodeIcon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-3 text-[#1D1D1F]">API Monetization</h3>
                                    <p className="text-gray-500 max-w-md text-lg leading-relaxed">Charge LLMs and Agents per request. No credit cards needed. Just a wallet signature and 0.00005 SOL.</p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-[#FAFAFA] rounded-3xl p-10 border border-black/5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 group">
                                <div>
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 text-[#1D1D1F] shadow-sm border border-black/5">
                                        <Shield02Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-3 text-[#1D1D1F]">Stateless Auth</h3>
                                    <p className="text-gray-500 leading-relaxed">No database required. JWT sessions carry the proof of payment cryptographically.</p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-[#FAFAFA] rounded-3xl p-10 border border-black/5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 group">
                                <div>
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 text-[#1D1D1F] shadow-sm border border-black/5">
                                        <Database01Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-3 text-[#1D1D1F]">Self-Sovereign</h3>
                                    <p className="text-gray-500 leading-relaxed">Verify payments locally on your own RPC node. No dependency on external APIs. Trustless.</p>
                                </div>
                            </div>

                            {/* Feature 4 (Code Reveal) */}
                            <div className="md:col-span-3 bg-[#111111] rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden text-gray-400 font-mono text-sm relative group ring-1 ring-white/10">
                                {/* Status Lights */}
                                <div className="absolute top-6 right-6 flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.2)]" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]" />
                                </div>

                                {/* Copy Button */}
                                <button
                                    onClick={handleCopy}
                                    className="absolute top-6 left-6 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white group/copy flex items-center gap-2"
                                    title="Copy to clipboard"
                                >
                                    {copied ? <Tick01Icon size={16} className="text-green-400" /> : <Copy01Icon size={16} />}
                                    <span className="text-xs font-medium">{copied ? 'Copied!' : 'Copy'}</span>
                                </button>

                                <div className="mt-8 overflow-x-auto">
                                    <pre className="text-sm md:text-base leading-relaxed"><code className="language-typescript">
                                        <span className="text-purple-400">import</span> <span className="text-yellow-300">{`{`}</span> <span className="text-blue-400">verifyX402Payment</span> <span className="text-yellow-300">{`}`}</span> <span className="text-purple-400">from</span> <span className="text-green-400">'@alleyboss/micropay'</span>;{'\n'}
                                        {'\n'}
                                        <span className="text-purple-400">export async function</span> <span className="text-blue-400">POST</span>(req) <span className="text-yellow-300">{`{`}</span>{'\n'}
                                        <span className="text-purple-400">const</span> <span className="text-yellow-300">{`{`}</span> <span className="text-blue-400">signature</span> <span className="text-yellow-300">{`}`}</span> = <span className="text-purple-400">await</span> req.<span className="text-blue-400">json</span>();{'\n'}
                                        {'\n'}
                                        <span className="text-gray-500">// 1. Verify Payment on Solana</span>{'\n'}
                                        <span className="text-purple-400">const</span> <span className="text-yellow-300">{`{`}</span> <span className="text-blue-400">valid</span> <span className="text-yellow-300">{`}`}</span> = <span className="text-purple-400">await</span> <span className="text-blue-400">verifyX402Payment</span>(<span className="text-yellow-300">{`{`}</span>{'\n'}
                                        price: <span className="text-orange-400">0.01</span>,{'\n'}
                                        recipient: <span className="text-green-400">'WALLET_ADDR'</span>{'\n'}
                                        <span className="text-yellow-300">{`}`}</span>, signature);{'\n'}
                                        {'\n'}
                                        <span className="text-purple-400">if</span> (!valid) <span className="text-yellow-300">{`{`}</span>{'\n'}
                                        <span className="text-purple-400">return new</span> <span className="text-yellow-300">Response</span>(<span className="text-green-400">'Payment Required'</span>, <span className="text-yellow-300">{`{`}</span>{'\n'}
                                        status: <span className="text-orange-400">402</span>{'\n'}
                                        <span className="text-yellow-300">{`}`}</span>);{'\n'}
                                        <span className="text-yellow-300">{`}`}</span>{'\n'}
                                        {'\n'}
                                        <span className="text-gray-500">// 2. Deliver Content</span>{'\n'}
                                        <span className="text-purple-400">return</span> <span className="text-yellow-300">Response</span>.<span className="text-blue-400">json</span>(<span className="text-yellow-300">{`{`}</span>{'\n'}
                                        secret: <span className="text-green-400">'AI_DATA_PAYLOAD'</span>{'\n'}
                                        <span className="text-yellow-300">{`}`}</span>);{'\n'}
                                        <span className="text-yellow-300">{`}`}</span></code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Demo Articles Section */}
                <section id="demo" className="py-32">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                            <div>
                                <h2 className="text-4xl font-bold tracking-tight mb-4 text-[#1D1D1F]">See it in action.</h2>
                                <p className="text-lg text-gray-500 max-w-xl leading-relaxed">
                                    Experience the power of x402 with our live demos.
                                    Try the autonomous AI agent or unlock premium blog content with instant micropayments (Devnet).
                                </p>
                            </div>
                            <Link href="/docs" className="text-sm font-semibold border-b border-black pb-0.5 hover:opacity-70 transition-opacity flex items-center gap-1">
                                Read the Docs <ArrowRight01Icon size={16} />
                            </Link>
                        </div>

                        {/* Agent Chat Demo Banner - Apple/Gemini Aesthetic */}
                        <Link
                            href="/agent-chat"
                            className="mb-16 block group relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-16px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30 opacity-100" />

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-10 md:p-14 gap-10">
                                <div className="max-w-2xl">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 backdrop-blur-md mb-6 border border-black/5">
                                        <SparklesIcon size={14} className="text-black" />
                                        <span className="text-[11px] font-semibold tracking-wide uppercase text-gray-600">Autonomous Agent</span>
                                    </div>

                                    <h3 className="text-4xl md:text-5xl font-semibold text-[#1D1D1F] tracking-tight mb-4 leading-[1.1]">
                                        Experience the future <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">of AI commerce.</span>
                                    </h3>

                                    <p className="text-xl text-gray-500 font-light leading-relaxed max-w-lg">
                                        Chat with an agent that pays its own way. <br className="hidden md:block" />
                                        Zero friction. Autonomous execution.
                                    </p>
                                </div>

                                <div className="relative group-hover:scale-105 transition-transform duration-700 ease-[0.16,1,0.3,1]">
                                    {/* Abstract UI representation */}
                                    <div className="w-64 aspect-[4/3] rounded-2xl bg-white shadow-2xl border border-gray-100 p-4 flex flex-col gap-3 rotate-3 group-hover:rotate-6 transition-transform duration-500">
                                        <div className="flex gap-2 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-red-400/20" />
                                            <div className="w-2 h-2 rounded-full bg-yellow-400/20" />
                                            <div className="w-2 h-2 rounded-full bg-green-400/20" />
                                        </div>
                                        <div className="w-3/4 h-3 bg-gray-100 rounded-full" />
                                        <div className="w-1/2 h-3 bg-gray-100 rounded-full" />
                                        <div className="mt-auto self-end px-3 py-1.5 rounded-lg bg-black text-white text-xs font-medium flex items-center gap-1.5 shadow-lg shadow-blue-500/20">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                            Paying 0.002 SOL
                                        </div>
                                    </div>

                                    <div className="absolute -bottom-6 -right-6">
                                        <div className="h-14 w-14 rounded-full bg-black text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                                            <ArrowRight01Icon size={24} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articles.map((article, i) => (
                                <Link
                                    key={article.id}
                                    href={`/article/${article.slug}`}
                                    className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
                                        {/* Article Image */}
                                        <Image
                                            src={article.coverImage}
                                            alt={article.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />

                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold text-[#1D1D1F] shadow-sm">
                                                {article.readingTime}
                                            </span>
                                        </div>
                                        {article.isPremium && (
                                            <div className="absolute top-4 right-4 z-10">
                                                <span className="w-8 h-8 bg-black/60 backdrop-blur-md text-white flex items-center justify-center rounded-full">
                                                    <LockPasswordIcon size={16} />
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 p-6 flex flex-col">
                                        <h3 className="text-xl font-bold mb-3 group-hover:text-gray-600 transition-colors leading-tight text-[#1D1D1F]">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-500 mb-6 line-clamp-2 text-sm leading-relaxed">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                                            <div className="flex gap-2">
                                                {article.tags?.slice(0, 1).map((tag: string) => (
                                                    <span key={tag} className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded-md">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="font-mono text-sm font-bold text-[#1D1D1F] bg-black/5 px-2 py-1 rounded text-green-800 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                {lamportsToSol(article.priceInLamports).toFixed(4)} SOL
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-32 border-t border-black/5 bg-white">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-[#1D1D1F]">Ready to monetize?</h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-300 to-blue-500 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                <a href="https://www.npmjs.com/package/@alleyboss/micropay-solana-x402-paywall" target="_blank" className="relative h-14 px-8 bg-black rounded-full text-white font-medium flex items-center justify-center hover:bg-gray-900 transition-colors gap-3 shadow-lg">
                                    <Globe02Icon size={20} />
                                    npm i @alleyboss/micropay-solana-x402-paywall
                                </a>
                            </div>
                        </div>
                        <p className="mt-8 text-gray-500 text-sm font-medium">MIT Licensed. Open Source. Production Ready.</p>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t border-black/5 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 font-bold text-lg text-[#1D1D1F]">
                        <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-white text-xs">
                            <LightningIcon className="w-3 h-3 fill-current" />
                        </div>
                        Micropay
                    </div>
                    <div className="flex gap-8 text-sm text-gray-500 font-medium">
                        <Link href="/docs" className="hover:text-black transition-colors">Documentation</Link>
                        <a href="https://github.com/AlleyBo55/micropay-solana-x402-paywall" target="_blank" className="hover:text-black transition-colors inline-flex items-center gap-1">
                            GitHub
                        </a>
                        <a href="https://x402.org" target="_blank" className="hover:text-black transition-colors">x402 Protocol</a>
                    </div>
                    <p className="text-gray-400 text-sm">© 2026 AlleyBoss. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
