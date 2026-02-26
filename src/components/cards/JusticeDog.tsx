import React from 'react';

export default function JusticeDog() {
  return (
    <g>
      <rect x="-45" y="-40" width="10" height="90" fill="#808080" />
      <rect x="35" y="-40" width="10" height="90" fill="#808080" />
      <ellipse cx="0" cy="25" rx="25" ry="22" fill="#1a1a1a" />
      <ellipse cx="0" cy="28" rx="12" ry="10" fill="#8B4513" />
      <ellipse cx="0" cy="-8" rx="22" ry="25" fill="#1a1a1a" />
      <ellipse cx="-8" cy="-5" rx="6" ry="5" fill="#8B4513" />
      <ellipse cx="8" cy="-5" rx="6" ry="5" fill="#8B4513" />
      <ellipse cx="0" cy="8" rx="10" ry="8" fill="#8B4513" />
      <polygon points="-15,-30 -22,-55 -8,-32" fill="#1a1a1a" />
      <polygon points="15,-30 22,-55 8,-32" fill="#1a1a1a" />
      <ellipse cx="-7" cy="-8" rx="4" ry="5" fill="#8B4513" />
      <ellipse cx="7" cy="-8" rx="4" ry="5" fill="#8B4513" />
      <circle cx="-5" cy="-9" r="1.5" fill="white" />
      <circle cx="9" cy="-9" r="1.5" fill="white" />
      <ellipse cx="0" cy="5" rx="5" ry="4" fill="#1a1a1a" />
      <g transform="translate(-30, -10)">
        <line x1="0" y1="-20" x2="0" y2="0" stroke="#FFD700" strokeWidth="2" />
        <ellipse cx="0" cy="5" rx="10" ry="5" fill="none" stroke="#FFD700" strokeWidth="2" />
      </g>
      <g transform="translate(30, -20)">
        <rect x="-2" y="-25" width="4" height="40" fill="#C0C0C0" />
        <rect x="-8" y="10" width="16" height="4" fill="#FFD700" />
        <polygon points="0,-30 -3,-25 3,-25" fill="#C0C0C0" />
      </g>
    </g>
  );
}
