'use client';

import React from 'react';
import CardShaderCanvas from './shaders/CardShaderCanvas';
import type { TarotCardData } from '@/types/tarot';

// ─── Dog Illustration Components (unchanged) ─────────────────────────────────

function GenericDog({ primaryColor }: { primaryColor: string }) {
  return (
    <g>
      <ellipse cx="0" cy="20" rx="35" ry="30" fill={primaryColor} />
      <circle cx="0" cy="-15" r="28" fill={primaryColor} />
      <ellipse cx="-18" cy="-35" rx="12" ry="18" fill={primaryColor} />
      <ellipse cx="18" cy="-35" rx="12" ry="18" fill={primaryColor} />
      <circle cx="-10" cy="-18" r="5" fill="#2d1b4e" />
      <circle cx="10" cy="-18" r="5" fill="#2d1b4e" />
      <circle cx="-8" cy="-20" r="2" fill="white" />
      <circle cx="12" cy="-20" r="2" fill="white" />
      <ellipse cx="0" cy="-5" rx="8" ry="6" fill="#2d1b4e" />
      <path d="M-8,5 Q0,12 8,5" fill="none" stroke="#2d1b4e" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function FoolDog() {
  return (
    <g>
      <ellipse cx="0" cy="25" rx="32" ry="28" fill="#F5D596" />
      <circle cx="0" cy="-10" r="30" fill="#F5D596" />
      <ellipse cx="-22" cy="-30" rx="14" ry="20" fill="#E8C373" />
      <ellipse cx="22" cy="-30" rx="14" ry="20" fill="#E8C373" />
      <ellipse cx="-22" cy="-28" rx="8" ry="12" fill="#F5D596" />
      <ellipse cx="22" cy="-28" rx="8" ry="12" fill="#F5D596" />
      <ellipse cx="-10" cy="-12" rx="6" ry="7" fill="#2d1b4e" />
      <ellipse cx="10" cy="-12" rx="6" ry="7" fill="#2d1b4e" />
      <circle cx="-8" cy="-14" r="2.5" fill="white" />
      <circle cx="12" cy="-14" r="2.5" fill="white" />
      <ellipse cx="0" cy="2" rx="7" ry="5" fill="#2d1b4e" />
      <path d="M-10,10 Q0,20 10,10" fill="none" stroke="#2d1b4e" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="0" cy="16" rx="5" ry="8" fill="#FF9999" />
      <line x1="25" y1="-40" x2="40" y2="30" stroke="#8B4513" strokeWidth="3" />
      <circle cx="35" cy="-35" r="12" fill="#DC143C" />
      <g transform="translate(-35, -50)">
        <ellipse cx="-4" cy="0" rx="5" ry="3" fill="#9c7cf4" />
        <ellipse cx="4" cy="0" rx="5" ry="3" fill="#9c7cf4" />
        <ellipse cx="0" cy="0" rx="1.5" ry="4" fill="#6b4bc1" />
      </g>
      <circle cx="-40" cy="-20" r="2" fill="#FFD700" />
      <circle cx="45" cy="-10" r="1.5" fill="#FFD700" />
    </g>
  );
}

function MagicianDog() {
  return (
    <g>
      <path d="M-35,50 Q0,20 35,50 L30,30 Q0,10 -30,30 Z" fill="#6b4bc1" />
      <ellipse cx="0" cy="25" rx="28" ry="25" fill="#1a1a1a" />
      <ellipse cx="0" cy="30" rx="15" ry="18" fill="white" />
      <circle cx="0" cy="-8" r="28" fill="#1a1a1a" />
      <path d="M-8,-35 L0,-8 L8,-35 Q0,-40 -8,-35" fill="white" />
      <ellipse cx="-20" cy="-28" rx="10" ry="16" fill="#1a1a1a" />
      <ellipse cx="20" cy="-28" rx="10" ry="16" fill="#1a1a1a" />
      <ellipse cx="-9" cy="-10" rx="5" ry="6" fill="#8B4513" />
      <ellipse cx="9" cy="-10" rx="5" ry="6" fill="#8B4513" />
      <circle cx="-7" cy="-12" r="2" fill="white" />
      <circle cx="11" cy="-12" r="2" fill="white" />
      <ellipse cx="0" cy="4" rx="6" ry="4" fill="#1a1a1a" />
      <line x1="30" y1="-40" x2="45" y2="0" stroke="#f4cf7c" strokeWidth="3" />
      <circle cx="30" cy="-45" r="6" fill="#f4cf7c" />
      <text x="-38" y="55" fontSize="10" fill="#f4cf7c">☆</text>
      <text x="30" y="55" fontSize="10" fill="#f4cf7c">◇</text>
      <text x="-5" y="58" fontSize="8" fill="#f4cf7c">♠</text>
      <circle cx="35" cy="-50" r="2" fill="#f4cf7c" />
      <circle cx="25" cy="-55" r="1.5" fill="#9c7cf4" />
    </g>
  );
}

function HighPriestessDog() {
  return (
    <g>
      <rect x="-45" y="-50" width="12" height="100" fill="#2d1b4e" />
      <rect x="33" y="-50" width="12" height="100" fill="#1a1a1a" />
      <text x="-42" y="-30" fontSize="8" fill="#f4cf7c">B</text>
      <text x="36" y="-30" fontSize="8" fill="#f4cf7c">J</text>
      <path d="M-25,50 Q0,30 25,50 L20,0 Q0,-10 -20,0 Z" fill="#4169E1" />
      <ellipse cx="0" cy="20" rx="22" ry="20" fill="#FFFAF0" />
      <circle cx="0" cy="-12" r="25" fill="#FFFAF0" />
      <ellipse cx="-15" cy="-5" rx="12" ry="10" fill="#FFE4B5" />
      <ellipse cx="15" cy="-5" rx="12" ry="10" fill="#FFE4B5" />
      <polygon points="-18,-35 -28,-55 -8,-40" fill="#FFFAF0" />
      <polygon points="18,-35 28,-55 8,-40" fill="#FFFAF0" />
      <polygon points="-16,-37 -25,-52 -10,-40" fill="#FFE4B5" />
      <polygon points="16,-37 25,-52 10,-40" fill="#FFE4B5" />
      <ellipse cx="-8" cy="-15" rx="4" ry="5" fill="#2d1b4e" />
      <ellipse cx="8" cy="-15" rx="4" ry="5" fill="#2d1b4e" />
      <circle cx="-6" cy="-16" r="1.5" fill="white" />
      <circle cx="10" cy="-16" r="1.5" fill="white" />
      <ellipse cx="0" cy="0" rx="5" ry="4" fill="#2d1b4e" />
      <rect x="-12" y="5" width="24" height="8" rx="2" fill="#f4cf7c" />
      <text x="0" y="11" fontSize="5" fill="#2d1b4e" textAnchor="middle">TORA</text>
      <path d="M-8,-60 A15,15 0 0,1 8,-60 A12,12 0 0,0 -8,-60" fill="#C0C0C0" />
    </g>
  );
}

function EmpressDog() {
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

function EmperorDog() {
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

function HierophantDog() {
  return (
    <g>
      <path d="M-30,55 Q0,30 30,55 L25,10 Q0,-5 -25,10 Z" fill="#8B0000" />
      <path d="M-20,50 Q0,35 20,50 L18,15 Q0,5 -18,15 Z" fill="#FFD700" />
      <ellipse cx="0" cy="20" rx="28" ry="25" fill="white" />
      <ellipse cx="-15" cy="15" rx="15" ry="12" fill="#8B4513" />
      <ellipse cx="15" cy="15" rx="15" ry="12" fill="#8B4513" />
      <circle cx="0" cy="-12" r="30" fill="white" />
      <ellipse cx="-12" cy="-15" rx="15" ry="18" fill="#8B4513" />
      <ellipse cx="12" cy="-15" rx="15" ry="18" fill="#8B4513" />
      <ellipse cx="0" cy="-5" rx="12" ry="14" fill="white" />
      <ellipse cx="-28" cy="-5" rx="12" ry="25" fill="#8B4513" />
      <ellipse cx="28" cy="-5" rx="12" ry="25" fill="#8B4513" />
      <ellipse cx="-10" cy="-15" rx="5" ry="6" fill="#2d1b4e" />
      <ellipse cx="10" cy="-15" rx="5" ry="6" fill="#2d1b4e" />
      <circle cx="-8" cy="-17" r="2" fill="white" />
      <circle cx="12" cy="-17" r="2" fill="white" />
      <ellipse cx="0" cy="0" rx="8" ry="6" fill="#1a1a1a" />
      <ellipse cx="-8" cy="8" rx="8" ry="6" fill="white" />
      <ellipse cx="8" cy="8" rx="8" ry="6" fill="white" />
      <g transform="translate(-35, 0)">
        <rect x="0" y="0" width="3" height="20" fill="#FFD700" />
        <circle cx="1.5" cy="-5" r="6" fill="none" stroke="#FFD700" strokeWidth="2" />
      </g>
      <path d="M-15,-42 Q0,-60 15,-42 L12,-38 Q0,-45 -12,-38 Z" fill="#F5F5DC" />
      <rect x="-8" y="-45" width="16" height="8" fill="#FFD700" />
    </g>
  );
}

function LoversDog() {
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

function ChariotDog() {
  return (
    <g>
      <circle cx="-35" cy="-50" r="2" fill="#FFD700" />
      <circle cx="35" cy="-45" r="2" fill="#FFD700" />
      <circle cx="0" cy="-60" r="3" fill="#FFD700" />
      <g transform="translate(0, -25)">
        <ellipse cx="0" cy="10" rx="22" ry="18" fill="#2d2d2d" />
        <ellipse cx="0" cy="12" rx="12" ry="10" fill="white" />
        <circle cx="0" cy="-8" r="20" fill="#2d2d2d" />
        <ellipse cx="0" cy="-3" rx="12" ry="10" fill="white" />
        <polygon points="-12,-25 -16,-40 -6,-27" fill="#1a1a1a" />
        <polygon points="12,-25 16,-40 6,-27" fill="#1a1a1a" />
        <ellipse cx="-6" cy="-10" rx="4" ry="5" fill="#4169E1" />
        <ellipse cx="6" cy="-10" rx="4" ry="5" fill="#4169E1" />
        <circle cx="-4" cy="-11" r="1.5" fill="white" />
        <circle cx="8" cy="-11" r="1.5" fill="white" />
        <ellipse cx="0" cy="0" rx="5" ry="4" fill="#1a1a1a" />
      </g>
      <line x1="-15" y1="0" x2="-25" y2="30" stroke="#8B4513" strokeWidth="2" />
      <line x1="15" y1="0" x2="25" y2="30" stroke="#8B4513" strokeWidth="2" />
      <rect x="-30" y="30" width="60" height="25" rx="5" fill="#4682B4" />
      <rect x="-25" y="35" width="50" height="15" fill="#FFD700" />
      <g transform="translate(-22, 42)">
        <circle cx="0" cy="0" r="8" fill="#E8E8E8" />
        <circle cx="-3" cy="-2" r="2" fill="#2d1b4e" />
        <circle cx="3" cy="-2" r="2" fill="#2d1b4e" />
      </g>
      <g transform="translate(22, 42)">
        <circle cx="0" cy="0" r="8" fill="#8B4513" />
        <circle cx="-3" cy="-2" r="2" fill="#2d1b4e" />
        <circle cx="3" cy="-2" r="2" fill="#2d1b4e" />
      </g>
    </g>
  );
}

function StrengthDog() {
  return (
    <g>
      <circle cx="-35" cy="35" r="8" fill="#FF8C00" />
      <circle cx="35" cy="30" r="6" fill="#FFD700" />
      <ellipse cx="0" cy="25" rx="32" ry="28" fill="#C0C0C0" />
      <ellipse cx="0" cy="30" rx="20" ry="18" fill="white" />
      <ellipse cx="0" cy="-8" rx="28" ry="26" fill="#C0C0C0" />
      <ellipse cx="0" cy="0" rx="18" ry="16" fill="white" />
      <ellipse cx="-20" cy="-28" rx="10" ry="14" fill="#C0C0C0" />
      <ellipse cx="20" cy="-28" rx="10" ry="14" fill="#C0C0C0" />
      <ellipse cx="-9" cy="-10" rx="5" ry="6" fill="#8B4513" />
      <ellipse cx="9" cy="-10" rx="5" ry="6" fill="#8B4513" />
      <circle cx="-7" cy="-12" r="2" fill="white" />
      <circle cx="11" cy="-12" r="2" fill="white" />
      <path d="M-12,-8 Q-9,-5 -6,-8" fill="none" stroke="#8B4513" strokeWidth="1" />
      <path d="M6,-8 Q9,-5 12,-8" fill="none" stroke="#8B4513" strokeWidth="1" />
      <ellipse cx="0" cy="5" rx="7" ry="5" fill="#1a1a1a" />
      <path d="M-10,12 Q0,20 10,12" fill="none" stroke="#2d1b4e" strokeWidth="2" strokeLinecap="round" />
      <g transform="translate(0, -38)">
        <circle cx="-12" cy="0" r="5" fill="#FF69B4" />
        <circle cx="0" cy="-3" r="6" fill="#FFA500" />
        <circle cx="12" cy="0" r="5" fill="#FF69B4" />
      </g>
      <g transform="translate(28, 15)">
        <ellipse cx="0" cy="8" rx="10" ry="8" fill="#FFA500" />
        <circle cx="0" cy="-2" r="9" fill="#FFA500" />
        <polygon points="-6,-8 -10,-18 -2,-10" fill="#FFA500" />
        <polygon points="6,-8 10,-18 2,-10" fill="#FFA500" />
        <ellipse cx="-3" cy="-3" rx="2" ry="2" fill="#228B22" />
        <ellipse cx="3" cy="-3" rx="2" ry="2" fill="#228B22" />
        <ellipse cx="0" cy="2" rx="2" ry="1.5" fill="#FF69B4" />
      </g>
    </g>
  );
}

function HermitDog() {
  return (
    <g>
      <polygon points="-45,55 0,-10 45,55" fill="#708090" opacity="0.5" />
      <g transform="translate(-30, -20)">
        <rect x="-5" y="-15" width="10" height="20" fill="#8B4513" />
        <rect x="-8" y="-25" width="16" height="12" rx="3" fill="#FFD700" />
        <circle cx="0" cy="-19" r="4" fill="#FFF8DC" />
      </g>
      <line x1="30" y1="-50" x2="30" y2="50" stroke="#8B4513" strokeWidth="4" />
      <path d="M-30,55 Q0,30 30,55 L25,0 Q0,-15 -25,0 Z" fill="#708090" />
      <ellipse cx="0" cy="25" rx="25" ry="22" fill="#FFFAF0" />
      <circle cx="0" cy="-10" r="26" fill="#FFFAF0" />
      <ellipse cx="0" cy="0" rx="15" ry="12" fill="#E8E8E8" />
      <ellipse cx="-20" cy="-28" rx="12" ry="16" fill="#FFFAF0" />
      <ellipse cx="20" cy="-28" rx="12" ry="16" fill="#FFFAF0" />
      <ellipse cx="-20" cy="-26" rx="8" ry="10" fill="#FFE4B5" />
      <ellipse cx="20" cy="-26" rx="8" ry="10" fill="#FFE4B5" />
      <ellipse cx="-8" cy="-12" rx="4" ry="3" fill="#2d1b4e" />
      <ellipse cx="8" cy="-12" rx="4" ry="3" fill="#2d1b4e" />
      <circle cx="-6" cy="-13" r="1" fill="white" />
      <circle cx="10" cy="-13" r="1" fill="white" />
      <path d="M-14,-18 Q-8,-22 -4,-18" fill="none" stroke="#A9A9A9" strokeWidth="2" />
      <path d="M4,-18 Q8,-22 14,-18" fill="none" stroke="#A9A9A9" strokeWidth="2" />
      <ellipse cx="0" cy="3" rx="5" ry="4" fill="#1a1a1a" />
      <circle cx="-40" cy="-45" r="2" fill="#FFD700" />
      <circle cx="40" cy="-40" r="1.5" fill="#FFD700" />
      <circle cx="0" cy="-55" r="2" fill="#FFD700" />
    </g>
  );
}

function WheelDog() {
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

function JusticeDog() {
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

function HangedDog() {
  return (
    <g>
      <path d="M-40,-55 Q0,-50 40,-55" fill="none" stroke="#228B22" strokeWidth="8" />
      <ellipse cx="-35" cy="-55" rx="15" ry="10" fill="#228B22" />
      <ellipse cx="35" cy="-55" rx="15" ry="10" fill="#228B22" />
      <line x1="0" y1="-50" x2="0" y2="-20" stroke="#8B4513" strokeWidth="3" />
      <g transform="rotate(180)">
        <ellipse cx="-20" cy="-45" rx="12" ry="30" fill="#8B4513" />
        <ellipse cx="20" cy="-45" rx="12" ry="30" fill="#8B4513" />
        <ellipse cx="0" cy="0" rx="28" ry="18" fill="#FFFAF0" />
        <ellipse cx="-15" cy="0" rx="12" ry="10" fill="#8B4513" />
        <ellipse cx="15" cy="0" rx="12" ry="10" fill="#8B4513" />
        <ellipse cx="0" cy="-22" rx="22" ry="18" fill="#FFFAF0" />
        <ellipse cx="-10" cy="-18" rx="10" ry="12" fill="#8B4513" />
        <ellipse cx="10" cy="-18" rx="10" ry="12" fill="#8B4513" />
        <path d="M-12,-22 Q-8,-18 -4,-22" fill="none" stroke="#2d1b4e" strokeWidth="2" />
        <path d="M4,-22 Q8,-18 12,-22" fill="none" stroke="#2d1b4e" strokeWidth="2" />
        <ellipse cx="0" cy="-10" rx="6" ry="5" fill="#1a1a1a" />
        <path d="M-6,-5 Q0,0 6,-5" fill="none" stroke="#2d1b4e" strokeWidth="1.5" />
        <ellipse cx="0" cy="25" rx="15" ry="5" fill="none" stroke="#FFD700" strokeWidth="2" />
      </g>
    </g>
  );
}

function DeathDog() {
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

function TemperanceDog() {
  return (
    <g>
      <ellipse cx="0" cy="50" rx="45" ry="10" fill="#87CEEB" opacity="0.5" />
      <ellipse cx="0" cy="20" rx="28" ry="24" fill="#4a4a4a" />
      <ellipse cx="-10" cy="22" rx="8" ry="6" fill="#C0C0C0" />
      <ellipse cx="10" cy="18" rx="6" ry="8" fill="#1a1a1a" />
      <ellipse cx="0" cy="28" rx="15" ry="10" fill="white" />
      <circle cx="0" cy="-10" r="25" fill="#4a4a4a" />
      <ellipse cx="-12" cy="-15" rx="8" ry="10" fill="#C0C0C0" />
      <ellipse cx="10" cy="-5" rx="6" ry="8" fill="#1a1a1a" />
      <path d="M-5,-35 L0,-5 L5,-35 Q0,-38 -5,-35" fill="white" />
      <ellipse cx="-20" cy="-25" rx="10" ry="14" fill="#4a4a4a" />
      <ellipse cx="20" cy="-25" rx="10" ry="14" fill="#4a4a4a" />
      <ellipse cx="-8" cy="-12" rx="5" ry="6" fill="#87CEEB" />
      <ellipse cx="8" cy="-12" rx="5" ry="6" fill="#8B4513" />
      <circle cx="-6" cy="-13" r="2" fill="white" />
      <circle cx="10" cy="-13" r="2" fill="white" />
      <ellipse cx="0" cy="2" rx="5" ry="4" fill="#1a1a1a" />
      <g transform="translate(-28, -5)">
        <path d="M-8,0 L-5,15 L5,15 L8,0 Z" fill="#FFD700" />
        <ellipse cx="0" cy="0" rx="8" ry="3" fill="#FFD700" />
      </g>
      <g transform="translate(28, 5)">
        <path d="M-8,0 L-5,15 L5,15 L8,0 Z" fill="#FFD700" />
        <ellipse cx="0" cy="0" rx="8" ry="3" fill="#FFD700" />
      </g>
      <path d="M-20,5 Q0,-10 20,10" fill="none" stroke="#87CEEB" strokeWidth="4" opacity="0.7" />
    </g>
  );
}

function DevilDog() {
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

function TowerDog() {
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

function StarDog() {
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

function MoonDog() {
  return (
    <g>
      <circle cx="0" cy="-45" r="20" fill="#F5F5DC" />
      <circle cx="5" cy="-48" r="3" fill="#E8E8E8" />
      <circle cx="-8" cy="-42" r="2" fill="#E8E8E8" />
      <ellipse cx="0" cy="50" rx="45" ry="12" fill="#4169E1" opacity="0.3" />
      <ellipse cx="0" cy="52" rx="20" ry="5" fill="#F5F5DC" opacity="0.3" />
      <ellipse cx="0" cy="15" rx="28" ry="24" fill="#808080" />
      <ellipse cx="0" cy="20" rx="16" ry="12" fill="white" />
      <ellipse cx="0" cy="-15" rx="24" ry="22" fill="#808080" />
      <path d="M-15,-25 Q0,-15 15,-25 L10,-5 Q0,5 -10,-5 Z" fill="white" />
      <polygon points="-18,-32 -25,-52 -10,-35" fill="#808080" />
      <polygon points="18,-32 25,-52 10,-35" fill="#808080" />
      <polygon points="-16,-33 -22,-48 -12,-36" fill="#C0C0C0" />
      <polygon points="16,-33 22,-48 12,-36" fill="#C0C0C0" />
      <path d="M-10,-18 Q-6,-14 -2,-18" fill="none" stroke="#2d1b4e" strokeWidth="2" />
      <path d="M2,-18 Q6,-14 10,-18" fill="none" stroke="#2d1b4e" strokeWidth="2" />
      <ellipse cx="0" cy="-8" rx="5" ry="4" fill="#1a1a1a" />
      <ellipse cx="0" cy="2" rx="6" ry="8" fill="#2d2d2d" />
      <path d="M-15,0 Q-25,-10 -15,-20" fill="none" stroke="#9c7cf4" strokeWidth="1" opacity="0.5" />
      <path d="M15,0 Q25,-10 15,-20" fill="none" stroke="#9c7cf4" strokeWidth="1" opacity="0.5" />
    </g>
  );
}

function SunDog() {
  return (
    <g>
      <circle cx="0" cy="-45" r="22" fill="#FFD700" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
        <line
          key={i}
          x1={Math.cos((angle * Math.PI) / 180) * 25}
          y1={-45 + Math.sin((angle * Math.PI) / 180) * 25}
          x2={Math.cos((angle * Math.PI) / 180) * 35}
          y2={-45 + Math.sin((angle * Math.PI) / 180) * 35}
          stroke="#FFD700"
          strokeWidth="3"
        />
      ))}
      {[-35, 35].map((x, i) => (
        <g key={i} transform={`translate(${x}, 40)`}>
          <circle cx="0" cy="0" r="10" fill="#FFD700" />
          <circle cx="0" cy="0" r="5" fill="#8B4513" />
          <rect x="-2" y="5" width="4" height="15" fill="#228B22" />
        </g>
      ))}
      <ellipse cx="0" cy="20" rx="28" ry="24" fill="#F5D596" />
      <ellipse cx="0" cy="25" rx="16" ry="12" fill="#FFE4B5" />
      <ellipse cx="28" cy="15" rx="15" ry="8" fill="#F5D596" transform="rotate(-30 28 15)" />
      <circle cx="0" cy="-8" r="26" fill="#F5D596" />
      <ellipse cx="-22" cy="-5" rx="10" ry="18" fill="#E8A642" />
      <ellipse cx="22" cy="-5" rx="10" ry="18" fill="#E8A642" />
      <path d="M-12,-10 Q-8,-5 -4,-10" fill="none" stroke="#2d1b4e" strokeWidth="3" />
      <path d="M4,-10 Q8,-5 12,-10" fill="none" stroke="#2d1b4e" strokeWidth="3" />
      <ellipse cx="0" cy="3" rx="7" ry="5" fill="#1a1a1a" />
      <path d="M-12,10 Q0,25 12,10" fill="#FF9999" stroke="#2d1b4e" strokeWidth="2" />
      <ellipse cx="0" cy="18" rx="6" ry="10" fill="#FF9999" />
    </g>
  );
}

function JudgementDog() {
  return (
    <g>
      <ellipse cx="-30" cy="45" rx="20" ry="10" fill="#E8E8E8" opacity="0.5" />
      <ellipse cx="30" cy="50" rx="18" ry="8" fill="#E8E8E8" opacity="0.5" />
      <ellipse cx="0" cy="48" rx="15" ry="8" fill="#E8E8E8" opacity="0.5" />
      <path d="M-25,-20 Q-50,-10 -55,20 Q-45,10 -35,15 Q-40,0 -25,5" fill="white" stroke="#E8E8E8" strokeWidth="1" />
      <path d="M25,-20 Q50,-10 55,20 Q45,10 35,15 Q40,0 25,5" fill="white" stroke="#E8E8E8" strokeWidth="1" />
      <path d="M-35,-5 Q-45,5 -45,15" fill="none" stroke="#E8E8E8" strokeWidth="1" />
      <path d="M35,-5 Q45,5 45,15" fill="none" stroke="#E8E8E8" strokeWidth="1" />
      <ellipse cx="0" cy="15" rx="22" ry="20" fill="#E8A642" />
      <ellipse cx="0" cy="18" rx="14" ry="12" fill="white" />
      <ellipse cx="0" cy="-12" rx="22" ry="24" fill="#E8A642" />
      <ellipse cx="0" cy="0" rx="12" ry="15" fill="white" />
      <path d="M-6,-35 L0,-5 L6,-35 Q0,-38 -6,-35" fill="white" />
      <ellipse cx="-18" cy="-28" rx="8" ry="16" fill="#E8A642" />
      <ellipse cx="18" cy="-28" rx="8" ry="16" fill="#E8A642" />
      <ellipse cx="-7" cy="-15" rx="4" ry="5" fill="#8B4513" />
      <ellipse cx="7" cy="-15" rx="4" ry="5" fill="#8B4513" />
      <circle cx="-5" cy="-16" r="1.5" fill="white" />
      <circle cx="9" cy="-16" r="1.5" fill="white" />
      <ellipse cx="0" cy="3" rx="5" ry="4" fill="#1a1a1a" />
      <ellipse cx="0" cy="-45" rx="18" ry="6" fill="none" stroke="#FFD700" strokeWidth="3" />
      <g transform="translate(30, -25) rotate(30)">
        <rect x="0" y="-3" width="20" height="6" fill="#FFD700" />
        <ellipse cx="22" cy="0" rx="8" ry="10" fill="#FFD700" />
      </g>
    </g>
  );
}

function WorldDog() {
  return (
    <g>
      <ellipse cx="0" cy="0" rx="48" ry="55" fill="none" stroke="#228B22" strokeWidth="8" />
      {[...Array(16)].map((_, i) => {
        const angle = (i * 22.5 * Math.PI) / 180;
        const x = Math.cos(angle) * 48;
        const y = Math.sin(angle) * 55;
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx="6"
            ry="3"
            fill="#228B22"
            transform={`rotate(${i * 22.5 + 90} ${x} ${y})`}
          />
        );
      })}
      {[
        [-42, -50, '#87CEEB'],
        [42, -50, '#DC143C'],
        [-42, 50, '#228B22'],
        [42, 50, '#4169E1'],
      ].map(([x, y, color], i) => (
        <g key={i} transform={`translate(${x}, ${y})`}>
          <circle cx="0" cy="0" r="8" fill={color} />
          <circle cx="-2" cy="-2" r="1.5" fill="#1a1a1a" />
          <circle cx="2" cy="-2" r="1.5" fill="#1a1a1a" />
          <ellipse cx="0" cy="2" rx="2" ry="1.5" fill="#1a1a1a" />
        </g>
      ))}
      <g transform="translate(0, 5)">
        <ellipse cx="0" cy="15" rx="22" ry="18" fill="#FFFAF0" />
        <ellipse cx="-20" cy="0" rx="6" ry="10" fill="#FFFAF0" transform="rotate(-30 -20 0)" />
        <ellipse cx="20" cy="0" rx="6" ry="10" fill="#FFFAF0" transform="rotate(30 20 0)" />
        <circle cx="0" cy="-15" r="22" fill="#FFFAF0" />
        <ellipse cx="-12" cy="-8" rx="10" ry="8" fill="#FFE4B5" />
        <ellipse cx="12" cy="-8" rx="10" ry="8" fill="#FFE4B5" />
        <polygon points="-15,-32 -22,-50 -6,-35" fill="#FFFAF0" />
        <polygon points="15,-32 22,-50 6,-35" fill="#FFFAF0" />
        <polygon points="-13,-33 -19,-46 -8,-36" fill="#FFE4B5" />
        <polygon points="13,-33 19,-46 8,-36" fill="#FFE4B5" />
        <path d="M-10,-18 Q-6,-13 -2,-18" fill="none" stroke="#2d1b4e" strokeWidth="2" />
        <path d="M2,-18 Q6,-13 10,-18" fill="none" stroke="#2d1b4e" strokeWidth="2" />
        <ellipse cx="-15" cy="-10" rx="4" ry="3" fill="#FFB6C1" opacity="0.6" />
        <ellipse cx="15" cy="-10" rx="4" ry="3" fill="#FFB6C1" opacity="0.6" />
        <ellipse cx="0" cy="-5" rx="4" ry="3" fill="#1a1a1a" />
        <path d="M-6,0 Q0,8 6,0" fill="none" stroke="#2d1b4e" strokeWidth="2" strokeLinecap="round" />
        <path d="M15,20 Q30,10 25,25 Q35,20 28,30" fill="none" stroke="#FFE4B5" strokeWidth="6" />
      </g>
      <circle cx="-30" cy="-30" r="2" fill="#FFD700" />
      <circle cx="30" cy="-25" r="2" fill="#FFD700" />
      <circle cx="0" cy="40" r="2" fill="#FFD700" />
    </g>
  );
}

// ─── Illustration Map ─────────────────────────────────────────────────────────

const DogIllustrations: Record<number, React.FC<{ primaryColor?: string; secondaryColor?: string }>> = {
  0: FoolDog, 1: MagicianDog, 2: HighPriestessDog, 3: EmpressDog,
  4: EmperorDog, 5: HierophantDog, 6: LoversDog, 7: ChariotDog,
  8: StrengthDog, 9: HermitDog, 10: WheelDog, 11: JusticeDog,
  12: HangedDog, 13: DeathDog, 14: TemperanceDog, 15: DevilDog,
  16: TowerDog, 17: StarDog, 18: MoonDog, 19: SunDog,
  20: JudgementDog, 21: WorldDog,
};

function toRomanNumeral(num: number): string {
  const numerals = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
    'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];
  return numerals[num] || num.toString();
}

// ─── CardFront ────────────────────────────────────────────────────────────────

interface CardFrontProps {
  card: TarotCardData;
  isReversed: boolean;
  width: number;
  height: number;
}

export default function CardFront({ card, isReversed, width, height }: CardFrontProps) {
  if (!card) return null;

  const DogComponent   = DogIllustrations[card.id] || GenericDog;
  const primaryColor   = card.colors?.[0] || '#FFD700';
  const secondaryColor = card.colors?.[1] || '#9c7cf4';
  const colors         = card.colors || ['#9c7cf4', '#f4cf7c', '#6b4bc1'];

  // Unique SVG filter IDs per card to avoid cross-card conflicts
  const goldId   = `cfGold-${card.id}`;
  const glowId   = `cfGlow-${card.id}`;
  const shadowId = `cfShadow-${card.id}`;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: 12,
        overflow: 'hidden',
        transform: isReversed ? 'rotate(180deg)' : 'none',
      }}
    >
      {/* ── WebGL animated shader background (unique per arcana) ── */}
      <CardShaderCanvas
        width={width}
        height={height}
        cardType={card.id}
        colors={colors}
        reversed={false}
        animate={true}
      />

      {/* ── SVG overlay: border, illustrations, text ── */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 180 300"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <defs>
          <linearGradient id={goldId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#f4cf7c" />
            <stop offset="50%"  stopColor="#ffe4a8" />
            <stop offset="100%" stopColor="#c19b4c" />
          </linearGradient>
          <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2.5" floodColor="#000" floodOpacity="0.85" />
          </filter>
        </defs>

        {/* Header dark strip for text legibility */}
        <path d="M12,0 L168,0 Q180,0 180,12 L180,42 L0,42 L0,12 Q0,0 12,0 Z"
          fill="rgba(0,0,0,0.48)" />

        {/* Footer dark strip */}
        <path d="M0,224 L180,224 L180,288 Q180,300 168,300 L12,300 Q0,300 0,288 Z"
          fill="rgba(0,0,0,0.52)" />

        {/* Gold outer border */}
        <rect
          x="5" y="5" width="170" height="290" rx="10"
          fill="none"
          stroke={`url(#${goldId})`}
          strokeWidth="2.5"
          filter={`url(#${glowId})`}
        />
        {/* Inner border */}
        <rect
          x="10" y="10" width="160" height="280" rx="7"
          fill="none"
          stroke={`url(#${goldId})`}
          strokeWidth="0.8"
          opacity="0.4"
        />

        {/* Corner ornaments */}
        {[
          [18, 18, 'M0,14 Q0,0 14,0'],
          [162, 18, 'M0,14 Q0,0 -14,0'],
          [18, 282, 'M0,-14 Q0,0 14,0'],
          [162, 282, 'M0,-14 Q0,0 -14,0'],
        ].map(([cx, cy, d], i) => (
          <g key={i} transform={`translate(${cx},${cy})`} filter={`url(#${glowId})`}>
            <path d={d} fill="none" stroke={`url(#${goldId})`} strokeWidth="1.5" />
            <circle cx="0" cy="0" r="2" fill={`url(#${goldId})`} />
          </g>
        ))}

        {/* Roman numeral */}
        <text
          x="90" y="27"
          textAnchor="middle"
          fontFamily="Cinzel, serif"
          fontSize="14"
          fontWeight="bold"
          fill="#f4cf7c"
          filter={`url(#${shadowId})`}
        >
          {toRomanNumeral(card.id)}
        </text>

        {/* Dog illustration */}
        <g transform="translate(90, 130)">
          <DogComponent primaryColor={primaryColor} secondaryColor={secondaryColor} />
        </g>

        {/* Card name (English) */}
        <text
          x="90" y="244"
          textAnchor="middle"
          fontFamily="Cinzel, serif"
          fontSize="12"
          fontWeight="bold"
          fill="#f4cf7c"
          filter={`url(#${shadowId})`}
          letterSpacing="0.5"
        >
          {card.name.toUpperCase()}
        </text>

        {/* Card name (Chinese) */}
        <text
          x="90" y="260"
          textAnchor="middle"
          fontFamily="Noto Sans TC, sans-serif"
          fontSize="11"
          fill="#d4b8f0"
          filter={`url(#${shadowId})`}
        >
          {card.nameZh}
        </text>

        {/* Keywords */}
        <text
          x="90" y="276"
          textAnchor="middle"
          fontFamily="Noto Sans TC, sans-serif"
          fontSize="7.5"
          fill="#c8b8e0"
          opacity="0.9"
        >
          {card.keywordsZh.slice(0, 2).join(' · ')}
        </text>

        {/* Bottom accent dots */}
        <g transform="translate(90, 291)" filter={`url(#${glowId})`}>
          <circle cx="-16" cy="0" r="3"   fill={`url(#${goldId})`} opacity="0.8" />
          <circle cx="0"   cy="0" r="3.5" fill={primaryColor}       opacity="0.9" />
          <circle cx="16"  cy="0" r="3"   fill={`url(#${goldId})`} opacity="0.8" />
        </g>
      </svg>
    </div>
  );
}
