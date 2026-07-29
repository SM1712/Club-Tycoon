import React from 'react';
import * as Icons from 'lucide-react';
import { Sponsor } from '../types';

interface SponsorLogoProps {
  sponsor: Sponsor;
  size?: number;
  style?: React.CSSProperties;
}

export const SponsorLogo: React.FC<SponsorLogoProps> = ({ sponsor, size = 48, style }) => {
  // Dynamically retrieve Lucide Icon or fallback to Handshake
  const IconComponent = (Icons as any)[sponsor.logoIcon] || Icons.Handshake;

  // Determine badge shape based on tier and placement
  let borderRadius = '12px'; // Default rounded square
  if (sponsor.placement === 'STADIUM') borderRadius = '14px';
  if (sponsor.tier === 1) borderRadius = '50%'; // Parodies get premium circular shields!

  // Derived accent gradient
  const primaryColor = sponsor.brandColor || '#3b82f6';
  const backgroundGradient = `linear-gradient(135deg, ${primaryColor} 0%, ${adjustColor(primaryColor, -40)} 100%)`;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius,
        background: backgroundGradient,
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: sponsor.tier === 1 ? '0 4px 14px rgba(0,0,0,0.35)' : '0 3px 8px rgba(0,0,0,0.2)',
        border: sponsor.tier === 1 ? '2px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.15)',
        position: 'relative',
        flexShrink: 0,
        ...style
      }}
      title={sponsor.name}
    >
      <IconComponent size={Math.round(size * 0.5)} />

      {/* Parody badge dot for Tier 1 */}
      {sponsor.tier === 1 && (
        <span style={{
          position: 'absolute',
          bottom: '-2px',
          right: '-2px',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: '#eab308',
          border: '2px solid var(--bg-card)'
        }} title="Patrocinador Global Estelar" />
      )}
    </div>
  );
};

// Helper function to darken hex colors for gradient depth
function adjustColor(hex: string, amount: number): string {
  let usePound = false;
  if (hex[0] === '#') {
    hex = hex.slice(1);
    usePound = true;
  }
  const num = parseInt(hex, 16);
  if (isNaN(num)) return hex;
  let r = (num >> 16) + amount;
  if (r > 255) r = 255; else if (r < 0) r = 0;
  let b = ((num >> 8) & 0x00FF) + amount;
  if (b > 255) b = 255; else if (b < 0) b = 0;
  let g = (num & 0x0000FF) + amount;
  if (g > 255) g = 255; else if (g < 0) g = 0;
  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
}
