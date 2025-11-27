import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Layers, Map, MoreVertical, Share2 } from 'lucide-react';
import ViewerWrapper from './ViewerWrapper';
import manifestData from '../data/manifest.json';

export default function EditorLayout() {
    const { blockId } = useParams();
    const navigate = useNavigate();

    // Find the current block
    const block = useMemo(() =>
        manifestData.blocks.find(b => b.id === blockId),
        [blockId]);

    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Reset scene index when block changes
    useEffect(() => {
        setCurrentSceneIndex(0);
    }, [blockId]);

    if (!block) {
        return <div className="flex items-center justify-center h-screen text-white">Block not found</div>;
    }

    const currentScene = block.labs[currentSceneIndex];

    return (
        <div className="h-screen flex flex-col bg-background overflow-hidden">
            {/* Top Bar */}
            <header className="h-14 bg-surface border-b border-white/5 flex items-center justify-between px-4 z-20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-white/5 rounded-lg text-text-secondary hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="font-semibold text-sm">{block.label}</h1>
                        <div className="text-xs text-text-muted flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Saved
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="btn-secondary text-sm py-1.5 flex items-center gap-2">
                        <Share2 size={16} />
                        Share
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-lg text-text-secondary">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Sidebar - Scene Reel */}
                <div
                    className={`bg-surface border-r border-white/5 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0 opacity-0'
                        }`}
                >
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                        <h2 className="font-medium text-sm flex items-center gap-2">
                            <Layers size={16} className="text-primary" />
                            Scenes ({block.labs.length})
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                        {block.labs.map((scene, idx) => (
                            <div
                                key={scene.id}
                                onClick={() => setCurrentSceneIndex(idx)}
                                className={`p-2 rounded-lg cursor-pointer transition-all border ${currentSceneIndex === idx
                                        ? 'bg-primary/10 border-primary/50'
                                        : 'hover:bg-white/5 border-transparent'
                                    }`}
                            >
                                <div className="aspect-video rounded bg-surface-light mb-2 overflow-hidden relative">
                                    <img
                                        src={scene.thumbnail || scene.panorama}
                                        alt={scene.label}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    {currentSceneIndex === idx && (
                                        <div className="absolute inset-0 border-2 border-primary rounded pointer-events-none" />
                                    )}
                                </div>
                                <div className={`text-xs truncate ${currentSceneIndex === idx ? 'text-primary font-medium' : 'text-text-secondary'}`}>
                                    {scene.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Toggle Sidebar Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-surface border border-white/10 p-1 rounded-r shadow-lg text-text-secondary hover:text-white"
                    style={{ left: isSidebarOpen ? '256px' : '0' }}
                >
                    {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>

                {/* Main Viewer Area */}
                <div className="flex-1 bg-black relative">
                    {currentScene && (
                        <ViewerWrapper
                            src={currentScene.panorama}
                            hotspots={[]} // TODO: Add hotspots from data
                        />
                    )}

                    {/* Bottom Control Bar Overlay */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl z-10">
                        <button className="text-white hover:text-primary transition-colors tooltip" title="Map View">
                            <Map size={20} />
                        </button>
                        <div className="w-px h-4 bg-white/20"></div>
                        <div className="text-sm font-medium min-w-[100px] text-center">
                            {currentScene?.label}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Inspector (Optional/Collapsible) */}
                <div className="w-72 bg-surface border-l border-white/5 hidden lg:flex flex-col">
                    <div className="p-4 border-b border-white/5">
                        <h2 className="font-medium text-sm">Properties</h2>
                    </div>
                    <div className="p-4 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs text-text-secondary uppercase font-semibold tracking-wider">Scene Name</label>
                            <input
                                type="text"
                                value={currentScene?.label}
                                readOnly
                                className="input-field"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-text-secondary uppercase font-semibold tracking-wider">Initial View</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button className="btn-secondary text-xs">Set Current</button>
                                <button className="btn-secondary text-xs">Reset</button>
                            </div>
                        </div>

                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                            <h3 className="text-primary text-sm font-medium mb-1">Pro Tip</h3>
                            <p className="text-xs text-text-muted">
                                Hold 'Ctrl' while dragging to rotate the view without moving the hotspot.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
