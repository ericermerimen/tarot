import React from 'react';

export default function StrengthDog() {
  return (
    <g>
      <circle cx="-35" cy="35" r="8" fill="#FF8C00" />
      <circle cx="35" cy="30" r="6" fill="#FFD700" />
      <ellipse cx="0" cy="25" rx="32" ry="28" fill="#C0C0C0" />
      <ellipse cx="0" cy="30" rx="20" ry="18" fill="white" />
      <ellipse cx="0" cy="-8" rx="28" ry="26" fill="#C0C0C0" />
      <ellipse cx="0" cy="0" rx="18" ry="16" fill="white" />
      <ellipse cx="-20" cy="-28" rx="10" ry="14" fill="#C0C0C0" />
      <ellipse cx="20" cy="-28" rx="10" ry="14" fill="#C0C0C0" />
      <ellipse cx="-9" cy="-10" rx="5" ry="6" fill="#8B4513" />
      <ellipse cx="9" cy="-10" rx="5" ry="6" fill="#8B4513" />
      <circle cx="-7" cy="-12" r="2" fill="white" />
      <circle cx="11" cy="-12" r="2" fill="white" />
      <path d="M-12,-8 Q-9,-5 -6,-8" fill="none" stroke="#8B4513" strokeWidth="1" />
      <path d="M6,-8 Q9,-5 12,-8" fill="none" stroke="#8B4513" strokeWidth="1" />
      <ellipse cx="0" cy="5" rx="7" ry="5" fill="#1a1a1a" />
      <path d="M-10,12 Q0,20 10,12" fill="none" stroke="#2d1b4e" strokeWidth="2" strokeLinecap="round" />
      <g transform="translate(0, -38)">
        <circle cx="-12" cy="0" r="5" fill="#FF69B4" />
        <circle cx="0" cy="-3" r="6" fill="#FFA500" />
        <circle cx="12" cy="0" r="5" fill="#FF69B4" />
      </g>
      <g transform="translate(28, 15)">
        <ellipse cx="0" cy="8" rx="10" ry="8" fill="#FFA500" />
        <circle cx="0" cy="-2" r="9" fill="#FFA500" />
        <polygon points="-6,-8 -10,-18 -2,-10" fill="#FFA500" />
        <polygon points="6,-8 10,-18 2,-10" fill="#FFA500" />
        <ellipse cx="-3" cy="-3" rx="2" ry="2" fill="#228B22" />
        <ellipse cx="3" cy="-3" rx="2" ry="2" fill="#228B22" />
        <ellipse cx="0" cy="2" rx="2" ry="1.5" fill="#FF69B4" />
      </g>
    </g>
  );
}
