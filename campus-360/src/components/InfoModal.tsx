import React from 'react';

export default function InfoModal({ open, onClose, content }: { open: boolean; onClose: () => void; content?: string }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative w-full md:w-2/3 lg:w-1/2 bg-white/10 backdrop-blur-md p-6 rounded-t-lg md:rounded-lg text-white z-50">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">Information</h3>
                    <button onClick={onClose} className="text-white/80">Close</button>
                </div>
                <div className="text-sm text-white/90 whitespace-pre-wrap">
                    {content ?? 'No information provided yet.'}
                </div>
            </div>
        </div>
    );
}
