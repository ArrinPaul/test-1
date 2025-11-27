import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getLab, getManifest } from '../lib/api';
import type { Lab } from '../lib/types';
import ViewerWrapper from './ViewerWrapper';
import { prefetchPanorama } from '../lib/pano-loader';
import { logPageView } from '../lib/analytics';
import { Share2, Check } from 'lucide-react';

export default function ViewerPage() {
    const { labId } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [lab, setLab] = useState<Lab | undefined>();
    const [copied, setCopied] = useState(false);
    const debounceRef = useRef<any>(null);

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
            />

            {/* Overlay UI */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <h1 className="text-white font-bold text-xl drop-shadow-md">{lab.label}</h1>
                {lab.meta?.floor && <p className="text-white/80 text-sm drop-shadow-md">Floor {lab.meta.floor}</p>}
            </div>

            {/* Controls */}
            <div className="absolute top-4 right-16 z-10 flex gap-2">
                <button
                    onClick={handleCopyLink}
                    className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="Copy Link to this view"
                    title="Copy Link"
                >
                    {copied ? <Check size={20} /> : <Share2 size={20} />}
                </button>
            </div>
        </div>
    );
}
