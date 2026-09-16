import React from 'react';
import Link from 'next/link';

const coresTurma = {
  acolhida:             { bg: '#005D72', label: 'Acolhida' },
  empatia:              { bg: '#972632', label: 'Empatia' },
  fe:                   { bg: '#004f63', label: 'Fé' },
  gratidao:             { bg: '#7a5c00', label: 'Gratidão' },
  'trabalho-educativo': { bg: '#972632', label: 'Trabalho Educativo' },
};

export default function BookCard({ livro }) {
  const cor = coresTurma[livro.turma] || { bg: '#005D72', label: livro.turma };

  return (
    <Link href={`/livro/${livro.id}`}>
      <div className="group cursor-pointer flex flex-col items-center">
        <div
          className="relative w-36 h-48 rounded-r-lg shadow-xl transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl"
          style={{ backgroundColor: cor.bg }}
        >
          {/* Lombada */}
          <div className="absolute left-0 top-0 h-full w-3 rounded-l-sm bg-black opacity-20" />
          {/* Faixa amarela no topo */}
          <div className="absolute top-0 left-3 right-0 h-1 bg-[#FFD430] opacity-80" />
          <div className="flex flex-col justify-between h-full p-3 pl-5">
            <span className="text-white text-xs font-bold uppercase tracking-widest opacity-80">
              {cor.label}
            </span>
            <div>
              <p className="text-white font-extrabold text-sm leading-tight">{livro.educando}</p>
              <p className="text-white/70 text-xs mt-1">{livro.educadora}</p>
            </div>
            <span className="text-[#FFD430] text-xs opacity-80 font-bold">IP · 2026</span>
          </div>
        </div>
        <p className="mt-3 text-sm font-semibold text-[#005D72] text-center max-w-[9rem] leading-tight">
          {livro.educando}
        </p>
      </div>
    </Link>
  );
}
