import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Navbar from '../../components/Navbar';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const HTMLFlipBook = dynamic(() => import('react-pageflip'), { ssr: false });
const Document = dynamic(() => import('react-pdf').then((module) => module.Document), { ssr: false });
const Page = dynamic(() => import('react-pdf').then((module) => module.Page), { ssr: false });
const BASE_PAGE_WIDTH = 560;
const BASE_PAGE_HEIGHT = 792;
const PDF_RENDER_PIXEL_RATIO = 3;
const MIN_ZOOM = 0.8;
const MAX_ZOOM = 1.5;
const ZOOM_STEP = 0.1;

// Página individual do livro (encaminhada via forwardRef para o react-pageflip)
const BookPage = React.forwardRef(({ pdfUrl, pageNumber, totalPages }, ref) => (
  <div
    ref={ref}
    className="bg-white shadow-inner select-none"
    style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    onContextMenu={(e) => e.preventDefault()}
  >
    {pageNumber === 0 ? (
      // Capa
      <div className="w-full h-full bg-[#1E4D3B] flex flex-col items-center justify-center text-white p-8">
        <p className="text-xs uppercase tracking-widest opacity-60 mb-6">Instituto Providência</p>
        <h2 className="text-3xl font-extrabold text-center">Atividades IP</h2>
        <p className="mt-4 text-lg opacity-80">2026</p>
      </div>
    ) : pageNumber === totalPages + 1 ? (
      // Contracapa
      <div className="w-full h-full bg-[#2C241D] flex flex-col items-center justify-center text-white p-8">
        <p className="text-sm opacity-50">IP · Instituto Providência · 2026</p>
      </div>
    ) : (
      <Page
        pageNumber={pageNumber}
        width={BASE_PAGE_WIDTH}
        devicePixelRatio={PDF_RENDER_PIXEL_RATIO}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    )}
  </div>
));
BookPage.displayName = 'BookPage';

export default function LivroPage() {
  const router = useRouter();
  const { id } = router.query;
  const bookRef = useRef();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [livro, setLivro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [zoom, setZoom] = useState(1);
  const pdfUrl = livro ? `/livros/${livro.arquivo}` : '';
  const totalFlipPages = totalPages + 2;
  const pageRefs = useMemo(
    () => Array.from({ length: totalFlipPages }, () => React.createRef()),
    [totalFlipPages],
  );
  const onFlip = useCallback((event) => {
    setCurrentPage(event.data);
  }, []);
  const bookPages = useMemo(() => [
      <BookPage ref={pageRefs[0]} key="cover" pdfUrl={pdfUrl} pageNumber={0} totalPages={totalPages} />,
      ...Array.from({ length: totalPages }, (_, i) => (
        <BookPage
          key={i + 1}
          ref={pageRefs[i + 1]}
          pdfUrl={pdfUrl}
          pageNumber={i + 1}
          totalPages={totalPages}
        />
      )),
      <BookPage
        ref={pageRefs[totalPages + 1]}
        key="back-cover"
        pdfUrl={pdfUrl}
        pageNumber={totalPages + 1}
        totalPages={totalPages}
      />,
  ], [pdfUrl, pageRefs, totalPages]);

  useEffect(() => {
    if (!id) return;
    fetch('/api/livros').then((response) => response.json())
      .then((books) => setLivro(books.find((book) => book.id === id)))
      .finally(() => setCarregando(false));
  }, [id]);

  useEffect(() => {
    import('react-pdf').then(({ pdfjs }) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    });
  }, []);

  const onDocumentLoad = useCallback(({ numPages }) => {
    setTotalPages(numPages);
  }, []);

  if (carregando) {
    return <div className="min-h-screen bg-[#FAF8F5] font-sans"><Navbar /><div className="flex items-center justify-center h-96 text-[#555]">Carregando livro...</div></div>;
  }
  if (!livro) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] font-sans">
        <Navbar />
        <div className="flex items-center justify-center h-96 text-[#555]">
          Livro não encontrado.
        </div>
      </div>
    );
  }

  const bookWrapperStyle = {
    width: `${BASE_PAGE_WIDTH * 2 * zoom}px`,
    height: `${BASE_PAGE_HEIGHT * zoom}px`,
  };
  const bookScaleStyle = {
    width: `${BASE_PAGE_WIDTH * 2}px`,
    height: `${BASE_PAGE_HEIGHT}px`,
    transform: `scale(${zoom})`,
    transformOrigin: 'top center',
  };

  return (
    <div
      className="min-h-screen bg-[#FAF8F5] font-sans"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Navbar />

      {/* Bloqueia impressão via CSS */}
      <style>{`@media print { body { display: none; } }`}</style>

      <main className="flex flex-col items-center py-12 px-4">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold text-[#1E4D3B]">{livro.educando}</h1>
          <p className="text-[#555] text-sm mt-1">{livro.educadora} · {livro.turma}</p>
        </div>

        {/* Carrega o PDF para contar páginas */}
        <div className="w-full overflow-x-auto flex justify-center">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoad}
            loading={<p className="text-[#555]">Carregando livro...</p>}
            options={{ disableAutoFetch: true, disableStream: true }}
          >
            {totalPages > 0 && (
              <div style={bookWrapperStyle}>
                <div style={bookScaleStyle}>
                  <HTMLFlipBook
                    ref={bookRef}
                    width={BASE_PAGE_WIDTH}
                    height={BASE_PAGE_HEIGHT}
                    showCover={false}
                    flippingTime={800}
                    usePortrait={false}
                    startPage={0}
                    renderOnlyPageLengthChange={true}
                    onFlip={onFlip}
                    className="shadow-2xl"
                  >
                    {bookPages}
                  </HTMLFlipBook>
                </div>
              </div>
            )}
          </Document>
        </div>

        {/* Controles */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <button
            onClick={() => bookRef.current?.pageFlip().flipPrev()}
            className="border-2 border-[#1E4D3B] text-[#1E4D3B] px-6 py-2 rounded-full font-bold hover:bg-[#1E4D3B] hover:text-white transition"
          >
            ← Voltar
          </button>
          <span className="text-sm text-[#555]">
            {currentPage + 1} / {totalFlipPages}
          </span>
          <button
            onClick={() => bookRef.current?.pageFlip().flipNext()}
            className="bg-[#D97736] text-white px-6 py-2 rounded-full font-bold hover:bg-[#c2662c] transition"
          >
            Avançar →
          </button>
        </div>

        <div className="flex items-center gap-3 mt-5" aria-label="Controles de zoom">
          <span className="text-sm font-semibold text-[#555]">Zoom</span>
          <button
            onClick={() => setZoom((value) => Math.max(MIN_ZOOM, Number((value - ZOOM_STEP).toFixed(1))))}
            disabled={zoom <= MIN_ZOOM}
            className="w-9 h-9 rounded-full border-2 border-[#1E4D3B] text-[#1E4D3B] text-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1E4D3B] hover:text-white transition"
            aria-label="Diminuir zoom"
            title="Diminuir zoom"
          >
            −
          </button>
          <button
            onClick={() => setZoom(1)}
            className="min-w-16 px-2 py-1 text-sm font-bold text-[#1E4D3B] hover:underline"
            aria-label="Redefinir zoom"
            title="Redefinir zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={() => setZoom((value) => Math.min(MAX_ZOOM, Number((value + ZOOM_STEP).toFixed(1))))}
            disabled={zoom >= MAX_ZOOM}
            className="w-9 h-9 rounded-full border-2 border-[#1E4D3B] text-[#1E4D3B] text-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1E4D3B] hover:text-white transition"
            aria-label="Aumentar zoom"
            title="Aumentar zoom"
          >
            +
          </button>
        </div>

        <button
          onClick={() => router.back()}
          className="mt-6 text-sm text-[#1E4D3B] underline hover:text-[#D97736] transition"
        >
          ← Voltar para a estante
        </button>
      </main>
    </div>
  );
}
