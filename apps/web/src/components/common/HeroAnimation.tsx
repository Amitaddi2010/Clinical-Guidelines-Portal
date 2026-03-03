'use client';

import { useEffect, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Animated Hero Illustration for Clinical Guidelines Portal          */
/*  Pure CSS + inline SVG — No 3D libraries needed                     */
/* ------------------------------------------------------------------ */

/** Small floating particle */
function Particle({ delay, x, duration }: { delay: number; x: number; duration: number }) {
    return (
        <div
            className="hero-particle"
            style={{
                left: `${x}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
            }}
        />
    );
}

/** Orbiting document icon */
function OrbitingDoc({ delay, radius, speed, icon }: { delay: number; radius: number; speed: number; icon: 'doc' | 'book' | 'clipboard' }) {
    const icons = {
        doc: (
            <svg width="28" height="34" viewBox="0 0 28 34" fill="none">
                <rect x="2" y="2" width="24" height="30" rx="3" stroke="rgba(200,134,10,0.6)" strokeWidth="1.5" fill="rgba(0,48,135,0.3)" />
                <line x1="7" y1="10" x2="21" y2="10" stroke="rgba(200,134,10,0.4)" strokeWidth="1" />
                <line x1="7" y1="14" x2="21" y2="14" stroke="rgba(200,134,10,0.4)" strokeWidth="1" />
                <line x1="7" y1="18" x2="17" y2="18" stroke="rgba(200,134,10,0.4)" strokeWidth="1" />
                <line x1="7" y1="22" x2="19" y2="22" stroke="rgba(200,134,10,0.3)" strokeWidth="1" />
            </svg>
        ),
        book: (
            <svg width="30" height="28" viewBox="0 0 30 28" fill="none">
                <path d="M15 4C12 2 7 2 3 3V24C7 23 12 23 15 25C18 23 23 23 27 24V3C23 2 18 2 15 4Z" stroke="rgba(200,134,10,0.6)" strokeWidth="1.5" fill="rgba(0,48,135,0.25)" />
                <line x1="15" y1="5" x2="15" y2="24" stroke="rgba(200,134,10,0.3)" strokeWidth="1" />
            </svg>
        ),
        clipboard: (
            <svg width="26" height="32" viewBox="0 0 26 32" fill="none">
                <rect x="2" y="4" width="22" height="26" rx="3" stroke="rgba(200,134,10,0.6)" strokeWidth="1.5" fill="rgba(0,48,135,0.3)" />
                <rect x="8" y="1" width="10" height="6" rx="2" stroke="rgba(200,134,10,0.5)" strokeWidth="1" fill="rgba(0,13,54,0.6)" />
                <line x1="7" y1="13" x2="19" y2="13" stroke="rgba(200,134,10,0.4)" strokeWidth="1" />
                <line x1="7" y1="17" x2="19" y2="17" stroke="rgba(200,134,10,0.4)" strokeWidth="1" />
                <line x1="7" y1="21" x2="14" y2="21" stroke="rgba(200,134,10,0.3)" strokeWidth="1" />
                <circle cx="7" cy="25" r="1.5" fill="rgba(72,200,80,0.5)" />
                <line x1="11" y1="25" x2="19" y2="25" stroke="rgba(200,134,10,0.3)" strokeWidth="1" />
            </svg>
        ),
    };

    return (
        <div
            className="hero-orbiting-item"
            style={{
                '--orbit-radius': `${radius}px`,
                '--orbit-speed': `${speed}s`,
                animationDelay: `${delay}s`,
            } as React.CSSProperties}
        >
            <div className="hero-orbit-icon">
                {icons[icon]}
            </div>
        </div>
    );
}

/** Central Healthcare Shield */
function CentralShield() {
    return (
        <div className="hero-central-shield">
            {/* Outer glow rings */}
            <div className="hero-shield-ring hero-shield-ring-1" />
            <div className="hero-shield-ring hero-shield-ring-2" />
            <div className="hero-shield-ring hero-shield-ring-3" />

            {/* Core shield */}
            <div className="hero-shield-core">
                <svg width="80" height="90" viewBox="0 0 80 90" fill="none">
                    {/* Shield outline */}
                    <path
                        d="M40 5L8 18V42C8 62 22 78 40 85C58 78 72 62 72 42V18L40 5Z"
                        fill="url(#shieldGrad)"
                        stroke="rgba(200,134,10,0.7)"
                        strokeWidth="2"
                    />
                    {/* Medical Cross */}
                    <rect x="33" y="28" width="14" height="34" rx="2" fill="rgba(200,134,10,0.85)" />
                    <rect x="23" y="38" width="34" height="14" rx="2" fill="rgba(200,134,10,0.85)" />
                    {/* Inner cross highlight */}
                    <rect x="35" y="30" width="10" height="30" rx="1.5" fill="rgba(255,200,60,0.3)" />
                    <rect x="25" y="40" width="30" height="10" rx="1.5" fill="rgba(255,200,60,0.3)" />
                    <defs>
                        <linearGradient id="shieldGrad" x1="40" y1="5" x2="40" y2="85" gradientUnits="userSpaceOnUse">
                            <stop stopColor="rgba(0,48,135,0.9)" />
                            <stop offset="1" stopColor="rgba(0,26,81,0.95)" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
}

/** DNA Helix SVG animation */
function DNAHelix() {
    return (
        <div className="hero-dna-container">
            <svg width="100%" height="100%" viewBox="0 0 120 400" fill="none" className="hero-dna-svg">
                {/* Back strand */}
                <path
                    d="M20,0 Q100,50 20,100 Q-60,150 20,200 Q100,250 20,300 Q-60,350 20,400"
                    stroke="rgba(0,48,135,0.3)"
                    strokeWidth="2"
                    fill="none"
                    className="hero-dna-strand-back"
                />
                {/* Front strand */}
                <path
                    d="M100,0 Q20,50 100,100 Q180,150 100,200 Q20,250 100,300 Q180,350 100,400"
                    stroke="rgba(200,134,10,0.35)"
                    strokeWidth="2"
                    fill="none"
                    className="hero-dna-strand-front"
                />
                {/* Cross-links */}
                {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
                    const y = i * 50 + 25;
                    const even = i % 2 === 0;
                    return (
                        <line
                            key={i}
                            x1={even ? 35 : 30}
                            y1={y}
                            x2={even ? 85 : 90}
                            y2={y}
                            stroke="rgba(200,134,10,0.2)"
                            strokeWidth="1.5"
                            className="hero-dna-link"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        />
                    );
                })}
                {/* Nodes on cross-links */}
                {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
                    const y = i * 50 + 25;
                    const even = i % 2 === 0;
                    return (
                        <g key={`nodes-${i}`}>
                            <circle cx={even ? 35 : 30} cy={y} r="3" fill="rgba(200,134,10,0.4)" className="hero-dna-node" style={{ animationDelay: `${i * 0.15}s` }} />
                            <circle cx={even ? 85 : 90} cy={y} r="3" fill="rgba(68,136,255,0.4)" className="hero-dna-node" style={{ animationDelay: `${i * 0.15 + 0.08}s` }} />
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

/** Heartbeat / ECG line */
function HeartbeatLine() {
    return (
        <div className="hero-heartbeat">
            <svg viewBox="0 0 300 60" fill="none" className="hero-heartbeat-svg">
                <path
                    d="M0,30 L40,30 L50,30 L60,10 L70,50 L80,5 L90,55 L100,30 L110,30 L150,30 L160,30 L170,10 L180,50 L190,5 L200,55 L210,30 L220,30 L260,30 L270,30 L280,15 L290,45 L300,30"
                    stroke="rgba(200,134,10,0.25)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="hero-heartbeat-path"
                />
            </svg>
        </div>
    );
}

/** Network connection nodes */
function NetworkNodes() {
    const nodes = [
        { x: 15, y: 20, size: 6, delay: 0 },
        { x: 75, y: 15, size: 5, delay: 0.5 },
        { x: 85, y: 70, size: 7, delay: 1 },
        { x: 25, y: 80, size: 5, delay: 1.5 },
        { x: 50, y: 50, size: 8, delay: 0.3 },
        { x: 65, y: 35, size: 4, delay: 0.8 },
        { x: 35, y: 60, size: 5, delay: 1.2 },
        { x: 90, y: 45, size: 4, delay: 0.6 },
    ];

    const connections = [
        [0, 4], [1, 5], [2, 4], [3, 6], [4, 5], [4, 6], [5, 7], [1, 7],
    ];

    return (
        <div className="hero-network">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Connection lines */}
                {connections.map(([from, to], i) => (
                    <line
                        key={`conn-${i}`}
                        x1={nodes[from].x}
                        y1={nodes[from].y}
                        x2={nodes[to].x}
                        y2={nodes[to].y}
                        stroke="rgba(68,136,255,0.12)"
                        strokeWidth="0.3"
                        className="hero-network-line"
                        style={{ animationDelay: `${i * 0.3}s` }}
                    />
                ))}
                {/* Nodes */}
                {nodes.map((node, i) => (
                    <circle
                        key={`node-${i}`}
                        cx={node.x}
                        cy={node.y}
                        r={node.size * 0.15}
                        fill="rgba(200,134,10,0.35)"
                        className="hero-network-node"
                        style={{ animationDelay: `${node.delay}s` }}
                    />
                ))}
            </svg>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Main Exported Component                                            */
/* ------------------------------------------------------------------ */

export function HeroAnimation() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className={`hero-animation-container ${mounted ? 'hero-animation-visible' : ''}`}>
            {/* Background network nodes */}
            <NetworkNodes />

            {/* DNA helix — left side */}
            <DNAHelix />

            {/* Heartbeat line across bottom */}
            <HeartbeatLine />

            {/* Central shield emblem */}
            <CentralShield />

            {/* Orbiting documents */}
            <OrbitingDoc delay={0} radius={140} speed={18} icon="doc" />
            <OrbitingDoc delay={-6} radius={140} speed={18} icon="book" />
            <OrbitingDoc delay={-12} radius={140} speed={18} icon="clipboard" />

            {/* Floating particles */}
            {Array.from({ length: 20 }).map((_, i) => (
                <Particle
                    key={i}
                    delay={i * 0.8}
                    x={Math.random() * 100}
                    duration={4 + Math.random() * 4}
                />
            ))}

            {/* Floating medical icons scattered around */}
            <div className="hero-float-icon hero-float-icon-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="rgba(200,134,10,0.35)" strokeWidth="1.5" fill="none" />
                    <path d="M12 8v8M8 12h8" stroke="rgba(200,134,10,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </div>
            <div className="hero-float-icon hero-float-icon-2">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke="rgba(200,134,10,0.35)" strokeWidth="1.5" fill="rgba(200,134,10,0.1)" />
                </svg>
            </div>
            <div className="hero-float-icon hero-float-icon-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="3" stroke="rgba(68,136,255,0.4)" strokeWidth="1.5" fill="none" />
                    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="rgba(68,136,255,0.3)" strokeWidth="1" strokeLinecap="round" />
                </svg>
            </div>
            <div className="hero-float-icon hero-float-icon-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4" stroke="rgba(72,200,80,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="10" stroke="rgba(72,200,80,0.3)" strokeWidth="1.5" fill="none" />
                </svg>
            </div>
            <div className="hero-float-icon hero-float-icon-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" stroke="rgba(200,134,10,0.35)" strokeWidth="1.5" fill="none" />
                </svg>
            </div>
        </div>
    );
}
