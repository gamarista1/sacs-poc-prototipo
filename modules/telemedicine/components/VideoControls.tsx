
import React from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, Settings, MoreVertical } from 'lucide-react';

interface VideoControlsProps {
  audioEnabled: boolean;
  videoEnabled: boolean;
  isScreenSharing: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onEndCall: () => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  audioEnabled,
  videoEnabled,
  isScreenSharing,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onEndCall
}) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[150] flex items-center space-x-4 px-8 py-4 bg-slate-900/80 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
      {/* Micrófono */}
      <button
        onClick={onToggleAudio}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
          audioEnabled ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white shadow-lg shadow-red-500/20 scale-110'
        }`}
      >
        {audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
      </button>

      {/* Cámara */}
      <button
        onClick={onToggleVideo}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
          videoEnabled ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white shadow-lg shadow-red-500/20 scale-110'
        }`}
      >
        {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
      </button>

      {/* Compartir Pantalla */}
      <button
        onClick={onToggleScreenShare}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
          isScreenSharing ? 'bg-mint-400 text-sacs-900' : 'bg-white/10 text-white hover:bg-white/20'
        }`}
      >
        <Monitor size={20} />
      </button>

      {/* Espaciador decorativo */}
      <div className="w-px h-8 bg-white/10 mx-2"></div>

      {/* Botón Colgar */}
      <button
        onClick={onEndCall}
        className="w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl shadow-red-600/30"
      >
        <PhoneOff size={24} fill="currentColor" />
      </button>

      {/* Opciones Adicionales */}
      <div className="flex space-x-2 ml-4">
        <button className="w-10 h-10 text-white/60 hover:text-white transition-colors">
          <Settings size={18} />
        </button>
        <button className="w-10 h-10 text-white/60 hover:text-white transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
};

export default VideoControls;
