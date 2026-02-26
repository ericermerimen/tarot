import React from 'react';

export default function WorldDog() {
  return (
    <g>
      <ellipse cx="0" cy="0" rx="48" ry="55" fill="none" stroke="#228B22" strokeWidth="8" />
      {[...Array(16)].map((_, i) => {
        const angle = (i * 22.5 * Math.PI) / 180;
        const x = Math.cos(angle) * 48;
        const y = Math.sin(angle) * 55;
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx="6"
            ry="3"
            fill="#228B22"
            transform={`rotate(${i * 22.5 + 90} ${x} ${y})`}
          />
        );
      })}
      {([
        [-42, -50, '#87CEEB'],
        [42, -50, '#DC143C'],
        [-42, 50, '#228B22'],
        [42, 50, '#4169E1'],
      ] as const).map(([x, y, color], i) => (
        <g key={i} transform={`translate(${x}, ${y})`}>
          <circle cx="0" cy="0" r="8" fill={color} />
          <circle cx="-2" cy="-2" r="1.5" fill="#1a1a1a" />
          <circle cx="2" cy="-2" r="1.5" fill="#1a1a1a" />
          <ellipse cx="0" cy="2" rx="2" ry="1.5" fill="#1a1a1a" />
        </g>
      ))}
      <g transform="translate(0, 5)">
        <ellipse cx="0" cy="15" rx="22" ry="18" fill="#FFFAF0" />
        <ellipse cx="-20" cy="0" rx="6" ry="10" fill="#FFFAF0" transform="rotate(-30 -20 0)" />
        <ellipse cx="20" cy="0" rx="6" ry="10" fill="#FFFAF0" transform="rotate(30 20 0)" />
        <circle cx="0" cy="-15" r="22" fill="#FFFAF0" />
        <ellipse cx="-12" cy="-8" rx="10" ry="8" fill="#FFE4B5" />
        <ellipse cx="12" cy="-8" rx="10" ry="8" fill="#FFE4B5" />
        <polygon points="-15,-32 -22,-50 -6,-35" fill="#FFFAF0" />
        <polygon points="15,-32 22,-50 6,-35" fill="#FFFAF0" />
        <polygon points="-13,-33 -19,-46 -8,-36" fill="#FFE4B5" />
        <polygon points="13,-33 19,-46 8,-36" fill="#FFE4B5" />
        <path d="M-10,-18 Q-6,-13 -2,-18" fill="none" stroke="#2d1b4e" strokeWidth="2" />
        <path d="M2,-18 Q6,-13 10,-18" fill="none" stroke="#2d1b4e" strokeWidth="2" />
        <ellipse cx="-15" cy="-10" rx="4" ry="3" fill="#FFB6C1" opacity="0.6" />
        <ellipse cx="15" cy="-10" rx="4" ry="3" fill="#FFB6C1" opacity="0.6" />
        <ellipse cx="0" cy="-5" rx="4" ry="3" fill="#1a1a1a" />
        <path d="M-6,0 Q0,8 6,0" fill="none" stroke="#2d1b4e" strokeWidth="2" strokeLinecap="round" />
        <path d="M15,20 Q30,10 25,25 Q35,20 28,30" fill="none" stroke="#FFE4B5" strokeWidth="6" />
      </g>
      <circle cx="-30" cy="-30" r="2" fill="#FFD700" />
      <circle cx="30" cy="-25" r="2" fill="#FFD700" />
      <circle cx="0" cy="40" r="2" fill="#FFD700" />
    </g>
  );
}
