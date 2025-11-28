import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export const Compass: React.FC = () => {
    const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
        // Dispatch custom event for controls to listen to
        window.dispatchEvent(new CustomEvent('compass-move', { detail: direction }));
    };

    const btnClass = "p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-full text-white border border-white/25 hover:border-white/40 hover:from-indigo-500/30 hover:to-purple-500/30 active:scale-90 transition-all duration-200 shadow-lg hover:shadow-[0_0_20px_rgba(102,126,234,0.4)]";

    return (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-black/30 to-black/20 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
            <button className={btnClass} onClick={() => handleMove('up')}><ChevronUp size={24} strokeWidth={2.5} /></button>
            <div className="flex gap-3">
                <button className={btnClass} onClick={() => handleMove('left')}><ChevronLeft size={24} strokeWidth={2.5} /></button>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white/50"></div>
                </div>
                <button className={btnClass} onClick={() => handleMove('right')}><ChevronRight size={24} strokeWidth={2.5} /></button>
            </div>
            <button className={btnClass} onClick={() => handleMove('down')}><ChevronDown size={24} strokeWidth={2.5} /></button>
        </div>
    );
};
