
import React, { useState } from 'react';
import { clinicalService } from '../../services/clinical.service';
import { useToast } from '../../context/ToastContext';

interface LabOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  doctorId: string;
  centerId: string;
}

const LabOrderModal: React.FC<LabOrderModalProps> = ({ isOpen, onClose, patientId, doctorId, centerId }) => {
  const { showToast } = useToast();
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const testOptions = [
    "Hemograma Completo", "Glucosa en Ayunas", "Perfil Lipídico", 
    "Creatinina", "TGO / TGP", "Examen de Orina", "TSH / T4 Libre"
  ];

  if (!isOpen) return null;

  const toggleTest = (test: string) => {
    setSelectedTests(prev => 
      prev.includes(test) ? prev.filter(t => t !== test) : [...prev, test]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTests.length === 0) return showToast("Seleccione al menos un examen", "error");
    
    setIsSubmitting(true);
    try {
      await clinicalService.createLabOrder({
        patient_id: patientId,
        doctor_id: doctorId,
        center_id: centerId,
        tests: selectedTests
      });
      showToast("Orden de laboratorio enviada al SCI", "success");
      onClose();
    } catch (err) {
      showToast("Error al crear orden", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-sacs-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Orden de Laboratorio</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Catálogo de Exámenes Disponibles</p>
            <div className="grid grid-cols-1 gap-2">
              {testOptions.map(test => (
                <button
                  key={test}
                  type="button"
                  onClick={() => toggleTest(test)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                    selectedTests.includes(test) 
                      ? 'border-sacs-500 bg-sacs-50 text-sacs-900' 
                      : 'border-slate-100 hover:border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="text-xs font-bold">{test}</span>
                  {selectedTests.includes(test) && <span className="text-sacs-500 text-lg">✓</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="flex space-x-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cancelar</button>
            <button disabled={isSubmitting} type="submit" className="flex-1 py-3 bg-sacs-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-sacs-500/20">
              {isSubmitting ? "Enviando..." : "Emitir Orden"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LabOrderModal;
