
import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Stars, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { bunkerData } from './data/bunkerData';

// Re-use logic or styles if needed, but this is a fresh 3D implementation.

// --- 3D Components ---

function CentralShaft() {
    return (
        <group>
            {/* Main Cylinder */}
            <mesh position={[0, -2, 0]}>
                <cylinderGeometry args={[2, 2, 15, 32, 1, true]} />
                <meshStandardMaterial
                    color="#334155"
                    side={THREE.DoubleSide}
                    roughness={0.7}
                    metalness={0.5}
                />
            </mesh>

            {/* Elevator Platform (Animated placeholder) */}
            <Elevator y={-4} speed={0.02} />
            <Elevator y={2} speed={-0.03} />
        </group>
    );
}

function Elevator({ y, speed }) {
    const ref = useRef();
    useFrame((state) => {
        // Simple vertical movement
        ref.current.position.y = y + Math.sin(state.clock.elapsedTime * speed * 10) * 3;
        // Rotation
        ref.current.rotation.y += 0.01;
    });

    return (
        <group ref={ref}>
            <mesh>
                <cylinderGeometry args={[1.8, 1.8, 0.2, 16]} />
                <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.2} />
            </mesh>
            <pointLight distance={5} intensity={1} color="#06b6d4" />
        </group>
    );
}

function ConnectionTube({ from, toRoom }) {
    // A simple tube from center [0, y, 0] to room position [x, y, z]
    // The room position is calculated from level and angle in Bunker3D main loop

    // Calculate vector to room
    const roomPos = new THREE.Vector3(toRoom.position[0], toRoom.position[1], toRoom.position[2]);
    const centerPos = new THREE.Vector3(0, toRoom.position[1], 0);

    // Length is distance - room radius (approx 1.5)
    const dist = roomPos.distanceTo(centerPos);

    // Angle
    const angle = Math.atan2(roomPos.x, roomPos.z);

    return (
        <mesh
            position={[roomPos.x / 2, roomPos.y, roomPos.z / 2]}
            rotation={[0, angle + Math.PI / 2, Math.PI / 2]}
        >
            <cylinderGeometry args={[0.3, 0.3, dist, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
    );
}

function Room({ data, position, onClick, isSelected }) {
    const ref = useRef();
    const [hovered, setHover] = useState(false);

    // Animate on hover/select
    useFrame(() => {
        const targetScale = hovered || isSelected ? 1.2 : 1;
        ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        // Slow rotation
        ref.current.rotation.y += 0.005;
    });

    return (
        <group position={position}>
            <mesh
                ref={ref}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick(data);
                }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                {/* Different shapes could be used here based on data.type, using Box for simplicity now */}
                <boxGeometry args={[3, 2, 3]} />
                <meshStandardMaterial
                    color={isSelected ? "#ffffff" : data.color}
                    roughness={0.2}
                    metalness={0.6}
                    emissive={hovered ? data.color : "#000000"}
                    emissiveIntensity={0.5}
                />
            </mesh>

            {/* Label always facing camera */}
            <Html distanceFactor={15} position={[0, 1.5, 0]}>
                <div style={{
                    color: 'white',
                    background: 'rgba(0,0,0,0.7)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none'
                }}>
                    {data.name}
                </div>
            </Html>
        </group>
    );
}

function BunkerView({ onSelectRoom, selectedRoomId }) {
    // Convert spherical coords to cartesian for room placement
    // level maps to Y, angle maps to X/Z
    const radius = 8;
    const levelHeight = 4;

    return (
        <group>
            <CentralShaft />

            {bunkerData.map((room) => {
                const rad = (room.angle * Math.PI) / 180;
                const x = Math.sin(rad) * radius;
                const z = Math.cos(rad) * radius;
                const y = room.level * levelHeight;
                const position = [x, y, z];

                return (
                    <React.Fragment key={room.id}>
                        <ConnectionTube from={[0, y, 0]} toRoom={{ position }} />
                        <Room
                            data={room}
                            position={position}
                            onClick={onSelectRoom}
                            isSelected={selectedRoomId === room.id}
                        />
                    </React.Fragment>
                );
            })}
        </group>
    );
}

// --- 2D Overlay ---
function UIOverlay({ selectedRoom, onClose }) {
    if (!selectedRoom) return null;

    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: `2px solid ${selectedRoom.color}`,
            boxShadow: `0 0 30px ${selectedRoom.color}40`,
            padding: '2rem',
            borderRadius: '16px',
            color: 'white',
            maxWidth: '500px',
            width: '90%',
            zIndex: 50,
            backdropFilter: 'blur(10px)'
        }}>
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                }}
            >
                ✕
            </button>

            <h2 style={{
                margin: '0 0 1rem 0',
                color: selectedRoom.color,
                fontSize: '1.8rem',
                textTransform: 'uppercase',
                letterSpacing: '2px'
            }}>
                {selectedRoom.id} // {selectedRoom.name}
            </h2>

            <div style={{
                width: '100%',
                height: '250px',
                background: `url(${selectedRoom.image}) center/cover no-repeat`,
                borderRadius: '8px',
                marginBottom: '1.5rem',
                border: '1px solid rgba(255,255,255,0.1)'
            }} />

            <p style={{
                lineHeight: 1.6,
                color: '#cbd5e1',
                fontSize: '1rem'
            }}>
                {selectedRoom.description}
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', fontSize: '0.8rem', color: '#64748b' }}>
                <span>LEVEL: {selectedRoom.level}</span>
                <span>SECTOR: {selectedRoom.angle}°</span>
                <span>TYPE: {selectedRoom.type?.toUpperCase()}</span>
            </div>
        </div>
    );
}

export default function Bunker3D() {
    const [selectedRoom, setSelectedRoom] = useState(null);

    return (
        <div style={{ width: '100%', height: '100vh', background: '#0f172a', position: 'relative' }}>

            {/* Header Overlay */}
            <div style={{
                position: 'absolute',
                top: 20,
                left: 20,
                zIndex: 10,
                color: 'white',
                pointerEvents: 'none'
            }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#38bdf8' }}>BUNKER OS v9.2</h1>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>Secure Facility Visualization</p>
            </div>

            <div style={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                zIndex: 10,
                color: 'white',
                pointerEvents: 'none',
                fontSize: '0.8rem',
                opacity: 0.5
            }}>
                Double click to rotate • Scroll to zoom • Click nodes for details
            </div>

            <Canvas camera={{ position: [15, 10, 15], fov: 45 }}>
                <fog attach="fog" args={['#0f172a', 10, 40]} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

                <Suspense fallback={null}>
                    <BunkerView
                        onSelectRoom={setSelectedRoom}
                        selectedRoomId={selectedRoom?.id}
                    />
                </Suspense>

                <OrbitControls
                    enablePan={false}
                    minDistance={10}
                    maxDistance={30}
                    autoRotate={!selectedRoom}
                    autoRotateSpeed={0.5}
                />
            </Canvas>

            <UIOverlay
                selectedRoom={selectedRoom}
                onClose={() => setSelectedRoom(null)}
            />
        </div>
    );
}
