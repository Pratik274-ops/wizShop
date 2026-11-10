/* ==========================================================
   WIZ SHOP — behaviour (vanilla JS, no dependencies)
   Header, mobile menu, scroll reveals, hover-to-play product
   films, hero film.
   ========================================================== */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);

  /* ---------- Header ---------- */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = $('#burger');
  const menu = $('#menu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    if (open) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
    root.classList.toggle('menu-open', open);
  }
  setMenu(false);
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); }
  });
  matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* ---------- Scroll reveals ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries, o) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); o.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
  }

  /* ---------- Active nav link ---------- */
  const links = $$('.nav__links a');
  if ('IntersectionObserver' in window) {
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const a = map.get(e.target.id);
        if (a && e.isIntersecting) { links.forEach(l => l.classList.remove('is-active')); a.classList.add('is-active'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Hero film ---------- */
  const hero = $('#heroVideo');
  if (hero) {
    if (reduce || saveData) {
      hero.removeAttribute('autoplay'); hero.preload = 'none'; hero.pause();
    } else if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { const p = hero.play(); if (p && p.catch) p.catch(() => {}); } else hero.pause();
      }, { threshold: 0.05 }).observe(hero);
    }
  }

  /* ---------- Product films: hover to play (tap on touch) ---------- */
  const cards = $$('.card');
  let active = null;
  let lastPointer = 'mouse';

  function load(v) { if (!v.getAttribute('src') && v.dataset.src) { v.src = v.dataset.src; v.load(); } }

  function stop(card) {
    const v = $('.card__video', card);
    v.pause();
    card.classList.remove('is-playing');
    $('.card__media', card).setAttribute('aria-pressed', 'false');
    if (active === card) active = null;
    setTimeout(() => { if (v.paused) v.currentTime = 0; }, 700);   // rewind after the fade-out
  }
  function play(card) {
    if (active && active !== card) stop(active);
    active = card;
    const v = $('.card__video', card);
    load(v);
    $('.card__media', card).setAttribute('aria-pressed', 'true');
    const p = v.play();
    if (p && p.catch) p.catch(() => stop(card));
  }

  cards.forEach(card => {
    const media = $('.card__media', card);
    const v = $('.card__video', card);
    const bar = $('.card__bar i', card);

    v.addEventListener('playing', () => { if (active === card) card.classList.add('is-playing'); });
    v.addEventListener('timeupdate', () => { if (v.duration) bar.style.transform = `scaleX(${v.currentTime / v.duration})`; });

    media.addEventListener('pointerdown', e => { lastPointer = e.pointerType; });
    media.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') play(card); });
    media.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') stop(card); });
    media.addEventListener('focus', () => play(card));
    media.addEventListener('blur', () => stop(card));
    media.addEventListener('click', () => {
      if (lastPointer === 'mouse' && canHover) return;        // hover already handles mouse
      if (card.classList.contains('is-playing') || active === card) stop(card); else play(card);
    });
    media.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); (active === card) ? stop(card) : play(card); }
    });
  });

  // Warm up the clips shortly before they scroll into view (desktop, not on data-saver)
  if ('IntersectionObserver' in window) {
    const warm = new IntersectionObserver((entries, o) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        if (canHover && !saveData) { const v = $('.card__video', e.target); v.preload = 'auto'; load(v); }
        o.unobserve(e.target);
      });
    }, { rootMargin: '400px 0px' });
    cards.forEach(c => warm.observe(c));
    // Stop a playing clip once its card scrolls away
    const away = new IntersectionObserver(entries => {
      entries.forEach(e => { if (!e.isIntersecting && e.target === active) stop(e.target); });
    }, { threshold: 0.2 });
    cards.forEach(c => away.observe(c));
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden && active) stop(active); });

  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
