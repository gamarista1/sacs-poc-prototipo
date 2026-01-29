
export type SessionStatus = 'WAITING' | 'CONNECTING' | 'ACTIVE' | 'COMPLETED';

export interface TeleconsultationSession {
  id: string;
  doctorId: string;
  patientId: string;
  appointmentId: string;
  startTime: string;
  status: SessionStatus;
  durationSeconds: number;
}

export interface MediaState {
  audioEnabled: boolean;
  videoEnabled: boolean;
  isScreenSharing: boolean;
}
