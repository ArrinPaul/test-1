import React, { useState, useEffect, useRef } from 'react';
import { useTourState } from '../../hooks/useTourState';
import { Map, Image as ImageIcon, ChevronDown } from 'lucide-react';

export const LocationBar: React.FC = () => {
    const { manifest, currentBlockId, currentImageId, setBlock, setImage, setIdle } = useTourState();
    const [isBlockOpen, setIsBlockOpen] = useState(false);
    const [isImageOpen, setIsImageOpen] = useState(false);

    const blockDropdownRef = useRef<HTMLDivElement>(null);
    const imageDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (blockDropdownRef.current && !blockDropdownRef.current.contains(event.target as Node)) {
                setIsBlockOpen(false);
            }
            if (imageDropdownRef.current && !imageDropdownRef.current.contains(event.target as Node)) {
                setIsImageOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!manifest || !currentBlockId) return null;

    console.log('LocationBar Render:', {
        blockCount: manifest.blocks?.length,
        currentBlockId,
        blocks: manifest.blocks
    });

    const currentBlock = manifest.blocks.find((b: any) => b.id === currentBlockId);
    const blockName = currentBlock ? (currentBlock.label || currentBlock.name) : 'Select Location';

    const currentImage = currentBlock?.labs?.find((l: any) => l.id === currentImageId);
    const imageName = currentImage ? (currentImage.label || currentImage.id) : 'Select View';

    const handleBlockClick = (blockId: string) => {
        setBlock(blockId);
        setIsBlockOpen(false);
        setIdle(false);
    };

    const handleImageClick = (imageId: string) => {
        setImage(imageId);
        setIsImageOpen(false);
        setIdle(false);
    };

    const buttonStyle = {
        background: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white',
        padding: '0.75rem 1.25rem',
        borderRadius: '2rem',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.2s',
        minWidth: '180px',
        justifyContent: 'space-between'
    };

    const dropdownStyle = {
        position: 'absolute' as const,
        top: '120%',
        left: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '1rem',
        padding: '0.5rem',
        width: '100%',
        minWidth: '240px',
        maxHeight: '60vh',
        overflowY: 'auto' as const,
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.25rem',
        zIndex: 100
    };

    const itemStyle = (isActive: boolean) => ({
        background: isActive ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
        border: '1px solid',
        borderColor: isActive ? 'rgba(56, 189, 248, 0.3)' : 'transparent',
        color: 'white',
        padding: '0.75rem 1rem',
        borderRadius: '0.75rem',
        fontSize: '0.9rem',
        cursor: 'pointer',
        textAlign: 'left' as const,
        transition: 'all 0.2s',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: isActive ? '600' : '400'
    });

    return (
        <div style={{
            position: 'absolute',
            top: '5rem', // Below Navbar
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 90,
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start'
        }}>
            {/* Block Selection Dropdown */}
            <div ref={blockDropdownRef} style={{ position: 'relative' }}>
                <button
                    onClick={() => { setIsBlockOpen(!isBlockOpen); setIsImageOpen(false); }}
                    style={buttonStyle}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
                        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Map size={16} style={{ color: '#38bdf8' }} />
                        <span>{blockName}</span>
                    </div>
                    <ChevronDown size={16} style={{ transform: isBlockOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {isBlockOpen && (
                    <div style={dropdownStyle}>
                        {manifest.blocks.map((block: any) => {
                            console.log('Rendering block item:', block);
                            return (
                                <button
                                    key={block.id}
                                    onClick={() => handleBlockClick(block.id)}
                                    style={itemStyle(currentBlockId === block.id)}
                                    onMouseEnter={(e) => {
                                        if (currentBlockId !== block.id) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (currentBlockId !== block.id) e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <span>{block.label || block.name}</span>
                                    <span style={{ fontSize: '0.75rem', color: '#888' }}>{block.labs?.length || 0}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Image Selection Dropdown */}
            <div ref={imageDropdownRef} style={{ position: 'relative' }}>
                <button
                    onClick={() => { setIsImageOpen(!isImageOpen); setIsBlockOpen(false); }}
                    style={buttonStyle}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
                        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ImageIcon size={16} style={{ color: '#a78bfa' }} />
                        <span style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {imageName}
                        </span>
                    </div>
                    <ChevronDown size={16} style={{ transform: isImageOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {isImageOpen && currentBlock?.labs && (
                    <div style={dropdownStyle}>
                        {currentBlock.labs.map((lab: any) => (
                            <button
                                key={lab.id}
                                onClick={() => handleImageClick(lab.id)}
                                style={itemStyle(currentImageId === lab.id)}
                                onMouseEnter={(e) => {
                                    if (currentImageId !== lab.id) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    if (currentImageId !== lab.id) e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <span>{lab.label || lab.id}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
