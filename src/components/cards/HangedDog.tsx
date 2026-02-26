import React from 'react';

export default function HangedDog() {
  return (
    <g>
      <path d="M-40,-55 Q0,-50 40,-55" fill="none" stroke="#228B22" strokeWidth="8" />
      <ellipse cx="-35" cy="-55" rx="15" ry="10" fill="#228B22" />
      <ellipse cx="35" cy="-55" rx="15" ry="10" fill="#228B22" />
      <line x1="0" y1="-50" x2="0" y2="-20" stroke="#8B4513" strokeWidth="3" />
      <g transform="rotate(180)">
        <ellipse cx="-20" cy="-45" rx="12" ry="30" fill="#8B4513" />
        <ellipse cx="20" cy="-45" rx="12" ry="30" fill="#8B4513" />
        <ellipse cx="0" cy="0" rx="28" ry="18" fill="#FFFAF0" />
        <ellipse cx="-15" cy="0" rx="12" ry="10" fill="#8B4513" />
        <ellipse cx="15" cy="0" rx="12" ry="10" fill="#8B4513" />
        <ellipse cx="0" cy="-22" rx="22" ry="18" fill="#FFFAF0" />
        <ellipse cx="-10" cy="-18" rx="10" ry="12" fill="#8B4513" />
        <ellipse cx="10" cy="-18" rx="10" ry="12" fill="#8B4513" />
        <path d="M-12,-22 Q-8,-18 -4,-22" fill="none" stroke="#2d1b4e" strokeWidth="2" />
        <path d="M4,-22 Q8,-18 12,-22" fill="none" stroke="#2d1b4e" strokeWidth="2" />
        <ellipse cx="0" cy="-10" rx="6" ry="5" fill="#1a1a1a" />
        <path d="M-6,-5 Q0,0 6,-5" fill="none" stroke="#2d1b4e" strokeWidth="1.5" />
        <ellipse cx="0" cy="25" rx="15" ry="5" fill="none" stroke="#FFD700" strokeWidth="2" />
      </g>
    </g>
  );
}
