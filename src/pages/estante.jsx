import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import BookCard from '../components/BookCard';
import Watermark from '../components/Watermark';
import { turmas } from '../data/livros';

export default function Estante() {
  const router = useRouter();
  const [turmaSelecionada, setTurmaSelecionada] = useState('todas');
  const [livros, setLivros] = useState([]);

  useEffect(() => {
    if (router.query.turma) setTurmaSelecionada(router.query.turma);
  }, [router.query.turma]);
  useEffect(() => {
    fetch('/api/livros').then((response) => response.json()).then(setLivros);
  }, []);

  const livrosFiltrados = turmaSelecionada === 'todas'
    ? livros
    : livros.filter((l) => l.turma === turmaSelecionada);

  return (
    <div className="min-h-screen bg-[#F5F8FA] font-sans">
      <Watermark />
      <Navbar />
      <main className="px-8 lg:px-16 py-12">
        <h1 className="text-4xl font-extrabold text-[#005D72] mb-2">Estante Virtual</h1>
        <p className="text-[#444] mb-10">Selecione uma turma para filtrar os livros.</p>

        {/* Filtro */}
        <div className="flex flex-wrap gap-3 mb-12">
          <button
            onClick={() => setTurmaSelecionada('todas')}
            className={`px-5 py-2 rounded-full text-sm font-bold border-2 transition-all ${
              turmaSelecionada === 'todas'
                ? 'bg-[#005D72] text-white border-[#005D72]'
                : 'border-[#005D72] text-[#005D72] hover:bg-[#005D72] hover:text-white'
            }`}
          >
            Todas
          </button>
          {turmas.map((turma) => (
            <button
              key={turma.id}
              onClick={() => setTurmaSelecionada(turma.id)}
              className={`px-5 py-2 rounded-full text-sm font-bold border-2 transition-all ${
                turmaSelecionada === turma.id
                  ? 'bg-[#972632] text-white border-[#972632]'
                  : 'border-[#972632] text-[#972632] hover:bg-[#972632] hover:text-white'
              }`}
            >
              {turma.nome}
            </button>
          ))}
        </div>

        {livrosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-[#aaa]">
            <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-lg font-medium">Nenhum livro encontrado nesta turma.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10">
            {livrosFiltrados.map((livro) => (
              <BookCard key={livro.id} livro={livro} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
