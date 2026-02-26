import React from 'react';

export default function TemperanceDog() {
  return (
    <g>
      <ellipse cx="0" cy="50" rx="45" ry="10" fill="#87CEEB" opacity="0.5" />
      <ellipse cx="0" cy="20" rx="28" ry="24" fill="#4a4a4a" />
      <ellipse cx="-10" cy="22" rx="8" ry="6" fill="#C0C0C0" />
      <ellipse cx="10" cy="18" rx="6" ry="8" fill="#1a1a1a" />
      <ellipse cx="0" cy="28" rx="15" ry="10" fill="white" />
      <circle cx="0" cy="-10" r="25" fill="#4a4a4a" />
      <ellipse cx="-12" cy="-15" rx="8" ry="10" fill="#C0C0C0" />
      <ellipse cx="10" cy="-5" rx="6" ry="8" fill="#1a1a1a" />
      <path d="M-5,-35 L0,-5 L5,-35 Q0,-38 -5,-35" fill="white" />
      <ellipse cx="-20" cy="-25" rx="10" ry="14" fill="#4a4a4a" />
      <ellipse cx="20" cy="-25" rx="10" ry="14" fill="#4a4a4a" />
      <ellipse cx="-8" cy="-12" rx="5" ry="6" fill="#87CEEB" />
      <ellipse cx="8" cy="-12" rx="5" ry="6" fill="#8B4513" />
      <circle cx="-6" cy="-13" r="2" fill="white" />
      <circle cx="10" cy="-13" r="2" fill="white" />
      <ellipse cx="0" cy="2" rx="5" ry="4" fill="#1a1a1a" />
      <g transform="translate(-28, -5)">
        <path d="M-8,0 L-5,15 L5,15 L8,0 Z" fill="#FFD700" />
        <ellipse cx="0" cy="0" rx="8" ry="3" fill="#FFD700" />
      </g>
      <g transform="translate(28, 5)">
        <path d="M-8,0 L-5,15 L5,15 L8,0 Z" fill="#FFD700" />
        <ellipse cx="0" cy="0" rx="8" ry="3" fill="#FFD700" />
      </g>
      <path d="M-20,5 Q0,-10 20,10" fill="none" stroke="#87CEEB" strokeWidth="4" opacity="0.7" />
    </g>
  );
}
