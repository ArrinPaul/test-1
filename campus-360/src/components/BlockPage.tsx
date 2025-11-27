import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBlock } from '../lib/api';
import type { Block } from '../lib/types';
import { ArrowLeft, Search } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import { logPageView } from '../lib/analytics';

export default function BlockPage() {
    const { blockId } = useParams();
    const [block, setBlock] = useState<Block | undefined>();
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (blockId) {
            logPageView(`block_view:${blockId}`);
            getBlock(blockId).then(setBlock);
        }
    }, [blockId]);

    if (!block) return <div className="p-8">Loading...</div>;

    const filteredLabs = block.labs.filter(lab =>
        lab.label.toLowerCase().includes(search.toLowerCase()) ||
        lab.meta?.equipment?.some(e => e.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-5xl mx-auto">
                <Breadcrumbs />

                {/* Header */}
                <div className="mb-8 flex items-center justify-between mt-4">
                    <div>
                        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-2">
                            <ArrowLeft size={16} className="mr-1" /> Back to Map
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900">{block.label}</h1>
                        <p className="text-slate-500">{block.short}</p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search labs..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                            aria-label="Search labs in this block"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLabs.map(lab => (
                        <div
                            key={lab.id}
                            onClick={() => navigate(`/lab/${lab.id}`)}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer hover:shadow-md transition-all group"
                            role="button"
                            tabIndex={0}
                            aria-label={`View ${lab.label}`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    navigate(`/lab/${lab.id}`);
                                }
                            }}
                        >
                            <div className="h-48 bg-slate-200 relative overflow-hidden">
                                <img
                                    src={lab.thumbnail || lab.panorama}
                                    alt={lab.label}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </div>

                            <div className="p-4">
                                <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{lab.label}</h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {lab.meta?.floor && (
                                        <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">Floor {lab.meta.floor}</span>
                                    )}
                                    {lab.meta?.equipment?.map((eq: string) => (
                                        <span key={eq} className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded">{eq}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredLabs.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        No labs found matching "{search}"
                    </div>
                )}
            </div>
        </div>
    );
}
