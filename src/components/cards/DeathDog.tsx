import React from 'react';

export default function DeathDog() {
  return (
    <g>
      <g transform="translate(-30, 40)">
        <circle cx="0" cy="0" r="8" fill="#DC143C" />
        <circle cx="0" cy="0" r="4" fill="#8B0000" />
      </g>
      <g transform="translate(30, 45)">
        <circle cx="0" cy="0" r="6" fill="#DC143C" />
        <circle cx="0" cy="0" r="3" fill="#8B0000" />
      </g>
      <ellipse cx="0" cy="20" rx="20" ry="30" fill="#1a1a1a" />
      <ellipse cx="0" cy="-20" rx="18" ry="25" fill="#1a1a1a" />
      <ellipse cx="0" cy="0" rx="10" ry="15" fill="#2d2d2d" />
      <ellipse cx="-15" cy="-35" rx="6" ry="12" fill="#1a1a1a" />
      <ellipse cx="15" cy="-35" rx="6" ry="12" fill="#1a1a1a" />
      <ellipse cx="-8" cy="-25" rx="4" ry="5" fill="#9c7cf4" />
      <ellipse cx="8" cy="-25" rx="4" ry="5" fill="#9c7cf4" />
      <circle cx="-6" cy="-26" r="1.5" fill="white" />
      <circle cx="10" cy="-26" r="1.5" fill="white" />
      <ellipse cx="0" cy="-5" rx="4" ry="3" fill="#2d2d2d" />
      <path d="M-8,10 L-8,35" stroke="white" strokeWidth="1" opacity="0.3" />
      <path d="M8,10 L8,35" stroke="white" strokeWidth="1" opacity="0.3" />
      <path d="M-12,20 L12,20" stroke="white" strokeWidth="1" opacity="0.3" />
      <path d="M-25,-10 Q-35,-20 -25,-30" fill="none" stroke="white" strokeWidth="1" opacity="0.4" />
      <path d="M25,-10 Q35,-20 25,-30" fill="none" stroke="white" strokeWidth="1" opacity="0.4" />
    </g>
  );
}
