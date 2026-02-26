import React from 'react';

export default function GenericDog({ primaryColor }: { primaryColor?: string }) {
  const fill = primaryColor || '#FFD700';
  return (
    <g>
      <ellipse cx="0" cy="20" rx="35" ry="30" fill={fill} />
      <circle cx="0" cy="-15" r="28" fill={fill} />
      <ellipse cx="-18" cy="-35" rx="12" ry="18" fill={fill} />
      <ellipse cx="18" cy="-35" rx="12" ry="18" fill={fill} />
      <circle cx="-10" cy="-18" r="5" fill="#2d1b4e" />
      <circle cx="10" cy="-18" r="5" fill="#2d1b4e" />
      <circle cx="-8" cy="-20" r="2" fill="white" />
      <circle cx="12" cy="-20" r="2" fill="white" />
      <ellipse cx="0" cy="-5" rx="8" ry="6" fill="#2d1b4e" />
      <path d="M-8,5 Q0,12 8,5" fill="none" stroke="#2d1b4e" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}
