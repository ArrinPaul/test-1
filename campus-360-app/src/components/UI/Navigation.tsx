import React from 'react';
import { useTourState } from '../../hooks/useTourState';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navigation: React.FC = () => {
    const { manifest, currentBlockId, currentImageId, setImage } = useTourState();

    if (!manifest || !currentBlockId || !currentImageId) return null;

    const currentBlock = manifest.blocks.find((b: any) => b.id === currentBlockId);
    if (!currentBlock || !currentBlock.labs) return null;

    const currentIndex = currentBlock.labs.findIndex((l: any) => l.id === currentImageId);

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % currentBlock.labs.length;
        setImage(currentBlock.labs[nextIndex].id);
    };

    const handlePrev = () => {
        const prevIndex = (currentIndex - 1 + currentBlock.labs.length) % currentBlock.labs.length;
        setImage(currentBlock.labs[prevIndex].id);
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.15, x: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                className="absolute left-[22rem] top-1/2 -translate-y-1/2 p-4 rounded-full bg-gradient-to-br from-indigo-500/25 to-purple-500/25 backdrop-blur-xl border border-white/30 text-white hover:border-white/50 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(102,126,234,0.5)] group"
                style={{ backdropFilter: 'blur(20px)' }}
            >
                <ChevronLeft size={28} className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.15, x: 4 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-gradient-to-br from-indigo-500/25 to-purple-500/25 backdrop-blur-xl border border-white/30 text-white hover:border-white/50 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(102,126,234,0.5)] group"
                style={{ backdropFilter: 'blur(20px)' }}
            >
                <ChevronRight size={28} className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            </motion.button>
        </>
    );
};
