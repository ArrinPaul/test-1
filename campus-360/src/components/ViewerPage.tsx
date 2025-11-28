import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getLab, getManifest } from '../lib/api';
import type { Lab } from '../lib/types';
import ViewerWrapper from './ViewerWrapper';
import BlockMenu from './BlockMenu';
import InfoModal from './InfoModal';
import { prefetchPanorama } from '../lib/pano-loader';
import { logPageView } from '../lib/analytics';
import { Share2, Check } from 'lucide-react';

export default function ViewerPage() {
    const { labId } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [lab, setLab] = useState<Lab | undefined>();
    const [manifest, setManifest] = useState<any>(null);
    const [previewThumb, setPreviewThumb] = useState<string | undefined>();
    const [viewerInstance, setViewerInstance] = useState<any>(null);
    const [infoOpen, setInfoOpen] = useState(false);
    const [infoContent, setInfoContent] = useState<string | undefined>(undefined);
    const [copied, setCopied] = useState(false);
    const [isIdle, setIsIdle] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(true);
    const debounceRef = useRef<any>(null);
    const idleTimerRef = useRef<any>(null);
    const autoplayTimerRef = useRef<any>(null);

    const defaultYaw = searchParams.get('yaw') ? parseFloat(searchParams.get('yaw')!) : undefined;
    const defaultPitch = searchParams.get('pitch') ? parseFloat(searchParams.get('pitch')!) : undefined;

    useEffect(() => {
        if (labId) {
            logPageView(`lab_view:${labId}`);
            getLab(labId).then(l => {
                setLab(l);
                if (l) {
                    prefetchNextLab(l.id);
                }
            });
        }
        // load manifest for menu/navigation
        getManifest().then(m => setManifest(m)).catch(() => {});
        
        // Set up info content for current lab
        if (lab) {
            const info = `Location: ${lab.label}\nDirectory: ${lab.meta?.directory || 'Unknown'}\nType: ${lab.type}`;
            setInfoContent(info);
        }
    }, [labId]);

    const prefetchNextLab = async (currentLabId: string) => {
        try {
            const manifest = await getManifest();
            for (const block of manifest.blocks) {
                const index = block.labs.findIndex(l => l.id === currentLabId);
                if (index !== -1 && index < block.labs.length - 1) {
                    const nextLab = block.labs[index + 1];
                    console.log("Prefetching", nextLab.label);
                    prefetchPanorama(nextLab.panorama);
                    break;
                }
            }
        } catch (e) {
            console.error("Error prefetching next lab", e);
        }
    };

    const handlePositionChange = useCallback((yaw: number, pitch: number) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set('yaw', yaw.toFixed(2));
                newParams.set('pitch', pitch.toFixed(2));
                return newParams;
            }, { replace: true });
        }, 500);
    }, [setSearchParams]);

    const handleViewerReady = (viewer: any) => {
        setViewerInstance(viewer);
        startAutoplay();
    };

    // Reset idle timer on user interaction
    const resetIdleTimer = () => {
        setIsIdle(false);
        setControlsVisible(true);
        
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current);
        
        idleTimerRef.current = setTimeout(() => {
            setIsIdle(true);
            setControlsVisible(false);
            startAutoplay();
        }, 3000); // 3 seconds of idle
    };

    // Start autoplay: rotate camera and cycle photos
    const startAutoplay = () => {
        if (!viewerInstance) return;
        
        // Gentle rotation
        const rotateInterval = setInterval(() => {
            if (isIdle && viewerInstance) {
                stepView(0.02, 0); // Very slow rotation
            }
        }, 100);
        
        // Auto advance to next photo after 10 seconds
        autoplayTimerRef.current = setTimeout(() => {
            if (isIdle) {
                navigateWithinBlock('next');
            }
        }, 10000);
        
        return () => clearInterval(rotateInterval);
    };

    // Set up user interaction listeners
    useEffect(() => {
        const handleUserActivity = () => resetIdleTimer();
        
        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('click', handleUserActivity);
        window.addEventListener('keydown', handleUserActivity);
        window.addEventListener('wheel', handleUserActivity);
        
        // Start idle timer immediately
        resetIdleTimer();
        
        return () => {
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('click', handleUserActivity);
            window.removeEventListener('keydown', handleUserActivity);
            window.removeEventListener('wheel', handleUserActivity);
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current);
        };
    }, [viewerInstance]);

    // keyboard controls (WASD / arrows)
    useEffect(() => {
        if (!viewerInstance) return;
        const onKey = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase();
            if (k === 'arrowleft' || k === 'a') {
                stepView(-0.4, 0);
            } else if (k === 'arrowright' || k === 'd') {
                stepView(0.4, 0);
            } else if (k === 'arrowup' || k === 'w') {
                stepView(0, -0.15);
            } else if (k === 'arrowdown' || k === 's') {
                stepView(0, 0.15);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [viewerInstance]);

    const navigateWithinBlock = (dir: 'next' | 'prev') => {
        if (!manifest || !lab) return;
        for (const block of manifest.blocks) {
            const idx = block.labs.findIndex((l: any) => l.id === lab.id);
            if (idx !== -1) {
                const newIdx = dir === 'next' ? idx + 1 : idx - 1;
                if (newIdx >= 0 && newIdx < block.labs.length) {
                    navigate(`/viewer/${block.labs[newIdx].id}`);
                }
                break;
            }
        }
    };

    // small helper to animate yaw/pitch if viewer supports it
    const stepView = (dyaw = 0, dpitch = 0) => {
        if (!viewerInstance) return;
        try {
            const pos = viewerInstance.getPosition ? viewerInstance.getPosition() : { yaw: 0, pitch: 0 };
            const target = { yaw: pos.yaw + dyaw, pitch: pos.pitch + dpitch };
            if (viewerInstance.animate) viewerInstance.animate({ yaw: target.yaw, pitch: target.pitch, duration: 600 });
        } catch (e) {
            // ignore if API differs
            console.warn('animate failed', e);
        }
    };

    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!lab) return <div className="w-full h-screen bg-slate-900 text-white flex items-center justify-center">Loading...</div>;

    return (
        <div className="w-screen h-screen overflow-hidden bg-black relative">
            <ViewerWrapper
                src={lab.panorama}
                onClose={() => navigate(-1)}
                hotspots={[]}
                defaultYaw={defaultYaw}
                defaultPitch={defaultPitch}
                onPositionChange={handlePositionChange}
                onReady={handleViewerReady}
            />

            {/* Block menu */}
            <div className={`transition-opacity duration-500 ${controlsVisible ? 'opacity-100' : 'opacity-20'} hidden md:block`}>
                <BlockMenu onHover={(t) => setPreviewThumb(t)} />
            </div>

            {/* Mobile menu toggle */}
            <div className="absolute left-4 top-4 z-30 md:hidden pointer-events-auto">
                <button
                    onClick={() => setControlsVisible(!controlsVisible)}
                    className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md"
                >
                    ☰
                </button>
            </div>

            {/* Hover preview - only on desktop */}
            {previewThumb && (
                <div className="absolute left-48 top-1/4 z-30 w-64 h-36 overflow-hidden rounded-lg shadow-2xl pointer-events-none border border-white/20 hidden md:block">
                    <img src={previewThumb} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm text-white text-sm p-2">
                        Preview
                    </div>
                </div>
            )}

            /* Logo top-right */}
            <div className="absolute top-4 right-20 z-30 pointer-events-auto">
                <img src="/logo.svg" alt="University Logo" className="w-16 h-16 object-contain opacity-90" />
            </div>

            {/* mid-left / mid-right navigation */}
            <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-20 pointer-events-auto transition-opacity duration-500 ${controlsVisible ? 'opacity-100' : 'opacity-0'}`}>
                <button onClick={() => navigateWithinBlock('prev')} className="bg-white/8 hover:bg-white/14 text-white p-3 rounded-full backdrop-blur-md">◀</button>
            </div>
            <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-20 pointer-events-auto transition-opacity duration-500 ${controlsVisible ? 'opacity-100' : 'opacity-0'}`}>
                <button onClick={() => navigateWithinBlock('next')} className="bg-white/8 hover:bg-white/14 text-white p-3 rounded-full backdrop-blur-md">▶</button>
            </div>

            {/* On-screen directional controls */}
            <div className={`absolute bottom-6 right-6 z-20 pointer-events-auto transition-opacity duration-500 ${controlsVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="grid grid-cols-3 gap-1 bg-white/5 backdrop-blur-md rounded-lg p-2">
                    <div></div>
                    <button onClick={() => stepView(0, -0.15)} className="bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded flex items-center justify-center">↑</button>
                    <div></div>
                    <button onClick={() => stepView(-0.4, 0)} className="bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded flex items-center justify-center">←</button>
                    <div className="w-10 h-10 flex items-center justify-center text-white/50 text-xs">PAN</div>
                    <button onClick={() => stepView(0.4, 0)} className="bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded flex items-center justify-center">→</button>
                    <div></div>
                    <button onClick={() => stepView(0, 0.15)} className="bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded flex items-center justify-center">↓</button>
                    <div></div>
                </div>
            </div>

            {/* Overlay UI */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <div className="bg-white/6 backdrop-blur-md px-3 py-1 rounded-md">
                    <h1 className="text-white font-semibold text-lg drop-shadow-md">{lab.label}</h1>
                </div>
            </div>

            {/* Controls */}
            <div className={`absolute top-4 right-4 z-10 flex gap-2 transition-opacity duration-500 ${controlsVisible ? 'opacity-100' : 'opacity-0'}`}>
                <button
                    onClick={handleCopyLink}
                    className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="Copy Link to this view"
                    title="Copy Link"
                >
                    {copied ? <Check size={20} /> : <Share2 size={20} />}
                </button>
                <button
                    onClick={() => setInfoOpen(true)}
                    className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors flex items-center justify-center cursor-pointer"
                    title="Info"
                >
                    i
                </button>
            </div>

            <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} content={infoContent} />
        </div>
    );
}
