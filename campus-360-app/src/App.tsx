import React, { useEffect, Suspense } from 'react';
import { Scene } from './components/Viewer/Scene';
import { Canvas } from '@react-three/fiber';
// import { XR, createXRStore } from '@react-three/xr';
import { Controls } from './components/Viewer/Controls';
import { Overlay } from './components/UI/Overlay';
import { Loader } from './components/UI/Loader';
import { Navbar } from './components/UI/Navbar';
import { ArrowControls } from './components/UI/ArrowControls';
import { LocationBar } from './components/UI/LocationBar';
import { useTourState } from './hooks/useTourState';

// const store = createXRStore();

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
          {/* <XR store={store}> */}
          <Scene />
          <Controls />
          {/* </XR> */}
        </Suspense>
      </Canvas>
      <Overlay />
      <Loader />
      <ArrowControls />

      {/* VR Button */}
      {/* <button
        onClick={() => store.enterVR()}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          padding: '12px 24px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '30px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8v13H3V8" />
          <path d="M1 3h22v5H1z" />
          <path d="M10 12h4" />
        </svg>
        Enter VR
      </button> */}
    </div>
  );
}

export default App;
