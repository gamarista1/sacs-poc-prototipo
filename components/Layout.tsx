
import React, { useState } from 'react';
import { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconDashboard, IconPatients, IconTelemed, IconLab, IconAudit } from './Icons';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  userName: string;
  centerName: string;
}

const Layout: React.FC<LayoutProps> = ({ children, role, userName, centerName }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: <IconDashboard />, roles: [UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN] },
    { label: 'Agenda Médica', path: '/doctor', icon: <IconPatients />, roles: [UserRole.DOCTOR, UserRole.SUPER_ADMIN] },
    { label: 'Laboratorio', path: '/lab', icon: <IconLab />, roles: [UserRole.LAB_TECH, UserRole.SUPER_ADMIN, UserRole.DOCTOR] },
    { label: 'Farmacia', path: '/pharmacy', icon: <IconTelemed />, roles: [UserRole.PHARMACIST, UserRole.SUPER_ADMIN] },
    { label: 'Portal Paciente', path: '/patient', icon: <IconDashboard />, roles: [UserRole.PATIENT, UserRole.SUPER_ADMIN] },
    { label: 'Auditoría', path: '/', icon: <IconAudit />, roles: [UserRole.SUPER_ADMIN] },
  ];

  // Detectar si el item es el activo
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex bg-clinical-bg text-slate-800 font-sans selection:bg-mint-400/30">
      {/* Sidebar Desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-sacs-900 text-white transform transition-all duration-300 ease-in-out
        lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section con Logo Oficial */}
          <div className="p-8 flex flex-col items-start">
            <div className="mb-4">
              <img 
                src="https://raw.githubusercontent.com/aj-asistente/assets/main/sacs-logo-white.png" 
                alt="SACS Telemedicina" 
                className="h-12 w-auto object-contain brightness-0 invert"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<div class="w-10 h-10 bg-gradient-to-br from-mint-400 to-sacs-500 rounded-xl flex items-center justify-center shadow-lg shadow-mint-500/20 rotate-3 transition-transform hover:rotate-0"><span class="text-sacs-900 font-black text-xl">S</span></div>';
                }}
              />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-[0.2em] text-white uppercase opacity-90">ORCHESTRATOR</h1>
              <p className="text-[9px] font-medium text-mint-400 tracking-[0.1em] uppercase opacity-60">Centro de Interoperabilidad</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 space-y-1.5 mt-4">
            {menuItems.filter(item => item.roles.includes(role)).map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                   navigate(item.path);
                   setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group
                  ${isActive(item.path) ? 'bg-white/10 text-mint-400 shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <span className={`mr-4 transition-colors ${isActive(item.path) ? 'text-mint-400' : 'group-hover:text-mint-400 opacity-60'}`}>
                  {item.icon}
                </span>
                <span className="font-semibold text-sm tracking-wide">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Footer */}
          <div className="p-6 m-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sacs-500 to-mint-400 p-0.5">
                <div className="w-full h-full rounded-full bg-sacs-900 flex items-center justify-center font-bold text-sm">
                  {userName.charAt(0)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate text-white">{userName}</p>
                <p className="text-[10px] text-mint-400/60 font-medium truncate uppercase tracking-widest">{centerName}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full mt-4 text-[11px] font-bold text-slate-400 hover:text-red-400 transition-colors uppercase tracking-widest border border-white/10 py-2 rounded-lg hover:bg-red-400/10"
            >
              Desconectar
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between z-40">
          <div className="flex items-center lg:hidden">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
          </div>
          <div className="hidden lg:block">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
              <span>SACS</span>
              <span>/</span>
              <span className="text-sacs-500 font-bold">Portal HL7 v4.0</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
             <div className="hidden sm:flex items-center space-x-3 bg-slate-100 rounded-full px-4 py-2 border border-slate-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[11px] font-bold text-slate-600">SCI CONECTADO</span>
             </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-sacs-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
