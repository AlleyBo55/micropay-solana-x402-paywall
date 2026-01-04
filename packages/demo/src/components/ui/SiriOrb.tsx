'use client';

import { motion } from 'framer-motion';

interface SiriOrbProps {
    variant?: 'single' | 'dual';
}

export const SiriOrb = ({ variant = 'single' }: SiriOrbProps) => {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Primary Orb (Blue/Purple) */}
            <div className={`relative ${variant === 'dual' ? 'w-1/2 h-full -ml-2' : 'w-full h-full'}`}>
                <OrbCore color="blue" />
            </div>

            {/* Secondary Orb (Orange/Cyan) - Only for Dual Mode */}
            {variant === 'dual' && (
                <div className="relative w-1/2 h-full -ml-4 scale-90">
                    <OrbCore color="orange" delay={1} />
                </div>
            )}
        </div>
    );
};

const OrbCore = ({ color = 'blue', delay = 0 }: { color?: 'blue' | 'orange'; delay?: number }) => {
    const primaryColor = color === 'blue' ? '#3b82f6' : '#f97316'; // Blue-500 vs Orange-500
    const secondaryColor = color === 'blue' ? '#06b6d4' : '#14b8a6'; // Cyan-500 vs Teal-500
    const tertiaryColor = color === 'blue' ? '#a855f7' : '#ef4444'; // Purple-500 vs Red-500
    const quaternaryColor = color === 'blue' ? '#ec4899' : '#eab308'; // Pink-500 vs Yellow-500

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
                className="absolute w-[60%] h-[60%] rounded-full blur-xl opacity-60"
                style={{ backgroundColor: primaryColor }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                    duration: 4,
                    delay: delay,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="absolute w-full h-full rounded-full opacity-50"
                style={{
                    background: `conic-gradient(from 0deg at 50% 50%, transparent 0%, ${secondaryColor} 50%, transparent 100%)`,
                    filter: 'blur(20px)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, delay: delay, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
                className="absolute w-[80%] h-[80%] rounded-full opacity-50"
                style={{
                    background: `conic-gradient(from 180deg at 50% 50%, transparent 0%, ${tertiaryColor} 50%, transparent 100%)`,
                    filter: 'blur(15px)',
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 10, delay: delay, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
                className="absolute w-[90%] h-[90%] rounded-full opacity-40"
                style={{
                    background: `conic-gradient(from 90deg at 50% 50%, transparent 0%, ${quaternaryColor} 50%, transparent 100%)`,
                    filter: 'blur(18px)',
                }}
                animate={{ rotate: 360, scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 12, delay: delay, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="absolute w-[20%] h-[20%] bg-white rounded-full blur-md opacity-80"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, delay: delay, repeat: Infinity }}
            />
        </div>
    );
};
