import React, { useState } from 'react';
import { useTourState } from '../../hooks/useTourState';
import { motion } from 'framer-motion';
import { Search, Clock } from 'lucide-react';

export const Menu: React.FC = () => {
    const { manifest, currentBlockId, setBlock, setImage, history } = useTourState();
    const [searchTerm, setSearchTerm] = useState('');
    const [showHistory, setShowHistory] = useState(false);

    if (!manifest) return null;

    const handleBlockClick = (block: any) => {
        setBlock(block.id);
        if (block.labs && block.labs.length > 0) {
            setImage(block.labs[0].id);
        }
    };

    const handleHistoryClick = (imageId: string) => {
        // Find the block containing this image
        for (const block of manifest.blocks) {
            const found = block.labs.find((lab: any) => lab.id === imageId);
            if (found) {
                setBlock(block.id);
                setImage(imageId);
                break;
            }
        }
    };

    const filteredBlocks = manifest.blocks.filter((block: any) =>
        block.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const historyItems = history.map((imageId: string) => {
        for (const block of manifest.blocks) {
            const found = block.labs.find((lab: any) => lab.id === imageId);
            if (found) return { imageId, label: found.label, blockLabel: block.label };
        }
        return null;
    }).filter(Boolean);

    return (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 max-h-[80vh] w-80">
            {/* Search Bar */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white/70 transition-colors z-10" size={18} />
                <input
                    type="text"
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:shadow-[0_0_20px_rgba(102,126,234,0.3)] transition-all duration-300"
                    style={{ fontWeight: 500 }}
                />
            </div>

            {/* History Toggle */}
            {history.length > 0 && (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-2xl text-white/80 hover:text-white hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(102,126,234,0.4)]"
                >
                    <Clock size={18} />
                    <span className="text-sm font-medium">Recent ({history.length})</span>
                </motion.button>
            )}

            {/* Recent History */}
            {showHistory && historyItems.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-2 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl"
                >
                    <p className="text-xs text-white/60 uppercase tracking-wider font-semibold mb-1">Recent Visits</p>
                    {historyItems.map((item: any, idx: number) => (
                        <motion.button
                            key={idx}
                            whileHover={{ x: 4 }}
                            onClick={() => handleHistoryClick(item.imageId)}
                            className="text-left p-3 rounded-xl hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-white/10"
                        >
                            <p className="text-white text-sm font-medium">{item.blockLabel}</p>
                            <p className="text-white/50 text-xs mt-0.5">{item.label}</p>
                        </motion.button>
                    ))}
                </motion.div>
            )}

            <div className="flex flex-col gap-3 overflow-y-auto pr-2 scrollbar-hide">
                {filteredBlocks.map((block: any) => (
                    <motion.button
                        key={block.id}
                        whileHover={{ scale: 1.03, x: 6 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleBlockClick(block)}
                        className={`
              relative p-5 rounded-2xl backdrop-blur-xl border transition-all duration-300 text-left group overflow-hidden
              ${currentBlockId === block.id
                                ? 'bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border-white/40 text-white shadow-[0_8px_32px_rgba(102,126,234,0.4)]'
                                : 'bg-gradient-to-br from-white/8 to-white/4 border-white/15 text-white/80 hover:border-white/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]'}
            `}
                    >
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-1" style={{ letterSpacing: '-0.02em' }}>{block.label}</h3>
                            <p className="text-xs opacity-70 font-medium">{block.labs?.length || 0} Locations</p>
                        </div>

                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                            style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                                transform: 'translateX(-100%)',
                                animation: currentBlockId === block.id ? 'none' : ''
                            }}
                        />
                    </motion.button>
                ))}

                {filteredBlocks.length === 0 && (
                    <div className="text-white/50 text-center py-8 text-sm">
                        No locations found
                    </div>
                )}
            </div>
        </div>
    );
};
