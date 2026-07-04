"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";

// Floating Mesh component
function FloatingMesh({ position, color, size }: { position: [number, number, number]; color: string; size: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(time / 2) * 0.5;
    meshRef.current.rotation.y = Math.cos(time / 2) * 0.5;
    meshRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.2;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial
        color={color}
        roughness={0.2}
        metalness={0.8}
        emissive={color}
        emissiveIntensity={hovered ? 0.3 : 0.1}
      />
    </mesh>
  );
}

// Particle Field Component
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const [positions, count] = useMemo(() => {
    const pCount = 300;
    const arr = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 12;
    }
    return [arr, pCount];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#5683da"
        size={0.06}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.7}
      />
    </points>
  );
}

// Mouse movement reactive lighting
function MouseGlow() {
  const { viewport } = useThree();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const lightRef = useRef<THREE.PointLight>(null);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse coords (-1 to 1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (!lightRef.current) return;
    // Map mouse screen coords to 3D coords based on viewport size
    const targetX = mouse.x * (viewport.width / 2);
    const targetY = mouse.y * (viewport.height / 2);
    lightRef.current.position.x += (targetX - lightRef.current.position.x) * 0.1;
    lightRef.current.position.y += (targetY - lightRef.current.position.y) * 0.1;
  });

  return <pointLight ref={lightRef} intensity={5} distance={10} color="#ff8964" position={[0, 0, 2]} />;
}

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 w-full h-full -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 4, 3]} intensity={1.5} color="#5683da" />
        
        {/* Abstract Floating geometries */}
        <FloatingMesh position={[-1.8, 1, 0]} color="#5683da" size={0.8} />
        <FloatingMesh position={[1.8, -0.8, -1]} color="#ff8964" size={0.6} />
        
        <Sphere position={[0, 0, -2]} args={[1.2, 32, 32]}>
          <meshStandardMaterial
            color="#111111"
            roughness={0.1}
            metalness={0.9}
            wireframe={true}
          />
        </Sphere>
        
        {/* Particle systems */}
        <ParticleField />

        {/* Dynamic Light Reactivity */}
        <MouseGlow />
      </Canvas>
    </div>
  );
}
