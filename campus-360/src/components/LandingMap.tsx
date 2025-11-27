import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getManifest } from '../lib/api';
import type { Block } from '../lib/types';
import clsx from 'clsx';

export default function LandingMap() {
    const navigate = useNavigate();
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

    useEffect(() => {
        getManifest().then(m => setBlocks(m.blocks));
    }, []);

    const handleBlockClick = (blockId: string) => {
        navigate(`/block/${blockId}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent, blockId: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            handleBlockClick(blockId);
        }
    };

    return (
        <div className="relative w-full h-full bg-slate-50 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />

            <div className="relative z-10 w-[800px] h-[600px] bg-white rounded-xl shadow-2xl border border-slate-200 p-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-4 absolute top-8 left-8">Campus Map</h1>
                <p className="text-slate-500 absolute top-16 left-8">Select a building to explore</p>

                <svg viewBox="0 0 800 500" className="w-full h-full mt-12">
                    {blocks.map(block => (
                        <g
                            key={block.id}
                            onClick={() => handleBlockClick(block.id)}
                            onMouseEnter={() => setHoveredBlock(block.id)}
                            onMouseLeave={() => setHoveredBlock(null)}
                            className="cursor-pointer group"
                            role="button"
                            tabIndex={0}
                            aria-label={`Explore ${block.label}`}
                            onKeyDown={(e) => handleKeyDown(e, block.id)}
                        >
                            <path
                                d={block.svgPath}
                                className={clsx(
                                    "transition-all duration-300",
                                    hoveredBlock === block.id ? "fill-blue-500" : "fill-slate-700"
                                )}
                            />
                            <circle
                                cx={block.svgAnchor.x}
                                cy={block.svgAnchor.y}
                                r={hoveredBlock === block.id ? 35 : 0}
                                className="fill-blue-500/20 animate-pulse"
                            />

                            {/* Label */}
                            <g transform={`translate(${block.svgAnchor.x}, ${block.svgAnchor.y + 40})`}>
                                <rect
                                    x="-60" y="-15" width="120" height="30" rx="15"
                                    className={clsx(
                                        "transition-all duration-300 fill-white stroke-slate-200",
                                        hoveredBlock === block.id ? "stroke-blue-500 shadow-lg" : "shadow-sm"
                                    )}
                                />
                                <text
                                    x="0" y="5"
                                    textAnchor="middle"
                                    className={clsx(
                                        "text-xs font-bold select-none pointer-events-none transition-colors",
                                        hoveredBlock === block.id ? "fill-blue-600" : "fill-slate-600"
                                    )}
                                >
                                    {block.label}
                                </text>
                            </g>
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
}
