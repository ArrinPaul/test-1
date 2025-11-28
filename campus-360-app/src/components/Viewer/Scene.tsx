import React, { useEffect, useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useTourState } from '../../hooks/useTourState';

export const Scene: React.FC = () => {
    const { currentImageId, manifest } = useTourState();
    const sphereRef = useRef<THREE.Mesh>(null);

    // Find the current image data from the manifest
    const currentImage = React.useMemo(() => {
        if (!manifest || !currentImageId) return null;
        for (const block of manifest.blocks) {
            const found = block.labs.find((lab: any) => lab.id === currentImageId);
            if (found) return found;
        }
        return null;
    }, [manifest, currentImageId]);

    const texture = useLoader(THREE.TextureLoader, currentImage ? currentImage.panorama : '/placeholder.jpg');

    useEffect(() => {
        if (texture) {
            const tex = texture as THREE.Texture;
            tex.mapping = THREE.EquirectangularReflectionMapping;
            tex.colorSpace = THREE.SRGBColorSpace;
        }
    }, [texture]);

    if (!currentImage) return null;

    return (
        <mesh ref={sphereRef} scale={[-1, 1, 1]}>
            <sphereGeometry args={[500, 60, 40]} />
            <meshBasicMaterial map={texture as THREE.Texture} side={THREE.BackSide} />
        </mesh>
    );
};
