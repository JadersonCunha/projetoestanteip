import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { turmas } from '../data/livros';

export default function Navbar() {
  const [turmasOpen, setTurmasOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const linkStyle = {
    color: 'white', textDecoration: 'none', fontSize: '0.85rem',
    fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
  };

  const navLinks = [['Home', '/'], ['Sobre', '/#about'], ['Livros', '/estante']];

  return (
    <>
      <header style={{
        backgroundColor: '#005D72', padding: isMobile ? '1rem 1.2rem' : '1.2rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      }}>
        <Link href="/" style={{ color: '#FFD430', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none' }}>
          IP
        </Link>

        {/* Desktop nav */}
        {!isMobile && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {navLinks.map(([label, href]) => (
              <Link key={label} href={href} className="nav-wobble" style={linkStyle}
                onMouseEnter={e => e.currentTarget.style.color = '#FFD430'}
                onMouseLeave={e => e.currentTarget.style.color = 'white'}>
                {label}
              </Link>
            ))}

            {/* Turmas dropdown */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setTurmasOpen(!turmasOpen)} className="nav-wobble"
                style={{ ...linkStyle, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Turmas
                <svg style={{ width: '12px', height: '12px', transition: 'transform 0.2s', transform: turmasOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {turmasOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '210px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', overflow: 'hidden', zIndex: 50 }}>
                  {turmas.map((turma) => (
                    <Link key={turma.id} href={`/estante?turma=${turma.id}`} onClick={() => setTurmasOpen(false)}
                      style={{ display: 'block', padding: '0.75rem 1.25rem', fontSize: '0.85rem', color: '#005D72', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#005D72'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#005D72'; }}>
                      {turma.nome}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/educadores" className="nav-wobble" style={linkStyle}
              onMouseEnter={e => e.currentTarget.style.color = '#FFD430'}
              onMouseLeave={e => e.currentTarget.style.color = 'white'}>
              Educadores
            </Link>
          </nav>
        )}

        {/* Botão hamburguer — só mobile */}
        {isMobile && (
          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FFD430', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        )}
      </header>

      {/* Drawer mobile */}
      {isMobile && (
        <div style={{
          position: 'fixed', top: '58px', left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 48,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s',
        }} onClick={() => setMenuOpen(false)}>
          <div style={{
            backgroundColor: '#004f63',
            width: '80%', maxWidth: '320px',
            height: '100%',
            padding: '2rem 1.5rem',
            display: 'flex', flexDirection: 'column', gap: '0.5rem',
            transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            overflowY: 'auto',
          }} onClick={e => e.stopPropagation()}>

            <p style={{ color: '#FFD430', fontWeight: 900, fontSize: '1.3rem', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>IP</p>

            {navLinks.map(([label, href]) => (
              <Link key={label} href={href} onClick={() => setMenuOpen(false)}
                style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'block' }}
                onMouseEnter={e => e.currentTarget.style.color = '#FFD430'}
                onMouseLeave={e => e.currentTarget.style.color = 'white'}>
                {label}
              </Link>
            ))}

            <div style={{ marginTop: '0.5rem' }}>
              <p style={{ color: '#FFD430', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem', marginTop: '0.5rem' }}>
                Turmas
              </p>
              {turmas.map((turma) => (
                <Link key={turma.id} href={`/estante?turma=${turma.id}`} onClick={() => setMenuOpen(false)}
                  style={{ display: 'block', color: 'rgba(255,255,255,0.75)', fontSize: '1rem', textDecoration: 'none', padding: '0.6rem 0.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#FFD430'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}>
                  → {turma.nome}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
