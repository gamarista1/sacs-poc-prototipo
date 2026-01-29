
import { UserRole, AppointmentStatus, LabOrderStatus, PrescriptionStatus } from '../types';

export const SEED_DATA = {
  users: [
    { id: 'u1', email: 'admin@sacs.com', password: 'SACS.Admin.V3!!', full_name: 'Admin General', role: UserRole.SUPER_ADMIN, center_id: 'c1' },
    { id: 'u2', email: 'doctor@sacs.com', password: 'SACS.Doctor.V3!!', full_name: 'Dr. Roberto Meza', role: UserRole.DOCTOR, center_id: 'c1' },
    { id: 'u3', email: 'lab@sacs.com', password: 'SACS.Lab.V3!!', full_name: 'Lic. Elena Solís', role: UserRole.LAB_TECH, center_id: 'c1' },
    { id: 'u4', email: 'pharma@sacs.com', password: 'SACS.Pharma.V3!!', full_name: 'Farm. Carlos Dávila', role: UserRole.PHARMACIST, center_id: 'c1' },
    { id: 'u5', email: 'patient@sacs.com', password: 'SACS.Patient.V3!!', full_name: 'Juan Pérez', role: UserRole.PATIENT, center_id: 'c1' },
  ],
  patients: [
    { id: 'p1', center_id: 'c1', document_id: '0801-1990-12345', first_name: 'Juan', last_name: 'Pérez', birth_date: '1990-05-15', gender: 'masculino', source_system: 'SACS-LOCAL' },
    { id: 'p2', center_id: 'c1', document_id: '0501-1985-54321', first_name: 'María', last_name: 'López', birth_date: '1985-11-20', gender: 'femenino', source_system: 'SACS-LOCAL' },
  ],
  appointments: [
    { id: 'a1', patient_id: 'p1', doctor_id: 'u2', center_id: 'c1', date: new Date().toISOString(), status: AppointmentStatus.PENDING, type: 'VIRTUAL', reason: 'Control Hipertensión' },
    { 
      id: 'neg1', 
      patient_id: 'p1', 
      doctor_id: 'u2', 
      center_id: 'c1', 
      date: null, 
      status: AppointmentStatus.REQUESTED_BY_PATIENT, 
      type: 'ROUTINE', 
      reason: 'Chequeo anual',
      patientNotes: 'Preferiblemente en la mañana'
    },
    { 
      id: 'neg2', 
      patient_id: 'p2', 
      doctor_id: 'u2', 
      center_id: 'c1', 
      date: null, 
      status: AppointmentStatus.PROPOSED_BY_DOCTOR, 
      type: 'ROUTINE', 
      reason: 'Revisión de laboratorio',
      proposedDate: new Date(Date.now() + 86400000).toISOString(),
      doctorNotes: 'Tengo espacio mañana a esta hora'
    },
  ],
  inventory: [
    { id: 'm1', name: 'Amoxicilina 500mg', stock: 100 },
    { id: 'm2', name: 'Ibuprofeno 600mg', stock: 50 },
  ]
};
