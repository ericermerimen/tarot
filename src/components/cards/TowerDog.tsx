import React from 'react';

export default function TowerDog() {
  return (
    <g>
      <path d="M15,-60 L5,-30 L15,-35 L0,-10" fill="none" stroke="#FFD700" strokeWidth="3" />
      <rect x="-25" y="-40" width="50" height="90" fill="#808080" />
      <rect x="-20" y="-45" width="40" height="10" fill="#696969" />
      <path d="M-10,-20 L0,0 L-5,20" fill="none" stroke="#4a4a4a" strokeWidth="2" />
      <path d="M15,-30 L10,0 L20,30" fill="none" stroke="#4a4a4a" strokeWidth="2" />
      <rect x="-35" y="20" width="8" height="6" fill="#696969" transform="rotate(15)" />
      <rect x="30" y="30" width="8" height="6" fill="#696969" transform="rotate(-20)" />
      <g transform="translate(-30, 35)">
        <ellipse cx="0" cy="5" rx="12" ry="10" fill="#D2691E" />
        <circle cx="0" cy="-8" r="14" fill="#D2691E" />
        <ellipse cx="0" cy="-12" rx="12" ry="10" fill="#D2691E" />
        <polygon points="-10,-18 -18,-35 -4,-20" fill="#D2691E" />
        <polygon points="10,-18 18,-35 4,-20" fill="#D2691E" />
        <polygon points="-9,-19 -15,-32 -5,-21" fill="#FFD39B" />
        <polygon points="9,-19 15,-32 5,-21" fill="#FFD39B" />
        <ellipse cx="-5" cy="-10" rx="5" ry="6" fill="#2d1b4e" />
        <ellipse cx="5" cy="-10" rx="5" ry="6" fill="#2d1b4e" />
        <circle cx="-3" cy="-11" r="2" fill="white" />
        <circle cx="7" cy="-11" r="2" fill="white" />
        <ellipse cx="0" cy="-2" rx="3" ry="2" fill="#1a1a1a" />
      </g>
      <circle cx="20" cy="-50" r="3" fill="#FF4500" />
      <circle cx="-15" cy="-55" r="2" fill="#FFD700" />
    </g>
  );
}
