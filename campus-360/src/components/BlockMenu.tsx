import React, { useEffect, useState } from 'react';
import { getManifest } from '../lib/api';
import type { Manifest, Block } from '../lib/types';
import { useNavigate } from 'react-router-dom';

export default function BlockMenu({ onHover }: { onHover?: (thumb?: string) => void }) {
    const [manifest, setManifest] = useState<Manifest | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        getManifest().then(m => setManifest(m)).catch(() => {});
    }, []);

    if (!manifest) return null;

    return (
        <div className="absolute left-4 top-1/4 z-20">
            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {manifest.blocks.map((b: Block) => (
                    <button
                        key={b.id}
                        onClick={() => {
                            // navigate to first lab of the block
                            if (b.labs && b.labs.length) navigate(`/viewer/${b.labs[0].id}`);
                        }}
                        onMouseEnter={() => onHover && onHover(b.labs?.[0]?.thumbnail)}
                        onMouseLeave={() => onHover && onHover(undefined)}
                        className="flex items-center gap-3 w-40 bg-white/8 hover:bg-white/16 text-white backdrop-blur-md rounded-lg px-3 py-2 transition-all duration-300 pointer-events-auto border border-white/10 hover:border-white/30"
                    >
                        <div className="w-12 h-8 bg-slate-700 rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                            {b.labs?.[0]?.thumbnail ? (
                                <img src={b.labs[0].thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-white/40 text-xs">IMG</div>
                            )}
                        </div>
                        <div className="text-sm text-white/95 truncate font-medium">{b.label}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}
