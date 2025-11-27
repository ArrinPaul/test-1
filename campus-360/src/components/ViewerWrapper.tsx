import { useEffect, useRef } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";

type Props = {
    src: string;
    onClose?: () => void;
    hotspots?: any[];
    defaultYaw?: number;
    defaultPitch?: number;
    onPositionChange?: (yaw: number, pitch: number) => void;
};

export default function ViewerWrapper({ src, onClose, hotspots = [], defaultYaw, defaultPitch, onPositionChange }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const viewerRef = useRef<Viewer | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const viewer = new Viewer({
            container: containerRef.current,
            panorama: src,
            defaultYaw: defaultYaw,
            defaultPitch: defaultPitch,
            navbar: ['zoom', 'fullscreen', 'caption'],
            plugins: [
                [MarkersPlugin, {
                    markers: hotspots.map(h => ({
                        id: h.id,
                        position: { yaw: h.yaw, pitch: h.pitch },
                        html: `<div class="bg-white/80 px-2 py-1 rounded text-sm font-bold shadow hover:bg-white cursor-pointer">${h.label}</div>`,
                        data: { ...h }
                    }))
                }]
            ]
        });

        viewerRef.current = viewer;

        const markersPlugin = viewer.getPlugin(MarkersPlugin) as MarkersPlugin;

        markersPlugin.addEventListener("select-marker", (e: any) => {
            const marker = e.marker;
            if (marker.data && marker.data.onClick) {
                marker.data.onClick();
            }
        });

        if (onPositionChange) {
            viewer.addEventListener('position-updated', (e: any) => {
                onPositionChange(e.position.yaw, e.position.pitch);
            });
        }

        return () => {
            viewer.destroy();
            viewerRef.current = null;
        };
    }, [src, hotspots]);

    return (
        <div className="relative w-full h-full bg-black">
            <div className="w-full h-full" ref={containerRef} />
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
            )}
        </div>
    );
}
