import { create } from 'zustand';

export interface TourState {
  currentBlockId: string | null;
  currentImageId: string | null;
  isIdle: boolean;
  manifest: any | null;
  history: string[]; // Array of imageIds
  cameraRotation: { direction: 'up' | 'down' | 'left' | 'right' | null };
  setManifest: (manifest: any) => void;
  setBlock: (blockId: string) => void;
  setImage: (imageId: string) => void;
  setIdle: (idle: boolean) => void;
  addToHistory: (imageId: string) => void;
  nextImage: () => void;
  previousImage: () => void;
  rotateCamera: (direction: 'up' | 'down' | 'left' | 'right') => void;
  activeRotation: 'up' | 'down' | 'left' | 'right' | null;
  startRotation: (direction: 'up' | 'down' | 'left' | 'right') => void;
  stopRotation: () => void;
  cameraZoom: { direction: 'in' | 'out' | null };
  zoomCamera: (direction: 'in' | 'out') => void;
  isAutoRotating: boolean;
  setAutoRotation: (isRotating: boolean) => void;
}

export const useTourState = create<TourState>((set, get) => ({
  currentBlockId: null,
  currentImageId: null,
  isIdle: false,
  manifest: null,
  history: JSON.parse(localStorage.getItem('tour-history') || '[]'),
  cameraRotation: { direction: null },
  cameraZoom: { direction: null },
  setManifest: (manifest) => set({ manifest }),
  setBlock: (blockId) => {
    set({ currentBlockId: blockId });
    // Automatically set the first image of the block
    const state = get();
    if (state.manifest) {
      const block = state.manifest.blocks.find((b: any) => b.id === blockId);
      if (block && block.labs && block.labs.length > 0) {
        get().setImage(block.labs[0].id);
      }
    }
  },
  setImage: (imageId) => {
    set({ currentImageId: imageId });
    // Add to history
    set((state) => {
      const newHistory = [imageId, ...state.history.filter(id => id !== imageId)].slice(0, 5);
      localStorage.setItem('tour-history', JSON.stringify(newHistory));
      return { history: newHistory };
    });
  },
  setIdle: (idle) => set({ isIdle: idle }),
  addToHistory: (imageId) => set((state) => {
    const newHistory = [imageId, ...state.history.filter(id => id !== imageId)].slice(0, 5);
    localStorage.setItem('tour-history', JSON.stringify(newHistory));
    return { history: newHistory };
  }),
  nextImage: () => {
    const state = get();
    console.log('nextImage called', {
      hasManifest: !!state.manifest,
      blockId: state.currentBlockId,
      imageId: state.currentImageId
    });

    if (!state.manifest || !state.currentBlockId || !state.currentImageId) {
      console.warn('Missing state for nextImage');
      return;
    }

    const currentBlock = state.manifest.blocks.find((b: any) => b.id === state.currentBlockId);
    if (!currentBlock || !currentBlock.labs) {
      console.warn('Block or labs not found');
      return;
    }

    let currentIndex = currentBlock.labs.findIndex((lab: any) => lab.id === state.currentImageId);
    if (currentIndex === -1) {
      console.warn('Current image index not found, resetting to 0');
      currentIndex = 0;
    }

    const nextIndex = (currentIndex + 1) % currentBlock.labs.length;
    const nextImageId = currentBlock.labs[nextIndex].id;
    console.log('Switching to next image:', nextImageId);

    get().setImage(nextImageId);
  },
  previousImage: () => {
    const state = get();
    if (!state.manifest || !state.currentBlockId || !state.currentImageId) return;

    const currentBlock = state.manifest.blocks.find((b: any) => b.id === state.currentBlockId);
    if (!currentBlock || !currentBlock.labs) return;

    const currentIndex = currentBlock.labs.findIndex((lab: any) => lab.id === state.currentImageId);
    if (currentIndex === -1) return;

    const prevIndex = currentIndex === 0 ? currentBlock.labs.length - 1 : currentIndex - 1;
    const prevImageId = currentBlock.labs[prevIndex].id;

    get().setImage(prevImageId);
  },
  rotateCamera: (direction) => {
    set({ cameraRotation: { direction } });
    // Reset after a short delay so it can be triggered again
    setTimeout(() => set({ cameraRotation: { direction: null } }), 100);
  },
  activeRotation: null,
  startRotation: (direction) => set({ activeRotation: direction, isAutoRotating: false }),
  stopRotation: () => set({ activeRotation: null }),
  zoomCamera: (direction) => {
    set({ cameraZoom: { direction } });
    setTimeout(() => set({ cameraZoom: { direction: null } }), 100);
  },
  isAutoRotating: false,
  setAutoRotation: (isRotating) => set({ isAutoRotating: isRotating }),
}));
