
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientAgenda from './PatientAgenda';
import SoapForm from './SoapForm';
import PrescriptionModal from './PrescriptionModal';
import LabOrderModal from './LabOrderModal';
import { patientService } from '../../services/patient.service';
import { clinicalService } from '../../services/clinical.service';
import { Appointment, Patient, AppointmentStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Video, AlertCircle, Calendar, Clock, CheckCircle2, Send, Play } from 'lucide-react';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [appointments, setAppointments] = useState<(Appointment & { patient: Patient })[]>([]);
  const [emergencies, setEmergencies] = useState<(Appointment & { patient: Patient })[]>([]);
  const [requests, setRequests] = useState<(Appointment & { patient: Patient })[]>([]);
  
  const [selectedAptId, setSelectedAptId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'agenda' | 'emergencies' | 'requests'>('agenda');
  const [isLoading, setIsLoading] = useState(true);
  
  // States for proposal flow
  const [proposalDates, setProposalDates] = useState<Record<string, string>>({});

  // Modales
  const [showPrescModal, setShowPrescModal] = useState(false);
  const [showLabModal, setShowLabModal] = useState(false);

  const loadAllData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const allApts = await patientService.getAppointments();
      const patients = await patientService.getAll();
      
      const mapped = allApts.map(apt => ({
        ...apt,
        patient: patients.find(p => p.id === apt.patient_id)!
      }));

      // Categorización por estado y centro
      const centerMapped = mapped.filter(a => a.center_id === user.center_id);
      
      setEmergencies(centerMapped.filter(a => a.status === AppointmentStatus.WAITING_FOR_TRIAGE));
      setRequests(centerMapped.filter(a => a.status === AppointmentStatus.REQUESTED_BY_PATIENT));
      setAppointments(centerMapped.filter(a => 
        a.status === AppointmentStatus.CONFIRMED || 
        a.status === AppointmentStatus.PENDING || 
        a.status === AppointmentStatus.PROPOSED_BY_DOCTOR ||
        a.status === AppointmentStatus.CONFIRMED_BY_PATIENT
      ));

      if (centerMapped.length > 0 && !selectedAptId) {
        const firstAgenda = centerMapped.find(a => a.status === AppointmentStatus.CONFIRMED || a.status === AppointmentStatus.PENDING);
        if (firstAgenda) setSelectedAptId(firstAgenda.id);
      }
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [user]);

  const selectedAppointment = appointments.find(a => a.id === selectedAptId);

  const handleAttendEmergency = async (id: string) => {
    try {
      await clinicalService.attendEmergency(id);
      showToast("Iniciando atención de emergencia", "success");
      navigate(`/teleconsultation/${id}`);
    } catch (err) {
      showToast("Error al procesar emergencia", "error");
    }
  };

  const handleSendProposal = async (aptId: string) => {
    const date = proposalDates[aptId];
    if (!date) return showToast("Seleccione una fecha y hora", "info");

    try {
      await clinicalService.counterProposeAppointment(aptId, date);
      showToast("Propuesta enviada al paciente", "success");
      loadAllData();
    } catch (err) {
      showToast("Error al enviar propuesta", "error");
    }
  };

  const handleSaveSOAP = async (soapData: any) => {
    if (!selectedAppointment || !user) return;
    try {
      await clinicalService.createSOAPNote({
        appointment_id: selectedAppointment.id,
        patient_id: selectedAppointment.patient_id,
        doctor_id: user.id,
        ...soapData
      });
      showToast("Nota SOAP guardada exitosamente", "success");
    } catch (err) {
      showToast("Error al guardar nota clínica", "error");
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-500">
      {/* Header Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
        <div className="flex bg-white p-1 rounded-2xl shadow-soft border border-slate-200">
          <button 
            onClick={() => setActiveTab('agenda')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-2 ${activeTab === 'agenda' ? 'bg-sacs-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Calendar size={14} />
            <span>Mi Agenda</span>
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-2 relative ${activeTab === 'requests' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Clock size={14} />
            <span>Solicitudes</span>
            {requests.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-400 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-white">{requests.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('emergencies')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-2 relative ${activeTab === 'emergencies' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <AlertCircle size={14} />
            <span>Urgencias</span>
            {emergencies.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-white animate-pulse">{emergencies.length}</span>}
          </button>
        </div>

        <div className="flex items-center space-x-4">
           <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado del Centro</p>
              <p className="text-sm font-bold text-sacs-500">Operativo (Nivel 1)</p>
           </div>
           <div className="w-10 h-10 bg-mint-400/20 rounded-xl flex items-center justify-center text-sacs-600">
              <Video size={20} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-220px)]">
        {/* Main Workspace */}
        <div className="lg:col-span-12 h-full overflow-y-auto custom-scrollbar">
          
          {/* VISTA: AGENDA */}
          {activeTab === 'agenda' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
               <div className="lg:col-span-3 h-full overflow-y-auto pr-2 custom-scrollbar">
                  <PatientAgenda 
                    appointments={appointments} 
                    selectedId={selectedAptId || undefined} 
                    onSelect={setSelectedAptId}
                    isLoading={isLoading}
                  />
               </div>
               <div className="lg:col-span-9 h-full overflow-y-auto custom-scrollbar">
                  {selectedAppointment ? (
                    <div className="space-y-6 pb-20">
                      {/* Banner de Inicio de Cita */}
                      <div className={`p-6 rounded-[2.5rem] text-white flex justify-between items-center shadow-clinical ${selectedAppointment.status === AppointmentStatus.PROPOSED_BY_DOCTOR ? 'bg-slate-500' : 'bg-sacs-900'}`}>
                         <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                               <Video size={24} className="text-mint-400" />
                            </div>
                            <div>
                               <h4 className="text-sm font-black uppercase tracking-widest">
                                  {selectedAppointment.status === AppointmentStatus.PROPOSED_BY_DOCTOR ? 'Propuesta en Espera' : 'Cita Confirmada'}
                               </h4>
                               <p className="text-[10px] text-white/60 font-medium uppercase tracking-tighter">
                                  {selectedAppointment.status === AppointmentStatus.PROPOSED_BY_DOCTOR ? 'Esperando que el paciente acepte el horario' : 'Handshake HL7-SECURE listo'}
                               </p>
                            </div>
                         </div>
                         {selectedAppointment.status !== AppointmentStatus.PROPOSED_BY_DOCTOR && (
                           <button 
                             onClick={() => navigate(`/teleconsultation/${selectedAppointment.id}`)}
                             className="bg-mint-400 text-sacs-900 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-mint-400/20"
                           >
                             Iniciar Teleconsulta
                           </button>
                         )}
                      </div>

                      <SoapForm 
                        patient={selectedAppointment.patient} 
                        appointment={selectedAppointment}
                        onSave={handleSaveSOAP}
                        onPrescription={() => setShowPrescModal(true)}
                        onLabOrder={() => setShowLabModal(true)}
                      />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200 p-12 text-center">
                       <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-6 opacity-30">🗓️</div>
                       <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">Sin Selección</h3>
                       <p className="text-slate-400 mt-2 max-w-xs font-medium">Seleccione una cita confirmada de la agenda para iniciar la atención clínica.</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* VISTA: SOLICITUDES */}
          {activeTab === 'requests' && (
            <div className="max-w-5xl mx-auto space-y-6 pb-20">
               <div className="flex items-center space-x-3 mb-8">
                  <Clock size={24} className="text-indigo-500" />
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Gestión de Agendamiento</h2>
               </div>

               {requests.length === 0 ? (
                 <div className="p-20 bg-white rounded-[3rem] border border-slate-200 text-center shadow-soft">
                    <CheckCircle2 size={48} className="mx-auto text-green-400 mb-4" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No hay solicitudes pendientes de revisión</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {requests.map(req => (
                     <div key={req.id} className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-200 hover:border-indigo-300 transition-all flex flex-col justify-between">
                        <div className="space-y-4">
                           <div className="flex justify-between items-start">
                              <div className="flex items-center space-x-3">
                                 <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center font-black text-indigo-500 text-lg">
                                    {req.patient.first_name[0]}
                                 </div>
                                 <div>
                                    <h4 className="text-sm font-black text-slate-800">{req.patient.first_name} {req.patient.last_name}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DNI: {req.patient.document_id}</p>
                                 </div>
                              </div>
                              <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100">Solicitud</span>
                           </div>
                           
                           <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Motivo / Notas Paciente</p>
                              <p className="text-xs font-medium text-slate-700 leading-relaxed italic">"{req.patientNotes || req.reason}"</p>
                           </div>

                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Establecer Propuesta de Horario</label>
                              <input 
                                type="datetime-local" 
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 outline-none text-xs font-bold text-slate-600"
                                value={proposalDates[req.id] || ''}
                                onChange={(e) => setProposalDates({...proposalDates, [req.id]: e.target.value})}
                              />
                           </div>
                        </div>

                        <button 
                           onClick={() => handleSendProposal(req.id)}
                           className="mt-8 w-full bg-indigo-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                           <Send size={14} />
                           <span>Enviar Contrapropuesta</span>
                        </button>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          )}

          {/* VISTA: URGENCIAS */}
          {activeTab === 'emergencies' && (
            <div className="max-w-4xl mx-auto space-y-6 pb-20">
               <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600 animate-pulse">
                    <AlertCircle size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Sala de Triage Virtual</h2>
               </div>

               {emergencies.length === 0 ? (
                 <div className="p-24 bg-white rounded-[4rem] border border-slate-200 text-center shadow-soft">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Cola de Emergencias Vacía</p>
                    <p className="text-[10px] text-slate-300 font-bold mt-2 uppercase">Monitoreo activo de red SCI habilitado</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {emergencies.map(emg => (
                     <div key={emg.id} className="bg-white p-8 rounded-[2.5rem] shadow-clinical border-l-8 border-red-500 flex flex-col md:flex-row justify-between items-center gap-6 group">
                        <div className="flex items-center space-x-6 flex-1">
                           <div className="w-16 h-16 bg-red-50 rounded-[1.5rem] flex items-center justify-center font-black text-red-600 text-2xl relative">
                              <div className="absolute inset-0 rounded-[1.5rem] border-2 border-red-500/20 animate-ping"></div>
                              {emg.patient.first_name[0]}
                           </div>
                           <div className="space-y-1">
                              <h4 className="text-lg font-black text-slate-900 tracking-tight">{emg.patient.first_name} {emg.patient.last_name}</h4>
                              <div className="flex items-center space-x-3">
                                 <span className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded uppercase tracking-widest">Emergencia Crítica</span>
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Espera: 4m 12s</span>
                              </div>
                              <p className="text-sm font-medium text-slate-500 mt-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 italic">
                                "{emg.reason}"
                              </p>
                           </div>
                        </div>

                        <button 
                           onClick={() => handleAttendEmergency(emg.id)}
                           className="w-full md:w-auto bg-red-600 text-white px-10 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-red-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-3"
                        >
                           <Play size={16} fill="white" />
                           <span>Atender Ahora</span>
                        </button>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          )}

        </div>
      </div>

      {/* Modales Compartidos */}
      {selectedAppointment && (
        <>
          <PrescriptionModal 
            isOpen={showPrescModal}
            onClose={() => setShowPrescModal(false)}
            patientId={selectedAppointment.patient_id}
            doctorId={user?.id || ''}
          />
          <LabOrderModal 
            isOpen={showLabModal}
            onClose={() => setShowLabModal(false)}
            patientId={selectedAppointment.patient_id}
            doctorId={user?.id || ''}
            centerId={selectedAppointment.center_id}
          />
        </>
      )}
    </div>
  );
};

export default DoctorDashboard;
