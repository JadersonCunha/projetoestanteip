import React, { useState, useEffect } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.querySelector('.simplebar-content-wrapper') || window;
    const onScroll = () => {
      const scrollTop = el === window ? window.scrollY : el.scrollTop;
      setVisible(scrollTop > 300);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  function scrollToTop() {
    const el = document.querySelector('.simplebar-content-wrapper');
    if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <button
      onClick={scrollToTop}
      title="Voltar ao topo"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: '#FFD430',
        color: '#005D72',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.3s, transform 0.3s',
      }}
    >
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
