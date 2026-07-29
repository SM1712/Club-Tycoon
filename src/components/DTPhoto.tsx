import React, { useState } from 'react';
import { User } from 'lucide-react';

interface DTPhotoProps {
  photo?: string;
  name: string;
  size?: number;
}

export const DTPhoto: React.FC<DTPhotoProps> = ({ photo, name, size = 48 }) => {
  const [hasError, setHasError] = useState(false);

  if (photo && !hasError) {
    return (
      <img
        src={photo}
        alt={name}
        onError={() => setHasError(true)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid #2563eb',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          flexShrink: 0
        }}
      />
    );
  }

  // Fallback: Avatar Icon Badge
  return (
    <div
      title={name}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: `${Math.max(10, Math.round(size * 0.35))}px`,
        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
        flexShrink: 0
      }}
    >
      <User size={Math.round(size * 0.55)} />
    </div>
  );
};
