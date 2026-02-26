import React from 'react';

export default function DevilDog() {
  return (
    <g>
      <path d="M-40,55 Q-30,30 -35,20 Q-25,35 -20,15 Q-10,40 0,10 Q10,40 20,15 Q25,35 35,20 Q30,30 40,55 Z" fill="#DC143C" opacity="0.3" />
      <path d="M-35,50 L-25,30" stroke="#808080" strokeWidth="3" />
      <path d="M35,50 L25,30" stroke="#808080" strokeWidth="3" />
      <ellipse cx="0" cy="25" rx="28" ry="25" fill="#1a1a1a" />
      {[-20, -10, 0, 10, 20].map((x, i) => (
        <ellipse key={i} cx={x} cy={35} rx="8" ry="6" fill="#2d2d2d" />
      ))}
      <circle cx="0" cy="-5" r="28" fill="#1a1a1a" />
      <ellipse cx="-20" cy="0" rx="12" ry="10" fill="#2d2d2d" />
      <ellipse cx="20" cy="0" rx="12" ry="10" fill="#2d2d2d" />
      <ellipse cx="-15" cy="-25" rx="8" ry="10" fill="#1a1a1a" />
      <ellipse cx="15" cy="-25" rx="8" ry="10" fill="#1a1a1a" />
      <polygon points="-18,-32 -22,-48 -12,-35" fill="#DC143C" />
      <polygon points="18,-32 22,-48 12,-35" fill="#DC143C" />
      <ellipse cx="-8" cy="-8" rx="5" ry="6" fill="#DC143C" />
      <ellipse cx="8" cy="-8" rx="5" ry="6" fill="#DC143C" />
      <circle cx="-6" cy="-9" r="2" fill="white" />
      <circle cx="10" cy="-9" r="2" fill="white" />
      <ellipse cx="0" cy="5" rx="4" ry="3" fill="#1a1a1a" />
      <path d="M-5,12 Q0,16 8,10" fill="none" stroke="#DC143C" strokeWidth="2" />
      <circle cx="-25" cy="45" r="6" fill="#FFD700" />
      <circle cx="25" cy="45" r="6" fill="#9c7cf4" />
    </g>
  );
}
