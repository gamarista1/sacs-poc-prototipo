
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Try standard relative path
  const logoPath = 'media/logo-sacs-verde.svg';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    // Attempt one fallback to absolute path if relative failed
    if (target.src.includes('media/') && !target.src.startsWith(window.location.origin + '/')) {
      target.src = '/media/logo-sacs-verde.svg';
    } else {
      // If absolute also fails, show text fallback
      setLogoFailed(true);
    }
  };

  return (
    <div className="min-h-screen bg-sacs-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-mint-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sacs-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

      <div className="w-full max-w-md relative animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 p-10 md:p-12">
          <div className="text-center mb-10">
            <div className="mb-8 flex justify-center">
              {!logoFailed ? (
                <img 
                  src={logoPath} 
                  alt="SACS Telemedicina" 
                  className="h-16 w-auto object-contain transition-transform hover:scale-105 duration-300"
                  onError={handleLogoError}
                />
              ) : (
                <div className="h-16 flex items-center justify-center space-x-2">
                  <span className="text-4xl font-black text-sacs-500 tracking-tighter">SACS</span>
                  <div className="w-1 h-8 bg-mint-400"></div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-left leading-none">Tele<br/>medicina</span>
                </div>
              )}
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Portal <span className="text-sacs-500">Hub</span></h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Orquestador de Interoperabilidad</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center space-x-2 animate-shake">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Profesional</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-mint-400 focus:ring-4 focus:ring-mint-400/10 outline-none transition-all font-semibold text-slate-700"
                placeholder="nombre@sacs.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-mint-400 focus:ring-4 focus:ring-mint-400/10 outline-none transition-all font-semibold text-slate-700"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-sacs-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-sacs-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3 disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Acceder al Sistema</span>
                  <span className="text-lg">→</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100">
            <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest leading-loose">
              Uso Restringido a Personal Autorizado.<br/>
              Protegido por Protocolo <span className="text-sacs-500">HL7-FHIR SECURE</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
