import React from 'react';
import { useTourState } from '../../hooks/useTourState';

export const Title: React.FC = () => {
    const { manifest, currentImageId } = useTourState();

    if (!manifest || !currentImageId) return null;

    // Find current image label
    let label = '';
    for (const block of manifest.blocks) {
        const found = block.labs.find((l: any) => l.id === currentImageId);
        if (found) {
            label = found.label; // Or found.id if label is filename
            // Clean up label if it's just a filename
            label = label.replace('.jpg', '').replace(/img\d+/, 'Location ' + label.replace('img', '').replace('.jpg', ''));
            break;
        }
    }

    return (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 px-10 py-4 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/30 text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(102,126,234,0.4)] transition-all duration-300">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/90 bg-clip-text" style={{ letterSpacing: '-0.03em' }}>
                {label}
            </h1>
        </div>
    );
};
