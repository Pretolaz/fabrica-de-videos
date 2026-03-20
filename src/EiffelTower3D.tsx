import React, {Suspense} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {ThreeCanvas} from '@remotion/three';

const EiffelModel: React.FC<{rotation: [number, number, number], scale: number}> = ({rotation, scale}) => {
    // Definimos uma estrutura 3D simples caso o carregamento do modelo falhe ou demore demais.
    // O usuário verá uma representação estilizada "low-poly" da torre.
    
    return (
        <group rotation={rotation} scale={[scale, scale, scale]}>
            {/* Base */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[4, 0.5, 4]} />
                <meshStandardMaterial color="#8b5a2b" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Nível 1 */}
            <mesh position={[0, 1.5, 0]}>
                <boxGeometry args={[3, 3, 3]} />
                <meshStandardMaterial color="#8b5a2b" wireframe />
            </mesh>
            
            {/* Nível 2 */}
            <mesh position={[0, 4.5, 0]}>
                <boxGeometry args={[2, 4, 2]} />
                <meshStandardMaterial color="#a0522d" wireframe />
            </mesh>

            {/* Topo / Antena */}
            <mesh position={[0, 7.5, 0]}>
                <coneGeometry args={[1, 3, 4]} />
                <meshStandardMaterial color="#cd853f" />
            </mesh>

            {/* Luzes Estilizadas ao redor */}
            {Array.from({length: 8}).map((_, i) => (
                <pointLight 
                    key={i}
                    position={[
                        Math.cos((i / 8) * Math.PI * 2) * 5,
                        2 + Math.sin(frame / 20) * 2,
                        Math.sin((i / 8) * Math.PI * 2) * 5
                    ]}
                    color="#ffd700" 
                    intensity={0.5} 
                />
            ))}
        </group>
    );
};

export const EiffelTower3D: React.FC = () => {
    const frame = useCurrentFrame();
    const {width, height, fps} = useVideoConfig();

    // Animação da câmera e rotação
    const entry = spring({
        frame,
        fps,
        config: {damping: 12, stiffness: 100},
        durationInFrames: 60
    });

    const rotationY = (frame / 120) * Math.PI * 2;
    const towerScale = interpolate(entry, [0, 1], [0, 1]);
    const cameraY = interpolate(frame, [0, 150], [5, 10]);

    return (
        <AbsoluteFill style={{
            background: 'radial-gradient(circle, #0f172a 0%, #020617 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {/* Título Paris */}
            <div style={{
                position: 'absolute',
                top: 80,
                width: '100%',
                textAlign: 'center',
                color: '#fff',
                fontFamily: 'system-ui, serif',
                fontSize: 120,
                fontWeight: 900,
                letterSpacing: 20,
                opacity: interpolate(frame, [20, 50], [0, 0.4]),
                textTransform: 'uppercase'
            }}>
                PARIS
            </div>

            <Suspense fallback={null}>
                <ThreeCanvas width={width} height={height} style={{background: 'transparent'}}>
                    <ambientLight intensity={0.6} />
                    <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={2} color="#ffffff" />
                    <EiffelModel rotation={[0, rotationY, 0]} scale={towerScale} />
                </ThreeCanvas>
            </Suspense>

            {/* Overlay Gradient for high premium look */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: '40%',
                background: 'linear-gradient(to top, #020617, transparent)',
                pointerEvents: 'none'
            }} />
        </AbsoluteFill>
    );
};
