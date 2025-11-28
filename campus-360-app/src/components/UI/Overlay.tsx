import React, { useEffect, useState } from 'react';
import { Menu } from './Menu';
import { Navigation } from './Navigation';
import { Title } from './Title';
import { Compass } from './Compass';
import { InfoModal } from './InfoModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize, Minimize } from 'lucide-react';

export const Overlay: React.FC = () => {
    const [visible, setVisible] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    let timeout: number;

    const resetVisibility = () => {
        setVisible(true);
        clearTimeout(timeout);
        timeout = setTimeout(() => setVisible(false), 3000); // Hide after 3s of inactivity
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        window.addEventListener('mousemove', resetVisibility);
        window.addEventListener('click', resetVisibility);
        window.addEventListener('keydown', resetVisibility);

        const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFsChange);

        resetVisibility();

        return () => {
            window.removeEventListener('mousemove', resetVisibility);
            window.removeEventListener('click', resetVisibility);
            window.removeEventListener('keydown', resetVisibility);
            document.removeEventListener('fullscreenchange', handleFsChange);
            clearTimeout(timeout);
        };
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none">
            {/* Always visible elements (or handle visibility inside them if needed) */}
            <div className="pointer-events-auto">
                <Title />
            </div>

            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none"
                    >
                        <div className="pointer-events-auto">
                            <Menu />
                            <Navigation />
                            <Compass />
                            <InfoModal />

                            {/* Fullscreen Toggle */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleFullscreen}
                                className="absolute top-6 right-28 p-3.5 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-white/30 text-white hover:border-white/40 hover:shadow-[0_0_25px_rgba(102,126,234,0.5)] transition-all duration-300 shadow-lg"
                            >
                                {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
                            </motion.button>
                        </div>

                        {/* Logo Placeholder */}
                        <div className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-full border border-white/30 flex items-center justify-center pointer-events-auto shadow-lg hover:shadow-[0_0_25px_rgba(102,126,234,0.4)] transition-all duration-300">
                            <span className="text-xs text-white/70 font-bold tracking-wider">LOGO</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
