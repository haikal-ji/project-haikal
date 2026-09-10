import React from 'react';
import { SiDocker, SiPostgresql } from 'react-icons/si';

interface TechIconProps {
  name: string;
  className?: string;
}

export default function TechIcon({ name, className = 'w-8 h-8' }: TechIconProps) {
  const norm = name.toLowerCase();

  if (norm.includes('react native') || norm.includes('react-native')) {
    return (
      <svg className={className} viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  if (norm.includes('react')) {
    return (
      <svg className={className} viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  if (norm.includes('docker')) {
    return <SiDocker className={`${className} text-[#2496ED]`} />;
  }

  if (norm.includes('next')) {
    return (
      <svg className={className} viewBox="0 0 128 128" fill="none">
        <circle cx="64" cy="64" r="62" fill="#000000" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
        <path d="M85.3 98.7L46.8 48H36V80H44.6V58.7L80.6 104.9C82.2 103 83.8 100.9 85.3 98.7Z" fill="url(#nextg1)" />
        <rect x="75" y="48" width="8.6" height="32" fill="url(#nextg2)" />
        <defs>
          <linearGradient id="nextg1" x1="68" y1="76" x2="90" y2="104" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="nextg2" x1="79" y1="48" x2="79" y2="72" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (norm.includes('typescript')) {
    return (
      <svg className={className} viewBox="0 0 128 128">
        <rect width="128" height="128" rx="16" fill="#3178C6" />
        <path d="M72.2 87.8c2.2 3.6 5.5 5.8 10 5.8 5.7 0 9.2-2.9 9.2-8.3 0-5.4-3.5-7.3-10.8-10.4-10.8-4.6-15.6-9.8-15.6-19.6 0-10.2 7.7-17.7 20-17.7 8.3 0 14.5 2.8 18.7 8.9l-8.4 5.3c-2.4-3.7-5.5-5.1-9.9-5.1-5.7 0-9.2 2.8-9.2 7.4 0 4.8 3.5 6.9 10.7 10 11.2 4.8 15.8 9.9 15.8 20.3 0 11.5-8.5 18.5-21.2 18.5-10.8 0-18.4-4.2-22.3-11.4l8-4.9zM20 48.7h41.4v9.8H46.5V112H35V58.5H20v-9.8z" fill="#FFF" />
      </svg>
    );
  }

  if (norm.includes('tailwind')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" fill="#38BDF8" />
      </svg>
    );
  }

  if (norm.includes('prisma')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.25 18.423l-7.5-16.5a.75.75 0 0 0-1.37 0l-7.5 16.5a.75.75 0 0 0 .97 1.008l7.5-3.75a.75.75 0 0 0 .42-.67V5.418l5.88 12.935a.75.75 0 0 0 1.1-.93zM10.5 6.643v10.607L4.542 18.72 10.5 6.643z" />
      </svg>
    );
  }

  if (norm.includes('supabase')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M21.362 9.354H12V.3a.3.3 0 0 0-.535-.187L.727 13.123a.3.3 0 0 0 .23.498H12v9.054a.3.3 0 0 0 .535.187l10.738-13.01a.3.3 0 0 0-.23-.498z" fill="#3ECF8E" />
      </svg>
    );
  }

  if (norm.includes('postgres')) {
    return <SiPostgresql className={`${className} text-[#336791]`} />;
  }

  if (norm.includes('figma')) {
    return (
      <svg className={className} viewBox="0 0 38 57" fill="none">
        <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
        <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
        <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
        <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
        <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
      </svg>
    );
  }

  if (norm.includes('git') && !norm.includes('hub')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#F05032">
        <path d="M21.62 10.44L13.56 2.38a1.987 1.987 0 0 0-2.82 0L8.72 4.4l3.56 3.56c.71-.24 1.54-.08 2.11.49.57.57.73 1.4.49 2.11l3.43 3.43c.71-.24 1.54-.08 2.11.49.8.8.8 2.08 0 2.88a2.03 2.03 0 0 1-2.88 0c-.6-.6-.74-1.48-.44-2.22l-3.2-3.2v5.77c.2.14.39.31.54.49.8.8.8 2.08 0 2.88a2.03 2.03 0 0 1-2.88 0 2.03 2.03 0 0 1 0-2.88c.19-.19.41-.34.66-.44v-5.9c-.25-.1-.47-.25-.66-.44-.59-.59-.74-1.47-.45-2.21L5.59 7.54 2.38 10.75a1.987 1.987 0 0 0 0 2.82l8.06 8.06c.78.78 2.04.78 2.82 0l8.36-8.37a1.987 1.987 0 0 0 0-2.82z" />
      </svg>
    );
  }

  if (norm.includes('github')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    );
  }

  if (norm.includes('vs code') || norm.includes('vscode')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#007ACC">
        <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.94-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
      </svg>
    );
  }

  if (norm.includes('vercel')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 22.525H0l12-21.05 12 21.05z" />
      </svg>
    );
  }

  // Default code/terminal fallback icon
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
