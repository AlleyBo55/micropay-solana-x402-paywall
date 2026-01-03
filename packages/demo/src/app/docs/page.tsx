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

const LightningIcon = ZapIcon;

const sections = [
    { id: 'intro', title: 'Introduction' },
    { id: 'demo-features', title: 'Features Demonstrated' },

    { id: 'installation', title: 'Installation' },
    { id: 'quick-start', title: 'Quick Start' },
    { id: 'configuration', title: 'Configuration' },
    { id: 'rpc-fallback', title: 'RPC Fallback (v2.1)' },
    { id: 'priority-fees', title: 'Priority Fees (v2.1)' },
    { id: 'versioned-tx', title: 'Versioned Transactions (v2.1)' },
    { id: 'payment-flow', title: 'The x402 Flow' },
    { id: 'spl-tokens', title: 'SPL Token Payments' },
    { id: 'middleware', title: 'Middleware' },
    { id: 'signature-store', title: 'Signature Store' },
    { id: 'pricing', title: 'Price Conversion' },
    { id: 'client-helpers', title: 'Client Helpers' },
    { id: 'retry-logic', title: 'Retry Logic' },
    { id: 'api-reference', title: 'Full API Reference' },
    { id: 'roadmap', title: 'Roadmap & Future' },
];

function CodeBlock({ code, language = 'typescript' }: { code: string; language?: string }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Syntax highlighting for JS/TS
    const highlightCode = (source: string) => {
        const tokens: { type: string; value: string }[] = [];
        let remaining = source;

        const patterns: [RegExp, string][] = [
            // Comments
            [/^(\/\/[^\n]*)/, 'comment'],
            [/^(\/\*[\s\S]*?\*\/)/, 'comment'],
            // Strings
            [/^('(?:[^'\\]|\\.)*')/, 'string'],
            [/^("(?:[^"\\]|\\.)*")/, 'string'],
            [/^(`(?:[^`\\]|\\.)*`)/, 'string'],
            // Keywords
            [/^(import|export|from|const|let|var|function|async|await|return|if|else|for|while|class|extends|new|try|catch|throw|typeof|interface|type|enum|namespace|declare|readonly|public|private|protected|static|get|set|implements|abstract|as|is|in|of|default|case|switch|break|continue|yield|void|null|undefined|true|false)\b/, 'keyword'],
            // Types (capitalized words, common TS types)
            [/^(string|number|boolean|any|unknown|never|object|Promise|Array|Record|Partial|Required|Pick|Omit|Readonly|Map|Set|Date|Error|Response|Request|Headers)\b/, 'type'],
            // Decorators / @ symbols
            [/^(@\w+)/, 'decorator'],
            // Numbers
            [/^(\d+(?:_\d+)*(?:\.\d+)?(?:n)?(?:e[+-]?\d+)?)/, 'number'],
            // Functions (word followed by paren)
            [/^(\w+)(?=\s*\()/, 'function'],
            // Properties (word followed by colon or .)
            [/^(\w+)(?=\s*:)/, 'property'],
            // Variables/identifiers
            [/^(\w+)/, 'variable'],
            // Operators and punctuation
            [/^([{}[\]();:,.=><!?+\-*/%&|^~@#]+)/, 'punctuation'],
            // Whitespace
            [/^(\s+)/, 'whitespace'],
        ];

        while (remaining.length > 0) {
            let matched = false;
            for (const [pattern, type] of patterns) {
                const match = remaining.match(pattern);
                if (match) {
                    tokens.push({ type, value: match[1] });
                    remaining = remaining.slice(match[0].length);
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                tokens.push({ type: 'plain', value: remaining[0] });
                remaining = remaining.slice(1);
            }
        }

        return tokens;
    };

    const colorMap: Record<string, string> = {
        keyword: 'text-purple-400',
        string: 'text-green-400',
        comment: 'text-gray-500 italic',
        number: 'text-orange-400',
        function: 'text-blue-400',
        type: 'text-cyan-400',
        decorator: 'text-yellow-400',
        property: 'text-sky-300',
        variable: 'text-gray-200',
        punctuation: 'text-gray-400',
        whitespace: '',
        plain: 'text-gray-300',
    };

    const tokens = highlightCode(code);

    return (
        <div className="relative group">
            <button
                onClick={copy}
                className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
            >
                {copied ? <CheckmarkCircle01Icon size={16} className="text-green-400" /> : <Copy01Icon size={16} className="text-gray-400" />}
            </button>
            <div className="bg-[#0D0D0D] rounded-xl p-5 font-mono text-sm overflow-x-auto shadow-xl ring-1 ring-white/10">
                <pre className="whitespace-pre-wrap">
                    {tokens.map((token, i) => (
                        <span key={i} className={colorMap[token.type] || 'text-gray-300'}>
                            {token.value}
                        </span>
                    ))}
                </pre>
            </div>
        </div>
    );
}

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState('intro');

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
                        <span className="hidden md:inline text-xs font-mono bg-green-100 text-green-700 px-2 py-1 rounded-full">v2.1.0</span>
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
                            <code className="text-purple-600 font-semibold bg-purple-50 px-1 py-0.5 rounded">@alleyboss/micropay-solana-x402-paywall</code> is a production-ready implementation of the HTTP 402 Payment Required protocol for Solana.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4 mb-8">
                            <div className="p-4 bg-white rounded-xl border border-black/5 shadow-sm">
                                <div className="text-2xl mb-2">💰</div>
                                <div className="font-bold">SOL & USDC</div>
                                <div className="text-sm text-gray-500">Native and SPL tokens</div>
                            </div>
                            <div className="p-4 bg-white rounded-xl border border-black/5 shadow-sm">
                                <div className="text-2xl mb-2">🔐</div>
                                <div className="font-bold">JWT Sessions</div>
                                <div className="text-sm text-gray-500">Secure unlock tracking</div>
                            </div>
                            <div className="p-4 bg-white rounded-xl border border-black/5 shadow-sm">
                                <div className="text-2xl mb-2">⚡</div>
                                <div className="font-bold">Zero Boilerplate</div>
                                <div className="text-sm text-gray-500">Express & Next.js ready</div>
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
                            This demo application showcases the full capabilities of the x402 paywall library in a production-ready Next.js environment:
                        </p>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
                                <h3 className="font-bold text-[#1D1D1F] mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                                    Core Payments
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5"></span>
                                        Article unlocking via SOL micro-transactions
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5"></span>
                                        Real-time on-chain payment verification
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5"></span>
                                        QR code generation for mobile wallet support
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
                                <h3 className="font-bold text-[#1D1D1F] mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                                    Advanced Features
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5"></span>
                                        <strong>JWT Session Management</strong> (24-hour access)
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5"></span>
                                        <strong>RPC Fallback</strong> reliability system
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5"></span>
                                        Environment-based configuration (Devnet/Mainnet)
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Installation */}
                    <section id="installation" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><CodeCircleIcon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Installation</h2>
                        </div>
                        <CodeBlock code="npm install @alleyboss/micropay-solana-x402-paywall @solana/web3.js" />
                        <p className="text-gray-500 mt-4 text-sm">
                            The library uses <code className="bg-gray-100 px-1 rounded">@solana/web3.js</code> as a peer dependency to keep bundle size minimal.
                        </p>
                    </section>

                    {/* Quick Start */}
                    <section id="quick-start" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><LightningIcon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Quick Start</h2>
                        </div>
                        <p className="text-gray-600 mb-6">Verify a payment and create a session in 3 lines:</p>
                        <CodeBlock code={`import { verifyPayment, createSession } from '@alleyboss/micropay-solana-x402-paywall';

// 1. Verify the on-chain payment
const result = await verifyPayment({
  signature: 'TX_SIGNATURE_FROM_CLIENT',
  expectedRecipient: 'YOUR_WALLET_ADDRESS',
  expectedAmount: 10_000_000n, // 0.01 SOL in lamports
  clientConfig: { network: 'mainnet-beta' },
});

// 2. Create session if valid
if (result.valid) {
  const { token } = await createSession(
    result.from!, // payer wallet
    'article-123',
    { secret: process.env.SESSION_SECRET!, durationHours: 24 }
  );
  
  // 3. Set cookie and return content
  cookies().set('x402_session', token, { httpOnly: true });
}`} />
                    </section>

                    {/* Configuration */}
                    <section id="configuration" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gray-100 text-gray-600 rounded-lg"><Settings01Icon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Configuration</h2>
                        </div>

                        <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm mb-6">
                            <h3 className="font-semibold mb-4">RPC Providers</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                For production, use a dedicated RPC provider instead of public endpoints:
                            </p>
                            <ul className="grid grid-cols-2 gap-3 mb-6">
                                {['Helius', 'QuickNode', 'Triton', 'Tatum', 'Alchemy', 'Custom RPC'].map(p => (
                                    <li key={p} className="flex items-center gap-2 text-sm text-gray-600">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span> {p}
                                    </li>
                                ))}
                            </ul>
                            <CodeBlock code={`// SolanaClientConfig
const clientConfig = {
  network: 'mainnet-beta', // or 'devnet'
  
  // Option 1: Custom RPC URL (recommended)
  rpcUrl: 'https://mainnet.helius-rpc.com/?api-key=YOUR_KEY',
  
  // Option 2: Tatum API Key
  tatumApiKey: 'YOUR_TATUM_KEY',
};`} />
                        </div>

                        <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-semibold mb-4">Environment Variables</h3>
                            <CodeBlock code={`# .env.local

# Required: Session JWT Secret (min 32 chars)
SESSION_SECRET=your-super-secret-key-min-32-characters

# Required: Your creator wallet address
CREATOR_WALLET=YourSolanaWalletAddress

# Required: Network
SOLANA_NETWORK=mainnet-beta # or devnet

# Optional: Custom RPC
NEXT_PUBLIC_RPC_URL=https://your-rpc-endpoint.com

# Optional: Article price (lamports)
ARTICLE_PRICE=10000000 # 0.01 SOL`} />
                        </div>
                    </section>

                    {/* RPC Fallback - NEW v2.1 */}
                    <section id="rpc-fallback" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><RefreshIcon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">RPC Fallback <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full ml-2">v2.1</span></h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Automatic failover to backup RPC endpoints on network errors. <strong>Disabled by default</strong> for backward compatibility.
                        </p>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                            <p className="text-sm text-yellow-800">
                                <strong>💡 When to enable:</strong> Production apps with high availability requirements. Fallback triggers on 429 (rate limit), 503 (service unavailable), timeouts, and connection errors.
                            </p>
                        </div>

                        <CodeBlock code={`import { getConnection, withFallback } from '@alleyboss/micropay-solana-x402-paywall/solana';

// Configure with fallback RPCs
const config = {
  network: 'mainnet-beta',
  rpcUrl: 'https://api.mainnet-beta.solana.com',
  enableFallback: true, // default: false
  fallbackRpcUrls: [
    'https://rpc.ankr.com/solana',
    'https://solana-mainnet.g.alchemy.com/v2/demo',
  ],
};

// Option 1: Simple connection (manual failover)
const connection = getConnection(config);

// Option 2: Automatic failover wrapper
const balance = await withFallback(config, (conn) => 
  conn.getBalance(publicKey)
);`} />

                        <div className="mt-6 bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-semibold mb-4">Configuration Options</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><code className="font-mono bg-gray-100 px-1 rounded">enableFallback</code> — Enable automatic failover (default: <code>false</code>)</li>
                                <li><code className="font-mono bg-gray-100 px-1 rounded">fallbackRpcUrls</code> — Array of backup RPC endpoints, tried in order</li>
                            </ul>
                        </div>
                    </section>

                    {/* Priority Fees - NEW v2.1 */}
                    <section id="priority-fees" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><LightningIcon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Priority Fees <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full ml-2">v2.1</span></h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Add compute budget instructions to land transactions faster during network congestion. <strong>Disabled by default</strong>.
                        </p>

                        <CodeBlock code={`import {
  createPriorityFeeInstructions,
  estimatePriorityFee,
  calculatePriorityFeeCost,
} from '@alleyboss/micropay-solana-x402-paywall/solana';

// Create priority fee instructions
const instructions = createPriorityFeeInstructions({
  enabled: true,        // default: false
  microLamports: 5000,  // price per compute unit
  computeUnits: 200_000, // max compute units
});

// Prepend to your transaction
transaction.add(...instructions, ...yourInstructions);

// Auto-estimate based on recent network activity
const connection = getConnection(config);
const estimatedFee = await estimatePriorityFee(connection, [recipientPubkey]);

// Calculate total cost
const cost = calculatePriorityFeeCost(5000, 200_000);
// → 1000 lamports (5000 × 200,000 / 1,000,000)`} />

                        <div className="mt-6 grid md:grid-cols-2 gap-4">
                            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-semibold mb-3">PriorityFeeConfig</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li><code className="font-mono bg-gray-100 px-1 rounded">enabled</code> — Enable fees (default: <code>false</code>)</li>
                                    <li><code className="font-mono bg-gray-100 px-1 rounded">microLamports</code> — Price per CU</li>
                                    <li><code className="font-mono bg-gray-100 px-1 rounded">computeUnits</code> — Max CUs (default: 200k)</li>
                                </ul>
                            </div>
                            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-semibold mb-3">Typical Values</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li><strong>Low priority:</strong> 1,000 µL/CU</li>
                                    <li><strong>Medium:</strong> 5,000 µL/CU</li>
                                    <li><strong>High priority:</strong> 10,000+ µL/CU</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Versioned Transactions - NEW v2.1 */}
                    <section id="versioned-tx" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><CodeCircleIcon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Versioned Transactions <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full ml-2">v2.1</span></h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Build v0 versioned transactions with optional address lookup tables and priority fees.
                        </p>

                        <CodeBlock code={`import {
  buildVersionedTransaction,
  fetchLookupTables,
  isVersionedTransaction,
} from '@alleyboss/micropay-solana-x402-paywall/solana';

// Build a versioned transaction
const { transaction, blockhash, lastValidBlockHeight } = await buildVersionedTransaction({
  connection,
  payer: wallet.publicKey,
  instructions: [transferInstruction],
  // Optional: add priority fees
  priorityFee: { enabled: true, microLamports: 5000 },
  // Optional: use address lookup tables for compression
  lookupTables: await fetchLookupTables(connection, [tableAddress]),
});

// Sign with your wallet
transaction.sign([wallet]);

// Send and confirm
const signature = await connection.sendTransaction(transaction);
await connection.confirmTransaction({
  signature,
  blockhash,
  lastValidBlockHeight,
});`} />

                        <div className="mt-6 bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-semibold mb-4">VersionedTransactionConfig</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><code className="font-mono bg-gray-100 px-1 rounded">connection</code> — Solana connection</li>
                                <li><code className="font-mono bg-gray-100 px-1 rounded">payer</code> — Fee payer public key</li>
                                <li><code className="font-mono bg-gray-100 px-1 rounded">instructions</code> — Array of instructions</li>
                                <li><code className="font-mono bg-gray-100 px-1 rounded">lookupTables?</code> — Address lookup tables for compression</li>
                                <li><code className="font-mono bg-gray-100 px-1 rounded">priorityFee?</code> — Priority fee config</li>
                                <li><code className="font-mono bg-gray-100 px-1 rounded">recentBlockhash?</code> — Optional (fetched if not provided)</li>
                            </ul>
                        </div>
                    </section>

                    {/* Visual Payment Flow Diagram */}
                    <section id="payment-flow" className="mb-20 scroll-mt-24">
                        <div className="bg-white border border-black/5 rounded-2xl p-8 shadow-sm overflow-x-auto">
                            <div className="min-w-[600px] flex flex-col items-center">
                                {/* Diagram Header */}
                                <div className="flex w-full justify-between px-12 mb-8 text-sm font-bold text-gray-400 uppercase tracking-wider">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-laptop"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" /></svg>
                                        </div>
                                        <span>Client</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-server"><rect width="20" height="8" x="2" y="2" rx="2" ry="2" /><rect width="20" height="8" x="2" y="14" rx="2" ry="2" /><line x1="6" x2="6.01" y1="6" y2="6" /><line x1="6" x2="6.01" y1="18" y2="18" /></svg>
                                        </div>
                                        <span>Server (x402)</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cuboid"><path d="m21.12 6.4-6.05-4.06a2 2 0 0 0-2.17-.05L2.95 8.41a2 2 0 0 0-.95 1.7v5.36a2 2 0 0 0 .95 1.7l9.95 6.12a2 2 0 0 0 2.17-.05l9.1-6.12a2 2 0 0 0 .95-1.7v-5.36a2 2 0 0 0-.95-1.7z" /></svg>
                                        </div>
                                        <span>Solana</span>
                                    </div>
                                </div>

                                {/* Flow Lines */}
                                <div className="relative w-full space-y-8 text-xs font-medium text-gray-600">
                                    {/* Step 1: Request */}
                                    <div className="relative flex items-center">
                                        <div className="absolute left-[12%] right-[50%] h-px bg-gray-200"></div>
                                        <div className="relative z-10 w-full flex justify-center text-center">
                                            <span className="bg-white px-3 py-1 border border-gray-200 rounded-full shadow-sm text-gray-900">
                                                1. Request content
                                            </span>
                                        </div>
                                        <div className="absolute right-[50%] -mt-1 w-2 h-2 border-t border-r border-gray-200 rotate-45 transform translate-x-1/2"></div>
                                    </div>

                                    {/* Step 2: 402 Response */}
                                    <div className="relative flex items-center">
                                        <div className="absolute left-[12%] right-[50%] h-px bg-gray-200 border-t border-dashed border-gray-300"></div>
                                        <div className="relative z-10 w-full flex justify-center text-center">
                                            <span className="bg-white px-3 py-1 border border-gray-200 rounded-full shadow-sm text-red-600 bg-red-50/50">
                                                2. 402 Payment Required
                                            </span>
                                        </div>
                                        <div className="absolute left-[12%] -mt-1 w-2 h-2 border-l border-b border-gray-300 rotate-45 transform -translate-x-1/2"></div>
                                    </div>

                                    {/* Step 3: Transaction */}
                                    <div className="relative flex items-center">
                                        <div className="absolute left-[12%] right-[12%] h-px bg-green-200"></div>
                                        <div className="relative z-10 w-full flex justify-center text-center">
                                            <span className="bg-white px-3 py-1 border border-green-200 rounded-full shadow-sm text-green-700 bg-green-50">
                                                3. Sign & Send Transaction
                                            </span>
                                        </div>
                                        <div className="absolute right-[12%] -mt-1 w-2 h-2 border-t border-r border-green-300 rotate-45 transform translate-x-1/2"></div>
                                    </div>

                                    {/* Step 4: Verify */}
                                    <div className="relative flex items-center">
                                        <div className="absolute left-[12%] right-[50%] h-px bg-gray-200"></div>
                                        <div className="relative z-10 w-full flex justify-center text-center">
                                            <span className="bg-white px-3 py-1 border border-gray-200 rounded-full shadow-sm">
                                                4. POST /verify &#123;signature&#125;
                                            </span>
                                        </div>
                                        <div className="absolute right-[50%] -mt-1 w-2 h-2 border-t border-r border-gray-200 rotate-45 transform translate-x-1/2"></div>
                                    </div>

                                    {/* Step 5: On-Chain Check */}
                                    <div className="relative flex items-center">
                                        <div className="absolute left-[50%] right-[12%] h-px bg-purple-200 border-t border-dashed border-purple-300"></div>
                                        <div className="relative z-10 w-full flex justify-center pl-[38%] text-center">
                                            <span className="bg-white px-3 py-1 border border-purple-200 rounded-full shadow-sm text-purple-700 bg-purple-50">
                                                5. Verify Tx
                                            </span>
                                        </div>
                                        <div className="absolute left-[50%] -mt-1 w-2 h-2 border-l border-b border-purple-300 rotate-45 transform -translate-x-1/2"></div>
                                    </div>

                                    {/* Step 6: Session */}
                                    <div className="relative flex items-center">
                                        <div className="absolute left-[12%] right-[50%] h-px bg-gray-200 border-t border-dashed border-gray-300"></div>
                                        <div className="relative z-10 w-full flex justify-center text-center">
                                            <span className="bg-white px-3 py-1 border border-gray-200 rounded-full shadow-sm text-indigo-600 bg-indigo-50/50">
                                                6. 200 OK + Set-Cookie (JWT)
                                            </span>
                                        </div>
                                        <div className="absolute left-[12%] -mt-1 w-2 h-2 border-l border-b border-gray-300 rotate-45 transform -translate-x-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SPL Token Payments */}
                    <section id="spl-tokens" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><DollarCircleIcon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">SPL Token Payments</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Accept USDC, USDT, or any custom SPL token. The library handles mint address resolution and token account parsing automatically.
                        </p>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                            <p className="text-sm text-yellow-800">
                                <strong>⚠️ Security Note:</strong> The library validates that tokens are sent to a valid token account, but does not strictly verify the token account's owner via RPC (for performance reasons). For high-value transactions, consider implementing strict owner verification server-side.
                            </p>
                        </div>

                        <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm mb-6">
                            <h3 className="font-semibold mb-4">Built-in Token Mints</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="font-mono text-xs text-gray-400 mb-1">USDC (Mainnet)</div>
                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">EPjFWdd5...USDC</code>
                                </div>
                                <div>
                                    <div className="font-mono text-xs text-gray-400 mb-1">USDC (Devnet)</div>
                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">4zMMC9srt...Devnet</code>
                                </div>
                                <div>
                                    <div className="font-mono text-xs text-gray-400 mb-1">USDT (Mainnet)</div>
                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">Es9vMFrzaCER...USDT</code>
                                </div>
                            </div>
                        </div>

                        <CodeBlock code={`import { verifySPLPayment, TOKEN_MINTS } from '@alleyboss/micropay-solana-x402-paywall';

// Verify USDC payment
const result = await verifySPLPayment({
  signature: 'TX_SIGNATURE',
  expectedRecipient: 'CREATOR_WALLET',
  expectedAmount: 1_000_000n, // 1 USDC (6 decimals)
  asset: 'usdc', // or 'usdt'
  clientConfig: { network: 'mainnet-beta' },
});

// Custom SPL Token
const customResult = await verifySPLPayment({
  signature: 'TX_SIGNATURE',
  expectedRecipient: 'CREATOR_WALLET',
  expectedAmount: 1_000_000_000n,
  asset: {
    mint: 'YOUR_TOKEN_MINT_ADDRESS',
    decimals: 9,
    symbol: 'TOKEN',
  },
  clientConfig: { network: 'mainnet-beta' },
});`} />
                    </section>

                    {/* Middleware */}
                    <section id="middleware" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><ShieldKeyIcon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Middleware</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Zero-boilerplate session validation for Express and Next.js. Automatically validates JWT sessions and returns 402 for protected routes.
                        </p>

                        <div className="space-y-6">
                            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <span className="px-2 py-1 bg-black text-white rounded text-xs">Express</span>
                                    Express / Node.js / Fastify
                                </h3>
                                <CodeBlock code={`import express from 'express';
import { createExpressMiddleware } from '@alleyboss/micropay-solana-x402-paywall/middleware';

const app = express();

// Protect /api/premium/* routes
app.use('/api/premium', createExpressMiddleware({
  sessionSecret: process.env.SESSION_SECRET!,
  protectedPaths: ['/**'], // all paths under /api/premium
  cookieName: 'x402_session', // optional, default
}));

// Access granted - session available on req
app.get('/api/premium/content', (req, res) => {
  res.json({
    content: 'Premium content!',
    wallet: req.session?.walletAddress,
    unlockedAt: req.session?.createdAt,
  });
});`} />
                            </div>

                            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <span className="px-2 py-1 bg-black text-white rounded text-xs">Next.js</span>
                                    Next.js Middleware
                                </h3>
                                <CodeBlock code={`// middleware.ts
import { createPaywallMiddleware } from '@alleyboss/micropay-solana-x402-paywall/middleware';

export const middleware = createPaywallMiddleware({
  sessionSecret: process.env.SESSION_SECRET!,
  protectedPaths: ['/api/premium/*', '/api/content/*'],
});

export const config = {
  matcher: ['/api/premium/:path*', '/api/content/:path*'],
};`} />
                            </div>

                            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs">Fastify</span>
                                    Fastify Plugin
                                </h3>
                                <CodeBlock code={`import Fastify from 'fastify';
import { createFastifyPlugin } from '@alleyboss/micropay-solana-x402-paywall/middleware';

const fastify = Fastify();

fastify.register(createFastifyPlugin({
  sessionSecret: process.env.SESSION_SECRET!,
  protectedPaths: ['/api/premium/*'],
}));`} />
                            </div>
                        </div>
                    </section>

                    {/* Signature Store */}
                    <section id="signature-store" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-100 text-red-600 rounded-lg"><Database01Icon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Signature Store (Anti-Replay)</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Prevent double-unlocks by tracking used transaction signatures. The library provides memory and Redis adapters.
                        </p>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                            <p className="text-sm text-yellow-800">
                                <strong>⚠️ Important:</strong> On-chain verification confirms a transaction happened, but doesn't prevent the same signature from being submitted twice. Use SignatureStore for app-layer replay protection.
                            </p>
                        </div>

                        <CodeBlock code={`import { createMemoryStore, createRedisStore } from '@alleyboss/micropay-solana-x402-paywall/store';

// Development: In-memory store (single instance only)
const store = createMemoryStore({
  cleanupInterval: 60000, // cleanup every minute
});

// Production: Redis store (distributed)
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);
const store = createRedisStore({
  client: redis,
  keyPrefix: 'micropay:sig:',
});

// Usage in verification flow
async function verifyAndUnlock(signature: string, articleId: string) {
  // 1. Check if already used
  if (await store.hasBeenUsed(signature)) {
    throw new Error('Payment already used for this resource');
  }
  
  // 2. Verify on-chain
  const result = await verifyPayment({ signature, ... });
  
  if (result.valid) {
    // 3. Mark as used with expiration
    await store.markAsUsed(
      signature,
      articleId,
      new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    );
    
    // 4. Create session and return content
    return createSession(result.from!, articleId);
  }
}`} />

                        <div className="mt-6 bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-semibold mb-4">SignatureStore Interface</h3>
                            <CodeBlock code={`interface SignatureStore {
  hasBeenUsed(signature: string): Promise<boolean>;
  markAsUsed(signature: string, resourceId: string, expiresAt: Date): Promise<void>;
  getUsage?(signature: string): Promise<SignatureUsage | null>;
}`} />
                        </div>
                    </section>

                    {/* Pricing */}
                    <section id="pricing" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><DollarCircleIcon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Price Conversion</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Convert between USD and SOL with automatic price fetching from multiple providers.
                        </p>

                        <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm mb-6">
                            <h3 className="font-semibold mb-4">Multi-Provider Fallback</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Price is fetched with automatic rotation through reliable providers:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['CoinCap', 'Binance', 'CoinGecko', 'Kraken'].map((p, i) => (
                                    <span key={p} className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                                        {p}
                                        {i < 3 && <ArrowRight01Icon size={12} className="text-gray-400" />}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <CodeBlock code={`import {
  getSolPrice,
  lamportsToUsd,
  usdToLamports,
  formatPriceDisplay,
  configurePricing,
} from '@alleyboss/micropay-solana-x402-paywall/pricing';

// Get current SOL price
const { solPrice, source } = await getSolPrice();
console.log(\`SOL is $\${solPrice} (from \${source})\`);

// Convert amounts
const usd = await lamportsToUsd(10_000_000n); // 0.01 SOL → ~$1.50
const lamports = await usdToLamports(1.50);   // $1.50 → lamports

// Format for display
const display = await formatPriceDisplay(10_000_000n);
// "0.0100 SOL (~$1.50)"

// Custom price provider
configurePricing({
  customProvider: async () => {
    const res = await fetch('https://my-api.com/sol-price');
    return (await res.json()).price;
  },
  cacheTTL: 30000, // 30 seconds
});`} />
                    </section>

                    {/* Client Helpers */}
                    <section id="client-helpers" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><CodeCircleIcon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Client Helpers</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Browser-safe utilities for payment flows. No Node.js dependencies.
                        </p>

                        <CodeBlock code={`import {
  createPaymentFlow,
  buildSolanaPayUrl,
  createPaymentReference,
} from '@alleyboss/micropay-solana-x402-paywall/client';

// Create a payment flow helper
const flow = createPaymentFlow({
  network: 'mainnet-beta',
  recipientWallet: 'CREATOR_WALLET',
  amount: 10_000_000n, // 0.01 SOL
  asset: 'native', // or 'usdc', 'usdt', { mint, decimals, symbol }
});

// Get display amount
flow.getFormattedAmount(); // "0.01 SOL"

// Generate Solana Pay URL for QR codes
const qrUrl = flow.getSolanaPayUrl({
  label: 'Unlock Premium Article',
  reference: createPaymentReference(),
});
// solana:WALLET?amount=0.01&label=Unlock%20Premium%20Article&reference=...

// Get explorer URL for transaction
const explorerUrl = flow.getExplorerUrl('TX_SIGNATURE');
// https://explorer.solana.com/tx/TX_SIGNATURE

// Direct URL builder
const url = buildSolanaPayUrl({
  recipient: 'WALLET',
  amount: 0.01,
  splToken: 'USDC_MINT', // for SPL tokens
  label: 'Payment',
});`} />
                    </section>

                    {/* Retry Logic */}
                    <section id="retry-logic" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><RefreshIcon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Retry Logic</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Handle transient RPC failures with exponential backoff and jitter.
                        </p>

                        <CodeBlock code={`import { withRetry, isRetryableRPCError } from '@alleyboss/micropay-solana-x402-paywall/utils';

// Wrap any async operation
const balance = await withRetry(
  () => connection.getBalance(publicKey),
  {
    maxAttempts: 3,
    baseDelayMs: 500,
    maxDelayMs: 5000,
    retryOn: isRetryableRPCError, // built-in error classifier
  }
);

// Custom retry condition
const result = await withRetry(
  () => fetchPriceFromAPI(),
  {
    maxAttempts: 5,
    retryOn: (error) => error.message.includes('rate limit'),
    onRetry: (attempt, error) => {
      console.log(\`Retry \${attempt}: \${error.message}\`);
    },
  }
);`} />

                        <div className="mt-6 bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-semibold mb-4">RetryOptions</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><code className="font-mono bg-gray-100 px-1 rounded">maxAttempts</code> — Maximum retry attempts (default: 3)</li>
                                <li><code className="font-mono bg-gray-100 px-1 rounded">baseDelayMs</code> — Initial delay in ms (default: 500)</li>
                                <li><code className="font-mono bg-gray-100 px-1 rounded">maxDelayMs</code> — Maximum delay cap (default: 5000)</li>
                                <li><code className="font-mono bg-gray-100 px-1 rounded">retryOn</code> — Function to determine if error is retryable</li>
                                <li><code className="font-mono bg-gray-100 px-1 rounded">onRetry</code> — Callback on each retry attempt</li>
                            </ul>
                        </div>
                    </section>

                    {/* API Reference */}
                    <section id="api-reference" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-gray-100 text-gray-600 rounded-lg"><SecurityCheckIcon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Full API Reference</h2>
                        </div>

                        <div className="space-y-8">
                            {/* Module list */}
                            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-semibold mb-4">Module Exports</h3>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    {[
                                        { path: '@.../solana', fns: 'verifyPayment, verifySPLPayment, getConnection, lamportsToSol' },
                                        { path: '@.../session', fns: 'createSession, validateSession, isArticleUnlocked' },
                                        { path: '@.../x402', fns: 'buildPaymentRequirement, verifyX402Payment, X402_HEADERS' },
                                        { path: '@.../middleware', fns: 'createExpressMiddleware, createPaywallMiddleware' },
                                        { path: '@.../store', fns: 'createMemoryStore, createRedisStore' },
                                        { path: '@.../client', fns: 'createPaymentFlow, buildSolanaPayUrl' },
                                        { path: '@.../pricing', fns: 'getSolPrice, formatPriceDisplay, configurePricing' },
                                        { path: '@.../utils', fns: 'withRetry, isRetryableRPCError' },
                                    ].map((mod) => (
                                        <div key={mod.path} className="p-3 bg-gray-50 rounded-lg">
                                            <div className="font-mono text-xs text-purple-600 mb-1">{mod.path}</div>
                                            <div className="text-gray-600 text-xs">{mod.fns}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Types */}
                            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-semibold mb-4">Key Types</h3>
                                <CodeBlock code={`import type {
  PaymentRequirement,
  PaymentPayload,
  PaymentAsset,
  VerificationResponse,
  SessionData,
  SessionConfig,
  SignatureStore,
  SignatureUsage,
  PriceData,
  SolanaClientConfig,
} from '@alleyboss/micropay-solana-x402-paywall';`} />
                            </div>
                        </div>
                    </section>

                    {/* Roadmap */}
                    <section id="roadmap" className="mb-20 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-pink-100 text-pink-600 rounded-lg"><LightningIcon size={20} /></div>
                            <h2 className="text-2xl font-bold text-[#1D1D1F]">Roadmap & Future</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            The following features are <strong>available in the core library</strong> but are not yet demonstrated in this example app. We plan to add UI demos for these soon:
                        </p>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
                                <h3 className="font-bold text-[#1D1D1F] mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                    Redis Signature Store
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    Production-grade anti-replay protection using Redis.
                                </p>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded block w-fit">import &#123; createRedisStore &#125; from '.../store'</code>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
                                <h3 className="font-bold text-[#1D1D1F] mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                    Express & Fastify Middleware
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    Drop-in middleware for Node.js backend frameworks.
                                </p>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded block w-fit">import &#123; createExpressMiddleware &#125; from '.../middleware'</code>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
                                <h3 className="font-bold text-[#1D1D1F] mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                    Advanced Priority Fees UI
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    User-configurable priority fees in the payment modal.
                                </p>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded block w-fit">PriorityFeeConfig</code>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
                                <h3 className="font-bold text-[#1D1D1F] mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                    Custom SPL Tokens
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    UI for paying with any SPL token mint (e.g., BONK, WIF).
                                </p>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded block w-fit">verifySPLPayment</code>
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
