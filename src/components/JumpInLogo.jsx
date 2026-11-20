import React from 'react';

export default function JumpInLogo({ size = 24, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="jumpInLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FF3B56" />
          <stop offset="100%" stop-color="#FA233B" />
        </linearGradient>
        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Musical Note shaped as letter 'J' */}
      {/* Top Flag / Musical Beam */}
      <path 
        d="M26 8 C26 8 36 6 38 15 C33 13 28 15 28 17 V29 C28 35.6 22.6 41 16 41 C9.4 41 4 35.6 4 29 C4 23 8.8 18.2 14.8 18.2 C17.2 18.2 19.4 19 21.2 20.4 V8 Z" 
        fill="url(#jumpInLogoGrad)"
        filter="url(#logoGlow)"
      />

      {/* Inner Highlight on note head */}
      <ellipse 
        cx="14" 
        cy="28" 
        rx="5" 
        ry="4" 
        transform="rotate(-25 14 28)" 
        fill="white" 
        opacity="0.3" 
      />
    </svg>
  );
}
