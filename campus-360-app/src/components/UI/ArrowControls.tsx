import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Info, Play, Pause, Plus, Minus } from 'lucide-react';
import { useTourState } from '../../hooks/useTourState';

export const ArrowControls = () => {
    const { rotateCamera, zoomCamera, isAutoRotating, setAutoRotation, startRotation, stopRotation } = useTourState();
    const [showInfo, setShowInfo] = useState(false);





    const arrowButtonStyle = {
        background: 'rgba(0, 0, 0, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white',
        cursor: 'pointer',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48px',
        height: '48px',
    };

    return (
        <>
            {/* Bottom Right Control Dock (Landscape) */}
            <div style={{
                position: 'absolute',
                right: '2rem',
                bottom: '2rem',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'row',
                gap: '1rem',
                alignItems: 'center', // Align items vertically in the center
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '1rem',
                borderRadius: '1.5rem',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
                {/* Left Group: Info, Play, Zoom */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {/* Info Button */}
                    <button
                        onClick={() => setShowInfo(!showInfo)}
                        style={{
                            ...arrowButtonStyle,
                            background: showInfo ? 'rgba(56, 189, 248, 0.3)' : 'rgba(0, 0, 0, 0.6)',
                            borderColor: showInfo ? 'rgba(56, 189, 248, 0.5)' : 'rgba(255, 255, 255, 0.2)',
                        }}
                        aria-label="Information"
                    >
                        <Info size={20} />
                    </button>

                    {/* Play/Pause Button */}
                    <button
                        onClick={() => setAutoRotation(!isAutoRotating)}
                        style={{
                            ...arrowButtonStyle,
                            background: isAutoRotating ? 'rgba(56, 189, 248, 0.3)' : 'rgba(0, 0, 0, 0.6)',
                            borderColor: isAutoRotating ? 'rgba(56, 189, 248, 0.5)' : 'rgba(255, 255, 255, 0.2)',
                        }}
                        aria-label={isAutoRotating ? "Pause rotation" : "Start rotation"}
                    >
                        {isAutoRotating ? <Pause size={20} /> : <Play size={20} />}
                    </button>

                    {/* Divider */}
                    <div style={{ width: '1px', height: '32px', background: 'rgba(255, 255, 255, 0.2)' }} />

                    {/* Zoom Controls */}
                    <button onClick={() => zoomCamera('out')} style={arrowButtonStyle} aria-label="Zoom Out">
                        <Minus size={20} />
                    </button>
                    <button onClick={() => zoomCamera('in')} style={arrowButtonStyle} aria-label="Zoom In">
                        <Plus size={20} />
                    </button>
                </div>

                {/* Divider */}
                <div style={{ width: '1px', height: '48px', background: 'rgba(255, 255, 255, 0.2)' }} />

                {/* Navigation Arrows (Inverted T Layout) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                    {/* Top Row: Up Arrow */}
                    <button
                        onMouseDown={() => startRotation('up')}
                        onMouseUp={stopRotation}
                        onMouseLeave={stopRotation}
                        onTouchStart={() => startRotation('up')}
                        onTouchEnd={stopRotation}
                        style={arrowButtonStyle}
                        aria-label="Look up"
                    >
                        <ChevronUp size={24} />
                    </button>

                    {/* Bottom Row: Left, Down, Right Arrows */}
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                            onMouseDown={() => startRotation('left')}
                            onMouseUp={stopRotation}
                            onMouseLeave={stopRotation}
                            onTouchStart={() => startRotation('left')}
                            onTouchEnd={stopRotation}
                            style={arrowButtonStyle}
                            aria-label="Rotate left"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onMouseDown={() => startRotation('down')}
                            onMouseUp={stopRotation}
                            onMouseLeave={stopRotation}
                            onTouchStart={() => startRotation('down')}
                            onTouchEnd={stopRotation}
                            style={arrowButtonStyle}
                            aria-label="Look down"
                        >
                            <ChevronDown size={24} />
                        </button>
                        <button
                            onMouseDown={() => startRotation('right')}
                            onMouseUp={stopRotation}
                            onMouseLeave={stopRotation}
                            onTouchStart={() => startRotation('right')}
                            onTouchEnd={stopRotation}
                            style={arrowButtonStyle}
                            aria-label="Rotate right"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Info Panel (Opens Above) */}
            {showInfo && (
                <div style={{
                    position: 'absolute',
                    right: '2rem',
                    bottom: '10rem', // Adjusted for taller dock
                    zIndex: 99,
                    background: 'rgba(0, 0, 0, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    maxWidth: '300px',
                    color: 'white',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
                        Campus 360 Tour
                    </h3>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', lineHeight: '1.5', color: 'rgba(255, 255, 255, 0.8)' }}>
                        Navigate through the campus using the controls below.
                    </p>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                        <div style={{ marginBottom: '0.5rem' }}>← → : Rotate view left/right</div>
                        <div style={{ marginBottom: '0.5rem' }}>↑ ↓ : Look up/down</div>
                        <div style={{ marginBottom: '0.5rem' }}>+ - : Zoom in/out</div>
                        <div style={{ marginBottom: '0.5rem' }}>▶ : Auto-rotate camera</div>
                    </div>
                </div>
            )}
        </>
    );
};
