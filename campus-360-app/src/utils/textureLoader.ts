import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export const preloadTexture = (url: string) => {
    useLoader.preload(THREE.TextureLoader, url);
};

export const preloadImages = (urls: string[]) => {
    urls.forEach(url => preloadTexture(url));
};
