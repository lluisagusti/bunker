
import React, { useState, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Stars, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { bunkerData } from './data/bunkerData';

// --- Global Hacker Styles ---
const HackerStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

        body {
            background-color: #000;
            color: #0f0;
            font-family: 'Share Tech Mono', monospace;
            overflow: hidden;
        }

        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }

        @keyframes flicker {
            0% { opacity: 0.97; }
            5% { opacity: 0.95; }
            10% { opacity: 0.9; }
            15% { opacity: 0.95; }
            20% { opacity: 0.99; }
            25% { opacity: 0.95; }
            30% { opacity: 0.9; }
            35% { opacity: 0.96; }
            40% { opacity: 0.98; }
            45% { opacity: 0.95; }
            50% { opacity: 0.99; }
            55% { opacity: 0.93; }
            60% { opacity: 0.9; }
            65% { opacity: 0.96; }
            70% { opacity: 1; }
            75% { opacity: 0.97; }
            80% { opacity: 0.95; }
            85% { opacity: 0.92; }
            90% { opacity: 0.98; }
            95% { opacity: 0.99; }
            100% { opacity: 0.96; }
        }

        .crt::before {
            content: " ";
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            z-index: 2;
            background-size: 100% 2px, 3px 100%;
            pointer-events: none;
        }

        .crt::after {
            content: " ";
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background: rgba(18, 16, 16, 0.1);
            opacity: 0;
            z-index: 2;
            pointer-events: none;
            animation: flicker 0.15s infinite;
        }

        .scanline {
            width: 100%;
            height: 100px;
            z-index: 10;
            background: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(32, 255, 77, 0.1) 50%, rgba(0,0,0,0) 100%);
            opacity: 0.1;
            position: absolute;
            bottom: 100%;
            animation: scanline 10s linear infinite;
            pointer-events: none;
        }

        .hacker-box {
            background: rgba(0, 20, 0, 0.9);
            border: 1px solid #33ff33;
            box-shadow: 0 0 20px rgba(51, 255, 51, 0.2), inset 0 0 20px rgba(51, 255, 51, 0.1);
            color: #33ff33;
            text-shadow: 0 0 5px rgba(51, 255, 51, 0.8);
        }

        .hacker-btn {
            background: transparent;
            border: 1px solid #33ff33;
            color: #33ff33;
            padding: 5px 10px;
            cursor: pointer;
            font-family: inherit;
            text-transform: uppercase;
            transition: all 0.2s;
        }
        .hacker-btn:hover {
            background: #33ff33;
            color: #000;
            box-shadow: 0 0 15px rgba(51, 255, 51, 0.8);
        }
        
        .hacker-btn.active {
            background: #33ff33;
            color: #000;
            box-shadow: 0 0 15px rgba(51, 255, 51, 0.8);
        }

        .typewriter-text {
            overflow: hidden;
            white-space: pre-wrap;
            animation: typing 2s steps(40, end);
        }

        /* Mobile Responsive Overlay */
        .hacker-popup {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 2rem;
            border-radius: 4px;
            max-width: 600px;
            width: 90%;
            z-index: 50;
            backdrop-filter: blur(5px);
            font-family: 'Share Tech Mono', monospace;
            cursor: pointer;
        }

        .hacker-popup-content {
            display: flex;
            gap: 20px;
            align-items: flex-start;
        }

        .hacker-popup-img {
            width: 200px;
            height: 150px;
            border: 1px solid #33ff33;
            position: relative;
            flex-shrink: 0;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
        }
        
        @media (max-width: 768px) {
            .hacker-popup {
                padding: 1rem;
                width: 95%;
                max-height: 90vh; /* Prevent going off screen */
                display: flex;
                flex-direction: column;
            }
            .hacker-popup-content {
                flex-direction: column;
                align-items: stretch;
                gap: 10px;
            }
            .hacker-popup-img {
                width: 100%;
                height: 120px; /* Shorter image on mobile */
                margin: 0 auto;
            }
            .hacker-popup h2 {
                font-size: 1.4rem !important;
            }
            .hacker-popup-scroll {
                overflow-y: auto;
                max-height: 60vh;
                padding-right: 5px;
            }
        }
    `}</style>
);

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

            {/* Spiral Staircase */}
            <SpiralStaircase />
        </group>
    );
}

function SpiralStaircase() {
    // Generate steps
    const stepCount = 480; // High count for "tiny steps" feel
    const height = 30; // Total height matching shaft
    const radius = 2.1; // Slightly larger than elevator (1.5 width => ~1.1 radius) but smaller than shaft (2.5)
    const turns = 5; // Number of full rotations

    const steps = Array.from({ length: stepCount }, (_, i) => {
        const t = i / stepCount;
        const angle = t * Math.PI * 2 * turns;
        const y = (t * height) - (height / 2) - 2; // Centered vertically, offset like shaft

        return (
            <group key={i} position={[0, y, 0]} rotation={[0, -angle, 0]}>
                <mesh position={[radius, 0, 0]}>
                    <boxGeometry args={[0.125, 0.0125, 0.05]} /> {/* Tiny step: 25% of original */}
                    <meshStandardMaterial
                        color="#a5f3fc"
                        transparent
                        opacity={0.3}
                        side={THREE.DoubleSide}
                        metalness={0.8}
                    />
                </mesh>
            </group>
        );
    });

    return <group>{steps}</group>;
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

function Room({ data, position, onClick, isSelected, language }) {
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
                    pointerEvents: 'none',
                    fontFamily: "'Share Tech Mono', monospace"
                }}>
                    {data.name[language]}
                </div>
            </Html>
        </group>
    );
}

function InterRoomTube({ p1, p2 }) {
    const start = new THREE.Vector3(...p1);
    const end = new THREE.Vector3(...p2);
    const distance = start.distanceTo(end);
    const center = start.clone().add(end).multiplyScalar(0.5);

    // Get direction vector
    const direction = end.clone().sub(start).normalize();

    // Create quaternion to rotate from up (0,1,0) to direction
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

    return (
        <mesh position={center} quaternion={quaternion}>
            <cylinderGeometry args={[0.1, 0.1, distance, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
    );
}

function BunkerView({ onSelectRoom, selectedRoomId, language }) {
    // Convert spherical coords to cartesian for room placement
    // level maps to Y, angle maps to X/Z
    const radius = 8;
    const levelHeight = 4;
    const verticalOffset = 8;

    // Pre-calculate positions
    const roomPositions = bunkerData.map(room => {
        const rad = (room.angle * Math.PI) / 180;
        const x = Math.sin(rad) * radius;
        const z = Math.cos(rad) * radius;
        const y = room.level * levelHeight + verticalOffset;
        return { ...room, position: [x, y, z] };
    });

    // Find connections
    const connections = [];
    for (let i = 0; i < roomPositions.length; i++) {
        for (let j = i + 1; j < roomPositions.length; j++) {
            const r1 = roomPositions[i];
            const r2 = roomPositions[j];
            const dist = new THREE.Vector3(...r1.position).distanceTo(new THREE.Vector3(...r2.position));

            // Connect if close enough (threshold ~12 units covers adjacent sectors/levels)
            // But ensure they aren't too close (overlapping)
            if (dist < 12 && dist > 1) {
                connections.push({
                    key: `${r1.id}-${r2.id}`,
                    p1: r1.position,
                    p2: r2.position
                });
            }
        }
    }

    return (
        <group>
            <CentralShaft />

            {/* Inter-room connectors */}
            {connections.map(conn => (
                <InterRoomTube key={conn.key} p1={conn.p1} p2={conn.p2} />
            ))}

            {roomPositions.map((room) => {
                return (
                    <React.Fragment key={room.id}>
                        <ConnectionTube from={[0, room.position[1], 0]} toRoom={{ position: room.position }} />
                        <Room
                            data={room}
                            position={room.position}
                            onClick={onSelectRoom}
                            isSelected={selectedRoomId === room.id}
                            language={language}
                        />
                    </React.Fragment>
                );
            })}
        </group>
    );
}

// --- 2D Overlay ---
function UIOverlay({ selectedRoom, onClose, language }) {
    if (!selectedRoom) return null;

    return (
        <div
            className="hacker-box hacker-popup"
            onClick={onClose}
        >
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '30px',
                background: 'rgba(51, 255, 51, 0.1)',
                borderBottom: '1px solid #33ff33',
                display: 'flex',
                alignItems: 'center',
                padding: '0 10px',
                fontSize: '0.8rem'
            }}>
                <span>TERMINAL_ACCESS_GRANTED :: {selectedRoom.id.toUpperCase()}</span>
                <button
                    onClick={onClose}
                    className="hacker-btn"
                    style={{ marginLeft: 'auto', border: 'none', fontSize: '1.2rem', padding: '0 5px' }}
                >
                    ✕
                </button>
            </div>

            <div className="hacker-popup-scroll" style={{ marginTop: '30px', display: 'flex', gap: '20px', flexDirection: 'column' }}>
                <div className="hacker-popup-content">
                    <div
                        className="hacker-popup-img"
                        style={{ backgroundImage: `url(${selectedRoom.image})` }}
                    >
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            background: '#000',
                            color: '#33ff33',
                            fontSize: '0.7rem',
                            padding: '2px 4px'
                        }}>IMG_REF_0{Math.floor(Math.random() * 99)}</div>
                    </div>

                    <div>
                        <h2 style={{
                            margin: '0 0 10px 0',
                            color: '#33ff33',
                            fontSize: '1.8rem',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            borderBottom: '1px dashed #33ff33',
                            paddingBottom: '5px'
                        }}>
                            {selectedRoom.name[language]}
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem', color: 'rgba(51, 255, 51, 0.8)' }}>
                            <div>&gt; LEVEL: {selectedRoom.level}</div>
                            <div>&gt; SECTOR: {selectedRoom.angle}°</div>
                            <div>&gt; TYPE: {selectedRoom.type?.toUpperCase()}</div>
                            <div>&gt; STATUS: {language === 'en' ? 'ONLINE' : 'EN LÍNEA'}</div>
                        </div>
                    </div>
                </div>

                <div style={{
                    border: '1px solid rgba(51, 255, 51, 0.3)',
                    padding: '15px',
                    background: 'rgba(0, 20, 0, 0.5)',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '10px',
                        background: '#0a0a0a',
                        padding: '0 5px',
                        color: '#33ff33',
                        fontSize: '0.8rem'
                    }}>LOG_ENTRY</div>
                    <p style={{
                        lineHeight: 1.6,
                        color: '#ccffcc',
                        fontSize: '1rem',
                        margin: 0,
                        whiteSpace: 'pre-wrap'
                    }}>
                        {selectedRoom.description[language]}
                        <span style={{ animation: 'flicker 1s infinite' }}>_</span>
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button className="hacker-btn" style={{ flex: 1 }}>{language === 'en' ? 'RUN_DIAGNOSTIC' : 'EJECUTAR_DIAG'}</button>
                    <button className="hacker-btn" style={{ flex: 1 }}>{language === 'en' ? 'OVERRIDE_LOCK' : 'ANULAR_CIERRE'}</button>
                    <button className="hacker-btn" style={{ flex: 1 }}>{language === 'en' ? 'VIEW_LOGS' : 'VER_REGISTROS'}</button>
                </div>
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

function Rock({ position, scale = 1, rotation }) {
    return (
        <mesh position={position} rotation={rotation} scale={scale}>
            <dodecahedronGeometry args={[0.8, 0]} />
            <meshStandardMaterial color="#57534e" roughness={0.9} />
        </mesh>
    );
}

function Terrain() {
    // Generate random trees and rocks
    const trees = useMemo(() => Array.from({ length: 40 }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = 8 + Math.random() * 25;
        return {
            x: Math.sin(angle) * radius,
            z: Math.cos(angle) * radius,
            key: i
        };
    }), []);

    const rocks = useMemo(() => Array.from({ length: 20 }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = 5 + Math.random() * 30;
        return {
            x: Math.sin(angle) * radius,
            z: Math.cos(angle) * radius,
            scale: 0.5 + Math.random(),
            rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
            key: i
        };
    }), []);

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
            {rocks.map(r => <Rock key={r.key} position={[r.x, 0.4, r.z]} scale={r.scale} rotation={r.rotation} />)}

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
    const [language, setLanguage] = useState('en'); // 'en' or 'es'

    return (
        <div className="crt" style={{ width: '100%', height: '100vh', background: '#000', position: 'relative' }}>
            <HackerStyles />
            <div className="scanline"></div>

            {/* Header Overlay */}
            <div style={{
                position: 'absolute',
                top: 20,
                left: 20,
                zIndex: 10,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                width: 'calc(100% - 40px)',
                pointerEvents: 'none'
            }}>
                <div>
                    <div style={{
                        borderBottom: '2px solid #33ff33',
                        paddingBottom: '5px',
                        marginBottom: '5px',
                        display: 'inline-block'
                    }}>
                        <h1 style={{
                            margin: 0,
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            color: '#33ff33',
                            textShadow: '0 0 10px rgba(51, 255, 51, 0.8)'
                        }}>
                            &gt; BUNKER_OS v9.2
                        </h1>
                    </div>
                    <p style={{
                        margin: 0,
                        fontSize: '1rem',
                        color: '#33ff33',
                        opacity: 0.8,
                        fontFamily: 'monospace'
                    }}>
                        [{language === 'en' ? 'SECURE FACILITY VISUALIZATION' : 'VISUALIZACIÓN DE INSTALACIÓN SEGURA'}] :: [{language === 'en' ? 'SYSTEM ONLINE' : 'SISTEMA CONECTADO'}]
                    </p>
                </div>

                {/* Language Switcher */}
                <div style={{ pointerEvents: 'auto', display: 'flex', gap: '5px' }}>
                    <button
                        className={`hacker-btn ${language === 'en' ? 'active' : ''}`}
                        onClick={() => setLanguage('en')}
                    >
                        EN
                    </button>
                    <button
                        className={`hacker-btn ${language === 'es' ? 'active' : ''}`}
                        onClick={() => setLanguage('es')}
                    >
                        ES
                    </button>
                </div>
            </div>

            <div style={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                zIndex: 10,
                color: '#33ff33',
                pointerEvents: 'none',
                fontSize: '0.9rem',
                opacity: 0.7,
                textShadow: '0 0 5px rgba(51, 255, 51, 0.5)'
            }}>
                &gt; {language === 'en' ? 'CONTROLS: DOUBLE_CLICK=ROTATE | SCROLL=ZOOM | CLICK_NODES=ACCESS_DATA' : 'CONTROLES: DOBLE_CLIC=ROTAR | SCROLL=ZOOM | CLIC_NODOS=ACCESO_DATOS'}
            </div>

            <Canvas camera={{ position: [20, 10, 20], fov: 50 }}>
                <fog attach="fog" args={['#000500', 20, 90]} /> {/* Greenish fog */}
                <ambientLight intensity={0.2} color="#ccffcc" />
                <spotLight position={[50, 50, 20]} angle={0.5} penumbra={1} intensity={1} castShadow color="#aaffaa" />
                <pointLight position={[-10, -20, -10]} intensity={0.5} color="#00ff00" />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

                <Suspense fallback={null}>
                    <group position={[0, -12, 0]}>
                        <BunkerView
                            onSelectRoom={setSelectedRoom}
                            selectedRoomId={selectedRoom?.id}
                            language={language}
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
                language={language}
            />
        </div>
    );
}
