/* =========================================================
   ROCK'N'ROLL SUMMIT — script.js
   ========================================================= */

(function () {
  'use strict';

  /* ---------- 言語切り替え (JA / EN) ---------- */
  (function() {
    var saved = localStorage.getItem('rrs-lang') || 'ja';
    document.documentElement.lang = saved;

    function updateButtons(lang) {
      document.querySelectorAll('.lang-btn').forEach(function(b) {
        b.classList.toggle('active', b.dataset.lang === lang);
      });
    }

    // Init buttons already in DOM
    updateButtons(saved);

    // Handle clicks (event delegation — works for dynamically inserted buttons too)
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.lang-btn');
      if (!btn) return;
      var lang = btn.dataset.lang;
      if (!lang) return;
      document.documentElement.lang = lang;
      localStorage.setItem('rrs-lang', lang);
      updateButtons(lang);
    });
  })();

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
  // .flyer-card は常に表示（ナビジャンプ時に消えるバグを防ぐため除外）
  const fadeTargets = document.querySelectorAll(
    '.section-header, .about-card, .news-item, .history-item, .movie-card, .gallery-item, .interview-card, .big-link, .archive-card'
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
        el.style.transform = el.style.transform.replace(/\s*translateY\(30px\)/, '');
        io.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  fadeTargets.forEach(el => io.observe(el));

  /* ---------- フライヤーカードを常時表示 ---------- */
  document.querySelectorAll('.flyer-card').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = '';
  });

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
      const href = card.getAttribute('href') || img.src;
      // .htmlページへのリンクはそのまま遷移させる
      if (href && href.match(/\.html(#.*)?$/)) {
        e.preventDefault();
        window.location.href = href;
        return;
      }
      e.preventDefault();
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
      if (target) {
        target.classList.add('active');
        // ページを1にリセット
        const firstBtn = target.nextElementSibling?.querySelector('.gpag-btn[data-p="1"]');
        if (firstBtn) firstBtn.click();
      }
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

  /* ---------- HISTORYウォール写真クリックで前後ナビ付きライトボックス ---------- */
  (function () {
    const lb      = document.getElementById('hwp-lightbox');
    const lbImg   = document.getElementById('hwp-lightbox-img');
    const lbBg    = document.getElementById('hwp-lightbox-bg');
    const btnClose = document.getElementById('hwp-lightbox-close');
    const btnPrev  = document.getElementById('hwp-lightbox-prev');
    const btnNext  = document.getElementById('hwp-lightbox-next');
    if (!lb) return;

    let current = 0;

    function getHwpImgs() {
      return Array.from(document.querySelectorAll('.hwp img'));
    }

    function show(idx) {
      const imgs = getHwpImgs();
      if (!imgs.length) return;
      current = (idx + imgs.length) % imgs.length;
      lbImg.style.opacity = '0';
      const src = imgs[current].src.replace('sz=w300', 'sz=w1200');
      lbImg.src = src;
      lbImg.onload = () => { lbImg.style.opacity = '1'; };
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      lbImg.src = '';
    }

    /* イベント委譲：.hwp のクリックをdocumentレベルで捕捉 */
    document.addEventListener('click', function (e) {
      const hwp = e.target.closest('.hwp');
      if (!hwp) return;
      const imgs = getHwpImgs();
      const idx = imgs.findIndex(img => img.parentElement === hwp || img === e.target);
      if (idx !== -1) show(idx);
    });

    btnClose.addEventListener('click', close);
    lbBg.addEventListener('click', close);
    btnPrev.addEventListener('click', () => show(current - 1));
    btnNext.addEventListener('click', () => show(current + 1));

    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape')      close();
      if (e.key === 'ArrowLeft')   show(current - 1);
      if (e.key === 'ArrowRight')  show(current + 1);
    });
  })();

  /* ---------- SHOPコラージュ写真クリックでライトボックス ---------- */
  document.querySelectorAll('.sc-photo').forEach(photo => {
    photo.addEventListener('click', () => {
      const img = photo.querySelector('img');
      if (!img) return;
      const fullSrc = img.src.replace('sz=w300', 'sz=w1200');
      openLightbox(fullSrc, 'SHOP');
    });
  });

  /* ---------- 血飛沫：各セクションの鉄板に追加 ---------- */
  (function() {
    // [img, size, top%, left%, rot, opacity]
    // top: 15〜78%, left: 5〜88% — 端で切れないよう余白を確保
    // img: 'a'=splat_a, 'b'=splat_b, 'f'=splat_full
    const presets = [
      ['b', 300, 18, 78, -18, 0.68],
      ['f', 260, 62, 10,  22, 0.60],
      ['a', 220, 42, 55, 140, 0.55],
      ['f', 340, 20, 38,  58, 0.65],
      ['b', 250, 70, 82, -72, 0.62],
      ['a', 200, 30, 15, 198, 0.58],
      ['f', 280, 55, 68,  82, 0.65],
      ['b', 230, 25, 48,-122, 0.60],
      ['a', 260, 72, 22,  40, 0.62],
      ['f', 220, 38, 74, 242, 0.58],
      ['b', 300, 60, 44,  -6, 0.65],
      ['a', 240, 20, 82, 108, 0.60],
      ['f', 200, 68, 58, -45, 0.55],
      ['b', 280, 32, 28,  75, 0.63],
      ['a', 260, 50, 88, 165, 0.58],
      ['f', 240, 75, 12, -30, 0.60],
      ['b', 220, 22, 62, 210, 0.62],
      ['a', 300, 65, 36, -88, 0.65],
    ];
    document.querySelectorAll('.section.wall-brick').forEach((sec, si) => {
      for (let j = 0; j < 3; j++) {
        const [img, size, top, left, rot, op] = presets[(si * 3 + j) % presets.length];
        const d = document.createElement('div');
        Object.assign(d.style, {
          position: 'absolute', top: top + '%', left: left + '%',
          width: size + 'px', height: size + 'px',
          backgroundImage: `url('img/splat_${img}.png')`,
          backgroundRepeat: 'no-repeat', backgroundSize: 'contain',
          pointerEvents: 'none', zIndex: '1',
          opacity: op, transform: `rotate(${rot}deg)`
        });
        sec.appendChild(d);
      }
    });
  })();

  /* ---------- ギャラリー：ページネーション（30枚/ページ） ---------- */
  (function() {
    const PER = 30;
    document.querySelectorAll('.gallery-grid').forEach(grid => {
      const cells = Array.from(grid.querySelectorAll('.gallery-cell'));
      if (cells.length <= PER) return;
      const total = Math.ceil(cells.length / PER);
      let cur = 1;

      const pager = document.createElement('div');
      pager.className = 'gallery-pager';

      function showPage(p) {
        cur = p;
        cells.forEach((c, i) => {
          c.style.display = Math.floor(i / PER) + 1 === p ? '' : 'none';
        });
        pager.querySelectorAll('.gpag-btn').forEach(b => {
          b.classList.toggle('active', +b.dataset.p === p);
        });
      }

      for (let p = 1; p <= total; p++) {
        const btn = document.createElement('button');
        btn.className = 'gpag-btn';
        btn.dataset.p = p;
        btn.textContent = p;
        btn.addEventListener('click', () => {
          showPage(p);
          // ギャラリーセクション先頭にスクロール
          grid.closest('.section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        pager.appendChild(btn);
      }
      grid.after(pager);
      showPage(1);
    });
  })();

  /* ---------- PINHEAD見開きページ：ライトボックスで開く ---------- */
  (function() {
    const pages = Array.from(document.querySelectorAll('.pinhead-page'));
    pages.forEach((link, i) => {
      link.addEventListener('click', e => {
        e.preventDefault();
        openPinheadLightbox(pages, i);
      });
    });

    function openPinheadLightbox(links, startIdx) {
      let idx = startIdx;
      const lb = document.createElement('div');
      lb.className = 'lb lb-gallery';
      Object.assign(lb.style, {
        position: 'fixed', inset: '0',
        background: 'rgba(0,0,0,.94)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '0', zIndex: '20000'
      });
      lb.innerHTML = `
        <button class="lb-close" aria-label="閉じる">×</button>
        <button class="lb-nav lb-prev" aria-label="前へ">&#8249;</button>
        <figure class="lb-fig">
          <img src="" alt="" style="max-width:100%;max-height:82vh;display:block;margin:0 auto;">
          <figcaption style="margin-top:10px;font-family:'Bungee',sans-serif;letter-spacing:.2em;color:#ccc;text-align:center;font-size:.8rem;">PINHEAD vol.30 OCTOBER 2015</figcaption>
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
        btn.addEventListener('mouseout',  () => btn.style.background = 'rgba(255,255,255,.10)');
      });
      Object.assign(lb.querySelector('.lb-fig').style, {
        maxWidth: '80vw', textAlign: 'center', flexShrink: '0'
      });

      function load(i) {
        lb.querySelector('.lb-fig img').src = links[i].getAttribute('href');
        lb.querySelector('.lb-prev').style.opacity = i === 0 ? '.25' : '1';
        lb.querySelector('.lb-next').style.opacity = i === links.length - 1 ? '.25' : '1';
        lb.querySelector('.lb-prev').disabled = i === 0;
        lb.querySelector('.lb-next').disabled = i === links.length - 1;
        idx = i;
      }
      load(startIdx);
      document.body.appendChild(lb);

      const close = () => { lb.remove(); document.removeEventListener('keydown', onKey); };
      lb.addEventListener('click', e => { if (e.target === lb) close(); });
      lb.querySelector('.lb-close').addEventListener('click', close);
      lb.querySelector('.lb-prev').addEventListener('click', e => { e.stopPropagation(); if (idx > 0) load(idx - 1); });
      lb.querySelector('.lb-next').addEventListener('click', e => { e.stopPropagation(); if (idx < links.length - 1) load(idx + 1); });
      function onKey(ev) {
        if (ev.key === 'Escape') close();
        else if (ev.key === 'ArrowLeft'  && idx > 0)              load(idx - 1);
        else if (ev.key === 'ArrowRight' && idx < links.length-1) load(idx + 1);
      }
      document.addEventListener('keydown', onKey);
    }
  })();

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
