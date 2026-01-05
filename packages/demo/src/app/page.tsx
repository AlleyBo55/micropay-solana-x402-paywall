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
                            <span className="text-xs font-medium text-gray-600">v3.3.13 · Self-Sovereign Mode</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#1D1D1F] mb-6 sm:mb-8 max-w-5xl mx-auto leading-[1.05] sm:leading-[0.95]"
                        >
                            Monetize the <br className="sm:hidden" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 animate-gradient">
                                AI Agent Economy
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-lg sm:text-xl text-gray-500 mb-10 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0"
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
                            className="mt-16 sm:mt-24 pt-8 sm:pt-10 border-t border-black/5 flex items-center justify-start sm:justify-center gap-8 sm:gap-16 opacity-80 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0"
                        >
                            {/* Solana Logo - Standard */}
                            <div className="flex items-center gap-2.5 font-bold text-lg sm:text-xl text-black flex-shrink-0">
                                <img src="https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" alt="Solana" />
                                <span>Solana</span>
                            </div>

                            {/* Next.js Logo - Standard */}
                            <div className="flex items-center gap-2.5 font-bold text-lg sm:text-xl text-black flex-shrink-0">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M90 180C139.706 180 180 139.706 180 90C180 40.2944 139.706 0 90 0C40.2944 0 0 40.2944 0 90C0 139.706 40.2944 180 90 180ZM128.496 148.974L56.7483 55.4571H48.5143V124.543H60.0571V70.7351L120.309 148.974H128.496ZM131.486 124.543V55.4571H119.943V124.543H131.486Z" fill="black" />
                                </svg>
                                <span>Next.js</span>
                            </div>

                            {/* TypeScript Logo - Standard */}
                            <div className="flex items-center gap-2.5 font-bold text-lg sm:text-xl text-[#3178C6] flex-shrink-0">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8 rounded-md" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 0H24V24H0V0Z" fill="#3178C6" />
                                    <path d="M11.8 7.5H6.2V9.16H8.2V16.5H9.8V9.16H11.8V7.5Z" fill="white" />
                                    <path d="M12.5 14.8C12.5 15.6 13.1 15.82 13.8 15.82C14.7 15.82 15.1 14.82 15.1 14.82C15.1 14.52 14.9 14.12 13.8 13.72L13.1 13.52C11.9 13.12 11.4 12.32 11.4 11.42C11.4 9.92 12.6 9.02 14 9.02C15.6 9.02 16.5 10.02 16.5 11.32H15C15 10.72 14.6 10.42 14.1 10.42C13.5 10.42 13 10.82 13 11.32C13 11.72 13.3 12.02 13.9 12.22L14.6 12.42C16 12.92 16.6 13.62 16.6 14.72C16.6 16.42 15.3 17.32 13.7 17.32C12 17.32 10.9 16.22 10.9 14.82H12.5V14.8Z" fill="white" />
                                </svg>
                                <span>TypeScript</span>
                            </div>

                            {/* Express Logo */}
                            <div className="flex items-center gap-2.5 font-bold text-lg sm:text-xl text-black flex-shrink-0">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" className="h-4 sm:h-6 w-auto object-contain" alt="Express.js" />
                            </div>

                            {/* NPM Logo */}
                            <div className="flex items-center gap-2.5 font-bold text-lg sm:text-xl text-[#CB3837] flex-shrink-0">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 256V0H256V256H0Z" fill="#CB3837" />
                                    <path d="M48 48V208H208V48H48ZM176 176H144V96H112V176H80V80H176V176Z" fill="white" />
                                </svg>
                                <span>npm</span>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Bento Grid Features - Apple Style */}
                <section className="py-20 sm:py-32 bg-white rounded-[2rem] sm:rounded-[3rem] shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.05)] mx-3 sm:mx-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="max-w-2xl mb-12 sm:mb-16 text-center sm:text-left">
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-[#1D1D1F]">Built for the machine economy.</h2>
                            <p className="text-base sm:text-lg text-gray-500 leading-relaxed">Traditional subscriptions don't work for AI agents or casual users. Micropay opens up a new revenue model: Pay-per-task.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Feature 1 */}
                            <div className="md:col-span-2 bg-[#FAFAFA] rounded-3xl p-8 sm:p-10 border border-black/5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none hidden sm:block">
                                    <SourceCodeIcon size={300} className="text-black" />
                                </div>
                                <div className="relative z-10">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-black/10">
                                        <SourceCodeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-[#1D1D1F]">API Monetization</h3>
                                    <p className="text-gray-500 max-w-md text-base sm:text-lg leading-relaxed">Charge LLMs and Agents per request. No credit cards needed. Just a wallet signature and 0.00005 SOL.</p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-[#FAFAFA] rounded-3xl p-8 sm:p-10 border border-black/5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 group">
                                <div>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-2xl flex items-center justify-center mb-6 text-[#1D1D1F] shadow-sm border border-black/5">
                                        <Shield02Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-[#1D1D1F]">Stateless Auth</h3>
                                    <p className="text-gray-500 leading-relaxed text-sm sm:text-base">No database required. JWT sessions carry the proof of payment cryptographically.</p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-[#FAFAFA] rounded-3xl p-8 sm:p-10 border border-black/5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 group">
                                <div>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-2xl flex items-center justify-center mb-6 text-[#1D1D1F] shadow-sm border border-black/5">
                                        <Database01Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-[#1D1D1F]">Self-Sovereign</h3>
                                    <p className="text-gray-500 leading-relaxed text-sm sm:text-base">Verify payments locally on your own RPC node. No dependency on external APIs. Trustless.</p>
                                </div>
                            </div>

                            {/* Feature 4 (Code Reveal) */}
                            <div className="md:col-span-3 bg-[#111111] rounded-[2rem] sm:rounded-3xl p-6 sm:p-12 shadow-2xl overflow-hidden text-gray-400 font-mono text-xs sm:text-sm relative group ring-1 ring-white/10">
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
                                    {copied ? <Tick01Icon size={14} className="text-green-400" /> : <Copy01Icon size={14} />}
                                    <span className="text-[10px] sm:text-xs font-medium">{copied ? 'Copied!' : 'Copy'}</span>
                                </button>

                                <div className="mt-12 sm:mt-8 overflow-x-auto no-scrollbar">
                                    <pre className="text-xs sm:text-base leading-relaxed"><code className="language-typescript">
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

                {/* Inspiration Gallery - Apple/SF Startup Aesthetic */}
                <section className="py-24 sm:py-40 bg-[#F5F5F7] mx-3 sm:mx-8 rounded-[2.5rem] sm:rounded-[4rem] overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 sm:px-12">
                        <div className="max-w-3xl mb-16 sm:mb-24">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-[10px] font-bold uppercase tracking-widest text-black/50 mb-6"
                            >
                                <SparklesIcon size={12} />
                                Inspiration
                            </motion.div>
                            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 text-[#1D1D1F] leading-[1.1]">
                                Infinite possibilities. <br />
                                <span className="text-black/30">Built with x402.</span>
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-500 leading-relaxed max-w-xl">
                                From autonomous agent marketplaces to gated silicon compute.
                                The future of micropayments is here.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 lg:auto-rows-[240px]">
                            {[
                                {
                                    icon: <Globe02Icon className="w-5 h-5" />,
                                    title: "Gated APIs",
                                    desc: "Monetize every request with zero friction. Perfect for LLM providers and serverless endpoints.",
                                    image: "/inspiration-gated-new.png",
                                    className: "md:col-span-8 md:row-span-2",
                                    color: "from-blue-500/80 to-blue-600/80"
                                },
                                {
                                    icon: <SparklesIcon className="w-5 h-5" />,
                                    title: "Hierarchies",
                                    desc: "Agents hiring agents.",
                                    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
                                    className: "md:col-span-4 md:row-span-1",
                                    color: "from-purple-500/80 to-purple-600/80"
                                },
                                {
                                    icon: <ZapIcon className="w-5 h-5" />,
                                    title: "Metered Compute",
                                    desc: "Pay for GPU ms.",
                                    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1200&auto=format&fit=crop",
                                    className: "md:col-span-4 md:row-span-2",
                                    color: "from-orange-500/80 to-orange-600/80"
                                },
                                {
                                    icon: <Share01Icon className="w-5 h-5" />,
                                    title: "Data Markets",
                                    desc: "Autonomous datasets.",
                                    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop",
                                    className: "md:col-span-4 md:row-span-1",
                                    color: "from-green-500/80 to-green-600/80"
                                },
                                {
                                    icon: <Settings01Icon className="w-5 h-5" />,
                                    title: "Tool Rental",
                                    desc: "On-demand high precision.",
                                    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1200&auto=format&fit=crop",
                                    className: "md:col-span-4 md:row-span-1",
                                    color: "from-pink-500/80 to-pink-600/80"
                                },
                                {
                                    icon: <LockPasswordIcon className="w-5 h-5" />,
                                    title: "Model Fine-tuning Access",
                                    desc: "Gate specialized intelligence with on-chain verification and anti-replay protection.",
                                    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
                                    className: "md:col-span-8 md:row-span-1",
                                    color: "from-indigo-500/80 to-indigo-600/80"
                                }
                            ].map((item, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                                    key={i}
                                    className={`group relative min-h-[320px] md:min-h-0 rounded-[2rem] overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700 hover:-translate-y-1 cursor-default ${item.className}`}
                                >
                                    {/* Background Image with sophisticated zoom and parallax-ish feel */}
                                    <div className="absolute inset-0">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                        {/* Subtle overlay to ensure text readability */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/5 to-black/60 pointer-events-none" />
                                    </div>

                                    {/* Content Overlay */}
                                    <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-10">
                                        <div className="relative z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                            <div className={`w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-4 text-white shadow-xl opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-500`}>
                                                {item.icon}
                                            </div>
                                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight group-hover:mb-3 transition-all duration-500">{item.title}</h3>
                                            <p className="text-white/70 text-sm sm:text-base font-medium leading-relaxed max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Premium Border Shine */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ring-1 ring-inset ring-white/20 rounded-[2rem]" />
                                </motion.div>
                            ))}
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
                            className="mb-12 sm:mb-16 block group relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-16px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30 opacity-100" />

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 sm:p-14 gap-8 sm:gap-10">
                                <div className="max-w-2xl text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 backdrop-blur-md mb-6 border border-black/5">
                                        <SparklesIcon size={14} className="text-black" />
                                        <span className="text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase text-gray-600">Autonomous Agent</span>
                                    </div>

                                    <h3 className="text-3xl sm:text-5xl font-semibold text-[#1D1D1F] tracking-tight mb-4 leading-[1.1]">
                                        Experience the future <br className="hidden sm:block" />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">of AI commerce.</span>
                                    </h3>

                                    <p className="text-base sm:text-xl text-gray-500 font-light leading-relaxed max-w-lg">
                                        Chat with an agent that pays its own way. <br className="hidden md:block" />
                                        Zero friction. Autonomous execution.
                                    </p>
                                </div>

                                <div className="relative group-hover:scale-105 transition-transform duration-700 ease-[0.16,1,0.3,1] scale-90 sm:scale-100">
                                    {/* Abstract UI representation */}
                                    <div className="w-56 sm:w-64 aspect-[4/3] rounded-2xl bg-white shadow-2xl border border-gray-100 p-4 flex flex-col gap-3 rotate-3 group-hover:rotate-6 transition-transform duration-500">
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

                                    <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6">
                                        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-black text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                                            <ArrowRight01Icon size={20} className="sm:size-24" />
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

                {/* Deploy Your Own Facilitator */}
                <section className="py-24 sm:py-32 bg-gradient-to-b from-gray-50 to-white mx-3 sm:mx-8 rounded-[2.5rem] overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 sm:px-12">
                        <div className="max-w-3xl mb-12 sm:mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-[10px] font-bold uppercase tracking-widest text-black/50 mb-6"
                            >
                                <Database01Icon size={12} />
                                Self-Sovereign
                            </motion.div>
                            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6 text-[#1D1D1F] leading-[1.1]">
                                Deploy your own <br />
                                <span className="text-black/30">facilitator.</span>
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-500 leading-relaxed max-w-xl">
                                Don't rely on third parties. Self-host your own x402 payment verification server with one click.
                                Open source, zero fees, full control.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                {
                                    name: 'Railway',
                                    color: 'from-black to-gray-800',
                                    url: 'https://railway.app/new/template?template=https://github.com/AlleyBo55/oneclick-x402-facilitator-solana',
                                    icon: (
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M.113 10.27A13.026 13.026 0 000 11.48h18.23c-.064-.125-.15-.237-.235-.347-3.117-4.027-4.793-3.677-7.19-3.78-.8-.034-1.34-.048-4.524-.048-1.704 0-3.555.005-5.358.01-.234.63-.459 1.24-.567 1.737h9.342v1.216H.113v.002zm18.26 2.426H.009c.02.326.05.645.094.961h16.955c.754 0 1.179-.429 1.315-.96zm-17.318 4.28s2.81 6.902 10.93 7.024c4.855 0 9.027-2.883 10.92-7.024H1.056zM11.988 0C7.5 0 3.593 2.466 1.531 6.108l4.75-.005v-.002c3.71 0 3.849.016 4.573.047l.448.016c1.563.052 3.485.22 4.996 1.364.82.621 2.007 1.99 2.712 2.965.654.902.842 1.94.396 2.934-.408.914-1.289 1.458-2.353 1.458H.391s.099.42.249.886h22.748A12.026 12.026 0 0024 12.005C24 5.377 18.621 0 11.988 0z" />
                                        </svg>
                                    ),
                                },
                            ].map((platform, i) => (
                                <motion.a
                                    key={platform.name}
                                    href={platform.url}
                                    target="_blank"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                                    <div className="relative z-10 flex flex-col items-center text-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${platform.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            {platform.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-[#1D1D1F]">{platform.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1">Deploy now →</p>
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                            <a
                                href="https://github.com/AlleyBo55/oneclick-x402-facilitator-solana"
                                target="_blank"
                                className="text-gray-500 hover:text-black transition-colors flex items-center gap-2"
                            >
                                <SourceCodeIcon size={16} />
                                View Source on GitHub
                            </a>
                            <span className="hidden sm:inline text-gray-300">•</span>
                            <span className="text-gray-400 flex items-center gap-2">
                                <Shield02Icon size={16} />
                                MIT Licensed • Zero Fees
                            </span>
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
