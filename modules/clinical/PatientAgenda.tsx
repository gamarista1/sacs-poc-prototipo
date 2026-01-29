
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Appointment, Patient, AppointmentStatus } from '../../types';
import { Video } from 'lucide-react';

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
          <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Agenda de Hoy</h2>
        <span className="bg-sacs-100 text-sacs-600 px-2.5 py-1 rounded-full text-[10px] font-bold">
          {appointments.length} CITAS
        </span>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No hay citas programadas</p>
        </div>
      ) : (
        appointments.map((apt) => (
          <div
            key={apt.id}
            className="group relative"
          >
            <button
              onClick={() => onSelect(apt.id)}
              className={`
                w-full text-left p-4 rounded-2xl transition-all duration-300 relative overflow-hidden
                ${selectedId === apt.id 
                  ? 'bg-sacs-900 text-white shadow-xl shadow-sacs-900/20 translate-x-1' 
                  : 'bg-white border border-slate-200 hover:border-mint-400 hover:bg-slate-50'}
              `}
            >
              {selectedId === apt.id && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-mint-400/10 rounded-bl-full animate-in fade-in zoom-in"></div>
              )}
              
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-black uppercase tracking-tighter ${selectedId === apt.id ? 'text-mint-400' : 'text-slate-400'}`}>
                  {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="flex items-center space-x-2">
                  {apt.type === 'VIRTUAL' && (
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md border ${selectedId === apt.id ? 'border-mint-400/30 text-mint-400' : 'border-indigo-100 text-indigo-500 bg-indigo-50'}`}>
                      VIDEO
                    </span>
                  )}
                  <span className={`
                    text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest
                    ${apt.status === AppointmentStatus.PENDING ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}
                    ${selectedId === apt.id && 'bg-white/10 text-white'}
                  `}>
                    {apt.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-transform group-hover:scale-105
                  ${selectedId === apt.id ? 'bg-mint-400 text-sacs-900' : 'bg-sacs-50 text-sacs-500'}
                `}>
                  {apt.patient.first_name[0]}{apt.patient.last_name[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-bold truncate text-sm leading-tight">
                    {apt.patient.first_name} {apt.patient.last_name}
                  </p>
                  <p className={`text-[10px] truncate ${selectedId === apt.id ? 'text-white/60' : 'text-slate-400'}`}>
                    {apt.reason}
                  </p>
                </div>
              </div>

              {/* Acceso Directo a Telemedicina si es virtual y está seleccionada */}
              {apt.type === 'VIRTUAL' && selectedId === apt.id && (
                <div className="mt-4 pt-3 border-t border-white/10 animate-in slide-in-from-top-2 duration-300">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/teleconsultation/${apt.id}`);
                    }}
                    className="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    <Video size={12} />
                    <span>Entrar a Videollamada</span>
                  </button>
                </div>
              )}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default PatientAgenda;
