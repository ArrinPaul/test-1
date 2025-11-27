import type { Manifest, Block, Lab } from './types';

let cachedManifest: Manifest | null = null;

export const getManifest = async (): Promise<Manifest> => {
    if (cachedManifest) return cachedManifest;

    // In a real app, this might be an API call. 
    // For local dev, we import the JSON directly or fetch it.
    // Since we are using Vite, we can import it if it's in src, 
    // or fetch it if it's in public. 
    // The user put it in src/data/manifest.json, so we can import it dynamically or statically.
    // However, to simulate "loading" and allow for runtime updates if we were to serve it,
    // let's try to fetch it from the public folder if we move it there, 
    // or just import it. 
    // The user said: "api.ts just imports manifest or fetches from /data/manifest.json"
    // If it is in src/data, it is bundled.

    try {
        // Dynamic import to keep it split
        const data = await import('../data/manifest.json');
        // The import returns a module, the default export is the json content
        cachedManifest = data.default as unknown as Manifest;
        return cachedManifest;
    } catch (e) {
        console.error("Failed to load manifest", e);
        throw e;
    }
};

export const getBlock = async (id: string): Promise<Block | undefined> => {
    const manifest = await getManifest();
    return manifest.blocks.find(b => b.id === id);
};

export const getLab = async (labId: string): Promise<Lab | undefined> => {
    const manifest = await getManifest();
    for (const block of manifest.blocks) {
        const lab = block.labs.find(l => l.id === labId);
        if (lab) return lab;
    }
    return undefined;
};
