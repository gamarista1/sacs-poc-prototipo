
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Appointment, Patient, AppointmentStatus } from '../../types';
import { Video, Clock, CheckCircle2 } from 'lucide-react';

interface PatientAgendaProps {
  appointments: (Appointment & { patient: Patient })[];
  selectedId?: string;
  onSelect: (id: string) => void;
  isLoading: boolean;
}

const PatientAgenda: React.FC<PatientAgendaProps> = ({ appointments, selectedId, onSelect, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-slate-100 rounded-3xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Agenda Clínica</h2>
        <span className="bg-sacs-100 text-sacs-600 px-2.5 py-1 rounded-full text-[10px] font-bold">
          {appointments.length} REGISTROS
        </span>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">No hay citas<br/>en la agenda</p>
        </div>
      ) : (
        appointments.map((apt) => {
          const isProposed = apt.status === AppointmentStatus.PROPOSED_BY_DOCTOR;
          const isConfirmed = apt.status === AppointmentStatus.CONFIRMED || apt.status === AppointmentStatus.CONFIRMED_BY_PATIENT;
          
          return (
            <div key={apt.id} className="group relative">
              <button
                onClick={() => onSelect(apt.id)}
                className={`
                  w-full text-left p-5 rounded-[1.8rem] transition-all duration-300 relative overflow-hidden border
                  ${selectedId === apt.id 
                    ? 'bg-sacs-900 text-white shadow-xl shadow-sacs-900/20 translate-x-1 border-sacs-900' 
                    : isProposed 
                      ? 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-100 hover:bg-slate-100 grayscale hover:grayscale-0' 
                      : 'bg-white border-slate-200 hover:border-mint-400 hover:bg-slate-50'}
                `}
              >
                {selectedId === apt.id && (
                  <div className="absolute top-0 right-0 w-20 h-20 bg-mint-400/10 rounded-bl-full animate-in fade-in zoom-in"></div>
                )}
                
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${selectedId === apt.id ? 'text-mint-400' : 'text-slate-400'}`}>
                      {apt.date ? new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (apt.proposedDate ? new Date(apt.proposedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--')}
                    </span>
                    {isProposed && <Clock size={10} className="text-amber-500 animate-pulse" />}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {apt.type === 'VIRTUAL' && (
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md border ${selectedId === apt.id ? 'border-mint-400/30 text-mint-400' : 'border-indigo-100 text-indigo-500 bg-indigo-50'}`}>
                        VIDEO
                      </span>
                    )}
                    <span className={`
                      text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-[0.1em]
                      ${isProposed ? 'bg-amber-100 text-amber-600' : isConfirmed ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}
                      ${selectedId === apt.id && 'bg-white/10 text-white'}
                    `}>
                      {isProposed ? 'Propuesta' : isConfirmed ? 'Confirmada' : apt.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`
                    w-11 h-11 rounded-[1.1rem] flex items-center justify-center font-bold text-sm transition-transform group-hover:scale-105
                    ${selectedId === apt.id ? 'bg-mint-400 text-sacs-900' : 'bg-sacs-50 text-sacs-500'}
                  `}>
                    {apt.patient.first_name[0]}{apt.patient.last_name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold truncate text-[13px] leading-tight">
                      {apt.patient.first_name} {apt.patient.last_name}
                    </p>
                    <p className={`text-[9px] truncate font-medium mt-0.5 ${selectedId === apt.id ? 'text-white/60' : 'text-slate-400'}`}>
                      {isProposed ? `Sugerido: ${new Date(apt.proposedDate!).toLocaleDateString()}` : apt.reason}
                    </p>
                  </div>
                </div>

                {/* Acción de Teleconsulta Directa */}
                {(apt.type === 'VIRTUAL' || apt.type === 'TELEMEDICINE') && isConfirmed && selectedId === apt.id && (
                  <div className="mt-5 pt-4 border-t border-white/10 animate-in slide-in-from-top-2 duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/teleconsultation/${apt.id}`);
                      }}
                      className="w-full bg-mint-400 text-sacs-900 py-2.5 rounded-[1.1rem] text-[9px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-lg shadow-mint-400/20 active:scale-95"
                    >
                      <Video size={12} fill="currentColor" />
                      <span>Entrar a Videollamada</span>
                    </button>
                  </div>
                )}

                {/* Aviso de Espera de Confirmación del Paciente */}
                {isProposed && selectedId === apt.id && (
                  <div className="mt-4 pt-3 border-t border-slate-200">
                     <p className="text-[9px] font-bold text-amber-600 flex items-center">
                        <Clock size={10} className="mr-1" /> Esperando confirmación del paciente
                     </p>
                  </div>
                )}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PatientAgenda;
