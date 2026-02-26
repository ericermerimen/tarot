import React from 'react';

export default function EmpressDog() {
  return (
    <g>
      {[-35, -20, 20, 35].map((x, i) => (
        <g key={i} transform={`translate(${x}, ${40 + (i % 2) * 10})`}>
          <circle cx="0" cy="0" r="6" fill={i % 2 ? '#FF69B4' : '#FFB6C1'} />
          <circle cx="0" cy="0" r="3" fill="#FFD700" />
        </g>
      ))}
      <ellipse cx="0" cy="25" rx="35" ry="28" fill="#E8A642" />
      <ellipse cx="0" cy="32" rx="20" ry="15" fill="white" />
      <ellipse cx="0" cy="-8" rx="28" ry="24" fill="#E8A642" />
      <ellipse cx="0" cy="0" rx="18" ry="16" fill="white" />
      <ellipse cx="-22" cy="-25" rx="12" ry="18" fill="#E8A642" />
      <ellipse cx="22" cy="-25" rx="12" ry="18" fill="#E8A642" />
      <ellipse cx="-22" cy="-23" rx="8" ry="12" fill="#FFD39B" />
      <ellipse cx="22" cy="-23" rx="8" ry="12" fill="#FFD39B" />
      <ellipse cx="-8" cy="-8" rx="5" ry="6" fill="#2d1b4e" />
      <ellipse cx="8" cy="-8" rx="5" ry="6" fill="#2d1b4e" />
      <circle cx="-6" cy="-10" r="2" fill="white" />
      <circle cx="10" cy="-10" r="2" fill="white" />
      <ellipse cx="-18" cy="0" rx="5" ry="3" fill="#FFB6C1" opacity="0.6" />
      <ellipse cx="18" cy="0" rx="5" ry="3" fill="#FFB6C1" opacity="0.6" />
      <ellipse cx="0" cy="6" rx="6" ry="4" fill="#2d1b4e" />
      <path d="M-6,12 Q0,17 6,12" fill="none" stroke="#2d1b4e" strokeWidth="2" strokeLinecap="round" />
      <g transform="translate(0, -30)">
        <circle cx="-15" cy="0" r="5" fill="#FF69B4" />
        <circle cx="0" cy="-5" r="6" fill="#FFD700" />
        <circle cx="15" cy="0" r="5" fill="#FF69B4" />
        <circle cx="-8" cy="-3" r="4" fill="#98FB98" />
        <circle cx="8" cy="-3" r="4" fill="#98FB98" />
      </g>
    </g>
  );
}
