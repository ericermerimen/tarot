import React from 'react';

export default function StarDog() {
  return (
    <g>
      <polygon points="0,-55 2,-48 10,-48 4,-43 6,-35 0,-40 -6,-35 -4,-43 -10,-48 -2,-48" fill="#FFD700" />
      {[[-30, -45], [30, -50], [-35, -30], [35, -35]].map(([x, y], i) => (
        <polygon
          key={i}
          points={`${x},${y} ${x + 1},${y + 4} ${x + 5},${y + 4} ${x + 2},${y + 7} ${x + 3},${y + 11} ${x},${y + 8} ${x - 3},${y + 11} ${x - 2},${y + 7} ${x - 5},${y + 4} ${x - 1},${y + 4}`}
          fill="#FFD700"
          opacity="0.7"
        />
      ))}
      <ellipse cx="0" cy="50" rx="45" ry="12" fill="#4169E1" opacity="0.4" />
      <ellipse cx="0" cy="20" rx="30" ry="26" fill="white" />
      {[-25, -12, 0, 12, 25].map((x, i) => (
        <ellipse key={i} cx={x} cy={35} rx="10" ry="8" fill="#F8F8FF" />
      ))}
      <circle cx="0" cy="-10" r="28" fill="white" />
      <ellipse cx="-18" cy="-5" rx="14" ry="12" fill="#F8F8FF" />
      <ellipse cx="18" cy="-5" rx="14" ry="12" fill="#F8F8FF" />
      <ellipse cx="-18" cy="-30" rx="10" ry="14" fill="white" />
      <ellipse cx="18" cy="-30" rx="10" ry="14" fill="white" />
      <path d="M-12,-12 Q-8,-8 -4,-12" fill="none" stroke="#2d1b4e" strokeWidth="2" />
      <path d="M4,-12 Q8,-8 12,-12" fill="none" stroke="#2d1b4e" strokeWidth="2" />
      <ellipse cx="0" cy="2" rx="5" ry="4" fill="#1a1a1a" />
      <path d="M-10,8 Q0,16 10,8" fill="none" stroke="#2d1b4e" strokeWidth="2" strokeLinecap="round" />
      <g transform="translate(-32, 25)">
        <path d="M-6,0 L-4,15 L4,15 L6,0 Z" fill="#FFD700" />
        <path d="M0,8 Q-10,20 -5,25" fill="none" stroke="#87CEEB" strokeWidth="3" />
      </g>
      <g transform="translate(32, 30)">
        <path d="M-6,0 L-4,15 L4,15 L6,0 Z" fill="#FFD700" />
        <path d="M0,8 Q10,20 5,25" fill="none" stroke="#87CEEB" strokeWidth="3" />
      </g>
    </g>
  );
}
