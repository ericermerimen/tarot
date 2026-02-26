import React from 'react';

export default function SunDog() {
  return (
    <g>
      <circle cx="0" cy="-45" r="22" fill="#FFD700" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
        <line
          key={i}
          x1={Math.cos((angle * Math.PI) / 180) * 25}
          y1={-45 + Math.sin((angle * Math.PI) / 180) * 25}
          x2={Math.cos((angle * Math.PI) / 180) * 35}
          y2={-45 + Math.sin((angle * Math.PI) / 180) * 35}
          stroke="#FFD700"
          strokeWidth="3"
        />
      ))}
      {[-35, 35].map((x, i) => (
        <g key={i} transform={`translate(${x}, 40)`}>
          <circle cx="0" cy="0" r="10" fill="#FFD700" />
          <circle cx="0" cy="0" r="5" fill="#8B4513" />
          <rect x="-2" y="5" width="4" height="15" fill="#228B22" />
        </g>
      ))}
      <ellipse cx="0" cy="20" rx="28" ry="24" fill="#F5D596" />
      <ellipse cx="0" cy="25" rx="16" ry="12" fill="#FFE4B5" />
      <ellipse cx="28" cy="15" rx="15" ry="8" fill="#F5D596" transform="rotate(-30 28 15)" />
      <circle cx="0" cy="-8" r="26" fill="#F5D596" />
      <ellipse cx="-22" cy="-5" rx="10" ry="18" fill="#E8A642" />
      <ellipse cx="22" cy="-5" rx="10" ry="18" fill="#E8A642" />
      <path d="M-12,-10 Q-8,-5 -4,-10" fill="none" stroke="#2d1b4e" strokeWidth="3" />
      <path d="M4,-10 Q8,-5 12,-10" fill="none" stroke="#2d1b4e" strokeWidth="3" />
      <ellipse cx="0" cy="3" rx="7" ry="5" fill="#1a1a1a" />
      <path d="M-12,10 Q0,25 12,10" fill="#FF9999" stroke="#2d1b4e" strokeWidth="2" />
      <ellipse cx="0" cy="18" rx="6" ry="10" fill="#FF9999" />
    </g>
  );
}
