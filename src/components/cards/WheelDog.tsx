import React from 'react';

export default function WheelDog() {
  return (
    <g>
      <circle cx="0" cy="0" r="50" fill="none" stroke="#FFD700" strokeWidth="3" />
      <circle cx="0" cy="0" r="40" fill="none" stroke="#9c7cf4" strokeWidth="2" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <text
          key={i}
          x={Math.cos((angle * Math.PI) / 180) * 45}
          y={Math.sin((angle * Math.PI) / 180) * 45}
          fontSize="8"
          fill="#FFD700"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏'][i]}
        </text>
      ))}
      <g transform="translate(0, 5)">
        <ellipse cx="0" cy="15" rx="22" ry="18" fill="white" />
        <circle cx="-10" cy="10" r="5" fill="#1a1a1a" />
        <circle cx="8" cy="20" r="4" fill="#1a1a1a" />
        <circle cx="-5" cy="25" r="3" fill="#1a1a1a" />
        <circle cx="0" cy="-8" r="20" fill="white" />
        <circle cx="-12" cy="-15" r="5" fill="#1a1a1a" />
        <circle cx="10" cy="-5" r="4" fill="#1a1a1a" />
        <circle cx="5" cy="-18" r="3" fill="#1a1a1a" />
        <ellipse cx="-18" cy="-5" rx="8" ry="14" fill="white" />
        <ellipse cx="18" cy="-5" rx="8" ry="14" fill="white" />
        <circle cx="-18" cy="-8" r="4" fill="#1a1a1a" />
        <circle cx="18" cy="0" r="3" fill="#1a1a1a" />
        <ellipse cx="-6" cy="-10" rx="4" ry="5" fill="#2d1b4e" />
        <ellipse cx="6" cy="-10" rx="4" ry="5" fill="#2d1b4e" />
        <circle cx="-4" cy="-11" r="1.5" fill="white" />
        <circle cx="8" cy="-11" r="1.5" fill="white" />
        <ellipse cx="0" cy="2" rx="5" ry="4" fill="#1a1a1a" />
        <ellipse cx="3" cy="10" rx="4" ry="6" fill="#FF9999" />
      </g>
    </g>
  );
}
