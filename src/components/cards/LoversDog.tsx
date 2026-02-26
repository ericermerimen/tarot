import React from 'react';

export default function LoversDog() {
  return (
    <g>
      <g transform="translate(0, -55)">
        <ellipse cx="0" cy="0" rx="8" ry="6" fill="#FFD700" />
        <path d="M-15,5 Q-20,-5 -10,-5 Q0,0 10,-5 Q20,-5 15,5" fill="white" opacity="0.8" />
      </g>
      <path d="M0,-15 C-15,-30 -30,-15 -15,0 L0,15 L15,0 C30,-15 15,-30 0,-15" fill="#FF69B4" />
      <g transform="translate(-25, 15)">
        <ellipse cx="0" cy="15" rx="20" ry="18" fill="#E8E8E8" />
        <circle cx="0" cy="-5" r="18" fill="#E8E8E8" />
        <ellipse cx="0" cy="0" rx="10" ry="8" fill="white" />
        <polygon points="-12,-20 -18,-35 -5,-22" fill="#808080" />
        <polygon points="12,-20 18,-35 5,-22" fill="#808080" />
        <ellipse cx="-5" cy="-8" rx="4" ry="5" fill="#4169E1" />
        <ellipse cx="5" cy="-8" rx="4" ry="5" fill="#4169E1" />
        <circle cx="-3" cy="-9" r="1.5" fill="white" />
        <circle cx="7" cy="-9" r="1.5" fill="white" />
        <ellipse cx="0" cy="3" rx="4" ry="3" fill="#1a1a1a" />
      </g>
      <g transform="translate(25, 15)">
        <ellipse cx="0" cy="15" rx="20" ry="18" fill="#2d2d2d" />
        <ellipse cx="0" cy="18" rx="10" ry="8" fill="white" />
        <circle cx="0" cy="-5" r="18" fill="#2d2d2d" />
        <ellipse cx="0" cy="0" rx="10" ry="8" fill="white" />
        <polygon points="-12,-20 -18,-35 -5,-22" fill="#1a1a1a" />
        <polygon points="12,-20 18,-35 5,-22" fill="#1a1a1a" />
        <ellipse cx="-5" cy="-8" rx="4" ry="5" fill="#8B4513" />
        <ellipse cx="5" cy="-8" rx="4" ry="5" fill="#8B4513" />
        <circle cx="-3" cy="-9" r="1.5" fill="white" />
        <circle cx="7" cy="-9" r="1.5" fill="white" />
        <ellipse cx="0" cy="3" rx="4" ry="3" fill="#1a1a1a" />
      </g>
    </g>
  );
}
