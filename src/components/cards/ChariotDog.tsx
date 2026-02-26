import React from 'react';

export default function ChariotDog() {
  return (
    <g>
      <circle cx="-35" cy="-50" r="2" fill="#FFD700" />
      <circle cx="35" cy="-45" r="2" fill="#FFD700" />
      <circle cx="0" cy="-60" r="3" fill="#FFD700" />
      <g transform="translate(0, -25)">
        <ellipse cx="0" cy="10" rx="22" ry="18" fill="#2d2d2d" />
        <ellipse cx="0" cy="12" rx="12" ry="10" fill="white" />
        <circle cx="0" cy="-8" r="20" fill="#2d2d2d" />
        <ellipse cx="0" cy="-3" rx="12" ry="10" fill="white" />
        <polygon points="-12,-25 -16,-40 -6,-27" fill="#1a1a1a" />
        <polygon points="12,-25 16,-40 6,-27" fill="#1a1a1a" />
        <ellipse cx="-6" cy="-10" rx="4" ry="5" fill="#4169E1" />
        <ellipse cx="6" cy="-10" rx="4" ry="5" fill="#4169E1" />
        <circle cx="-4" cy="-11" r="1.5" fill="white" />
        <circle cx="8" cy="-11" r="1.5" fill="white" />
        <ellipse cx="0" cy="0" rx="5" ry="4" fill="#1a1a1a" />
      </g>
      <line x1="-15" y1="0" x2="-25" y2="30" stroke="#8B4513" strokeWidth="2" />
      <line x1="15" y1="0" x2="25" y2="30" stroke="#8B4513" strokeWidth="2" />
      <rect x="-30" y="30" width="60" height="25" rx="5" fill="#4682B4" />
      <rect x="-25" y="35" width="50" height="15" fill="#FFD700" />
      <g transform="translate(-22, 42)">
        <circle cx="0" cy="0" r="8" fill="#E8E8E8" />
        <circle cx="-3" cy="-2" r="2" fill="#2d1b4e" />
        <circle cx="3" cy="-2" r="2" fill="#2d1b4e" />
      </g>
      <g transform="translate(22, 42)">
        <circle cx="0" cy="0" r="8" fill="#8B4513" />
        <circle cx="-3" cy="-2" r="2" fill="#2d1b4e" />
        <circle cx="3" cy="-2" r="2" fill="#2d1b4e" />
      </g>
    </g>
  );
}
