
import React, { useState } from 'react';
import { clinicalService } from '../../services/clinical.service';
import { useToast } from '../../context/ToastContext';

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  doctorId: string;
  medicalRecordId?: string;
}

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({ isOpen, onClose, patientId, doctorId, medicalRecordId }) => {
  const { showToast } = useToast();
  const [meds, setMeds] = useState([{ name: '', dosage: '', frequency: '', duration: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const addMed = () => setMeds([...meds, { name: '', dosage: '', frequency: '', duration: '' }]);
  
  const updateMed = (index: number, field: string, value: string) => {
    const newMeds = [...meds];
    (newMeds[index] as any)[field] = value;
    setMeds(newMeds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await clinicalService.createPrescription({
        patient_id: patientId,
        doctor_id: doctorId,
        medical_record_id: medicalRecordId || 'pending',
        medications: meds.filter(m => m.name !== '')
      });
      showToast("Receta generada y firmada digitalmente", "success");
      onClose();
    } catch (err) {
      showToast("Error al procesar la receta", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-sacs-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Nueva Prescripción</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {meds.map((med, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-4 relative">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medicamento</label>
                  <input 
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 mt-1" 
                    placeholder="Ej. Amoxicilina 500mg"
                    value={med.name}
                    onChange={e => updateMed(idx, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dosis</label>
                  <input 
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 mt-1" 
                    placeholder="Ej. 1 tableta"
                    value={med.dosage}
                    onChange={e => updateMed(idx, 'dosage', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Frecuencia</label>
                  <input 
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 mt-1" 
                    placeholder="Ej. Cada 8 horas"
                    value={med.frequency}
                    onChange={e => updateMed(idx, 'frequency', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addMed} className="text-sacs-500 text-xs font-black uppercase tracking-widest">+ Añadir Medicamento</button>
          <div className="flex space-x-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cancelar</button>
            <button disabled={isSubmitting} type="submit" className="flex-1 py-3 bg-sacs-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-sacs-900/20">
              {isSubmitting ? "Procesando..." : "Firmar Receta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionModal;
