import { useEffect, useRef } from 'react';

/* ---------- Navegação entre seções (usada pela busca global) ---------- */

export interface Destino {
  secao: string; // id da seção (ex.: "mapa")
  alvo?: string; // id do elemento dentro da seção
  regiao?: string; // id de região do mapa
  mecanica?: string; // id de mecânica (limpa filtros)
}

export const EVENTO_NAVEGAR = 'leonida:navegar';

export function navegar(d: Destino) {
  if (d.secao === 'fontes') {
    window.location.hash = '#/fontes';
    return;
  }
  if (window.location.hash.startsWith('#/')) {
    // saindo da página de fontes: volta para a home e espera renderizar
    window.location.hash = '#' + d.secao;
    setTimeout(() => window.dispatchEvent(new CustomEvent(EVENTO_NAVEGAR, { detail: d })), 120);
    return;
  }
  window.dispatchEvent(new CustomEvent(EVENTO_NAVEGAR, { detail: d }));
}

export function rolarPara(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduzir ? 'auto' : 'smooth', block: 'center' });
  el.classList.remove('destaque-flash');
  void el.offsetWidth;
  el.classList.add('destaque-flash');
  if (el.tabIndex < 0 && !el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

/** Adiciona a classe "visivel" quando o elemento entra na tela. */
export function useRevelar<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('visivel');
      return;
    }
    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visivel');
            obs.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

