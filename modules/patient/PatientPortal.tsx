
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patient.service';
import { useAuth } from '../../context/AuthContext';
import { Appointment, Patient, Prescription, AppointmentStatus } from '../../types';
import { storage } from '../../utils/storage';
import { useToast } from '../../context/ToastContext';
import { Video, Calendar, Clock, ArrowRight, MessageSquare, X } from 'lucide-react';

const RequestTelemedModal: React.FC<{ isOpen: boolean, onClose: () => void, onSuccess: () => void }> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return showToast("Por favor indique el motivo de la consulta", "info");
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Usamos el ID del paciente (en este prototipo p1)
      await patientService.requestTeleconsultation('p1', reason);
      showToast("Solicitud enviada exitosamente", "success");
      onSuccess();
      onClose();
    } catch (err) {
      showToast("Error al enviar la solicitud", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-sacs-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Nueva Teleconsulta</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Solicitud de Atención Virtual</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Motivo de la Consulta</label>
            <textarea
              required
              className="w-full h-32 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-sacs-500 focus:ring-4 focus:ring-sacs-500/10 outline-none transition-all font-medium text-slate-700 resize-none"
              placeholder="Describa brevemente sus síntomas o el motivo de su requerimiento..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="flex space-x-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 bg-sacs-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-sacs-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Enviar Solicitud"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PatientPortal: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const apts = await patientService.getAppointments('p1');
      const allPresc = await storage.get<Prescription[]>('sacs_prescriptions') || [];
      setAppointments(apts);
      setPrescriptions(allPresc.filter(p => p.patient_id === 'p1'));
    } catch (err) {
      console.error("Error cargando portal:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const requestedAppointments = appointments.filter(a => a.status === AppointmentStatus.REQUESTED);
  const confirmedAppointments = appointments.filter(a => a.status === AppointmentStatus.CONFIRMED || a.status === AppointmentStatus.PENDING);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-12 h-12 border-4 border-mint-400 border-t-sacs-500 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Expediente...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Saludo y Acción Principal */}
      <div className="px-2 space-y-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hola, <span className="text-sacs-500">{user?.full_name.split(' ')[0]}</span></h1>
          <p className="text-slate-500 font-medium">Gestiona tu salud desde el portal SACS.</p>
        </div>
        
        <button 
          onClick={() => setIsRequestModalOpen(true)}
          className="w-full bg-gradient-to-r from-sacs-900 to-sacs-600 p-6 rounded-[2.5rem] text-white flex justify-between items-center shadow-clinical hover:scale-[1.02] active:scale-95 transition-all group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-mint-400/20 rounded-2xl flex items-center justify-center">
              <Video size={24} className="text-mint-400" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-black uppercase tracking-widest">Nueva Teleconsulta</h4>
              <p className="text-[10px] text-white/60 font-medium uppercase tracking-tighter">Solicita atención médica hoy</p>
            </div>
          </div>
          <ArrowRight className="text-mint-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Próximas Citas */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center">
          <Calendar size={14} className="mr-2" /> Próximas Citas
        </h2>
        {confirmedAppointments.length === 0 ? (
          <div className="p-10 bg-white rounded-3xl border border-slate-200 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase">Sin citas confirmadas</p>
          </div>
        ) : (
          confirmedAppointments.map(apt => (
            <div key={apt.id} className="bg-sacs-900 p-6 rounded-[2.5rem] shadow-xl shadow-sacs-900/20 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-mint-400/10 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black text-mint-400 uppercase tracking-widest">{apt.type}</span>
                  <span className="text-xs font-black">{apt.date ? new Date(apt.date).toLocaleDateString() : 'Pendiente'}</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{apt.reason}</h3>
                <p className="text-white/60 text-sm font-medium">Dr. Roberto Meza</p>
                <div className="mt-6 flex justify-between items-center">
                   <div className="text-2xl font-black tracking-tight">
                    {apt.date ? new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                   </div>
                   {apt.type === 'TELEMEDICINE' || apt.type === 'VIRTUAL' ? (
                     <button 
                        onClick={() => navigate(`/teleconsultation/${apt.id}`)}
                        className="bg-mint-400 text-sacs-900 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-mint-400/20 hover:scale-105 active:scale-95 flex items-center space-x-2"
                     >
                       <Video size={14} />
                       <span>Ingresar a Sala</span>
                     </button>
                   ) : (
                     <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">
                       Ver Detalles
                     </button>
                   )}
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Solicitudes Pendientes */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center">
          <Clock size={14} className="mr-2" /> Solicitudes Pendientes
        </h2>
        {requestedAppointments.length === 0 ? (
          <div className="p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase">No tienes solicitudes pendientes</p>
          </div>
        ) : (
          requestedAppointments.map(apt => (
            <div key={apt.id} className="bg-white p-6 rounded-[2.5rem] shadow-clinical border border-slate-200 flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{apt.reason}</h3>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Telemedicina</p>
                  </div>
                </div>
                <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-amber-100">Requested</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                Tu solicitud está siendo procesada. Esperando asignación de horario por el centro médico.
              </p>
            </div>
          ))
        )}
      </section>

      {/* Mis Recetas */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center">
          <span className="mr-2">💊</span> Mis Recetas Vigentes
        </h2>
        {prescriptions.length === 0 ? (
          <div className="p-10 bg-white rounded-3xl border border-slate-200 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase">Aún no tienes recetas</p>
          </div>
        ) : (
          prescriptions.map(presc => (
            <div key={presc.id} className="bg-white p-6 rounded-[2.5rem] shadow-clinical border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-mint-400/10 rounded-2xl flex items-center justify-center text-2xl">💊</div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Código Farmacia</p>
                  <p className="text-lg font-black text-sacs-500 font-mono tracking-tighter">{presc.validation_code}</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {presc.medications.map((med, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{med.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{med.frequency}</p>
                    </div>
                    <span className="text-[10px] font-black text-slate-500 bg-slate-50 px-2 py-1 rounded-md">{med.dosage}</span>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-center space-x-4 border border-dashed border-slate-200">
                <div className="grid grid-cols-4 gap-1 p-1 bg-white border border-slate-200">
                  {[...Array(16)].map((_, i) => <div key={i} className={`w-2 h-2 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}></div>)}
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">Muestra este código<br/>en cualquier farmacia SACS</p>
              </div>
            </div>
          ))
        )}
      </section>

      <RequestTelemedModal 
        isOpen={isRequestModalOpen} 
        onClose={() => setIsRequestModalOpen(false)} 
        onSuccess={loadData}
      />
    </div>
  );
};

export default PatientPortal;
