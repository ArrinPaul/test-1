import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTourState } from '../../hooks/useTourState';

export const Controls: React.FC = () => {
    const { camera, gl } = useThree();
    const controlsRef = useRef<any>(null);
    const { isIdle, cameraRotation, cameraZoom, isAutoRotating, activeRotation } = useTourState();

    // Listen to camera rotation triggers from UI buttons
    useEffect(() => {
        if (!cameraRotation.direction) return;

        const speed = 0.1;
        switch (cameraRotation.direction) {
            case 'up':
                camera.rotateX(speed);
                break;
            case 'down':
                camera.rotateX(-speed);
                break;
            case 'left':
                camera.rotateY(speed);
                break;
            case 'right':
                camera.rotateY(-speed);
                break;
        }
    }, [cameraRotation, camera]);

    // Listen to camera zoom triggers from UI buttons
    useEffect(() => {
        if (!cameraZoom.direction) return;

        const zoomSpeed = 5;
        const currentFov = (camera as THREE.PerspectiveCamera).fov;
        let newFov = currentFov;

        if (cameraZoom.direction === 'in') {
            newFov = Math.max(30, currentFov - zoomSpeed);
        } else if (cameraZoom.direction === 'out') {
            newFov = Math.min(100, currentFov + zoomSpeed);
        }

        if (newFov !== currentFov) {
            (camera as THREE.PerspectiveCamera).fov = newFov;
            camera.updateProjectionMatrix();
        }
    }, [cameraZoom, camera]);

    // Handle mouse wheel zoom
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            const zoomSpeed = 0.05;
            const currentFov = (camera as THREE.PerspectiveCamera).fov;
            let newFov = currentFov + e.deltaY * zoomSpeed;

            newFov = Math.max(30, Math.min(100, newFov));

            if (newFov !== currentFov) {
                (camera as THREE.PerspectiveCamera).fov = newFov;
                camera.updateProjectionMatrix();
            }
        };

        const canvas = gl.domElement;
        canvas.addEventListener('wheel', handleWheel, { passive: false });
        return () => canvas.removeEventListener('wheel', handleWheel);
    }, [camera, gl]);

    // Keyboard state tracking
    const keysPressed = useRef<Set<string>>(new Set());

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            keysPressed.current.add(e.key.toLowerCase());
            // Also add Arrow keys as they are
            if (e.key.startsWith('Arrow')) {
                keysPressed.current.add(e.key);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed.current.delete(e.key.toLowerCase());
            if (e.key.startsWith('Arrow')) {
                keysPressed.current.delete(e.key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Auto-rotate, Manual Continuous Rotation, and Keyboard logic
    useFrame(() => {
        const rotationSpeed = 0.02; // Adjust speed as needed

        let rotated = false;

        // 1. Check activeRotation (from UI buttons)
        if (activeRotation) {
            switch (activeRotation) {
                case 'up': camera.rotateX(rotationSpeed); break;
                case 'down': camera.rotateX(-rotationSpeed); break;
                case 'left': camera.rotateY(rotationSpeed); break;
                case 'right': camera.rotateY(-rotationSpeed); break;
            }
            rotated = true;
        }

        // 2. Check Keyboard Controls
        const keys = keysPressed.current;
        if (keys.has('arrowup') || keys.has('w') || keys.has('ArrowUp')) {
            camera.rotateX(rotationSpeed);
            rotated = true;
        }
        if (keys.has('arrowdown') || keys.has('s') || keys.has('ArrowDown')) {
            camera.rotateX(-rotationSpeed);
            rotated = true;
        }
        if (keys.has('arrowleft') || keys.has('a') || keys.has('ArrowLeft')) {
            camera.rotateY(rotationSpeed);
            rotated = true;
        }
        if (keys.has('arrowright') || keys.has('d') || keys.has('ArrowRight')) {
            camera.rotateY(-rotationSpeed);
            rotated = true;
        }

        // 3. Auto-rotation (only if not manually rotating)
        if (!rotated && isAutoRotating) {
            camera.rotateY(-0.002); // Smooth rotation speed
        }

        if (controlsRef.current) {
            controlsRef.current.autoRotate = isIdle && !isAutoRotating && !rotated && !activeRotation;
            controlsRef.current.autoRotateSpeed = 0.5;
            controlsRef.current.update();
        }
    });

    return (
        <OrbitControls
            ref={controlsRef}
            enableZoom={false} // Disable default zoom to use FOV zoom
            minDistance={10}
            maxDistance={200}
            enablePan={false}
            rotateSpeed={-0.5} // Invert drag for natural feel
        />
    );
};
