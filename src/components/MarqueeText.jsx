import React from 'react';

export default function MarqueeText({ text, className = '', maxChars = 24 }) {
  if (!text) return null;

  const isLong = text.length > maxChars;

  if (!isLong) {
    return <div className={`truncate ${className}`}>{text}</div>;
  }

  return (
    <div 
      className="relative overflow-hidden w-full whitespace-nowrap"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)'
      }}
    >
      <div className="inline-flex animate-marquee">
        <span className={`pr-10 ${className}`}>{text}</span>
        <span className={`pr-10 ${className}`}>{text}</span>
      </div>
    </div>
  );
}
