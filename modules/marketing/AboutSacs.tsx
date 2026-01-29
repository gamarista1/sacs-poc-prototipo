
import React from 'react';

const AboutSacs: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Conoce a <span className="text-sacs-500">SACS</span></h1>
        <p className="text-slate-500 font-medium mt-4">
          Descubre nuestra visión sobre la interoperabilidad clínica y el futuro de la telemedicina en la región.
        </p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-clinical border border-slate-200 overflow-hidden relative">
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 0,
            paddingTop: '55.8342%',
            paddingBottom: 0,
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            borderRadius: '2rem',
            willChange: 'transform',
          }}
          className="border border-slate-100"
        >
          <iframe
            loading="lazy"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              border: 'none',
              padding: 0,
              margin: 0,
            }}
            src="https://www.canva.com/design/DAG_u4Ytaz4/cyG4DmrHltvdeRj8_zXDyw/view?embed"
            allowFullScreen
            title="SACS Telemedicina Presentation"
          ></iframe>
        </div>
        
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 px-4">
          <div className="flex items-center space-x-3">
             <div className="w-12 h-12 bg-mint-400/10 rounded-2xl flex items-center justify-center text-sacs-600">
                <span className="text-2xl">✨</span>
             </div>
             <div>
                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Interoperabilidad HL7-FHIR</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Estándar internacional de salud</p>
             </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Diseño por Gustavo Amarista</p>
            <a 
              href="https://www.canva.com/design/DAG_u4Ytaz4/cyG4DmrHltvdeRj8_zXDyw/view?utm_content=DAG_u4Ytaz4&utm_campaign=designshare&utm_medium=embeds&utm_source=link" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-black text-sacs-500 hover:text-sacs-600 uppercase tracking-widest flex items-center justify-center md:justify-end transition-colors mt-1"
            >
              <span>Abrir en pantalla completa</span>
              <span className="ml-2">↗</span>
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Misión", desc: "Digitalizar la salud con calidez y eficiencia tecnológica.", icon: "🎯" },
          { title: "Visión", desc: "Ser el ecosistema líder en interoperabilidad médica regional.", icon: "🚀" },
          { title: "Valores", desc: "Seguridad, Innovación y Enfoque Humano en cada línea de código.", icon: "🤝" }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-soft">
            <span className="text-3xl mb-4 block">{item.icon}</span>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">{item.title}</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutSacs;
