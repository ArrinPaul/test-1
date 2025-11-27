import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Plus, Search, Settings, User } from 'lucide-react';
import manifestData from '../data/manifest.json';

interface Block {
    id: string;
    label: string;
    short: string;
    labs: any[];
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [blocks, setBlocks] = useState<Block[]>([]);

    useEffect(() => {
        // In a real app, this would be an API call
        setBlocks(manifestData.blocks);
    }, []);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Top Navigation */}
            <nav className="h-16 border-b border-white/5 bg-surface/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold">
                        C
                    </div>
                    <span className="font-semibold text-lg tracking-tight">Campus 360</span>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-text-secondary hover:text-white transition-colors">
                        <Search size={20} />
                    </button>
                    <button className="p-2 text-text-secondary hover:text-white transition-colors">
                        <Settings size={20} />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-surface-light border border-white/10 flex items-center justify-center text-sm font-medium">
                        <User size={16} />
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 p-8 max-w-7xl mx-auto w-full animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">My Tours</h1>
                        <p className="text-text-secondary text-sm">Manage and edit your virtual tours</p>
                    </div>
                    <button className="btn-primary flex items-center gap-2">
                        <Plus size={18} />
                        <span>New Tour</span>
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blocks.map((block) => (
                        <div
                            key={block.id}
                            onClick={() => navigate(`/tour/${block.id}`)}
                            className="group bg-surface border border-white/5 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
                        >
                            {/* Thumbnail Area */}
                            <div className="h-48 bg-surface-light relative overflow-hidden">
                                {block.labs.length > 0 ? (
                                    <img
                                        src={block.labs[0].thumbnail || block.labs[0].panorama}
                                        alt={block.label}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                                        <Map size={48} className="opacity-20" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />

                                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-xs font-medium text-white border border-white/10">
                                    {block.labs.length} Scenes
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-5">
                                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                                    {block.label}
                                </h3>
                                <p className="text-text-secondary text-sm mb-4">
                                    {block.short}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <span className="text-xs text-text-muted">Last updated 2h ago</span>
                                    <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                        Open Editor →
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
