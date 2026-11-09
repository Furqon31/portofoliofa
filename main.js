document.addEventListener("DOMContentLoaded", () => {
            if (document.body.dataset.page !== "index") return;
            try {
                var t = localStorage.getItem("theme");
                if (t) document.documentElement.setAttribute("data-theme", t)
            } catch (e) {}

            (() => {
                const $ = (s, c = document) => c.querySelector(s);
                const fxs = [...document.querySelectorAll('.fx')];
                const hero = $('#home');
                const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

                /* ---------- Urutan animasi slide pertama ---------- */
                const show = id => $(id).classList.add('show');
                const start = () => {
                    hero.classList.add('ready'); // nama & role meluncur dari kiri / kanan
                    const t = reduce ? 0 : 1100;
                    setTimeout(() => show('#who'), t); // WHO?! muncul langsung (tanpa slide)
                    setTimeout(() => show('#about'), t + 120);
                    setTimeout(() => show('#links'), t + 240);
                };
                (document.fonts?.ready ?? Promise.resolve()).then(() => requestAnimationFrame(() => requestAnimationFrame(start)));

                /* ---------- Efek kursor: isi putih + outline hitam ---------- */
                // state per elemen: posisi target, posisi halus, radius target, radius halus
                const state = new Map(fxs.map(el => [el, {
                    x: 0,
                    y: 0,
                    tx: 0,
                    ty: 0,
                    r: 0,
                    tr: 0,
                    init: false
                }]));
                const maxR = el => Math.max(70, Math.min(170, el.getBoundingClientRect().height * 0.62));
                const local = (el, e) => {
                    // koordinat lokal tanpa terpengaruh transform animasi
                    const r = el.getBoundingClientRect();
                    return [e.clientX - r.left, e.clientY - r.top];
                };

                fxs.forEach(el => {
                    const s = state.get(el);
                    const move = e => {
                        const [x, y] = local(el, e);
                        s.tx = x;
                        s.ty = y;
                        s.tr = maxR(el);
                        if (!s.init) {
                            s.x = x;
                            s.y = y;
                            s.init = true;
                        }
                    };
                    el.addEventListener('pointerenter', move);
                    el.addEventListener('pointermove', move);
                    el.addEventListener('pointerleave', () => {
                        s.tr = 0;
                    });
                    el.addEventListener('pointercancel', () => {
                        s.tr = 0;
                    });
                });

                const tick = () => {
                    fxs.forEach(el => {
                        const s = state.get(el);
                        if (s.r < .3 && s.tr === 0) {
                            if (s.r !== 0) {
                                s.r = 0;
                                el.style.setProperty('--r', '0px');
                            }
                            s.init = false;
                            return;
                        }
                        s.x += (s.tx - s.x) * .2; // mengikuti arah kursor dengan easing
                        s.y += (s.ty - s.y) * .2;
                        s.r += (s.tr - s.r) * .14;
                        el.style.setProperty('--x', s.x.toFixed(1) + 'px');
                        el.style.setProperty('--y', s.y.toFixed(1) + 'px');
                        el.style.setProperty('--r', s.r.toFixed(1) + 'px');
                    });
                    requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);

                /* ---------- Certifications: kotak berputar seperti kubus ---------- */
                // Rotasi terus bertambah per 90° supaya sisi terang/gelap bergantian
                // searah gerakan kursor (masuk dari atas -> turun, masuk dari bawah -> naik).
                document.querySelectorAll('.cert').forEach(row => {
                    const cube = row.querySelector('.cube');
                    let rx = 0;
                    const fromTop = e => e.clientY < row.getBoundingClientRect().top + row.offsetHeight / 2;
                    const turn = deg => {
                        rx += deg;
                        cube.style.setProperty('--rx', rx + 'deg');
                    };
                    row.addEventListener('pointerenter', e => turn(fromTop(e) ? -90 : 90));
                    row.addEventListener('pointerleave', e => turn(fromTop(e) ? 90 : -90));
                });

                /* ---------- Nav aktif sesuai slide ---------- */
                const links = [...document.querySelectorAll('.nav-links a')];
                // Projects dan About berada di dalam satu section besar, jadi pantau bloknya
                // langsung agar status navbar berganti saat blok yang tepat terlihat.
                requestAnimationFrame(() => {
                    const io = new IntersectionObserver(es => es.forEach(en => {
                        if (!en.isIntersecting) return;
                        const id = en.target.id === 'based' ? 'home' : en.target.id;
                        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
                    }), {
                        rootMargin: '-30% 0px -69% 0px'
                    });
                    ['home', 'based', 'certifications', 'project-feature', 'about-section'].forEach(id => {
                        const section = document.getElementById(id);
                        if (section) io.observe(section);
                    });
                });
            })();

            /* =====================================================================
                       DATA PROJECT — ganti teks & gambar di sini saja.
                       title   : judul besar di kiri (sticky saat scroll)
                       heading : judul di dalam kartu kanan
                       desc    : deskripsi singkat
                       images  : daftar gambar (src = path file, alt = deskripsi gambar)
                       ===================================================================== */
            const PROJECTS = [{
                title: 'Design UI/UX',
                heading: 'Tugas desain antarmuka di Figma',
                desc: 'Kumpulan tugas desain UI/UX: aplikasi tanaman, landing page restoran pizza, dan alur belanja sampai pembayaran aplikasi sepatu. Ganti teks ini dengan deskripsimu sendiri.',
                images: [{
                    src: 'assets/ui-ux.png',
                    alt: 'Kumpulan tugas desain UI/UX di Figma'
                }]
            }, {
                title: 'Project Dua',
                heading: 'Ringkasan satu baris project ini',
                desc: 'Ganti dengan penjelasan singkat: tujuan project, peran kamu, dan teknologi yang dipakai. Gambar di bawah hanya contoh agar slider terlihat jalan.',
                images: [{
                    src: 'assets/ui-ux.png',
                    alt: 'Contoh gambar 1 (ganti)'
                }, {
                    src: 'assets/ui-ux.png',
                    alt: 'Contoh gambar 2 (ganti)'
                }, {
                    src: 'assets/ui-ux.png',
                    alt: 'Contoh gambar 3 (ganti)'
                }]
            }, {
                title: 'Project Tiga',
                heading: 'Ringkasan satu baris project ini',
                desc: 'Ganti dengan penjelasan singkat: tujuan project, peran kamu, dan teknologi yang dipakai.',
                images: [{
                    src: 'assets/ui-ux.png',
                    alt: 'Contoh gambar 1 (ganti)'
                }, {
                    src: 'assets/ui-ux.png',
                    alt: 'Contoh gambar 2 (ganti)'
                }]
            }];

            /* =====================================================================
               DATA SITUS — ganti sesuai kebutuhan.
               SITE.owner : nama di footer
               CONTACT    : email tujuan tombol "Get In Touch"
               SOCIALS    : link GitHub / LinkedIn / Instagram
               PAGES      : alamat halaman About & Projects yang sudah kamu buat
               BOXES      : dua kotak besar (gambar, judul, tulisan saat hover, tujuan)
               MENU       : isi dropdown menu (ikon: home, user, folder, mail, globe, award, compass)
               SONGS      : daftar lagu (taruh file di assets/music/)
               THEMES     : urutan tema saat gerigi diklik (tambah tema = tambah blok [data-theme] di CSS)
               ===================================================================== */
            const SITE = {
                owner: 'Muhammad Fadil Furqon Al-Qudsi'
            };
            const CONTACT = {
                email: 'fadildodil87@gmail.com'
            };
            const SOCIALS = {
                github: 'https://github.com/Furqon31',
                linkedin: 'https://linkedin.com/in/fadil-furqon-801635443/',
                instagram: 'https://instagram.com/hauhi30'
            };
            const PAGES = {
                about: 'aboutf.html',
                projects: 'projectf.html'
            };

            const BOXES = [{
                    title: 'About',
                    href: PAGES.about,
                    img: 'img/about_detail.jpg',
                    alt: 'Gambar untuk halaman About',
                    label: 'Klik for detail'
                }, // contoh: img: 'assets/about.jpg'
                {
                    title: 'Projects',
                    href: PAGES.projects,
                    img: 'img/project_detail.jpg',
                    alt: 'Gambar untuk halaman Projects',
                    label: 'Klik for detail'
                }
            ];
            const MENU = [{
                key: 'home',
                label: 'Home',
                desc: 'Kembali ke awal halaman',
                href: '#home',
                icon: 'home'
            }, {
                key: 'about',
                label: 'About',
                desc: 'Tentang saya dan latar belakang',
                href: PAGES.about,
                icon: 'user'
            }, {
                key: 'projects',
                label: 'Projects',
                desc: 'Karya dan studi kasus pilihan',
                href: PAGES.projects,
                icon: 'folder'
            }, {
                key: 'about',
                label: 'About',
                desc: 'Tentang saya dan cara menghubungi saya',
                href: '#about-section',
                icon: 'user'
            }];
            const SONGS = [{
                title: 'AURA',
                artist: '',
                src: 'music/AURA.mp3'
            }, {
                title: 'GLORIA',
                artist: '',
                src: 'music/GLORIA.mp3'
            }];
            const THEMES = ['light', 'dark'];

            /* ---------- Projects: judul sticky, kartu slider, lightbox ---------- */
            (() => {
                    const $ = id => document.getElementById(id);
                    const root = $('projects'),
                        idxNav = $('pIndex');
                    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
                    const esc = s => String(s).replace(/[&<>"]/g, c => ({
                        '&': '&amp;',
                        '<': '&lt;',
                        '>': '&gt;',
                        '"': '&quot;'
                    }[c]));
                    const svg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
                    const ICON = {
                        expand: svg('M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7'),
                        prev: svg('M15 5l-7 7 7 7'),
                        next: svg('M9 5l7 7-7 7')
                    };

                    /* --- render --- */
                    root.innerHTML = PROJECTS.map((p, i) => `
    <article class="p-step" data-i="${i}">
      <h2 class="p-title">${esc(p.title)}</h2>
      <div class="p-card" data-i="${i}">
        <button type="button" class="p-open" aria-label="Perbesar galeri ${esc(p.title)}">${ICON.expand}</button>
        <h3>${esc(p.heading)}</h3>
        <p>${esc(p.desc)}</p>
        <div class="p-track">${p.images.map(im => `<div class="p-slide"><img src="${esc(im.src)}" alt="${esc(im.alt || p.title)}" loading="lazy" draggable="false"></div>`).join('')}</div>
        <div class="p-foot">
          <span class="p-hint">Klik kartu untuk melihat semua gambar</span>
          <div class="p-ctrl">
            <button type="button" class="p-btn" data-d="-1" aria-label="Gambar sebelumnya">${ICON.prev}</button>
            <span class="p-count" aria-live="polite">1/${p.images.length}</span>
            <button type="button" class="p-btn" data-d="1" aria-label="Gambar berikutnya">${ICON.next}</button>
          </div>
        </div>
      </div>
    </article>`).join('');

  idxNav.innerHTML = PROJECTS.map((p, i) =>
    `<button type="button" data-i="${i}" aria-label="Ke project ${i + 1}: ${esc(p.title)}">${String(i + 1).padStart(2, '0')}</button>`).join('');

  /* --- lightbox --- */
  const lb = $('lb'), img = $('lbImg'), thumbs = $('lbThumbs'), count = $('lbCount');
  const lbTitle = $('lbTitle'), lbDesc = $('lbDesc'), prevB = $('lbPrev'), nextB = $('lbNext'), closeB = $('lbClose');
  let lbOpen = false, lbP = null, lbI = 0, lbCard = null, lastFocus = null, swapT = 0;

  const setBox = (l, t, w, h, r) => {
    lb.style.setProperty('--l', l); lb.style.setProperty('--t', t);
    lb.style.setProperty('--w', w); lb.style.setProperty('--h', h); lb.style.setProperty('--r', r);
  };
  const boxFrom = rc => setBox(rc.left + 'px', rc.top + 'px', rc.width + 'px', rc.height + 'px', '20px');

  const show = (k, instant) => {
    const n = lbP.images.length;
    lbI = (k + n) % n;
    const im = lbP.images[lbI];
    const apply = () => { img.src = im.src; img.alt = im.alt || lbP.title; img.classList.remove('swap'); };
    clearTimeout(swapT);
    if (instant || reduce) apply(); else { img.classList.add('swap'); swapT = setTimeout(apply, 200); }
    count.textContent = `${lbI + 1}/${n}`;
    [...thumbs.children].forEach((b, j) => {
      b.setAttribute('aria-current', j === lbI ? 'true' : 'false');
      if (j === lbI) thumbs.scrollTo({ left: b.offsetLeft - thumbs.clientWidth / 2 + b.offsetWidth / 2, behavior: instant ? 'auto' : 'smooth' });
    });
  };

  const openLb = (pi, start, card) => {
    lbP = PROJECTS[pi]; lbCard = card; lastFocus = document.activeElement;
    lbTitle.textContent = lbP.title;
    lbDesc.textContent = lbP.heading;
    const multi = lbP.images.length > 1;
    prevB.style.display = nextB.style.display = multi ? '' : 'none';
    thumbs.style.display = multi ? '' : 'none';
    thumbs.innerHTML = lbP.images.map((im, k) =>
      `<button type="button" data-k="${k}" aria-label="Gambar ${k + 1}"><img src="${esc(im.src)}" alt=""></button>`).join('');
    show(start, true);

    boxFrom(card.getBoundingClientRect());          // mulai tepat di posisi kartu
    lb.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    void lb.offsetWidth;                            // paksa reflow agar transisi jalan
    lb.classList.add('open');
    setBox('0px', '0px', '100vw', '100dvh', '0px'); // kartu membesar jadi layar penuh
    lbOpen = true;
    closeB.focus({ preventScroll: true });
  };

  const closeLb = () => {
    if (!lbOpen) return;
    lbOpen = false;
    lb.classList.remove('open');
    boxFrom(lbCard.getBoundingClientRect());        // mengecil kembali ke kartu
    setTimeout(() => {
      lb.hidden = true;
      document.documentElement.style.overflow = '';
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    }, reduce ? 0 : 680);
  };

  closeB.addEventListener('click', closeLb);
  prevB.addEventListener('click', () => show(lbI - 1));
  nextB.addEventListener('click', () => show(lbI + 1));
  thumbs.addEventListener('click', e => { const b = e.target.closest('button'); if (b) show(+b.dataset.k); });
  document.addEventListener('keydown', e => {
    if (!lbOpen) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') show(lbI - 1);
    else if (e.key === 'ArrowRight') show(lbI + 1);
    else if (e.key === 'Tab') {                     // fokus tetap di dalam galeri
      const f = [...lb.querySelectorAll('button')].filter(b => b.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* --- kartu: slider kiri-kanan, drag, autoplay --- */
  root.querySelectorAll('.p-card').forEach(card => {
    const pi = +card.dataset.i;
    const track = card.querySelector('.p-track');
    const n = track.children.length;
    const counter = card.querySelector('.p-count');
    const stride = () => track.clientWidth + 12;
    const cur = () => Math.min(n - 1, Math.max(0, Math.round(track.scrollLeft / stride())));
    const go = k => track.scrollTo({ left: ((k + n) % n) * stride(), behavior: reduce ? 'auto' : 'smooth' });
    const update = () => { counter.textContent = `${cur() + 1}/${n}`; };

    let raf = 0;
    track.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });

    if (n < 2) card.querySelector('.p-ctrl').style.display = 'none';
    card.querySelectorAll('.p-btn').forEach(b => b.addEventListener('click', e => {
      e.stopPropagation();
      go(cur() + Number(b.dataset.d));
    }));

    // drag dengan mouse (sentuh sudah ditangani scroll bawaan)
    let down = false, dragged = false, sx = 0, sl = 0;
    track.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0 || n < 2) return;
      down = true; dragged = false; sx = e.clientX; sl = track.scrollLeft;
    });
    window.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (!dragged && Math.abs(dx) > 5) { dragged = true; track.style.scrollSnapType = 'none'; }
      if (dragged) track.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', () => {
      if (!down) return;
      down = false;
      if (dragged) { track.style.scrollSnapType = ''; go(cur()); setTimeout(() => { dragged = false; }, 60); }
    });

    // klik kartu -> membesar jadi galeri
    card.addEventListener('click', () => { if (!dragged) openLb(pi, cur(), card); });

    // autoplay pelan, berhenti saat hover/fokus/galeri terbuka
    let inView = false, hold = false;
    new IntersectionObserver(es => { inView = es[0].isIntersecting; }, { threshold: .4 }).observe(card);
    card.addEventListener('pointerenter', () => { hold = true; });
    card.addEventListener('pointerleave', () => { hold = false; });
    card.addEventListener('focusin', () => { hold = true; });
    card.addEventListener('focusout', () => { hold = false; });
    if (!reduce && n > 1) setInterval(() => { if (inView && !hold && !down && !lbOpen) go(cur() + 1); }, 3800);
  });

  /* --- indikator 01 02 03 --- */
  const btns = [...idxNav.children], steps = [...root.children];
  const stepIO = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) btns.forEach((b, k) => b.classList.toggle('active', steps[k] === en.target));
  }), { rootMargin: '-50% 0px -50% 0px' });
  steps.forEach(s => stepIO.observe(s));
  // rootMargin -2px: tepi yang hanya menempel (saat berhenti tepat di slide Contact) tidak dihitung terlihat
  new IntersectionObserver(es => idxNav.classList.toggle('on', es[0].isIntersecting), { rootMargin: '-2px 0px -2px 0px' }).observe(root);
  idxNav.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b) steps[+b.dataset.i].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });
})();

/* ---------- Link sosial (teks berputar seperti kubus, ikon diam), kotak About/Projects, footer ---------- */
        (() => {
                const $ = id => document.getElementById(id);
                const esc = s => String(s).replace(/[&<>"]/g, c => ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;'
                }[c]));

                /* isi href dari konfigurasi */
                const hrefs = {...SOCIALS,
                    email: 'mailto:' + CONTACT.email
                };
                document.querySelectorAll('a[data-social]').forEach(a => {
                    a.href = hrefs[a.dataset.social] || '#';
                });
                const footer = $('cFoot');
                if (footer) footer.textContent = '© ' + SITE.owner;

                /* teks berputar: hitbox = seluruh link, tapi hanya teks yang bergerak */
                document.querySelectorAll('.lnk .roll').forEach(roll => {
                            const a = roll.closest('.lnk'),
                                t = roll.textContent.trim();
                            roll.innerHTML = `<span class="ghost">${esc(t)}</span><span class="cube" aria-hidden="true">${[0, 1, 2, 3].map(k => `<span class="face f${k}">${esc(t)}</span>`).join('')}</span>`;
    const cube = roll.querySelector('.cube');
    let rx = 0, last = 0;
    const turn = () => {
      const now = performance.now();
      if (now - last < 260) return;
      last = now; rx -= 90;
      cube.style.setProperty('--rx', rx + 'deg');
    };
    a.addEventListener('pointerenter', turn);
    a.addEventListener('focus', () => { if (a.matches(':focus-visible')) turn(); });
  });

  /* Projects dan About ditata menjadi dua blok terpisah. */
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 19 19 5M8 5h11v11"/></svg>';
  const projectBox = BOXES.find(box => box.title === 'Projects');
  const aboutBox = BOXES.find(box => box.title === 'About');
  const box = b => `<a class="ex-box" href="${esc(b.href)}" aria-label="${esc(b.title)}: ${esc(b.label)}"><img src="${esc(b.img)}" alt="${esc(b.alt || '')}" loading="lazy" draggable="false"><span class="ex-title">${esc(b.title)}</span><span class="ex-cta"><span>${esc(b.label)} ${arrow}</span></span></a>`;
  $('exGrid').innerHTML = `
    <article class="feature-row feature-project" id="project-feature">${box(projectBox)}
      <section class="feature-detail" aria-label="Sorotan project"><div class="feature-shots" aria-hidden="true"><img src="img/project1.png" alt=""><img src="img/project2.png" alt=""></div><div class="feature-copy"><p class="feature-kicker">Project pilihan</p><h2>Eksplorasi antarmuka yang fungsional.</h2><p>Dua rancangan aplikasi yang memadukan alur pengguna yang jelas, visual yang rapi, dan pengalaman digital yang nyaman dipakai.</p></div></section>
    </article>
    <article class="feature-row feature-about" id="about-section">
      ${box(aboutBox)}
      <section class="feature-contact"><a class="c-box" href="#" data-social="email"><span class="roll">Get In Touch</span></a><div class="c-links"><a class="lnk" href="#" data-social="email"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-email"/></svg><span class="roll">Email</span></a><a class="lnk" href="#" data-social="github"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-github"/></svg><span class="roll">GitHub</span></a><a class="lnk" href="#" data-social="instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-instagram"/></svg><span class="roll">Instagram</span></a><a class="lnk" href="#" data-social="linkedin"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-linkedin"/></svg><span class="roll">LinkedIn</span></a></div></section>
    </article>`;
  document.querySelectorAll('.feature-contact [data-social]').forEach(a => {
    a.href = hrefs[a.dataset.social] || '#';
  });
  document.querySelectorAll('.feature-contact .roll').forEach(roll => {
    const link = roll.closest('a');
    const text = roll.textContent.trim();
    roll.innerHTML = `<span class="ghost">${esc(text)}</span><span class="cube" aria-hidden="true">${[0, 1, 2, 3].map(face => `<span class="face f${face}">${esc(text)}</span>`).join('')}</span>`;
    const cube = roll.querySelector('.cube');
    let rotation = 0;
    const turn = () => {
      rotation -= 90;
      cube.style.setProperty('--rx', rotation + 'deg');
    };
    link.addEventListener('pointerenter', turn);
    link.addEventListener('focus', turn);
  });
})();

/* ---------- Based in Indonesia: masuk saat terlihat + efek pixel mengikuti kursor ---------- */
        (() => {
            const $ = id => document.getElementById(id);
            const sec = $('based'),
                cmp = $('cmp'),
                base = $('cmpTxt'),
                cv = $('cmpCv'),
                ctx = cv.getContext('2d');
            const big = $('big'),
                over = $('over');
            const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

            /* --- animasi masuk (sekali) --- */
            let done = reduce;
            new IntersectionObserver((es, io) => {
                if (!es[0].isIntersecting) return;
                sec.classList.add('in');
                io.disconnect();
                setTimeout(() => {
                    done = true;
                }, 1800); // efek pixel aktif setelah teks di tempatnya
            }, {
                threshold: .3
            }).observe(sec);

            /* --- raster teks ke grid blok (rata-rata warna per blok) --- */
            let W = 0,
                H = 0,
                B = 14,
                gw = 0,
                gh = 0,
                dpr = 1,
                hit = null;
            let A, R_, G_, B_;
            const drawText = (c, el, ox, oy) => {
                const s = getComputedStyle(el);
                let t = el.textContent.trim();
                if (s.textTransform === 'uppercase') t = t.toUpperCase();
                c.font = `${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
                c.textBaseline = 'alphabetic';
                const m = c.measureText(t);
                const asc = m.fontBoundingBoxAscent ?? m.actualBoundingBoxAscent;
                const desc = m.fontBoundingBoxDescent ?? m.actualBoundingBoxDescent;
                const x = el.offsetLeft,
                    y = el.offsetTop + (el.offsetHeight - (asc + desc)) / 2 + asc; // setengah-leading seperti CSS
                const sw = parseFloat(s.webkitTextStrokeWidth) || 0;
                if (sw > 0) {
                    c.lineWidth = sw;
                    c.strokeStyle = s.webkitTextStrokeColor;
                    c.lineJoin = 'miter';
                    c.strokeText(t, x, y);
                }
                c.fillStyle = s.color;
                c.fillText(t, x, y);
            };
            const build = () => {
                W = Math.round(base.clientWidth);
                H = Math.round(base.clientHeight);
                if (!W || !H) return;
                dpr = Math.min(window.devicePixelRatio || 1, 2);
                cv.width = Math.round(W * dpr);
                cv.height = Math.round(H * dpr);
                B = Math.max(8, Math.round(W / 96));
                gw = Math.ceil(W / B);
                gh = Math.ceil(H / B);

                const off = document.createElement('canvas');
                off.width = W;
                off.height = H;
                const c = off.getContext('2d', {
                    willReadFrequently: true
                });
                drawText(c, big);
                drawText(c, over);
                const d = c.getImageData(0, 0, W, H).data;

                A = new Float32Array(gw * gh);
                R_ = new Uint8Array(gw * gh);
                G_ = new Uint8Array(gw * gh);
                B_ = new Uint8Array(gw * gh);
                for (let by = 0; by < gh; by++)
                    for (let bx = 0; bx < gw; bx++) {
                        let sa = 0,
                            sr = 0,
                            sg = 0,
                            sb = 0,
                            n = 0;
                        const x1 = Math.min(W, (bx + 1) * B),
                            y1 = Math.min(H, (by + 1) * B);
                        for (let y = by * B; y < y1; y++)
                            for (let x = bx * B; x < x1; x++) {
                                const i = (y * W + x) * 4,
                                    a = d[i + 3];
                                n++;
                                if (a) {
                                    sa += a;
                                    sr += d[i] * a;
                                    sg += d[i + 1] * a;
                                    sb += d[i + 2] * a;
                                }
                            }
                        const k = by * gw + bx;
                        if (sa) {
                            A[k] = sa / (n * 255);
                            R_[k] = sr / sa;
                            G_[k] = sg / sa;
                            B_[k] = sb / sa;
                        }
                    }
                    // hitbox = area kedua kata
                let l = 1e9,
                    t = 1e9,
                    r = -1e9,
                    b = -1e9;
                [big, over].forEach(e => {
                    l = Math.min(l, e.offsetLeft);
                    t = Math.min(t, e.offsetTop);
                    r = Math.max(r, e.offsetLeft + e.offsetWidth);
                    b = Math.max(b, e.offsetTop + e.offsetHeight);
                });
                hit = {
                    l,
                    t,
                    r,
                    b
                };
            };
            const rebuild = () => {
                cancelAnimationFrame(raf);
                running = false;
                reset();
                build();
            };
            let rt = 0;
            addEventListener('resize', () => {
                clearTimeout(rt);
                rt = setTimeout(rebuild, 160);
            });
  (document.fonts?.load('400 100px "Bebas Neue"') ?? Promise.resolve()).then(() => document.fonts?.ready).then(build);

            /* --- jendela pixel persegi yang mengikuti kursor --- */
            let tx = 0,
                ty = 0,
                cx = 0,
                cy = 0,
                Rr = 0,
                tR = 0,
                running = false,
                raf = 0;
            const rMax = () => Math.max(3, Math.round(Math.min(260, Math.max(150, W * .16)) / B / 2));
            const reset = () => {
                Rr = 0;
                tR = 0;
                base.classList.remove('holed');
                ctx.clearRect(0, 0, cv.width, cv.height);
            };

            const paint = () => {
                const rr = Math.round(Rr);
                ctx.clearRect(0, 0, cv.width, cv.height);
                if (rr < 1) {
                    base.classList.remove('holed');
                    return;
                }
                const bx = Math.floor(cx / B),
                    by = Math.floor(cy / B);
                const x0 = Math.max(0, bx - rr),
                    x1 = Math.min(gw - 1, bx + rr),
                    y0 = Math.max(0, by - rr),
                    y1 = Math.min(gh - 1, by + rr);
                base.style.setProperty('--hx', x0 * B + 'px');
                base.style.setProperty('--hy', y0 * B + 'px');
                base.style.setProperty('--hw', (x1 - x0 + 1) * B + 'px');
                base.style.setProperty('--hh', (y1 - y0 + 1) * B + 'px');
                base.classList.add('holed');
                for (let y = y0; y <= y1; y++)
                    for (let x = x0; x <= x1; x++) {
                        const k = y * gw + x,
                            a = A[k];
                        if (a < .03) continue;
                        ctx.fillStyle = `rgba(${R_[k]},${G_[k]},${B_[k]},${Math.min(1, a * 1.2).toFixed(3)})`;
                        const px0 = Math.round(x * B * dpr),
                            py0 = Math.round(y * B * dpr);
                        ctx.fillRect(px0, py0, Math.round((x + 1) * B * dpr) - px0, Math.round((y + 1) * B * dpr) - py0);
                    }
            };
            const frame = () => {
                cx += (tx - cx) * .3;
                cy += (ty - cy) * .3;
                Rr += (tR - Rr) * .2;
                paint();
                if (tR === 0 && Rr < .5) {
                    reset();
                    running = false;
                    return;
                }
                raf = requestAnimationFrame(frame);
            };
            const aim = e => {
                if (!done || !hit) return;
                const r = base.getBoundingClientRect(),
                    x = e.clientX - r.left,
                    y = e.clientY - r.top,
                    pad = 10;
                const hot = x >= hit.l - pad && x <= hit.r + pad && y >= hit.t - pad && y <= hit.b + pad;
                tx = x;
                ty = y;
                tR = hot ? rMax() : 0;
                if (hot && !running) {
                    cx = x;
                    cy = y;
                    running = true;
                    raf = requestAnimationFrame(frame);
                }
            };
            const off = () => {
                tR = 0;
            };
            cmp.addEventListener('pointermove', aim);
            cmp.addEventListener('pointerdown', aim);
            cmp.addEventListener('pointerleave', off);
            cmp.addEventListener('pointerup', off);
            cmp.addEventListener('pointercancel', off);
            addEventListener('themechange', () => requestAnimationFrame(rebuild)); // warna teks berubah saat ganti tema
        })();

/* ---------- Navbar: menu dropdown (ikon berganti), pemutar musik, ganti tema ---------- */
        (() => {
            const $ = id => document.getElementById(id);
            const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
            const esc = s => String(s).replace(/[&<>"]/g, c => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;'
            }[c]));

            const P = {
                home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-6h4v6"/>',
                user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
                globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3.2 3.4 3.2 14.6 0 18M12 3c-3.2 3.4-3.2 14.6 0 18"/>',
                award: '<circle cx="12" cy="9" r="6"/><path d="M8.6 14 7 22l5-3 5 3-1.6-8"/>',
                folder: '<path d="M3 6.5h6.5l2 2.5H21v10.5H3z"/>',
                compass: '<circle cx="12" cy="12" r="9"/><path d="m15.6 8.4-2.1 5.1-5.1 2.1 2.1-5.1z"/>',
                mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>',
                play: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
                pause: '<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/>',
                prev: '<path d="M6 5v14"/><path d="M19 5 9 12l10 7z" fill="currentColor"/>',
                next: '<path d="M18 5v14"/><path d="M5 5l10 7-10 7z" fill="currentColor"/>',
                vol: '<path d="M4 9.5v5h4l5 4v-13l-5 4z"/><path d="M16.5 9a4 4 0 0 1 0 6"/>'
            };
            const ico = (k, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[k]}</svg>`;

            /* ---- kubus untuk item dropdown (arah putar mengikuti arah kursor masuk/keluar) ---- */
            const cubeHTML = '<span class="cube" aria-hidden="true"><span class="face light f0"></span><span class="face dark f1"></span><span class="face light f2"></span><span class="face dark f3"></span></span>';
            const cubeify = el => {
                const cube = el.querySelector('.cube');
                let rx = 0;
                const turn = d => {
                    rx += d;
                    cube.style.setProperty('--rx', rx + 'deg');
                };
                const fromTop = e => e.clientY < el.getBoundingClientRect().top + el.offsetHeight / 2;
                el.addEventListener('pointerenter', e => turn(fromTop(e) ? -90 : 90));
                el.addEventListener('pointerleave', e => turn(fromTop(e) ? 90 : -90));
                el.addEventListener('focus', () => {
                    if (el.matches(':focus-visible')) turn(-90);
                });
                el.addEventListener('blur', () => {
                    if (Math.abs(rx / 90) % 2 === 1) turn(-90);
                });
            };

            /* ---- pengatur dropdown ---- */
            const panels = {};
            const makePanel = (btn, panel) => {
                const api = {
                    btn,
                    panel,
                    isOpen: () => panel.classList.contains('open'),
                    place() {
                        const r = btn.getBoundingClientRect(),
                            vw = document.documentElement.clientWidth,
                            w = panel.offsetWidth;
                        panel.style.top = Math.round(r.bottom + 10) + 'px';
                        panel.style.left = Math.round(Math.min(Math.max(8, r.right - w), vw - w - 8)) + 'px';
                    },
                    open() {
                        Object.values(panels).forEach(p => {
                            if (p !== api) p.close();
                        });
                        api.place();
                        panel.removeAttribute('inert');
                        panel.classList.add('open');
                        btn.setAttribute('aria-expanded', 'true');
                    },
                    close() {
                        panel.classList.remove('open');
                        panel.setAttribute('inert', '');
                        btn.setAttribute('aria-expanded', 'false');
                    }
                };
                btn.addEventListener('click', () => (api.isOpen() ? api.close() : api.open()));
                return api;
            };
            const menuBtn = $('menuBtn'),
                musicBtn = $('musicBtn'),
                menuPanel = $('menuPanel'),
                musicPanel = $('musicPanel');
            panels.menu = makePanel(menuBtn, menuPanel);
            panels.music = makePanel(musicBtn, musicPanel);
            document.addEventListener('pointerdown', e => {
                Object.values(panels).forEach(p => {
                    if (p.isOpen() && !p.panel.contains(e.target) && !p.btn.contains(e.target)) p.close();
                });
            });
            document.addEventListener('keydown', e => {
                if (e.key !== 'Escape') return;
                Object.values(panels).forEach(p => {
                    if (p.isOpen()) {
                        p.close();
                        p.btn.focus();
                    }
                });
            });
            addEventListener('resize', () => Object.values(panels).forEach(p => {
                if (p.isOpen()) p.place();
            }));

            /* ---- MENU: isi dropdown + ikon tombol yang berganti sesuai bagian halaman ---- */
            menuPanel.innerHTML = MENU.map(m =>
                `<a class="dd-item" role="menuitem" href="${esc(m.href)}" data-key="${esc(m.key)}">${cubeHTML}<span class="dd-content">${ico(m.icon, 'dd-ico')}<span class="dd-text"><b>${esc(m.label)}</b><small>${esc(m.desc)}</small></span></span></a>`).join('');
            menuPanel.querySelectorAll('.dd-item').forEach(a => {
                cubeify(a);
                a.addEventListener('click', () => panels.menu.close());
            });

            const SEC_ICON = {
                home: 'home',
                based: 'globe',
                certifications: 'award',
                projects: 'folder',
                'project-feature': 'folder',
                'about-section': 'user'
            };
            const SEC_MENU = {
                home: 'home',
                based: 'home',
                certifications: 'home',
                projects: 'projects',
                'project-feature': 'projects',
                'about-section': 'about'
            };
            const SEC_NAME = {
                home: 'Home',
                based: 'Based in Indonesia',
                certifications: 'Certifications',
                projects: 'Projects',
                'project-feature': 'Projects',
                'about-section': 'About'
            };

            const cube = $('miCube'),
                f0 = $('miF0'),
                f1 = $('miF1');
            let curIcon = 'home',
                want = 'home',
                rolling = false;
            f0.innerHTML = ico('home');
            const setIcon = key => {
                want = key;
                if (rolling || key === curIcon) return;
                rolling = true;
                f1.innerHTML = ico(key);
                void cube.offsetWidth;
                cube.classList.add('roll');
                cube.style.setProperty('--rx', '-90deg');
                setTimeout(() => {
                    f0.innerHTML = ico(key);
                    cube.classList.remove('roll');
                    cube.style.setProperty('--rx', '0deg');
                    curIcon = key;
                    rolling = false;
                    if (want !== curIcon) setIcon(want);
                }, reduce ? 0 : 520);
            };
            const onSection = id => {
                if (!SEC_ICON[id]) return;
                setIcon(SEC_ICON[id]);
                menuBtn.setAttribute('aria-label', `Menu (sekarang di ${SEC_NAME[id]})`);
                menuPanel.querySelectorAll('.dd-item').forEach(a => a.setAttribute('aria-current', a.dataset.key === SEC_MENU[id] ? 'true' : 'false'));
            };
            const secIO = new IntersectionObserver(es => es.forEach(en => {
                if (en.isIntersecting) onSection(en.target.id);
            }), {
                rootMargin: '-30% 0px -69% 0px'
            });
            Object.keys(SEC_ICON).forEach(id => {
                const el = $(id);
                if (el) secIO.observe(el);
            });
            onSection('home');

            /* ---- MUSIK ---- */
            const audio = new Audio();
            const musicStateKey = 'portfolio-music';
            audio.preload = 'none';
            audio.volume = .7;
            let cur = -1,
                seeking = false;
            const fmt = s => (isFinite(s) ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') : '0:00');

            musicPanel.innerHTML = `
    <div class="mp-now">
      <div><div class="mp-title" id="mpTitle"></div><div class="mp-artist" id="mpArtist"></div></div>
      <input class="mp-seek" id="mpSeek" type="range" min="0" max="1000" value="0" step="1" aria-label="Posisi lagu">
      <div class="mp-time"><span id="mpCur">0:00</span><span id="mpDur">0:00</span></div>
      <div class="mp-ctrls">
        <button class="mp-btn" id="mpPrev" type="button" aria-label="Lagu sebelumnya">${ico('prev')}</button>
        <button class="mp-btn main" id="mpPlay" type="button" aria-label="Putar"></button>
        <button class="mp-btn" id="mpNext" type="button" aria-label="Lagu berikutnya">${ico('next')}</button>
        <label class="mp-vol">${ico('vol')}<input id="mpVol" type="range" min="0" max="100" value="70" aria-label="Volume"></label>
      </div>
      <div class="mp-status" id="mpStatus" role="status"></div>
    </div>
    <ul class="mp-list" id="mpList"></ul>`;
            const mpList = $('mpList'),
                mpStatus = $('mpStatus'),
                seek = $('mpSeek');
            mpList.innerHTML = SONGS.length ?
                SONGS.map((s, i) => `<li><button type="button" class="dd-item mp-item" data-i="${i}">${cubeHTML}<span class="dd-content"><span class="mp-num">${String(i + 1).padStart(2, '0')}</span><span class="dd-text"><b>${esc(s.title)}</b><small>${esc(s.artist || '')}</small></span></span></button></li>`).join('') :
                '<li class="mp-empty">Belum ada lagu. Isi array SONGS di index.html.</li>';
            mpList.querySelectorAll('.dd-item').forEach(b => {
                cubeify(b);
                b.addEventListener('click', () => load(+b.dataset.i, true));
            });

            const paint = () => {
                const playing = cur >= 0 && !audio.paused;
                $('mpTitle').textContent = cur >= 0 ? SONGS[cur].title : (SONGS.length ? 'Pilih lagu' : 'Belum ada lagu');
                $('mpArtist').textContent = cur >= 0 ? (SONGS[cur].artist || '') : '';
                $('mpPlay').innerHTML = ico(playing ? 'pause' : 'play');
                $('mpPlay').setAttribute('aria-label', playing ? 'Jeda' : 'Putar');
                musicBtn.toggleAttribute('data-playing', playing);
                musicBtn.setAttribute('aria-label', playing ? `Pemutar musik (memutar: ${SONGS[cur].title})` : 'Pemutar musik');
                mpList.querySelectorAll('.dd-item').forEach(b => b.setAttribute('aria-current', +b.dataset.i === cur ? 'true' : 'false'));
            };
            const load = (i, play) => {
                if (!SONGS.length) return;
                cur = (i + SONGS.length) % SONGS.length;
                mpStatus.textContent = '';
                seek.value = 0;
                $('mpCur').textContent = '0:00';
                $('mpDur').textContent = '0:00';
                audio.src = SONGS[cur].src;
                paint();
                if (play) audio.play().catch(err => {
                    if (err.name !== 'AbortError') mpStatus.textContent = 'Lagu tidak bisa diputar.';
                });
            };
            $('mpPlay').addEventListener('click', () => {
                if (!SONGS.length) return;
                if (cur < 0) load(0, true);
                else if (audio.paused) audio.play().catch(() => {
                    mpStatus.textContent = 'Lagu tidak bisa diputar.';
                });
                else audio.pause();
            });
            $('mpPrev').addEventListener('click', () => load((cur < 0 ? 0 : cur) - 1, true));
            $('mpNext').addEventListener('click', () => load(cur + 1, true));
            $('mpVol').addEventListener('input', e => {
                audio.volume = e.target.value / 100;
            });
            seek.addEventListener('input', () => {
                seeking = true;
                if (isFinite(audio.duration)) audio.currentTime = seek.value / 1000 * audio.duration;
            });
            seek.addEventListener('change', () => {
                seeking = false;
            });
            audio.addEventListener('play', paint);
            audio.addEventListener('pause', paint);
            audio.addEventListener('ended', () => load(cur + 1, true));
            audio.addEventListener('durationchange', () => {
                $('mpDur').textContent = fmt(audio.duration);
            });
            audio.addEventListener('timeupdate', () => {
                $('mpCur').textContent = fmt(audio.currentTime);
                if (!seeking && isFinite(audio.duration) && audio.duration > 0) seek.value = audio.currentTime / audio.duration * 1000;
            });
            audio.addEventListener('error', () => {
                if (cur >= 0) mpStatus.textContent = `File lagu tidak ditemukan: ${SONGS[cur].src}`;
                paint();
            });
            let savedMusic = null;
            try {
                savedMusic = JSON.parse(sessionStorage.getItem(musicStateKey));
            } catch (_) {}
            const savedIndex = savedMusic && SONGS.findIndex(song => String(savedMusic.src).endsWith(song.src));
            if (savedIndex >= 0) {
                audio.volume = Math.min(1, Math.max(0, Number(savedMusic.volume) || .7));
                audio.addEventListener('loadedmetadata', () => {
                    audio.currentTime = Math.max(0, Number(savedMusic.time) || 0);
                    if (savedMusic.playing) audio.play().catch(() => {});
                }, { once: true });
                load(savedIndex, false);
            }
            addEventListener('pagehide', () => {
                if (cur < 0) return;
                try {
                    sessionStorage.setItem(musicStateKey, JSON.stringify({
                        src: audio.currentSrc || SONGS[cur].src,
                        time: audio.currentTime,
                        volume: audio.volume,
                        playing: !audio.paused
                    }));
                } catch (_) {}
            });
            paint();

            /* ---- TEMA (gerigi) ---- */
            const themeBtn = $('themeBtn'),
                root = document.documentElement;
            const nameOf = t => (t === 'dark' ? 'gelap' : t === 'light' ? 'terang' : t);
            const getTheme = () => root.getAttribute('data-theme') || 'light';
            const label = () => themeBtn.setAttribute('aria-label', `Ganti tema warna (sekarang: ${nameOf(getTheme())})`);
            label();
            themeBtn.addEventListener('click', () => {
                const t = THEMES[(THEMES.indexOf(getTheme()) + 1) % THEMES.length];
                root.setAttribute('data-theme', t);
                try {
                    localStorage.setItem('theme', t);
                } catch (_) {}
                label();
                themeBtn.classList.remove('spin');
                void themeBtn.offsetWidth;
                themeBtn.classList.add('spin');
                dispatchEvent(new Event('themechange'));
            });
        })();
});

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "about") return;
(() => {
                const $ = id => document.getElementById(id);
                const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
                const esc = s => String(s).replace(/[&<>"]/g, c => ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;'
                }[c]));
                const DEV = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';
                const HIT = 8; /* ukuran hitbox kursor (px), kotak 8x8 */
                const FADE = .05; /* kecepatan jejak memudar; makin besar makin cepat hilang */

                /* BOX 1: nama meluncur saat halaman dibuka (tidak terpengaruh kursor) */
                const b1 = $('b1');
  (document.fonts?.ready ?? Promise.resolve()).then(() => requestAnimationFrame(() => requestAnimationFrame(() => b1.classList.add('go'))));

                /* BOX 1: foto kedua hanya terlihat di jejak hitbox kursor di atas foto */
                const cv = $('rv'),
                    cx = cv.getContext('2d'),
                    mk = document.createElement('canvas'),
                    mx = mk.getContext('2d');
                const im2 = new Image();
                im2.src = 'img/foto.jpeg';
                let W = 0,
                    H = 0,
                    last = null,
                    running = false,
                    idle = 0;
                const size = () => {
                    W = cv.width = mk.width = b1.clientWidth;
                    H = cv.height = mk.height = b1.clientHeight;
                };
                size();
                addEventListener('resize', size);
                const frame = () => {
                    mx.globalCompositeOperation = 'destination-out';
                    mx.fillStyle = `rgba(0,0,0,${FADE})`;
                    mx.fillRect(0, 0, W, H);
                    mx.globalCompositeOperation = 'source-over';
                    cx.globalCompositeOperation = 'source-over';
                    cx.clearRect(0, 0, W, H);
                    cx.drawImage(mk, 0, 0);
                    if (im2.complete && im2.naturalWidth) {
                        const s = Math.max(W / im2.naturalWidth, H / im2.naturalHeight),
                            w = im2.naturalWidth * s,
                            h = im2.naturalHeight * s;
                        cx.globalCompositeOperation = 'source-in';
                        cx.drawImage(im2, (W - w) / 2, (H - h) / 2, w, h);
                    }
                    if (performance.now() - idle > 1800) {
                        running = false;
                        mx.clearRect(0, 0, W, H);
                        cx.clearRect(0, 0, W, H);
                        return;
                    }
                    requestAnimationFrame(frame);
                };
                const stamp = (x, y) => {
                    mx.fillStyle = '#000';
                    mx.fillRect(x - HIT / 2, y - HIT / 2, HIT, HIT);
                };
                b1.addEventListener('pointermove', e => {
                    const r = b1.getBoundingClientRect(),
                        x = e.clientX - r.left,
                        y = e.clientY - r.top;
                    b1.classList.add('hov');
                    if (last) { // isi celah antar titik supaya jejaknya menyambung
                        const d = Math.hypot(x - last.x, y - last.y),
                            n = Math.ceil(d / (HIT / 2));
                        for (let i = 1; i <= n; i++) stamp(last.x + (x - last.x) * i / n, last.y + (y - last.y) * i / n);
                    } else stamp(x, y);
                    last = {
                        x,
                        y
                    };
                    idle = performance.now();
                    if (!running) {
                        running = true;
                        requestAnimationFrame(frame);
                    }
                });
                b1.addEventListener('pointerleave', () => {
                    last = null;
                });

                /* helper: jalankan sekali saat terlihat */
                const once = (el, fn, t = .35) => new IntersectionObserver((es, o) => es.forEach(e => {
                    if (e.isIntersecting) {
                        fn();
                        o.disconnect();
                    }
                }), {
                    threshold: t
                }).observe(el);

                /* BOX 2: efek ketik + paragraf naik */
                const typ = $('typ'),
                    word = "WHO I'M";
                once(typ, () => {
                    let i = 0;
                    const t = setInterval(() => {
                        typ.textContent = word.slice(0, ++i);
                        if (i >= word.length) {
                            clearInterval(t);
                            setTimeout(() => $('whoP').classList.add('in'), 250);
                        }
                    }, reduce ? 0 : 130);
                });

                /* BOX 3: logo berkumpul + daftar skill */
                const TOOLS = [
                    ['vscode/vscode-original', 'VS Code'],
                    ['git/git-original', 'Git'],
                    ['github/github-original', 'GitHub'],
                    ['figma/figma-original', 'Figma'],
                    ['postman/postman-original', 'Postman'],
                    ['laravel/laravel-original', 'Laravel'],
                    ['mysql/mysql-original', 'MySQL']
                ];
                const tools = $('tools');
                tools.innerHTML = TOOLS.map(([p, n]) => `<div class="tool" data-n="${n}" style="--dx:${(Math.random()*120-60).toFixed(0)}vw;--dy:${(Math.random()*80-40).toFixed(0)}vh"><img src="${DEV + p}.svg" alt="${n}" loading="lazy"></div>`).join('');
                once(tools, () => tools.classList.add('in'), .2);
                $('skillList').innerHTML = [
                        ['html5/html5-original', 'Web Development'],
                        ['postman/postman-original', 'REST API'],
                        ['figma/figma-original', 'Designer'],
                        ['flutter/flutter-original', 'Mobile Development']
                    ]
                    .map(([p, n]) => `<div class="sk"><img src="${DEV + p}.svg" alt=""><span class="roll skill-roll">${n}</span></div>`).join('');

                /* Skill: teks bergulir satu kali, ikon tetap diam. */
                document.querySelectorAll('.skill-roll').forEach(roll => {
                    const text = roll.textContent.trim();
                    roll.innerHTML = `<span class="ghost">${esc(text)}</span><span class="cube" aria-hidden="true">${[0, 1, 2, 3].map(k => `<span class="face f${k}">${esc(text)}</span>`).join('')}</span>`;
                    const cube = roll.querySelector('.cube');
                    let rotation = 0, last = 0;
                    const turn = () => {
                        const now = performance.now();
                        if (now - last < 260) return;
                        last = now;
                        rotation -= 90;
                        cube.style.setProperty('--rx', rotation + 'deg');
                    };
                    (roll.closest('.sk') || roll).addEventListener('pointerenter', turn);
                });

                /* Experience: logo teknologi */
                document.querySelectorAll('[data-logos]').forEach(el => {
                    el.innerHTML = el.dataset.logos.split(',').map(p => `<img src="${DEV + p}.svg" alt="${esc(p.split('/')[0])}" loading="lazy">`).join('');
                });

                /* Education: baris kubus */
                document.querySelectorAll('.cert').forEach(row => {
                    row.setAttribute('aria-label', row.dataset.a + ', ' + row.dataset.b);
                    row.innerHTML = `<div class="cube" aria-hidden="true"><div class="face light f0"></div><div class="face dark f1"></div><div class="face light f2"></div><div class="face dark f3"></div></div><div class="cert-text"><span>${esc(row.dataset.a)}</span><i>${esc(row.dataset.b)}</i></div>`;
                    const cube = row.querySelector('.cube');
                    let rx = 0;
                    const top = e => e.clientY < row.getBoundingClientRect().top + row.offsetHeight / 2;
                    const turn = d => {
                        rx += d;
                        cube.style.setProperty('--rx', rx + 'deg');
                    };
                    row.addEventListener('pointerenter', e => turn(top(e) ? -90 : 90));
                    row.addEventListener('pointerleave', e => turn(top(e) ? 90 : -90));
                });

                /* Education: klik baris IPI -> panel terbuka ke bawah seperti dropdown */
                const edu = $('eduIpi'),
                    panel = $('eduPanel'),
                    hint = edu.querySelector('i');
                const toggleEdu = () => {
                    const open = panel.classList.toggle('open');
                    edu.setAttribute('aria-expanded', open);
                    hint.textContent = open ? 'Tutup −' : 'Klik untuk detail +';
                };
                edu.addEventListener('click', toggleEdu);
                edu.addEventListener('keydown', e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleEdu();
                    }
                });

                /* Link: teks berputar seperti kubus */
                document.querySelectorAll('.lnk .roll, .big .roll').forEach(roll => {
                            const a = roll.closest('a'),
                                t = roll.textContent.trim();
                            roll.innerHTML = `<span class="ghost">${esc(t)}</span><span class="cube" aria-hidden="true">${[0,1,2,3].map(k => `<span class="face f${k}">${esc(t)}</span>`).join('')}</span>`;
    const cube = roll.querySelector('.cube'); let rx = 0, last = 0;
    const turn = () => { const n = performance.now(); if (n - last < 260) return; last = n; rx -= 90; cube.style.setProperty('--rx', rx + 'deg'); };
    a.addEventListener('pointerenter', turn);
    a.addEventListener('focus', () => { if (a.matches(':focus-visible')) turn(); });
  });
})();
});

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;

  if (page === 'about' || page === 'project') {
    const header = document.querySelector('header.nav');
    if (header) {
      const icon = key => ({
        home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-6h4v6"/>',
        user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
        folder: '<path d="M3 6.5h6.5l2 2.5H21v10.5H3z"/>',
        award: '<circle cx="12" cy="9" r="6"/><path d="M8.6 14 7 22l5-3 5 3-1.6-8"/>',
        mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>'
      }[key]);
      const svg = key => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon(key)}</svg>`;
      const isAbout = page === 'about';
      header.innerHTML = `
        <a href="indexf.html#home" aria-label="Beranda"><img class="logo logo-f" src="img/logo-f.png" alt="" aria-hidden="true"></a>
        <div class="nav-right"><nav class="nav-links" aria-label="Navigasi utama"><a href="indexf.html#home">Home</a><a href="indexf.html#certifications">Certifications</a><a href="projectf.html" class="${isAbout ? '' : 'active'}">Projects</a><a href="aboutf.html" class="${isAbout ? 'active' : ''}">About</a></nav><div class="nav-tools"><button class="nav-btn" id="menuBtn" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="menuPanel" aria-label="Menu"><span class="mi"><span class="mi-cube" id="miCube"><span class="mi-f f0" id="miF0"></span><span class="mi-f f1" id="miF1"></span></span></span></button><button class="nav-btn" id="musicBtn" type="button" aria-pressed="false" aria-label="Putar musik"><svg class="ic note" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg><span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span></button><button class="nav-btn gear-btn" id="themeBtn" type="button" aria-label="Ganti tema warna"><svg class="gear" viewBox="0 0 64 64" aria-hidden="true"><mask id="gearHole"><rect width="64" height="64" fill="#fff"/><circle cx="32" cy="32" r="9" fill="#000"/></mask><g fill="currentColor" mask="url(#gearHole)"><path id="blade" d="M32 32 30 4c9 1 16 6 19 14z"/><use href="#blade" transform="rotate(45 32 32)"/><use href="#blade" transform="rotate(90 32 32)"/><use href="#blade" transform="rotate(135 32 32)"/><use href="#blade" transform="rotate(180 32 32)"/><use href="#blade" transform="rotate(225 32 32)"/><use href="#blade" transform="rotate(270 32 32)"/><use href="#blade" transform="rotate(315 32 32)"/></g><circle cx="32" cy="32" r="5" fill="currentColor"/></svg></button></div></div>`;
      header.insertAdjacentHTML('afterend', `<nav class="dd" id="menuPanel" aria-label="Menu halaman"><a href="indexf.html#home">Home</a><a href="indexf.html#certifications">Certifications</a><a href="projectf.html">Projects</a><a href="aboutf.html">About</a></nav>`);

      const menuBtn = document.getElementById('menuBtn');
      const menuPanel = document.getElementById('menuPanel');
      menuBtn.addEventListener('click', () => {
        const open = menuPanel.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', String(open));
      });
      document.addEventListener('pointerdown', event => {
        if (!header.contains(event.target) && !menuPanel.contains(event.target)) menuPanel.classList.remove('open');
      });

      const musicStateKey = 'portfolio-music';
      let savedMusic = null;
      try {
        savedMusic = JSON.parse(sessionStorage.getItem(musicStateKey));
      } catch (_) {}
      const savedSrc = ['music/AURA.mp3', 'music/GLORIA.mp3'].find(src => String(savedMusic?.src || '').endsWith(src));
      const music = new Audio(savedSrc || 'music/AURA.mp3');
      music.volume = Math.min(1, Math.max(0, Number(savedMusic?.volume) || .7));
      const musicBtn = document.getElementById('musicBtn');
      const paintMusic = () => {
        musicBtn.setAttribute('aria-pressed', String(!music.paused));
        musicBtn.toggleAttribute('data-playing', !music.paused);
      };
      music.addEventListener('play', paintMusic);
      music.addEventListener('pause', paintMusic);
      if (savedMusic?.playing && savedSrc) {
        music.addEventListener('loadedmetadata', () => {
          music.currentTime = Math.max(0, Number(savedMusic.time) || 0);
          music.play().catch(() => {});
        }, { once: true });
      }
      musicBtn.addEventListener('click', () => {
        if (music.paused) music.play(); else music.pause();
      });
      addEventListener('pagehide', () => {
        try {
          sessionStorage.setItem(musicStateKey, JSON.stringify({
            src: music.currentSrc || music.src,
            time: music.currentTime,
            volume: music.volume,
            playing: !music.paused
          }));
        } catch (_) {}
      });
      paintMusic();
      document.getElementById('themeBtn').addEventListener('click', () => {
        const root = document.documentElement;
        root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      });

      const cube = document.getElementById('miCube'), f0 = document.getElementById('miF0'), f1 = document.getElementById('miF1');
      let currentIcon = isAbout ? 'user' : 'folder', wantedIcon = currentIcon, rolling = false;
      f0.innerHTML = svg(currentIcon);
      const setIcon = key => {
        wantedIcon = key;
        if (rolling || key === currentIcon) return;
        rolling = true; f1.innerHTML = svg(key); void cube.offsetWidth;
        cube.classList.add('roll'); cube.style.setProperty('--rx', '-90deg');
        setTimeout(() => { f0.innerHTML = svg(key); cube.classList.remove('roll'); cube.style.setProperty('--rx', '0deg'); currentIcon = key; rolling = false; if (wantedIcon !== currentIcon) setIcon(wantedIcon); }, 520);
      };
      const sections = isAbout ? [['b1', 'home'], ['who', 'user'], ['skills', 'user'], ['experience', 'folder'], ['education', 'award'], ['contact', 'mail']] : [['hero', 'home'], ['projects', 'folder'], ['contact', 'mail']];
      const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setIcon(entry.target.dataset.navIcon); }), { rootMargin: '-35% 0px -60% 0px' });
      sections.forEach(([id, key]) => { const section = document.getElementById(id); if (section) { section.dataset.navIcon = key; observer.observe(section); } });

    }
  }

  if (page !== 'index') return;
  if (!document.body.hasAttribute('data-contact-form')) return;
  const trigger = document.querySelector('.c-box');
  if (!trigger) return;
  const email = trigger.closest('#contact')?.querySelector('[data-social="email"]')?.href.replace('mailto:', '') || 'fadildodil87@gmail.com';
  document.body.insertAdjacentHTML('beforeend', `
    <div class="contact-modal" id="contactModal" hidden>
      <form class="contact-form" id="contactForm">
        <button class="contact-close" type="button" aria-label="Tutup formulir">×</button>
        <p>Get in touch</p><h2>Kirim pesan</h2>
        <label>Email<input type="email" name="email" placeholder="nama@email.com" required></label>
        <label>Message<textarea name="message" rows="5" placeholder="Halo, saya ingin menghubungi Anda..." required></textarea></label>
        <button type="submit">Kirim pesan</button>
      </form>
    </div>`);
  const modal = document.getElementById('contactModal');
  const close = () => { modal.hidden = true; document.body.classList.remove('modal-open'); };
  // Link tetap memakai mailto bawaan agar Get In Touch kembali seperti semula.
  modal.querySelector('.contact-close').addEventListener('click', close);
  modal.addEventListener('click', event => { if (event.target === modal) close(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !modal.hidden) close(); });
  modal.querySelector('#contactForm').addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    window.location.href = `mailto:${email}?subject=${encodeURIComponent('Pesan baru dari ' + data.get('email'))}&body=${encodeURIComponent(data.get('message') + '\n\nEmail pengirim: ' + data.get('email'))}`;
    close();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "project") return;
/* =====================================================================
           DATA PROJECT — ganti teks & gambar di sini.
           tag    : tulisan kecil di atas judul
           title  : judul besar (sticky di kiri)
           heading: judul di dalam box
           desc   : penjelasan: apa yang dibangun dan dibuat
           images : gambar yang tampil saat kursor di sekitar box
                    contoh: ['assets/solterfarm-1.jpg','assets/solterfarm-2.jpg']
                    kosongkan [] untuk memakai gambar contoh
           ===================================================================== */
        const PROJECTS = [{
            tag: 'sistem informasi peternakan',
            title: 'SolterFarm',
            heading: 'Pendataan ternak berbasis web',
            desc: 'Sistem informasi pengelolaan data peternakan berbasis web dengan QR Code dan IoT. Ganti dengan penjelasan lengkap: apa yang kamu bangun, fitur yang kamu buat, dan teknologi yang dipakai.',
            // Tambahkan foto project di sini, misalnya: 'img/solterfarm-1.jpg'
            images: ['img/project1.png']
        }, {
            tag: 'aplikasi santri',
            title: 'App Santri',
            heading: 'Aplikasi untuk santri',
            desc: 'Aplikasi Santri untuk mendukung kebutuhan dan aktivitas santri.',
            images: ['img/project3.png']
        }, {
            tag: 'desain antarmuka',
            title: 'Project Figma',
            heading: 'Desain aplikasi di Figma',
            desc: 'Project desain antarmuka aplikasi yang dibuat menggunakan Figma.',
            images: ['img/project2.png']
        }];
        

        (() => {
                const $ = id => document.getElementById(id);
                const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
                const esc = s => String(s).replace(/[&<>"]/g, c => ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;'
                }[c]));
                const ph = (t, n) => 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="${n % 2 ? '#2b2b2a' : '#1b1b1b'}"/><text x="600" y="420" font-family="Impact,Arial Narrow,sans-serif" font-size="110" fill="#e7e6e3" text-anchor="middle">${esc(t.toUpperCase())}</text><text x="600" y="490" font-family="Arial,sans-serif" font-size="28" fill="#8a8985" text-anchor="middle">ganti di array PROJECTS</text></svg>`);

                /* hero: judul meluncur ke tengah */
                (document.fonts?.ready ?? Promise.resolve()).then(() => requestAnimationFrame(() => requestAnimationFrame(() => $('hero').classList.add('go'))));

                /* render project */
                $('projects').innerHTML = PROJECTS.map(p => {
                            const imgs = p.images.length ? p.images : [ph(p.title, 0), ph(p.title, 1)];
                            return `<article class="p-step">
      <div class="p-title"><small>${esc(p.tag)}</small><b>${esc(p.title)}</b></div>
      <div class="p-card" tabindex="0" aria-label="${esc(p.title)}: klik untuk melihat detail project">
        <div class="p-txt"><em>Apa yang saya bangun</em><h3>${esc(p.heading)}</h3><p>${esc(p.desc)}</p></div>
        <div class="p-img" aria-hidden="true">${imgs.map((s, i) => `<img src="${esc(s)}" alt="" loading="lazy" class="${i ? '' : 'on'}">`).join('')}</div>
      </div></article>`;
  }).join('');

  /* Detail yang membesar saat kartu dipilih. Semua foto berasal dari images pada PROJECTS. */
  const modal = document.getElementById('projectModal');
  const modalTag = document.getElementById('projectModalTag');
  const modalTitle = document.getElementById('projectModalTitle');
  const modalDescription = document.getElementById('projectModalDescription');
  const modalGallery = document.getElementById('projectModalGallery');
  const modalClose = document.getElementById('projectModalClose');
  let lastCard = null;
  const closeDetail = () => {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    lastCard?.focus();
  };
  const openDetail = (project, card) => {
    lastCard = card;
    modalTag.textContent = project.tag;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.desc;
    modalGallery.innerHTML = project.images.map((src, i) =>
      `<img src="${esc(src)}" alt="${esc(project.title)} — foto ${i + 1}" loading="lazy">`).join('');
    modal.hidden = false;
    document.body.classList.add('modal-open');
    modalClose.focus();
  };
  modalClose.addEventListener('click', closeDetail);
  modal.addEventListener('click', event => { if (event.target === modal) closeDetail(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !modal.hidden) closeDetail(); });

  /* gambar berganti pelan saat kursor di sekitar box; klik membuka detail */
  document.querySelectorAll('.p-card').forEach(card => {
    const ims = [...card.querySelectorAll('.p-img img')]; let k = 0, t = 0;
    const step = () => { ims[k].classList.remove('on'); k = (k + 1) % ims.length; ims[k].classList.add('on'); };
    const start = () => { if (ims.length > 1 && !reduce && !t) t = setInterval(step, 1600); };
    const stop = () => { clearInterval(t); t = 0; };
    card.addEventListener('pointerenter', start);
    card.addEventListener('pointerleave', stop);
    card.addEventListener('focus', () => { card.classList.add('on'); start(); });
    card.addEventListener('blur', () => { card.classList.remove('on'); stop(); });
    card.addEventListener('click', () => openDetail(PROJECTS[[...document.querySelectorAll('.p-card')].indexOf(card)], card));
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); card.click(); }
    });
  });

  /* link: teks berputar seperti kubus */
  document.querySelectorAll('.roll').forEach(roll => {
    const a = roll.closest('a'), t = roll.textContent.trim();
    roll.innerHTML = `<span class="ghost">${esc(t)}</span><span class="cube" aria-hidden="true">${[0,1,2,3].map(k => `<span class="face f${k}">${esc(t)}</span>`).join('')}</span>`;
    const cube = roll.querySelector('.cube'); let rx = 0, last = 0;
    const turn = () => { const n = performance.now(); if (n - last < 260) return; last = n; rx -= 90; cube.style.setProperty('--rx', rx + 'deg'); };
    a.addEventListener('pointerenter', turn);
    a.addEventListener('focus', () => { if (a.matches(':focus-visible')) turn(); });
  });
})();
});
