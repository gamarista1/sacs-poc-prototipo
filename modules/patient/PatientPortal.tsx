
import React, { useState, useEffect } from 'react';
import { patientService } from '../../services/patient.service';
import { useAuth } from '../../context/AuthContext';
import { Appointment, Patient, Prescription } from '../../types';
import { storage } from '../../utils/storage';

const PatientPortal: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        // En una app real filtraríamos por ID del paciente asociado al usuario
        // Aquí usamos el paciente 'p1' del SEED por ser el prototipo
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
    loadData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-12 h-12 border-4 border-mint-400 border-t-sacs-500 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Expediente...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Saludo */}
      <div className="px-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hola, <span className="text-sacs-500">{user?.full_name.split(' ')[0]}</span></h1>
        <p className="text-slate-500 font-medium">Gestiona tu salud desde el portal SACS.</p>
      </div>

      {/* Próximas Citas */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center">
          <span className="mr-2">📅</span> Próximas Citas
        </h2>
        {appointments.length === 0 ? (
          <div className="p-10 bg-white rounded-3xl border border-slate-200 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase">Sin citas programadas</p>
          </div>
        ) : (
          appointments.map(apt => (
            <div key={apt.id} className="bg-sacs-900 p-6 rounded-[2.5rem] shadow-xl shadow-sacs-900/20 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-mint-400/10 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black text-mint-400 uppercase tracking-widest">{apt.type}</span>
                  <span className="text-xs font-black">{new Date(apt.date).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{apt.reason}</h3>
                <p className="text-white/60 text-sm font-medium">Dr. Roberto Meza</p>
                <div className="mt-6 flex justify-between items-center">
                   <div className="text-2xl font-black tracking-tight">
                    {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </div>
                   <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">
                     Ver Detalles
                   </button>
                </div>
              </div>
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
                {/* Simulación QR */}
                <div className="grid grid-cols-4 gap-1 p-1 bg-white border border-slate-200">
                  {[...Array(16)].map((_, i) => <div key={i} className={`w-2 h-2 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}></div>)}
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">Muestra este código<br/>en cualquier farmacia SACS</p>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default PatientPortal;
