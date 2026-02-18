
import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Stars, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { bunkerData } from './data/bunkerData';

// Re-use logic or styles if needed, but this is a fresh 3D implementation.

// --- 3D Components ---

function CentralShaft() {
    // Structural rings array
    const rings = Array.from({ length: 15 }, (_, i) => i * 2 - 14);

    return (
        <group>
            {/* Main Outer Glass Shell */}
            <mesh position={[0, -2, 0]}>
                <cylinderGeometry args={[2.5, 2.5, 30, 32, 1, true]} />
                <meshStandardMaterial
                    color="#0f172a"
                    opacity={0.3}
                    transparent
                    side={THREE.DoubleSide}
                    roughness={0.1}
                    metalness={0.9}
                />
            </mesh>

            {/* Inner Core Energy Beam */}
            <mesh position={[0, -2, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 30, 16]} />
                <meshBasicMaterial color="#06b6d4" transparent opacity={0.5} />
            </mesh>
            {/* Core Glow */}
            <mesh position={[0, -2, 0]}>
                <cylinderGeometry args={[0.6, 0.6, 30, 16]} />
                <meshBasicMaterial color="#06b6d4" transparent opacity={0.1} depthWrite={false} side={THREE.BackSide} />
            </mesh>

            {/* Structural Rings */}
            {rings.map((y, i) => (
                <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[2.6, 0.15, 8, 32]} />
                    <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
                </mesh>
            ))}

            {/* Vertical Guide Rails */}
            {[0, 90, 180, 270].map((angle, i) => (
                <group key={i} rotation={[0, (angle * Math.PI) / 180, 0]}>
                    <mesh position={[2.4, -2, 0]}>
                        <boxGeometry args={[0.2, 30, 0.4]} />
                        <meshStandardMaterial color="#334155" metalness={0.7} />
                    </mesh>
                </group>
            ))}

            {/* Elevator Platforms */}
            <Elevator y={0} speed={0.1} offset={0} />
        </group>
    );
}

function Elevator({ y, speed, offset }) {
    const ref = useRef();
    useFrame((state) => {
        const time = state.clock.elapsedTime * speed + offset;
        ref.current.position.y = Math.sin(time) * 10 - 2;
    });

    return (
        <group ref={ref}>
            {/* Cabin Box - Glass with Metal Frame */}
            <mesh position={[0, 1, 0]}>
                <boxGeometry args={[1.5, 2.2, 1.5]} />
                <meshStandardMaterial
                    color="#94a3b8"
                    transparent
                    opacity={0.3}
                    metalness={0.9}
                    roughness={0.1}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Metal Frame edges */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1.55, 0.1, 1.55]} />
                <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
            <mesh position={[0, 2.1, 0]}>
                <boxGeometry args={[1.55, 0.1, 1.55]} />
                <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>

            {/* Interior Light */}
            <pointLight position={[0, 1.8, 0]} distance={4} intensity={0.8} color="#fef3c7" />

            {/* Floor */}
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[1.4, 1.4]} />
                <meshStandardMaterial color="#475569" />
            </mesh>
        </group>
    );
}

function ConnectionTube({ from, toRoom }) {
    // A simple tube from center [0, y, 0] to room position [x, y, z]
    // The room position is calculated from level and angle in Bunker3D main loop

    // Calculate vector to room
    const roomPos = new THREE.Vector3(toRoom.position[0], toRoom.position[1], toRoom.position[2]);
    const centerPos = new THREE.Vector3(0, toRoom.position[1], 0);

    // Shaft radius (from CentralShaft component)
    const shaftRadius = 2.5;

    // Length is distance - room radius (approx 2.25 for 4.5 depth) - shaft radius
    // We want it to start at shaftRadius and end at roomPos (minus a bit for overlap if needed)
    const totalDist = roomPos.distanceTo(centerPos);
    const tubeLength = totalDist - shaftRadius - 2.2; // Subtract room radius approx

    // Angle
    const angle = Math.atan2(roomPos.x, roomPos.z);

    // Position: Move from center by (shaftRadius + tubeLength/2) in direction of room
    const radius = shaftRadius + tubeLength / 2;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    return (
        <mesh
            position={[x, roomPos.y, z]}
            rotation={[0, angle + Math.PI / 2, Math.PI / 2]}
        >
            <cylinderGeometry args={[0.3, 0.3, tubeLength, 8]} />
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
                <boxGeometry args={[4.5, 3, 4.5]} />
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
                const verticalOffset = 8; // Move rooms closer to surface (relative to group at -12)
                const y = room.level * levelHeight + verticalOffset;
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
            backdropFilter: 'blur(10px)',
            fontFamily: "'Share Tech Mono'"
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

// --- Environment Components ---

function Tree({ position }) {
    return (
        <group position={position}>
            {/* Trunk */}
            <mesh position={[0, 1, 0]}>
                <cylinderGeometry args={[0.2, 0.4, 2, 8]} />
                <meshStandardMaterial color="#3f2e18" roughness={0.9} />
            </mesh>
            {/* Leaves */}
            <mesh position={[0, 3, 0]}>
                <coneGeometry args={[1.5, 3, 8]} />
                <meshStandardMaterial color="#166534" roughness={0.8} />
            </mesh>
            <mesh position={[0, 4.5, 0]}>
                <coneGeometry args={[1.2, 2.5, 8]} />
                <meshStandardMaterial color="#166534" roughness={0.8} />
            </mesh>
        </group>
    );
}

function Rock({ position, scale = 1 }) {
    return (
        <mesh position={position} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]} scale={scale}>
            <dodecahedronGeometry args={[0.8, 0]} />
            <meshStandardMaterial color="#57534e" roughness={0.9} />
        </mesh>
    );
}

function Terrain() {
    // Generate random trees and rocks
    const trees = Array.from({ length: 40 }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = 8 + Math.random() * 25;
        return {
            x: Math.sin(angle) * radius,
            z: Math.cos(angle) * radius,
            key: i
        };
    });

    const rocks = Array.from({ length: 20 }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = 5 + Math.random() * 30;
        return {
            x: Math.sin(angle) * radius,
            z: Math.cos(angle) * radius,
            scale: 0.5 + Math.random(),
            key: i
        };
    });

    return (
        <group position={[0, 0, 0]}>
            {/* Ground Plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[100, 100, 32]} />
                <meshStandardMaterial color="#1c1917" roughness={1} />
            </mesh>

            {/* Grass/Forest Floor Visuals */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                <circleGeometry args={[50, 64]} />
                <meshStandardMaterial
                    color="#14532d"
                    roughness={1}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Trees */}
            {trees.map(t => <Tree key={t.key} position={[t.x, 0, t.z]} />)}

            {/* Rocks */}
            {rocks.map(r => <Rock key={r.key} position={[r.x, 0.4, r.z]} scale={r.scale} />)}

            {/* Shaft Opening (Concrete Ring) */}
            <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[2.5, 4, 32]} />
                <meshStandardMaterial color="#44403c" roughnes={0.8} />
            </mesh>
        </group>
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

            <Canvas camera={{ position: [20, 10, 20], fov: 50 }}>
                <fog attach="fog" args={['#020617', 20, 90]} />
                <ambientLight intensity={0.4} color="#a5f3fc" />
                <spotLight position={[50, 50, 20]} angle={0.5} penumbra={1} intensity={1.5} castShadow color="#f0f9ff" />
                <pointLight position={[-10, -20, -10]} intensity={0.5} color="#06b6d4" />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

                <Suspense fallback={null}>
                    <group position={[0, -12, 0]}>
                        <BunkerView
                            onSelectRoom={setSelectedRoom}
                            selectedRoomId={selectedRoom?.id}
                        />
                    </group>
                    <Terrain />
                </Suspense>

                <OrbitControls
                    enablePan={true}
                    minDistance={10}
                    maxDistance={60}
                    maxPolarAngle={Math.PI / 1.8}
                    autoRotate={false}
                    autoRotateSpeed={0.5}
                    target={[0, -5, 0]}
                />
            </Canvas>

            <UIOverlay
                selectedRoom={selectedRoom}
                onClose={() => setSelectedRoom(null)}
            />
        </div>
    );
}
