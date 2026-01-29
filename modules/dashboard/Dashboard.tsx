
import React, { useState } from 'react';
import StatCard from './StatCard';
import { IconPatients, IconTelemed, IconLab } from '../../components/Icons';
import CreatePatientModal from '../patients/CreatePatientModal';

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const recentEncounters = [
    { id: 1, patient: 'Juan Pérez', doctor: 'Dr. Roberto Meza', status: 'Finalizado', type: 'Telemedicina', time: '10:30 AM', avatar: 'JP' },
    { id: 2, patient: 'María López', doctor: 'Dra. Ana Castro', status: 'En Curso', type: 'Presencial', time: '11:15 AM', avatar: 'ML' },
    { id: 3, patient: 'Carlos Ruiz', doctor: 'Dr. Roberto Meza', status: 'Pendiente', type: 'Telemedicina', time: '12:00 PM', avatar: 'CR' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Bienvenido al Hub</h1>
          <p className="text-slate-500 font-medium mt-1">Monitoreo de interoperabilidad y flujo clínico en tiempo real.</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-sacs-500 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-sacs-500/20 hover:scale-105 transition-all flex items-center"
          >
            <span className="mr-2 text-lg">+</span> Registrar Paciente
          </button>
          <div className="flex bg-white rounded-xl shadow-soft border border-slate-200 p-1">
            <button className="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-lg">HOY</button>
            <button className="px-6 py-2 text-slate-500 text-xs font-bold hover:bg-slate-50 rounded-lg">SEMANA</button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Pacientes Hoy" value="2,840" icon={<IconPatients />} trend="12.5%" />
        <StatCard title="Teleconsultas" value="152" icon={<IconTelemed />} />
        <StatCard title="Lab Analytics" value="84" icon={<IconLab />} trend="2.1%" isPositive={false} />
        <StatCard title="Interacción API" value="19k" icon={<IconLab />} trend="45%" />
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tabla existente... */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-soft border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800">Próximas Consultas</h3>
            <button className="text-xs font-bold text-sacs-500 hover:bg-sacs-50 px-4 py-2 rounded-xl transition-colors">EXPORTAR REGISTROS</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Paciente</th>
                  <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Médico</th>
                  <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Tipo</th>
                  <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentEncounters.map((enc) => (
                  <tr key={enc.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 group-hover:bg-mint-400 transition-colors">
                          {enc.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{enc.patient}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{enc.time}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-semibold text-slate-600">{enc.doctor}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${enc.type === 'Telemedicina' ? 'bg-sacs-50 text-sacs-500' : 'bg-orange-50 text-orange-600'}`}>
                        {enc.type}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className={`inline-flex items-center text-xs font-bold ${enc.status === 'Finalizado' ? 'text-green-500' : enc.status === 'En Curso' ? 'text-amber-500' : 'text-slate-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${enc.status === 'Finalizado' ? 'bg-green-500' : enc.status === 'En Curso' ? 'bg-amber-500' : 'bg-slate-300'}`}></span>
                        {enc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel Interoperabilidad existente... */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-soft border border-slate-200">
            <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-sacs-50 rounded-lg flex items-center justify-center mr-3 text-sacs-500 text-sm">🔗</span>
              Orquestación
            </h3>
            
            <div className="space-y-4">
              {[
                { name: 'SCI Local', status: 'active', speed: '12ms' },
                { name: 'FHIR Gateway', status: 'idle', speed: '-' },
                { name: 'Lab External', status: 'active', speed: '45ms' }
              ].map((sys, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-mint-400 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-slate-700">{sys.name}</p>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-tighter">Latency: {sys.speed}</p>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full ${sys.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-300'}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CreatePatientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={(id) => alert(`Paciente registrado con éxito. ID: ${id}`)}
      />
    </div>
  );
};

export default Dashboard;
