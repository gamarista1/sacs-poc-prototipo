
import React, { useState, useEffect } from 'react';
import ReactPlayer from 'https://esm.sh/react-player@2.16.0';

interface ParticipantVideoProps {
  url?: string;
  stream?: MediaStream;
  label: string;
  videoEnabled: boolean;
  audioEnabled: boolean;
  isLocal?: boolean;
}

const ParticipantVideo: React.FC<ParticipantVideoProps> = ({
  url,
  stream,
  label,
  videoEnabled,
  audioEnabled,
  isLocal = false
}) => {
  // Simulación de nivel de audio
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    if (!audioEnabled) {
      setAudioLevel(0);
      return;
    }

    const interval = setInterval(() => {
      // Valor aleatorio entre 10% y 80% para simular voz activa
      setAudioLevel(Math.floor(Math.random() * 70) + 10);
    }, 150);

    return () => clearInterval(interval);
  }, [audioEnabled]);

  const initials = label.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className={`relative w-full h-full bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border ${isLocal ? 'border-mint-400/50' : 'border-white/5'}`}>
      {/* Video Content */}
      <div className={`w-full h-full transition-opacity duration-500 ${videoEnabled ? 'opacity-100' : 'opacity-0'}`}>
        {url ? (
          <ReactPlayer
            url={url}
            playing
            muted={isLocal}
            width="100%"
            height="100%"
            style={{ objectFit: 'cover' }}
            playsinline
            loop
          />
        ) : (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500">
            {/* Placeholder si no hay stream ni url */}
            <span className="text-xs font-bold uppercase tracking-widest">Esperando señal...</span>
          </div>
        )}
      </div>

      {/* Avatar Placeholder (Video OFF) */}
      {!videoEnabled && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 animate-in fade-in duration-300">
          <div className="w-24 h-24 rounded-full bg-sacs-900 border-2 border-white/10 flex items-center justify-center text-3xl font-black text-white shadow-2xl relative">
             <div className="absolute inset-0 rounded-full border-2 border-mint-400/20 animate-ping"></div>
             {initials}
          </div>
          <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Cámara Desactivada</p>
        </div>
      )}

      {/* Metadata & Indicators */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center space-x-2">
          {/* Nivel de Audio */}
          <div className="flex items-end space-x-0.5 h-3 w-4">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`w-1 rounded-full transition-all duration-150 ${audioEnabled ? 'bg-mint-400' : 'bg-slate-600'}`}
                style={{ height: audioEnabled ? `${audioLevel * (i/3)}%` : '20%' }}
              />
            ))}
          </div>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">{label}</span>
          {isLocal && <span className="text-[9px] font-bold text-mint-400 bg-mint-400/10 px-1 rounded ml-1">TÚ</span>}
        </div>

        {/* Mute Indicator icon for others */}
        {!audioEnabled && (
          <div className="bg-red-500/80 backdrop-blur-md p-1.5 rounded-lg border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="1" x2="23" y1="1" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantVideo;
