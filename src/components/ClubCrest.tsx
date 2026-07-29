import React, { useState } from 'react';

interface ClubCrestProps {
  logo?: string;
  name: string;
  abbr: string;
  color1?: string;
  color2?: string;
  pattern?: 'stripes' | 'sash' | 'halves' | 'quarters' | 'cross' | 'chevron';
  size?: number;
}

export const ClubCrest: React.FC<ClubCrestProps> = ({
  logo,
  name,
  abbr,
  color1 = '#2563eb',
  color2 = '#ffffff',
  pattern = 'sash',
  size = 42
}) => {
  const [hasError, setHasError] = useState(false);

  if (logo && !hasError) {
    return (
      <img
        src={logo}
        alt={name}
        onError={() => setHasError(true)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: 'contain',
          display: 'block',
          flexShrink: 0,
          filter: 'drop-shadow(2px 3px 0px #18181b)'
        }}
      />
    );
  }

  // Playful Hand-Drawn Doodle Ink Shield Crest Generator
  const displayAbbr = (abbr || name.slice(0, 3)).toUpperCase().slice(0, 3);
  const primaryColor = color1 || '#2563eb';
  const secondaryColor = color2 || '#ffffff';
  const uniqueId = `crest_${displayAbbr}_${size}_${Math.floor(Math.random() * 1000)}`;

  return (
    <svg
      width={size}
      height={size * 1.18}
      viewBox="0 0 100 118"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, filter: 'drop-shadow(3px 4px 0px #18181b)' }}
    >
      <title>{name}</title>
      <defs>
        <clipPath id={`clip_${uniqueId}`}>
          {/* Wobbly organic doodle shield path */}
          <path d="M 50 11 C 70 12, 88 18, 87 23 C 86 60, 74 88, 50 103 C 26 88, 14 60, 13 23 C 12 18, 30 12, 50 11 Z" />
        </clipPath>
      </defs>

      {/* Background shadow doodle outline */}
      <path
        d="M 50 7 C 72 8, 92 14, 91 21 C 90 64, 76 94, 50 109 C 24 94, 10 64, 9 21 C 8 14, 28 8, 50 7 Z"
        fill="#18181b"
      />

      {/* Main Wobbly Shield Body */}
      <path
        d="M 50 11 C 70 12, 88 18, 87 23 C 86 60, 74 88, 50 103 C 26 88, 14 60, 13 23 C 12 18, 30 12, 50 11 Z"
        fill={primaryColor}
        stroke="#18181b"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Pattern Overlay */}
      <g clipPath={`url(#clip_${uniqueId})`}>
        {pattern === 'stripes' && (
          <path d="M 28 -5 V 125 M 44 -5 V 125 M 60 -5 V 125 M 76 -5 V 125" stroke={secondaryColor} strokeWidth="8" strokeOpacity="0.85" strokeLinecap="round" />
        )}
        {pattern === 'halves' && (
          <rect x="50" y="0" width="50" height="120" fill={secondaryColor} fillOpacity="0.85" />
        )}
        {pattern === 'sash' && (
          <path d="M -10 15 L 110 85 M 10 -15 L 130 55 M -30 45 L 90 115" stroke={secondaryColor} strokeWidth="15" strokeOpacity="0.85" strokeLinecap="round" />
        )}
        {pattern === 'quarters' && (
          <>
            <rect x="50" y="0" width="50" height="55" fill={secondaryColor} fillOpacity="0.85" />
            <rect x="0" y="55" width="50" height="65" fill={secondaryColor} fillOpacity="0.85" />
          </>
        )}
        {pattern === 'cross' && (
          <path d="M -5 55 H 105 M 50 -5 V 125" stroke={secondaryColor} strokeWidth="16" strokeOpacity="0.85" strokeLinecap="round" />
        )}
        {pattern === 'chevron' && (
          <path d="M -5 80 L 50 38 L 105 80" stroke={secondaryColor} strokeWidth="18" fill="none" strokeOpacity="0.85" strokeLinecap="round" />
        )}
      </g>

      {/* Inner doodle ink stroke contour */}
      <path
        d="M 50 15 C 67 16, 83 21, 82 25 C 81 58, 70 82, 50 97 C 30 82, 19 58, 18 25 C 17 21, 33 16, 50 15 Z"
        fill="none"
        stroke="#18181b"
        strokeWidth="2"
        strokeDasharray="12 3"
      />

      {/* Center Emblem Disc (Yellow/White Doodle Ink Disc) */}
      <circle cx="50" cy="55" r="21" fill={secondaryColor} stroke="#18181b" strokeWidth="3" />

      {/* 3-Letter Abbreviation in Hand-Drawn Font */}
      <text
        x="50"
        y="61"
        textAnchor="middle"
        fill={primaryColor}
        fontSize="16"
        fontWeight="900"
        fontFamily="'Kalam', 'Patrick Hand', cursive, sans-serif"
      >
        {displayAbbr}
      </text>

      {/* Hand-Drawn Doodle Crown on Top */}
      <path
        d="M 36 14 L 42 7 L 50 11 L 58 7 L 64 14 Z"
        fill="#facc15"
        stroke="#18181b"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="42" cy="7" r="1.5" fill="#18181b" />
      <circle cx="50" cy="11" r="1.5" fill="#18181b" />
      <circle cx="58" cy="7" r="1.5" fill="#18181b" />
    </svg>
  );
};
