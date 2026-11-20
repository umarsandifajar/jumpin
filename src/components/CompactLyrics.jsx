import React, { useState, useEffect } from 'react';
import { Mic2 } from 'lucide-react';

export default function CompactLyrics({ track, currentTime }) {
  const [lyricsLines, setLyricsLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  // Sample or fetch synced lyrics for known songs
  useEffect(() => {
    // Basic dynamic lyric phrases for ambient/demo or searched tracks
    const sampleLyrics = [
      { time: 0, text: `♪ ${track.title} — ${track.artist} ♪` },
      { time: 10, text: "I'm tryna put you in the worst mood, ah" },
      { time: 16, text: "P1 cleaner than your church shoes, ah" },
      { time: 22, text: "Milli point two just to hurt you, ah" },
      { time: 28, text: "All red Lamb' just to tease you, ah" },
      { time: 34, text: "None of these toys on lease too, ah" },
      { time: 40, text: "Made your whole year in a week too, yah" },
      { time: 46, text: "Main bitch out your league too, ah" },
      { time: 52, text: "Side bitch out of your league too, ah" },
      { time: 58, text: "Look what you've done, I'm a motherfuckin' starboy" },
      { time: 70, text: "Every day a star is born, climb into the space and glow" },
      { time: 85, text: "Feel the rhythm in the night, pure sound with JumpIn" },
    ];

    setLyricsLines(sampleLyrics);
  }, [track.id, track.title, track.artist]);

  // Update current line based on currentTime
  useEffect(() => {
    if (lyricsLines.length === 0) return;

    let activeIdx = 0;
    for (let i = 0; i < lyricsLines.length; i++) {
      if (currentTime >= lyricsLines[i].time) {
        activeIdx = i;
      } else {
        break;
      }
    }
    setCurrentLineIndex(activeIdx);
  }, [currentTime, lyricsLines]);

  const currentLyric = lyricsLines[currentLineIndex]?.text || `♪ ${track.title} ♪`;

  return (
    <div className="w-full flex items-center mb-1 animate-fade-in">
      <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 max-w-full shadow-sm">
        <Mic2 size={13} className="text-rose-400 shrink-0 animate-pulse" />
        <span className="text-xs md:text-sm font-medium text-white/90 truncate tracking-wide">
          {currentLyric}
        </span>
      </div>
    </div>
  );
}
