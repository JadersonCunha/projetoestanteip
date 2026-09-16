import React, { useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';

export default function VirtualBookReader({ studentName }) {
  const bookRef = useRef();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF8F5] p-6">
      <div className="shadow-2xl bg-white p-2 rounded-lg border-4 border-[#1E4D3B]">
        <HTMLFlipBook
          width={450}
          height={600}
          showCover={true}
          ref={bookRef}
          className="shadow-xl"
        >
          <div className="demo-page bg-[#1E4D3B] p-8 text-white flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold text-center">Atividades IP</h1>
            <p className="mt-6 text-xl">{studentName}</p>
            <span className="mt-12 text-sm opacity-70">Instituto Providência - 2026</span>
          </div>
          <div className="demo-page bg-white p-6 text-black border-l border-gray-300 flex flex-col">
            <div className="border-2 border-dashed border-gray-200 h-full flex items-center justify-center">
              <span className="text-gray-400 font-medium">Conteúdo do PDF - Página 1</span>
            </div>
          </div>
          <div className="demo-page bg-white p-6 text-black border-r border-gray-300 flex flex-col">
            <div className="border-2 border-dashed border-gray-200 h-full flex items-center justify-center">
              <span className="text-gray-400 font-medium">Conteúdo do PDF - Página 2</span>
            </div>
          </div>
        </HTMLFlipBook>
      </div>
      <div className="flex gap-4 mt-8">
        <button 
          onClick={() => bookRef.current.pageFlip().flipPrev()}
          className="border-2 border-[#1E4D3B] text-[#1E4D3B] px-6 py-2 rounded-full font-bold hover:bg-[#1E4D3B] hover:text-white transition"
        >
          &larr; Voltar Página
        </button>
        <button 
          onClick={() => bookRef.current.pageFlip().flipNext()}
          className="bg-[#D97736] text-white px-6 py-2 rounded-full font-bold hover:bg-[#c2662c] transition"
        >
          Avançar Página &rarr;
        </button>
      </div>
    </div>
  );
}
