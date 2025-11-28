import React from 'react';
import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

export const Loader: React.FC = () => {
    const { progress, active } = useProgress();

    return (
        <AnimatePresence>
            {active && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-black"
                >
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                        <p className="text-white font-mono text-sm">{progress.toFixed(0)}% Loading</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
