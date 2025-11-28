import React, { useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Viewer/Scene';
import { Controls } from './components/Viewer/Controls';
import { Overlay } from './components/UI/Overlay';
import { Loader } from './components/UI/Loader';
import { Navbar } from './components/UI/Navbar';
import { ArrowControls } from './components/UI/ArrowControls';
import { LocationBar } from './components/UI/LocationBar';
import { useTourState } from './hooks/useTourState';

function App() {
  const { setManifest, setBlock, setImage, setIdle } = useTourState();

  useEffect(() => {
    fetch('/manifest.json')
      .then((res) => res.json())
      .then((data) => {
        setManifest(data);

        // Check URL params
        const params = new URLSearchParams(window.location.search);
        const blockId = params.get('block');
        const imageId = params.get('view');

        if (blockId && imageId) {
          setBlock(blockId);
          setImage(imageId);
        } else {
          // Set initial state (Gate to Logo)
          if (data.blocks && data.blocks.length > 0) {
            const firstBlock = data.blocks[0];
            setBlock(firstBlock.id);
            if (firstBlock.labs && firstBlock.labs.length > 0) {
              setImage(firstBlock.labs[0].id);
            }
          }
        }
      })
      .catch((err) => console.error('Failed to load manifest:', err));
  }, [setManifest, setBlock, setImage]);

  // Sync state to URL
  const { currentBlockId, currentImageId } = useTourState();
  useEffect(() => {
    if (currentBlockId && currentImageId) {
      const params = new URLSearchParams(window.location.search);
      params.set('block', currentBlockId);
      params.set('view', currentImageId);
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    }
  }, [currentBlockId, currentImageId]);

  // Idle detection
  useEffect(() => {
    let timeout: number;
    const resetIdle = () => {
      setIdle(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIdle(true), 5000); // 5 seconds idle
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('click', resetIdle);

    resetIdle(); // Init

    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('click', resetIdle);
      clearTimeout(timeout);
    };
  }, [setIdle]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
      <Navbar />
      <LocationBar />
      <Canvas camera={{ fov: 75, position: [0, 0, 0.1] }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
        <Controls />
      </Canvas>
      <Overlay />
      <Loader />
      <ArrowControls />
    </div>
  );
}

export default App;
