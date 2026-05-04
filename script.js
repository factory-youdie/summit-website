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

  /* ---------- フライヤーをクリックで簡易ライトボックス（← →ナビ付き） ---------- */
  const flyerCards = [...document.querySelectorAll('.flyer-card')].filter(card => card.querySelector('.flyer-img img'));
  flyerCards.forEach((card, i) => {
    card.addEventListener('click', e => {
      e.preventDefault();
      openFlyerLightbox(flyerCards, i);
    });
  });
  // CANCELLED等、画像なしカードはリンク無効のみ
  document.querySelectorAll('.flyer-card').forEach(card => {
    if (!card.querySelector('.flyer-img img')) {
      card.addEventListener('click', e => e.preventDefault());
    }
  });

  function openFlyerLightbox(cards, startIdx) {
    let idx = startIdx;

    const lb = document.createElement('div');
    lb.className = 'lb lb-gallery';
    Object.assign(lb.style, {
      position: 'fixed', inset: '0',
      background: 'rgba(0,0,0,.93)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: '20000'
    });

    lb.innerHTML = `
      <button class="lb-close" aria-label="閉じる">×</button>
      <button class="lb-nav lb-prev" aria-label="前へ">&#8249;</button>
      <figure class="lb-fig">
        <img src="" alt="" style="max-width:100%;max-height:80vh;display:block;margin:0 auto;">
        <figcaption style="margin-top:12px;font-family:'Bungee',sans-serif;letter-spacing:.2em;color:#fff;text-align:center;font-size:.85rem;"></figcaption>
      </figure>
      <button class="lb-nav lb-next" aria-label="次へ">&#8250;</button>
    `;

    Object.assign(lb.querySelector('.lb-close').style, {
      position: 'absolute', top: '20px', right: '24px',
      background: 'transparent', color: '#fff',
      fontSize: '44px', border: 'none', cursor: 'pointer',
      zIndex: '1', lineHeight: '1', padding: '0'
    });
    lb.querySelectorAll('.lb-nav').forEach(btn => {
      Object.assign(btn.style, {
        background: 'rgba(255,255,255,.10)', color: '#fff',
        border: 'none', cursor: 'pointer', fontSize: '72px',
        lineHeight: '1', padding: '0 18px', borderRadius: '4px',
        flexShrink: '0', transition: 'background .2s', userSelect: 'none'
      });
      btn.addEventListener('mouseover', () => btn.style.background = 'rgba(255,255,255,.24)');
      btn.addEventListener('mouseout', () => btn.style.background = 'rgba(255,255,255,.10)');
    });
    Object.assign(lb.querySelector('.lb-fig').style, {
      maxWidth: '70vw', textAlign: 'center', flexShrink: '0'
    });

    function load(i) {
      const card = cards[i];
      const href = card.getAttribute('href');
      const year = card.dataset.year || '';
      lb.querySelector('.lb-fig img').src = href;
      lb.querySelector('.lb-fig img').alt = year;
      lb.querySelector('figcaption').textContent = year ? "ROCK'N'ROLL SUMMIT " + year : '';
      const prev = lb.querySelector('.lb-prev');
      const next = lb.querySelector('.lb-next');
      prev.style.opacity = i === 0 ? '.25' : '1';
      next.style.opacity = i === cards.length - 1 ? '.25' : '1';
      prev.disabled = i === 0;
      next.disabled = i === cards.length - 1;
    }

    load(idx);
    document.body.appendChild(lb);

    const close = () => {
      lb.remove();
      document.removeEventListener('keydown', onKey);
    };
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', e => {
      e.stopPropagation(); if (idx > 0) load(--idx);
    });
    lb.querySelector('.lb-next').addEventListener('click', e => {
      e.stopPropagation(); if (idx < cards.length - 1) load(++idx);
    });

    function onKey(ev) {
      if (ev.key === 'Escape') close();
      else if (ev.key === 'ArrowLeft' && idx > 0) load(--idx);
      else if (ev.key === 'ArrowRight' && idx < cards.length - 1) load(++idx);
    }
    document.addEventListener('keydown', onKey);
  }

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

  /* ---------- GALLERY：年別タブ切り替え ---------- */
  const galleryTabs = document.querySelectorAll('.gallery-tab');
  const galleryGrids = document.querySelectorAll('.gallery-grid');
  galleryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      galleryTabs.forEach(t => t.classList.remove('active'));
      galleryGrids.forEach(g => g.classList.remove('active'));
      tab.classList.add('active');
      const year = tab.dataset.year;
      const target = document.querySelector(`.gallery-grid[data-year="${year}"]`);
      if (target) target.classList.add('active');
    });
  });

  /* ---------- GALLERY：写真クリックでライトボックス拡大（← →ナビ付き） ---------- */
  document.querySelectorAll('.gallery-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const activeGrid = document.querySelector('.gallery-grid.active');
      if (!activeGrid) return;
      const cells = Array.from(activeGrid.querySelectorAll('.gallery-cell'));
      const idx = cells.indexOf(cell);
      openGalleryLightbox(cells, idx);
    });
  });

  function openGalleryLightbox(cells, startIdx) {
    let idx = startIdx;

    const lb = document.createElement('div');
    lb.className = 'lb lb-gallery';
    Object.assign(lb.style, {
      position: 'fixed', inset: '0',
      background: 'rgba(0,0,0,.93)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '0', zIndex: '20000'
    });

    lb.innerHTML = `
      <button class="lb-close" aria-label="閉じる">×</button>
      <button class="lb-nav lb-prev" aria-label="前へ">&#8249;</button>
      <figure class="lb-fig">
        <img src="" alt="" style="max-width:100%;max-height:80vh;display:block;margin:0 auto;">
        <figcaption style="margin-top:12px;font-family:'Bungee',sans-serif;letter-spacing:.2em;color:#fff;text-align:center;font-size:.85rem;"></figcaption>
      </figure>
      <button class="lb-nav lb-next" aria-label="次へ">&#8250;</button>
    `;

    Object.assign(lb.querySelector('.lb-close').style, {
      position: 'absolute', top: '20px', right: '24px',
      background: 'transparent', color: '#fff',
      fontSize: '44px', border: 'none', cursor: 'pointer',
      zIndex: '1', lineHeight: '1', padding: '0'
    });
    lb.querySelectorAll('.lb-nav').forEach(btn => {
      Object.assign(btn.style, {
        background: 'rgba(255,255,255,.10)', color: '#fff',
        border: 'none', cursor: 'pointer', fontSize: '72px',
        lineHeight: '1', padding: '0 18px', borderRadius: '4px',
        flexShrink: '0', transition: 'background .2s', userSelect: 'none'
      });
      btn.addEventListener('mouseover', () => btn.style.background = 'rgba(255,255,255,.24)');
      btn.addEventListener('mouseout', () => btn.style.background = 'rgba(255,255,255,.10)');
    });
    Object.assign(lb.querySelector('.lb-fig').style, {
      maxWidth: '80vw', textAlign: 'center', flexShrink: '0'
    });

    function load(i) {
      const cell = cells[i];
      const img = cell.querySelector('img');
      const fullSrc = img.src.replace('sz=w400', 'sz=w1200');
      const grid = cell.closest('.gallery-grid');
      const year = grid ? grid.dataset.year : '';
      lb.querySelector('.lb-fig img').src = fullSrc;
      lb.querySelector('.lb-fig img').alt = year;
      lb.querySelector('figcaption').textContent = year ? "ROCK'N'ROLL SUMMIT " + year : '';
      const prev = lb.querySelector('.lb-prev');
      const next = lb.querySelector('.lb-next');
      prev.style.opacity = i === 0 ? '.25' : '1';
      next.style.opacity = i === cells.length - 1 ? '.25' : '1';
      prev.disabled = i === 0;
      next.disabled = i === cells.length - 1;
    }

    load(idx);
    document.body.appendChild(lb);

    const close = () => {
      lb.remove();
      document.removeEventListener('keydown', onKey);
    };
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', e => {
      e.stopPropagation();
      if (idx > 0) load(--idx);
    });
    lb.querySelector('.lb-next').addEventListener('click', e => {
      e.stopPropagation();
      if (idx < cells.length - 1) load(++idx);
    });

    function onKey(ev) {
      if (ev.key === 'Escape') close();
      else if (ev.key === 'ArrowLeft' && idx > 0) load(--idx);
      else if (ev.key === 'ArrowRight' && idx < cells.length - 1) load(++idx);
    }
    document.addEventListener('keydown', onKey);
  }

  /* ---------- 鉄壁Wall：写真クリックでライトボックス ---------- */
  document.querySelectorAll('.wall-photo').forEach(photo => {
    photo.addEventListener('click', () => {
      const img = photo.querySelector('img');
      if (!img) return;
      const fullSrc = img.src.replace('sz=w300', 'sz=w1200');
      const year = photo.dataset.year || '';
      openLightbox(fullSrc, year ? 'ROCK\'N\'ROLL SUMMIT ' + year : '');
    });
  });

  /* ---------- SHOPコラージュ写真クリックでライトボックス ---------- */
  document.querySelectorAll('.sc-photo').forEach(photo => {
    photo.addEventListener('click', () => {
      const img = photo.querySelector('img');
      if (!img) return;
      const fullSrc = img.src.replace('sz=w300', 'sz=w1200');
      openLightbox(fullSrc, 'SHOP');
    });
  });

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
