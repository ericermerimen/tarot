import React from 'react';

export default function JudgementDog() {
  return (
    <g>
      <ellipse cx="-30" cy="45" rx="20" ry="10" fill="#E8E8E8" opacity="0.5" />
      <ellipse cx="30" cy="50" rx="18" ry="8" fill="#E8E8E8" opacity="0.5" />
      <ellipse cx="0" cy="48" rx="15" ry="8" fill="#E8E8E8" opacity="0.5" />
      <path d="M-25,-20 Q-50,-10 -55,20 Q-45,10 -35,15 Q-40,0 -25,5" fill="white" stroke="#E8E8E8" strokeWidth="1" />
      <path d="M25,-20 Q50,-10 55,20 Q45,10 35,15 Q40,0 25,5" fill="white" stroke="#E8E8E8" strokeWidth="1" />
      <path d="M-35,-5 Q-45,5 -45,15" fill="none" stroke="#E8E8E8" strokeWidth="1" />
      <path d="M35,-5 Q45,5 45,15" fill="none" stroke="#E8E8E8" strokeWidth="1" />
      <ellipse cx="0" cy="15" rx="22" ry="20" fill="#E8A642" />
      <ellipse cx="0" cy="18" rx="14" ry="12" fill="white" />
      <ellipse cx="0" cy="-12" rx="22" ry="24" fill="#E8A642" />
      <ellipse cx="0" cy="0" rx="12" ry="15" fill="white" />
      <path d="M-6,-35 L0,-5 L6,-35 Q0,-38 -6,-35" fill="white" />
      <ellipse cx="-18" cy="-28" rx="8" ry="16" fill="#E8A642" />
      <ellipse cx="18" cy="-28" rx="8" ry="16" fill="#E8A642" />
      <ellipse cx="-7" cy="-15" rx="4" ry="5" fill="#8B4513" />
      <ellipse cx="7" cy="-15" rx="4" ry="5" fill="#8B4513" />
      <circle cx="-5" cy="-16" r="1.5" fill="white" />
      <circle cx="9" cy="-16" r="1.5" fill="white" />
      <ellipse cx="0" cy="3" rx="5" ry="4" fill="#1a1a1a" />
      <ellipse cx="0" cy="-45" rx="18" ry="6" fill="none" stroke="#FFD700" strokeWidth="3" />
      <g transform="translate(30, -25) rotate(30)">
        <rect x="0" y="-3" width="20" height="6" fill="#FFD700" />
        <ellipse cx="22" cy="0" rx="8" ry="10" fill="#FFD700" />
      </g>
    </g>
  );
}
