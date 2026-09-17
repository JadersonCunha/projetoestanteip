import React, { useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';

export default function VirtualBookReader({ studentName }) {
  const bookRef = useRef();
  const [bookWidth, setBookWidth] = useState(450);

  useEffect(() => {
    const updateWidth = () => setBookWidth(Math.min(450, Math.max(180, window.innerWidth - 48)));
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF8F5] p-4 sm:p-6">
      <div className="max-w-full overflow-x-auto rounded-lg border-4 border-[#1E4D3B] bg-white p-2 shadow-2xl">
        <HTMLFlipBook
          width={bookWidth}
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
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button 
          onClick={() => bookRef.current.pageFlip().flipPrev()}
          className="border-2 border-[#1E4D3B] px-4 py-2 rounded-full font-bold text-[#1E4D3B] hover:bg-[#1E4D3B] hover:text-white transition sm:px-6"
        >
          &larr; Voltar Página
        </button>
        <button 
          onClick={() => bookRef.current.pageFlip().flipNext()}
          className="bg-[#D97736] px-4 py-2 rounded-full font-bold text-white hover:bg-[#c2662c] transition sm:px-6"
        >
          Avançar Página &rarr;
        </button>
      </div>
    </div>
  );
}
