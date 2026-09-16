import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Watermark from '../components/Watermark';
import BackToTop from '../components/BackToTop';

const FONT_HERO = 'clamp(2.4rem, 3.5vw, 3.8rem)';

export default function Home() {
  return (
    <div className="bg-[#F5F8FA] text-[#1a1a1a] overflow-x-hidden font-sans scroll-smooth" style={{ position: 'relative' }}>

      <Watermark />
      <Navbar />

      <BackToTop />

      {/* HOME */}
      <section id="home" className="hero-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '2.5rem 2rem', maxWidth: '1280px', margin: '0 auto', width: '100%', boxSizing: 'border-box', position: 'relative', zIndex: 1 }}>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', width: '100%' }}>

          {/* ESQUERDA — título + texto + botões */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', marginBottom: '1rem' }}>

              {/* ESTANTE */}
              <div className="animate-from-top" style={{ marginBottom: '-12px', position: 'relative', zIndex: 30 }}>
                <div style={{ display: 'inline-block', backgroundColor: '#FFD430', transform: 'rotate(-12deg)', transformOrigin: 'left center', padding: '0.5rem 1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                  <span style={{ fontSize: FONT_HERO, fontWeight: 900, color: '#005D72', display: 'inline-block', transform: 'rotate(12deg)', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                    Estante
                  </span>
                </div>
              </div>

              {/* VIRTUAL */}
              <div className="animate-from-left" style={{ marginBottom: '-12px', marginLeft: '16px', position: 'relative', zIndex: 20 }}>
                <div style={{ display: 'inline-block', backgroundColor: '#972632', padding: '0.5rem 1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                  <span style={{ fontSize: FONT_HERO, fontWeight: 900, color: '#FFD430', display: 'block', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                    Virtual
                  </span>
                </div>
              </div>

              {/* IP */}
              <div className="animate-from-bottom" style={{ marginLeft: '32px', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'inline-block', backgroundColor: '#005D72', transform: 'rotate(12deg)', transformOrigin: 'left center', padding: '0.5rem 1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                  <span style={{ fontSize: FONT_HERO, fontWeight: 900, color: '#972632', display: 'inline-block', transform: 'rotate(-12deg)', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                    IP
                  </span>
                </div>
              </div>

            </div>

            <p style={{ fontSize: '1.1rem', color: '#444', lineHeight: 1.7, maxWidth: '420px' }}>
              Acompanhe o desenvolvimento e as atividades dos educandos através de livros virtuais interativos.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/login" style={{ backgroundColor: '#FFD430', color: '#005D72', fontWeight: 700, padding: '0.9rem 2rem', borderRadius: '999px', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', fontSize: '1rem', transition: 'all 0.2s', textDecoration: 'none' }}>
                Login
              </Link>
              <Link href="/primeiro-acesso" style={{ border: '2px solid #005D72', color: '#005D72', fontWeight: 700, padding: '0.9rem 2rem', borderRadius: '999px', fontSize: '1rem', transition: 'all 0.2s', textDecoration: 'none' }}>
                Primeiro Acesso
              </Link>
            </div>
          </div>

          {/* DIREITA — ilustração estante */}
          <div className="hero-ilustracao" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '100%', maxWidth: '560px', height: '420px', backgroundColor: '#003D4D', borderRadius: '100px 0 0 100px', padding: '1.5rem', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', border: '8px solid #004f63', borderRight: 'none' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: '8px', borderBottom: '4px solid #004f63', paddingBottom: '8px', zIndex: 1 }}>
                <div style={{ width: '24px', height: '130px', backgroundColor: '#972632', borderRadius: '2px 2px 0 0' }} />
                <div style={{ width: '32px', height: '150px', backgroundColor: '#005D72', borderRadius: '2px 2px 0 0' }} />
                <div style={{ width: '20px', height: '115px', backgroundColor: '#FFD430', borderRadius: '2px 2px 0 0' }} />
                <div style={{ width: '40px', height: '165px', backgroundColor: '#972632', borderRadius: '2px 2px 0 0' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: '8px', borderBottom: '4px solid #004f63', paddingBottom: '8px', zIndex: 1 }}>
                <div style={{ width: '32px', height: '135px', backgroundColor: '#005D72', borderRadius: '2px 2px 0 0' }} />
                <div style={{ width: '24px', height: '110px', backgroundColor: '#FFD430', borderRadius: '2px 2px 0 0' }} />
                <div style={{ width: '48px', height: '90px', backgroundColor: '#972632', borderRadius: '2px 2px 0 0', transform: 'rotate(90deg) translateX(12px)' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: '8px', zIndex: 1 }}>
                <div style={{ width: '36px', height: '150px', backgroundColor: '#FFD430', borderRadius: '2px 2px 0 0' }} />
                <div style={{ width: '40px', height: '165px', backgroundColor: '#005D72', borderRadius: '2px 2px 0 0' }} />
                <div style={{ width: '32px', height: '135px', backgroundColor: '#972632', borderRadius: '2px 2px 0 0' }} />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SOBRE */}
      <section id="about" className="sobre-section" style={{ backgroundColor: 'rgba(255,255,255,0.85)', padding: '6rem 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <span style={{ color: '#972632', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.85rem' }}>Sobre</span>
          <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: 900, color: '#005D72', marginTop: '1rem', marginBottom: '1.5rem', maxWidth: '640px' }}>
            Quem somos
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#444', lineHeight: 1.8, maxWidth: '680px', marginBottom: '1rem' }}>
            O Instituto Providência é uma organização dedicada à educação e ao desenvolvimento integral de crianças e jovens. Nossa missão é proporcionar um ambiente de aprendizado inclusivo, criativo e transformador.
          </p>
          <p style={{ fontSize: '1.1rem', color: '#444', lineHeight: 1.8, maxWidth: '680px' }}>
            A Estante Virtual IP nasceu para aproximar educadores, famílias e educandos por meio de uma plataforma digital que registra e celebra cada conquista ao longo da jornada educacional.
          </p>
        </div>
      </section>

      <footer style={{ backgroundColor: '#005D72', padding: '2rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {[['Home', '#home'], ['Sobre', '#about'], ['Produto', '/estante']].map(([label, href]) => (
            <a key={label} href={href} style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = '#FFD430'}
              onMouseLeave={e => e.target.style.color = 'white'}
            >{label}</a>
          ))}
        </div>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>IP - Instituto Providência | 2026</span>
      </footer>
    </div>
  );
}
