import React from 'react';
import Link from 'next/link';

const turmaConfig = {
  'acolhida-manha': { bg: '#005D72', accent: '#FFD430', label: 'Acolhida Manhã',  icon: '🌅' },
  'acolhida-tarde': { bg: '#007A8A', accent: '#FFD430', label: 'Acolhida Tarde',  icon: '🌇' },
  'empatia-tarde':  { bg: '#972632', accent: '#FFB347', label: 'Empatia Tarde',   icon: '💛' },
  'fe-manha':       { bg: '#4A3728', accent: '#E8C97A', label: 'Fé Manhã',        icon: '✨' },
  'fe-tarde':       { bg: '#6B4226', accent: '#E8C97A', label: 'Fé Tarde',        icon: '🕯️' },
  'gratidao':       { bg: '#2D5016', accent: '#A8D55A', label: 'Gratidão',        icon: '🌿' },
};

export default function BookCard({ livro }) {
  const cfg = turmaConfig[livro.turma] || { bg: '#005D72', accent: '#FFD430', label: livro.turma, icon: '📖' };
  const initials = livro.educando.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <Link href={`/livro/${livro.id}`}>
      <div className="group cursor-pointer flex min-w-0 flex-col items-center">
        {/* Capa do livro */}
        <div
          className="book-card-cover relative h-52 w-36 max-w-full rounded-r-lg shadow-xl transition-all duration-300 group-hover:-translate-y-3 group-hover:shadow-2xl overflow-hidden"
          style={{ backgroundColor: cfg.bg }}
        >
          {/* Lombada */}
          <div className="absolute left-0 top-0 h-full w-4 flex flex-col items-center justify-center gap-1"
            style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}>
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: cfg.accent }} />
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: cfg.accent }} />
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: cfg.accent }} />
          </div>

          {/* Faixa superior */}
          <div className="absolute top-0 left-4 right-0 h-1.5" style={{ backgroundColor: cfg.accent }} />

          {/* Faixa inferior */}
          <div className="absolute bottom-0 left-4 right-0 h-1.5" style={{ backgroundColor: cfg.accent }} />

          {/* Conteúdo */}
          <div className="absolute left-4 right-0 top-0 bottom-0 flex flex-col justify-between p-3">
            {/* Turma */}
            <span className="text-[9px] font-bold uppercase tracking-widest opacity-70"
              style={{ color: cfg.accent }}>
              {cfg.label}
            </span>

            {/* Iniciais centralizadas */}
            <div className="flex flex-col items-center justify-center flex-1 gap-1">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-extrabold border-2"
                style={{ borderColor: cfg.accent, color: cfg.accent, backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                {initials}
              </div>
              <span className="text-lg">{cfg.icon}</span>
            </div>

            {/* Nome e ano */}
            <div>
              <p className="text-white font-extrabold text-xs leading-tight line-clamp-2">{livro.educando}</p>
              <p className="text-[9px] font-bold mt-1 opacity-60" style={{ color: cfg.accent }}>IP · 2026</p>
            </div>
          </div>

          {/* Brilho no hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-white" />
        </div>

        <p className="mt-3 max-w-full px-1 text-center text-xs font-semibold leading-tight text-[#005D72]">
          {livro.educando}
        </p>
      </div>
    </Link>
  );
}
