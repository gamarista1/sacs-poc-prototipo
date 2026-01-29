
import React, { useState, useEffect } from 'react';
import PatientAgenda from './PatientAgenda';
import SoapForm from './SoapForm';
import PrescriptionModal from './PrescriptionModal';
import LabOrderModal from './LabOrderModal';
import { patientService } from '../../services/patient.service';
import { clinicalService } from '../../services/clinical.service';
import { Appointment, Patient } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
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
          <>
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
          </>
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
