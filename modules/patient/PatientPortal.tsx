
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patient.service';
import { useAuth } from '../../context/AuthContext';
import { Appointment, Patient, Prescription, AppointmentStatus } from '../../types';
import { storage } from '../../utils/storage';
import { useToast } from '../../context/ToastContext';
import { Video, Calendar, Clock, ArrowRight, MessageSquare, X, AlertTriangle, Check, XCircle } from 'lucide-react';

const RequestAppointmentModal: React.FC<{ isOpen: boolean, onClose: () => void, onSuccess: () => void }> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [reason, setReason] = useState('');
  const [desiredDate, setDesiredDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return showToast("Por favor indique el motivo", "info");
    if (!desiredDate) return showToast("Seleccione una fecha preferida", "info");
    if (!user) return;

    setIsSubmitting(true);
    try {
      await patientService.requestRoutineAppointment('p1', desiredDate, reason);
      showToast("Solicitud de cita enviada", "success");
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
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Agendar Cita</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Consulta de Rutina</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fecha Preferida</label>
            <input
              type="datetime-local"
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-sacs-500 outline-none transition-all font-medium text-slate-700"
              value={desiredDate}
              onChange={(e) => setDesiredDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Motivo / Síntomas</label>
            <textarea
              required
              className="w-full h-24 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-sacs-500 outline-none transition-all font-medium text-slate-700 resize-none"
              placeholder="Describa brevemente..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="flex space-x-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-2xl">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-sacs-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-sacs-900/20">
              {isSubmitting ? "Enviando..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EmergencyModal: React.FC<{ isOpen: boolean, onClose: () => void, onSuccess: () => void }> = ({ isOpen, onClose, onSuccess }) => {
  const { showToast } = useToast();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleEmergency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return showToast("Indique la urgencia", "info");
    setIsSubmitting(true);
    try {
      await patientService.requestEmergency('p1', reason);
      showToast("Solicitud de emergencia activada", "success");
      onSuccess();
      onClose();
    } catch (err) {
      showToast("Error al activar emergencia", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-red-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-red-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-red-50 flex flex-col items-center text-center space-y-2">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-2xl font-black text-red-600 uppercase tracking-tight">SOLICITUD SOS</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atención Médica Inmediata</p>
        </div>
        <form onSubmit={handleEmergency} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">¿Qué está ocurriendo?</label>
            <textarea
              required
              autoFocus
              className="w-full h-32 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl focus:ring-4 focus:ring-red-100 outline-none transition-all font-bold text-red-900 resize-none placeholder:text-red-200"
              placeholder="Ej: Dolor fuerte en el pecho, dificultad para respirar..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-red-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-red-600/30 hover:scale-[1.02] active:scale-95 transition-all">
            {isSubmitting ? "ACTIVANDO PROTOCOLO..." : "ACTIVAR EMERGENCIA"}
          </button>
          <button type="button" onClick={onClose} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest">Cancelar</button>
        </form>
      </div>
    </div>
  );
};

const PatientPortal: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modals, setModals] = useState({ routine: false, emergency: false });

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

  useEffect(() => { loadData(); }, [user]);

  const triageAppointments = appointments.filter(a => a.status === AppointmentStatus.WAITING_FOR_TRIAGE);
  const proposals = appointments.filter(a => a.status === AppointmentStatus.PROPOSED_BY_DOCTOR);
  const requested = appointments.filter(a => a.status === AppointmentStatus.REQUESTED_BY_PATIENT || a.status === AppointmentStatus.REQUESTED);
  const confirmed = appointments.filter(a => a.status === AppointmentStatus.CONFIRMED || a.status === AppointmentStatus.CONFIRMED_BY_PATIENT || a.status === AppointmentStatus.PENDING || a.status === AppointmentStatus.IN_PROGRESS);

  const handleAcceptProposal = async (id: string) => {
    try {
      await patientService.acceptDoctorProposal(id);
      showToast("Cita confirmada correctamente", "success");
      loadData();
    } catch (err) { showToast("Error al confirmar", "error"); }
  };

  const handleRejectProposal = async (id: string) => {
    if (window.confirm("¿Desea rechazar esta propuesta de horario?")) {
      try {
        await patientService.rejectProposal(id);
        showToast("Propuesta rechazada", "info");
        loadData();
      } catch (err) { showToast("Error al rechazar", "error"); }
    }
  };

  if (isLoading) return <div className="flex flex-col items-center justify-center h-64"><div className="w-12 h-12 border-4 border-mint-400 border-t-sacs-500 rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-md mx-auto space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Hero & SOS */}
      <div className="px-2 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hola, <span className="text-sacs-500">{user?.full_name.split(' ')[0]}</span></h1>
            <p className="text-slate-500 font-medium">Panel de Control de Salud</p>
          </div>
          <button 
            onClick={() => setModals({ ...modals, emergency: true })}
            className="w-16 h-16 bg-red-600 rounded-3xl text-white flex flex-col items-center justify-center shadow-2xl shadow-red-600/40 hover:scale-110 active:scale-90 transition-all group"
          >
            <AlertTriangle size={24} className="group-hover:animate-bounce" />
            <span className="text-[8px] font-black mt-1 uppercase tracking-tighter">SOS</span>
          </button>
        </div>
        
        <button 
          onClick={() => setModals({ ...modals, routine: true })}
          className="w-full bg-gradient-to-r from-sacs-900 to-sacs-600 p-6 rounded-[2.5rem] text-white flex justify-between items-center shadow-clinical hover:scale-[1.02] active:scale-95 transition-all group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-mint-400/20 rounded-2xl flex items-center justify-center">
              <Calendar size={24} className="text-mint-400" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-black uppercase tracking-widest">Agendar Consulta</h4>
              <p className="text-[10px] text-white/60 font-medium uppercase tracking-tighter">Programar chequeo de rutina</p>
            </div>
          </div>
          <ArrowRight className="text-mint-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Emergency Waiting Room Indicator */}
      {triageAppointments.length > 0 && (
        <section className="px-2 animate-pulse">
          <div className="bg-red-50 border-2 border-red-200 p-6 rounded-[2.5rem] flex flex-col items-center text-center space-y-4 shadow-xl shadow-red-100">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-red-600 uppercase tracking-tight">Urgencia en Triage</h3>
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mt-1">Esperando a un médico disponible</p>
            </div>
            <p className="text-[11px] text-slate-500 font-medium italic">"Estamos procesando tu solicitud de emergencia con prioridad alta. No cierres esta ventana."</p>
          </div>
        </section>
      )}

      {/* PROPOSALS: Doctor proposing a time */}
      {proposals.length > 0 && (
        <section className="space-y-4 px-2">
          <h2 className="text-[11px] font-black text-amber-500 uppercase tracking-[0.2em] flex items-center">
            <Clock size={14} className="mr-2" /> Propuestas del Médico
          </h2>
          {proposals.map(apt => (
            <div key={apt.id} className="bg-amber-50 border-2 border-amber-200 p-6 rounded-[2.5rem] space-y-5 shadow-lg shadow-amber-100/50 animate-in slide-in-from-left-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Propuesta de Horario</h4>
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-1">Dr. Roberto Meza</p>
                </div>
                <div className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Pendiente</div>
              </div>
              
              <div className="bg-white p-4 rounded-2xl border border-amber-100 text-center">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fecha y Hora Propuesta</p>
                 <p className="text-lg font-black text-slate-800 tracking-tight">
                    {new Date(apt.proposedDate!).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                 </p>
                 <p className="text-2xl font-black text-amber-600 tracking-tighter">
                    {new Date(apt.proposedDate!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </p>
              </div>

              <div className="flex space-x-3">
                <button onClick={() => handleRejectProposal(apt.id)} className="flex-1 py-3 border-2 border-amber-200 text-amber-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center space-x-2">
                  <XCircle size={14} /> <span>Rechazar</span>
                </button>
                <button onClick={() => handleAcceptProposal(apt.id)} className="flex-1 py-3 bg-amber-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center justify-center space-x-2">
                  <Check size={14} /> <span>Confirmar</span>
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* CONFIRMED: Active/Future appointments */}
      <section className="space-y-4 px-2">
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
          <Calendar size={14} className="mr-2" /> Próximas Citas
        </h2>
        {confirmed.length === 0 ? (
          <div className="p-10 bg-white rounded-[2.5rem] border border-slate-200 text-center shadow-soft">
            <p className="text-xs font-bold text-slate-400 uppercase">Sin citas confirmadas</p>
          </div>
        ) : (
          confirmed.map(apt => (
            <div key={apt.id} className="bg-sacs-900 p-6 rounded-[2.5rem] shadow-xl shadow-sacs-900/20 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-mint-400/10 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black text-mint-400 uppercase tracking-widest">{apt.type}</span>
                  <span className="text-xs font-black">{apt.date ? new Date(apt.date).toLocaleDateString() : 'En Proceso'}</span>
                </div>
                <h3 className="text-xl font-bold mb-1 truncate">{apt.reason}</h3>
                <p className="text-white/60 text-sm font-medium">Dr. Roberto Meza</p>
                <div className="mt-6 flex justify-between items-center">
                   <div className="text-2xl font-black tracking-tight">
                    {apt.date ? new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                   </div>
                   {(apt.type === 'TELEMEDICINE' || apt.type === 'VIRTUAL' || apt.type === 'EMERGENCY') && (
                     <button 
                        onClick={() => navigate(`/teleconsultation/${apt.id}`)}
                        className="bg-mint-400 text-sacs-900 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-mint-400/20 hover:scale-105 active:scale-95 flex items-center space-x-2"
                     >
                       <Video size={14} />
                       <span>{apt.status === AppointmentStatus.IN_PROGRESS ? 'Unirme ahora' : 'Ingresar a Sala'}</span>
                     </button>
                   )}
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* REQUESTED: Waiting for review */}
      <section className="space-y-4 px-2">
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
          <Clock size={14} className="mr-2" /> Solicitudes Pendientes
        </h2>
        {requested.length === 0 ? (
          <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No tienes solicitudes pendientes</p>
          </div>
        ) : (
          requested.map(apt => (
            <div key={apt.id} className="bg-white p-6 rounded-[2.5rem] shadow-clinical border border-slate-200 flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{apt.reason}</h3>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{apt.type === 'EMERGENCY' ? 'Emergencia' : 'Rutina'}</p>
                  </div>
                </div>
                <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-indigo-100">Review</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[11px] text-slate-500 font-medium italic">"Esperando revisión y asignación de horario por el centro médico."</p>
                {apt.date && <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Deseado: {new Date(apt.date).toLocaleString()}</p>}
              </div>
            </div>
          ))
        )}
      </section>

      <RequestAppointmentModal isOpen={modals.routine} onClose={() => setModals({ ...modals, routine: false })} onSuccess={loadData} />
      <EmergencyModal isOpen={modals.emergency} onClose={() => setModals({ ...modals, emergency: false })} onSuccess={loadData} />
    </div>
  );
};

export default PatientPortal;
