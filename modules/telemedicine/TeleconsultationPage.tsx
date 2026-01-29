
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TeleconsultationRoom from './components/TeleconsultationRoom';
import SoapForm from '../clinical/SoapForm';
import PrescriptionModal from '../clinical/PrescriptionModal';
import LabOrderModal from '../clinical/LabOrderModal';
import { patientService } from '../../services/patient.service';
import { clinicalService } from '../../services/clinical.service';
import { teleconsultationService } from '../../services/teleconsultation.service';
import { Appointment, Patient, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ChevronLeft, ShieldCheck, Activity } from 'lucide-react';

const TeleconsultationPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modales
  const [showPrescModal, setShowPrescModal] = useState(false);
  const [showLabModal, setShowLabModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!appointmentId) return;
      try {
        const apts = await patientService.getAppointments();
        if (!isMounted) return;

        const apt = apts.find(a => a.id === appointmentId);
        if (!apt) throw new Error("Cita no encontrada");
        
        const pat = await patientService.getById(apt.patient_id);
        if (!isMounted) return;
        if (!pat) throw new Error("Paciente no encontrado");

        setAppointment(apt);
        setPatient(pat);
        
        // Inicializar sesión en el backend simulado
        await teleconsultationService.initializeSession(apt.id, apt.doctor_id, apt.patient_id);
      } catch (error: any) {
        if (isMounted) {
          showToast(error.message, "error");
          navigate(user?.role === UserRole.PATIENT ? '/patient' : '/doctor');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [appointmentId, navigate, showToast, user]);

  const handleSaveSOAP = async (soapData: any) => {
    if (!appointment || !user) return;
    try {
      await clinicalService.createSOAPNote({
        appointment_id: appointment.id,
        patient_id: appointment.patient_id,
        doctor_id: user.id,
        ...soapData
      });
      await teleconsultationService.endSession(appointment.teleconsultationId || appointment.id);
      showToast("Consulta finalizada y registrada correctamente", "success");
      navigate('/doctor');
    } catch (err) {
      showToast("Error al guardar el encuentro clínico", "error");
    }
  };

  const handleEndCall = () => {
    const isDoctor = user?.role !== UserRole.PATIENT;
    const msg = isDoctor 
      ? "¿Desea finalizar la videollamada? Asegúrese de guardar sus notas clínicas antes de salir." 
      : "¿Desea salir de la videollamada?";

    if (window.confirm(msg)) {
      navigate(isDoctor ? '/doctor' : '/patient');
    }
  };

  if (isLoading || !patient || !appointment) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-mint-400 border-t-sacs-500 rounded-full animate-spin"></div>
        <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Estableciendo Conexión HL7-SECURE...</p>
      </div>
    );
  }

  const isDoctor = user?.role === UserRole.DOCTOR || user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.CENTER_ADMIN;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6 animate-in fade-in duration-700">
      {/* Header de la Sala */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(isDoctor ? '/doctor' : '/patient')}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                {isDoctor ? "Sala de Teleconsulta" : "Consulta Virtual con Especialista"}
              </h1>
              <span className="px-2 py-0.5 bg-mint-400/20 text-sacs-600 text-[10px] font-black rounded-md uppercase tracking-widest border border-mint-400/30">En Vivo</span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              {isDoctor ? `Paciente: ${patient.first_name} ${patient.last_name}` : `Especialista: Dr. Roberto Meza`}
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6">
           <div className="flex items-center space-x-2 text-green-500 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">HL7-SECURE ACTIVE</span>
           </div>
           <div className="flex items-center space-x-2 text-sacs-500">
              <Activity size={16} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Banda: 1080p Crystal Clear</span>
           </div>
        </div>
      </div>

      {/* Main Split View Grid o Full View para Paciente */}
      <div className={`grid grid-cols-1 ${isDoctor ? 'lg:grid-cols-10 gap-8' : ''} flex-1 min-h-0`}>
        {/* Columna Video (40% si doctor, 100% si paciente) */}
        <div className={`${isDoctor ? 'lg:col-span-4' : 'lg:col-span-10'} h-full`}>
           <TeleconsultationRoom 
            patient={patient}
            onEndSession={handleEndCall}
           />
        </div>

        {/* Columna Historia Clínica (Solo Doctores - 60%) */}
        {isDoctor && (
          <div className="lg:col-span-6 h-full overflow-y-auto custom-scrollbar pr-2 pb-10">
             <SoapForm 
                patient={patient}
                appointment={appointment}
                onSave={handleSaveSOAP}
                onPrescription={() => setShowPrescModal(true)}
                onLabOrder={() => setShowLabModal(true)}
             />
          </div>
        )}
      </div>

      {/* Modales Complementarios (Solo Doctores) */}
      {isDoctor && (
        <>
          <PrescriptionModal 
            isOpen={showPrescModal}
            onClose={() => setShowPrescModal(false)}
            patientId={patient.id}
            doctorId={user?.id || ''}
          />
          <LabOrderModal 
            isOpen={showLabModal}
            onClose={() => setShowLabModal(false)}
            patientId={patient.id}
            doctorId={user?.id || ''}
            centerId={appointment.center_id}
          />
        </>
      )}
    </div>
  );
};

export default TeleconsultationPage;
