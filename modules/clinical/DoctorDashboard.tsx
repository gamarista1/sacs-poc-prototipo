
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientAgenda from './PatientAgenda';
import SoapForm from './SoapForm';
import PrescriptionModal from './PrescriptionModal';
import LabOrderModal from './LabOrderModal';
import { patientService } from '../../services/patient.service';
import { clinicalService } from '../../services/clinical.service';
import { Appointment, Patient } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Video } from 'lucide-react';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<(Appointment & { patient: Patient })[]>([]);
  const [selectedAptId, setSelectedAptId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modales
  const [showPrescModal, setShowPrescModal] = useState(false);
  const [showLabModal, setShowLabModal] = useState(false);

  useEffect(() => {
    const loadAgenda = async () => {
      try {
        const apts = await patientService.getAppointments();
        const patients = await patientService.getAll();
        
        const agenda = apts.map(apt => ({
          ...apt,
          patient: patients.find(p => p.id === apt.patient_id)!
        }));

        setAppointments(agenda);
        if (agenda.length > 0) setSelectedAptId(agenda[0].id);
      } catch (error) {
        console.error("Error cargando agenda:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAgenda();
  }, []);

  const selectedAppointment = appointments.find(a => a.id === selectedAptId);

  const handleSaveSOAP = async (soapData: any) => {
    if (!selectedAppointment || !user) return;
    
    try {
      await clinicalService.createSOAPNote({
        appointment_id: selectedAppointment.id,
        patient_id: selectedAppointment.patient_id,
        doctor_id: user.id,
        ...soapData
      });
      showToast("Nota SOAP guardada en el expediente electrónico", "success");
    } catch (err) {
      showToast("Fallo al persistir la nota clínica", "error");
    }
  };

  const handleStartTelemed = () => {
    if (selectedAppointment) {
      navigate(`/teleconsultation/${selectedAppointment.id}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-140px)]">
      {/* Columna Izquierda: Agenda */}
      <div className="lg:col-span-3 h-full overflow-y-auto pr-2 custom-scrollbar">
        <PatientAgenda 
          appointments={appointments} 
          selectedId={selectedAptId || undefined} 
          onSelect={setSelectedAptId}
          isLoading={isLoading}
        />
      </div>

      {/* Columna Derecha: Consulta Activa */}
      <div className="lg:col-span-9 h-full overflow-y-auto custom-scrollbar">
        {selectedAppointment ? (
          <div className="space-y-6 pb-10">
            {/* Quick Action Bar para Telemedicina si aplica */}
            {selectedAppointment.type === 'VIRTUAL' && (
              <div className="bg-gradient-to-r from-sacs-900 to-sacs-600 p-6 rounded-[2rem] text-white flex justify-between items-center shadow-clinical animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Video size={24} className="text-mint-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest">Cita Virtual Programada</h4>
                    <p className="text-[10px] text-white/60 font-medium uppercase tracking-tighter">Handshake HL7-SECURE listo para iniciar</p>
                  </div>
                </div>
                <button 
                  onClick={handleStartTelemed}
                  className="bg-mint-400 text-sacs-900 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-mint-400/20"
                >
                  Iniciar Teleconsulta
                </button>
              </div>
            )}

            <SoapForm 
              patient={selectedAppointment.patient} 
              appointment={selectedAppointment}
              onSave={handleSaveSOAP}
              onPrescription={() => setShowPrescModal(true)}
              onLabOrder={() => setShowLabModal(true)}
            />
            
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
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-sacs-50 rounded-full flex items-center justify-center text-3xl mb-6 grayscale opacity-50">
              🩺
            </div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">Sin Paciente Activo</h3>
            <p className="text-slate-400 mt-2 max-w-xs font-medium">Seleccione una cita de la agenda lateral para iniciar la documentación clínica.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
