import { useState } from 'react';
import { Menu, X, Map, Info, Home, ChevronDown } from 'lucide-react';
import { useTourState } from '../../hooks/useTourState';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLocations, setShowLocations] = useState(false);
    const { manifest, setBlock, setIdle } = useTourState();

    const handleLocationClick = (blockId: string) => {
        setBlock(blockId);
        setIsOpen(false);
        setShowLocations(false);
        setIdle(false);
    };

    const navItems = [
        { name: 'Home', icon: <Home size={20} />, action: () => console.log('Home') },
        { name: 'About', icon: <Info size={20} />, action: () => console.log('About') },
    ];

    return (
        <nav style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1000,
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
            color: 'white',
            pointerEvents: 'none'
        }}>
            <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Campus 360</h1>
            </div>

            {/* Desktop Menu */}
            <div style={{ pointerEvents: 'auto', display: 'flex', gap: '2rem', alignItems: 'center' }} className="hidden md:flex">
                {/* Locations Dropdown */}
                <div style={{ position: 'relative' }}>
                    <button
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '2rem',
                            transition: 'background 0.3s'
                        }}
                        onClick={() => setShowLocations(!showLocations)}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                        <Map size={20} />
                        <span>Locations</span>
                        <ChevronDown size={16} style={{ transform: showLocations ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
                    </button>

                    {showLocations && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            background: 'rgba(0,0,0,0.9)',
                            padding: '0.5rem',
                            borderRadius: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            minWidth: '200px',
                            marginTop: '0.5rem',
                            maxHeight: '60vh',
                            overflowY: 'auto'
                        }}>
                            {manifest?.blocks?.map((block: any) => (
                                <button
                                    key={block.id}
                                    onClick={() => handleLocationClick(block.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',
                                        display: 'block',
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.5rem',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                        e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'none';
                                        e.currentTarget.style.color = 'white';
                                    }}
                                >
                                    {block.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {navItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={item.action}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '2rem',
                            transition: 'background 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </button>
                ))}
            </div>

            {/* Mobile Menu Button */}
            <button
                style={{ pointerEvents: 'auto', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                className="md:hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    background: 'rgba(0,0,0,0.9)',
                    padding: '1rem',
                    borderRadius: '0 0 0 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    pointerEvents: 'auto',
                    minWidth: '250px',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                }}>
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaa', fontSize: '0.9rem', padding: '0 0.5rem 0.5rem' }}>
                            <Map size={16} /> LOCATIONS
                        </div>
                        {manifest?.blocks?.map((block: any) => (
                            <button
                                key={block.id}
                                onClick={() => handleLocationClick(block.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    display: 'block',
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '0.5rem 1rem',
                                    fontSize: '1rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'none';
                                    e.currentTarget.style.color = 'white';
                                }}
                            >
                                {block.name}
                            </button>
                        ))}
                    </div>

                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => {
                                item.action();
                                setIsOpen(false);
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                fontSize: '1.1rem',
                                padding: '0.5rem',
                                textAlign: 'left'
                            }}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </nav>
    );
};
