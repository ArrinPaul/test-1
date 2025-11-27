import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getManifest } from '../lib/api';
import type { Manifest, Lab, Block } from '../lib/types';
import { Search, MapPin } from 'lucide-react';

export default function GlobalSearch() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ lab: Lab; block: Block }[]>([]);
    const [manifest, setManifest] = useState<Manifest | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getManifest().then(setManifest);

        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!query || !manifest) {
            setResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const hits: { lab: Lab; block: Block }[] = [];

        manifest.blocks.forEach(block => {
            block.labs.forEach(lab => {
                if (
                    lab.label.toLowerCase().includes(lowerQuery) ||
                    lab.id.toLowerCase().includes(lowerQuery) ||
                    lab.meta?.equipment?.some((e: string) => e.toLowerCase().includes(lowerQuery))
                ) {
                    hits.push({ lab, block });
                }
            });
        });

        setResults(hits.slice(0, 5)); // Limit to 5 results
        setIsOpen(true);
    }, [query, manifest]);

    return (
        <div className="relative w-64" ref={wrapperRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                    type="text"
                    placeholder="Search campus..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => query && setIsOpen(true)}
                    className="w-full pl-9 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
            </div>

            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden z-50">
                    {results.map(({ lab, block }) => (
                        <div
                            key={lab.id}
                            onClick={() => {
                                navigate(`/lab/${lab.id}`);
                                setIsOpen(false);
                                setQuery("");
                            }}
                            className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                        >
                            <div className="font-medium text-slate-800 text-sm">{lab.label}</div>
                            <div className="text-xs text-slate-500 flex items-center mt-1">
                                <MapPin size={10} className="mr-1" />
                                {block.label} • Floor {lab.meta?.floor || '?'}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
