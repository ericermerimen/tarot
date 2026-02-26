import React from 'react';

export default function EmperorDog() {
  return (
    <g>
      <rect x="-40" y="-30" width="80" height="80" fill="#4a4a4a" rx="5" />
      <rect x="-35" y="-25" width="70" height="70" fill="#5a5a5a" rx="3" />
      <ellipse cx="0" cy="25" rx="30" ry="28" fill="#8B6914" />
      <ellipse cx="0" cy="30" rx="18" ry="15" fill="#D4A84B" />
      <ellipse cx="0" cy="-10" rx="26" ry="28" fill="#2d2d2d" />
      <ellipse cx="0" cy="-5" rx="20" ry="20" fill="#D4A84B" />
      <polygon points="-18,-35 -25,-60 -8,-38" fill="#2d2d2d" />
      <polygon points="18,-35 25,-60 8,-38" fill="#2d2d2d" />
      <ellipse cx="-8" cy="-12" rx="5" ry="6" fill="#2d1b4e" />
      <ellipse cx="8" cy="-12" rx="5" ry="6" fill="#2d1b4e" />
      <circle cx="-6" cy="-14" r="2" fill="white" />
      <circle cx="10" cy="-14" r="2" fill="white" />
      <ellipse cx="0" cy="3" rx="6" ry="5" fill="#1a1a1a" />
      <line x1="-8" y1="12" x2="8" y2="12" stroke="#2d1b4e" strokeWidth="2" />
      <g transform="translate(0, -55)">
        <polygon points="-15,10 -18,0 -10,-5 0,-10 10,-5 18,0 15,10" fill="#FFD700" />
        <circle cx="-10" cy="-2" r="3" fill="#DC143C" />
        <circle cx="0" cy="-7" r="3" fill="#DC143C" />
        <circle cx="10" cy="-2" r="3" fill="#DC143C" />
      </g>
      <line x1="35" y1="-30" x2="35" y2="30" stroke="#FFD700" strokeWidth="4" />
      <circle cx="35" cy="-35" r="8" fill="#FFD700" />
    </g>
  );
}
