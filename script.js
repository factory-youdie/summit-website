/* =========================================================
   ROCK'N'ROLL SUMMIT — script.js
   ========================================================= */

(function () {
  'use strict';

  /* ---------- モバイルナビ開閉 ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => nav.classList.remove('open'))
    );
  }

  /* ---------- スクロールでヘッダー追従 ---------- */
  const header = document.querySelector('.site-header');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80) header.style.background =
      'linear-gradient(180deg, rgba(0,0,0,.98), rgba(0,0,0,.85))';
    else header.style.background =
      'linear-gradient(180deg, rgba(0,0,0,.95), rgba(0,0,0,.7) 80%, transparent)';
    lastY = y;
  });

  /* ---------- フェードイン（IntersectionObserver） ---------- */
  const fadeTargets = document.querySelectorAll(
    '.section-header, .about-card, .news-item, .history-item, .flyer-card, .movie-card, .gallery-item, .interview-card, .big-link, .archive-card'
  );
  fadeTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = (el.style.transform || '') + ' translateY(30px)';
    el.style.transition = 'opacity .8s ease, transform .8s ease';
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.opacity = '1';
        el.style.transform = el.style.transform.replace(' translateY(30px)', '');
        io.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  fadeTargets.forEach(el => io.observe(el));

  /* ---------- エンドロール（リファレンス画像準拠：スクロールせず一画面） ---------- */
  // v2はスクロール演出ではなく参考画像のような掠れたコラージュ表示なので、
  // 特別な制御は不要。フェードインのみIntersectionObserverに任せる。

  /* ---------- フライヤーをクリックで簡易ライトボックス（プレースホルダ対応） ---------- */
  const flyerCards = document.querySelectorAll('.flyer-card');
  flyerCards.forEach(card => {
    card.addEventListener('click', e => {
      const img = card.querySelector('.flyer-img img');
      if (!img) {
        // 画像未差し替えのときは遷移しない
        e.preventDefault();
        return;
      }
      e.preventDefault();
      openLightbox(img.src, img.alt || card.dataset.year);
    });
  });

  /* ---------- インタビュー画像をクリックで拡大表示 ---------- */
  document.querySelectorAll('.interview-card').forEach(card => {
    if (card.classList.contains('placeholder')) return;
    card.addEventListener('click', e => {
      const img = card.querySelector('img');
      if (!img) return;
      e.preventDefault();
      const href = card.getAttribute('href') || img.src;
      openLightbox(href, img.alt || '');
    });
  });

  function openLightbox(src, caption) {
    const lb = document.createElement('div');
    lb.className = 'lb';
    lb.innerHTML = `
      <button class="lb-close" aria-label="閉じる">×</button>
      <figure class="lb-fig">
        <img src="${src}" alt="${caption || ''}">
        <figcaption>${caption || ''}</figcaption>
      </figure>
    `;
    Object.assign(lb.style, {
      position: 'fixed', inset: '0',
      background: 'rgba(0,0,0,.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: '20000', cursor: 'zoom-out'
    });
    const closeBtn = lb.querySelector('.lb-close');
    Object.assign(closeBtn.style, {
      position: 'absolute', top: '20px', right: '20px',
      background: 'transparent', color: '#fff',
      fontSize: '40px', border: 'none', cursor: 'pointer'
    });
    const fig = lb.querySelector('.lb-fig');
    Object.assign(fig.style, {
      maxWidth: '90vw', maxHeight: '90vh',
      textAlign: 'center', color: '#fff'
    });
    fig.querySelector('img').style.maxWidth = '100%';
    fig.querySelector('img').style.maxHeight = '80vh';
    fig.querySelector('figcaption').style.marginTop = '12px';
    fig.querySelector('figcaption').style.fontFamily = '"Bungee",sans-serif';
    fig.querySelector('figcaption').style.letterSpacing = '.2em';

    document.body.appendChild(lb);
    const close = () => lb.remove();
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function esc(ev) {
      if (ev.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });
  }

  /* ---------- 開発者向けロゴクリックでイースターエッグ ---------- */
  const star = document.querySelector('.logo-star');
  if (star) {
    let clicks = 0;
    star.addEventListener('click', () => {
      clicks++;
      if (clicks >= 5) {
        document.body.style.transition = 'filter 1s';
        document.body.style.filter = 'hue-rotate(180deg) invert(.05)';
        setTimeout(() => { document.body.style.filter = ''; }, 2500);
        clicks = 0;
      }
    });
  }
})();
