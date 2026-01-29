
import React, { useState } from 'react';
import Webcam from 'https://esm.sh/react-webcam@7.2.0';
import ParticipantVideo from './ParticipantVideo';
import VideoControls from './VideoControls';
import { MediaState } from '../../../types/telemedicina';
import { Patient } from '../../../types';

interface TeleconsultationRoomProps {
  patient: Patient;
  onEndSession: () => void;
}

const TeleconsultationRoom: React.FC<TeleconsultationRoomProps> = ({ patient, onEndSession }) => {
  const [mediaState, setMediaState] = useState<MediaState>({
    audioEnabled: true,
    videoEnabled: true,
    isScreenSharing: false
  });

  const remoteVideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-woman-patient-talking-to-doctor-on-tablet-screen-40538-large.mp4";

  return (
    <div className="relative w-full h-[calc(100vh-160px)] bg-slate-900 rounded-[3rem] overflow-hidden shadow-clinical border border-white/5 animate-in fade-in zoom-in-95 duration-700">
      {/* Remote Participant (Main View - Patient) */}
      <div className="absolute inset-0">
        <ParticipantVideo 
          url={remoteVideoUrl}
          label={`${patient.first_name} ${patient.last_name}`}
          videoEnabled={true} // Asumimos que el paciente tiene video
          audioEnabled={true}
        />
      </div>

      {/* Local Participant (PiP - Doctor) */}
      <div className="absolute top-8 right-8 w-64 h-48 z-40 animate-in slide-in-from-top-4 duration-1000">
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-mint-400 group cursor-move">
          <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
            {mediaState.videoEnabled ? (
              <Webcam 
                audio={false}
                mirrored
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/50 bg-sacs-900">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold">DR</div>
                <span className="text-[8px] font-black mt-2 uppercase tracking-widest">Cámara OFF</span>
              </div>
            )}
          </div>
          
          {/* Label local flotante */}
          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded border border-white/10">
            <p className="text-[8px] font-black text-white uppercase tracking-widest">Tú (Médico)</p>
          </div>
        </div>
      </div>

      {/* Watermark / Logo Section */}
      <div className="absolute top-8 left-8 z-40 flex items-center space-x-3 pointer-events-none opacity-40">
        <div className="w-10 h-10 bg-white p-2 rounded-xl">
           <img src="media/logo-sacs-verde.svg" alt="SACS" className="w-full h-full object-contain" />
        </div>
        <div>
          <p className="text-[10px] font-black text-white uppercase tracking-widest">HL7-FHIR SECURE ROOM</p>
          <p className="text-[8px] font-bold text-mint-400 uppercase tracking-tighter">ENCRIPTACIÓN END-TO-END</p>
        </div>
      </div>

      {/* Central Notification (Opcional, ej: Paciente está hablando) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex flex-col items-center justify-center">
         {/* Aquí podrían ir indicadores de conexión lenta o subtítulos automáticos */}
      </div>

      {/* Controls Overlay */}
      <VideoControls 
        audioEnabled={mediaState.audioEnabled}
        videoEnabled={mediaState.videoEnabled}
        isScreenSharing={mediaState.isScreenSharing}
        onToggleAudio={() => setMediaState(prev => ({ ...prev, audioEnabled: !prev.audioEnabled }))}
        onToggleVideo={() => setMediaState(prev => ({ ...prev, videoEnabled: !prev.videoEnabled }))}
        onToggleScreenShare={() => setMediaState(prev => ({ ...prev, isScreenSharing: !prev.isScreenSharing }))}
        onEndCall={onEndSession}
      />

      {/* Background Decorator for Professional Look */}
      <div className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-mint-400/5 blur-[120px] pointer-events-none"></div>
    </div>
  );
};

export default TeleconsultationRoom;
