/* ====== I18N ====== */
const LANG_CYCLE = ['he', 'en', 'ru', 'ar'];
const LANG_LABELS = { he: 'HE', en: 'EN', ru: 'RU', ar: 'AR' };
const RTL_LANGS = new Set(['he', 'ar']);
const STORAGE_KEY = 'dks-main-lang';

let currentLang = 'he';

function getStoredLang() {
    try { return localStorage.getItem(STORAGE_KEY) || 'he'; } catch { return 'he'; }
}
function setStoredLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
}

function applyLanguage(lang) {
    if (!LANG_CYCLE.includes(lang)) lang = 'he';
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGS.has(lang) ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-he]').forEach(el => {
        const val = el.getAttribute('data-' + lang);
        if (val !== null) el.innerHTML = val;
    });

    document.querySelectorAll('[data-placeholder-he]').forEach(el => {
        const val = el.getAttribute('data-placeholder-' + lang);
        if (val !== null) el.placeholder = val;
    });

    document.querySelectorAll('[data-aria-label-he]').forEach(el => {
        const val = el.getAttribute('data-aria-label-' + lang);
        if (val !== null) el.setAttribute('aria-label', val);
    });

    document.querySelectorAll('[data-content-he]').forEach(el => {
        const val = el.getAttribute('data-content-' + lang);
        if (val !== null) el.setAttribute('content', val);
    });

    const titleEl = document.querySelector('title[data-he]');
    if (titleEl) {
        const val = titleEl.getAttribute('data-' + lang);
        if (val !== null) document.title = val;
    }

    document.querySelectorAll('[data-cur-lang]').forEach(el => {
        el.textContent = LANG_LABELS[lang];
    });

    document.querySelectorAll('.lang-menu button[data-lang]').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.setAttribute('aria-current', 'true');
        } else {
            btn.removeAttribute('aria-current');
        }
    });

    setStoredLang(lang);
}

function closeAllLangMenus() {
    document.querySelectorAll('.lang-wrap').forEach(wrap => {
        const menu = wrap.querySelector('.lang-menu');
        const trigger = wrap.querySelector('.lang-toggle, .lang-float');
        if (menu) menu.hidden = true;
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
}

function toggleLangMenu(wrap) {
    const menu = wrap.querySelector('.lang-menu');
    const trigger = wrap.querySelector('.lang-toggle, .lang-float');
    if (!menu || !trigger) return;
    const isOpen = !menu.hidden;
    closeAllLangMenus();
    if (!isOpen) {
        menu.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
    }
}

document.addEventListener('click', e => {
    const langItem = e.target.closest('.lang-menu button[data-lang]');
    if (langItem) {
        applyLanguage(langItem.getAttribute('data-lang'));
        closeAllLangMenus();
        return;
    }
    const trigger = e.target.closest('.lang-wrap .lang-toggle, .lang-wrap .lang-float');
    if (trigger) {
        const wrap = trigger.closest('.lang-wrap');
        if (wrap) toggleLangMenu(wrap);
        return;
    }
    if (!e.target.closest('.lang-wrap')) {
        closeAllLangMenus();
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllLangMenus();
});

applyLanguage(getStoredLang());

// ===== INTRO: SEAL VIDEO → LOGO FLIGHT =====
(function logoIntroAnimation() {
    const intro = document.getElementById('logoIntro');
    const introVideo = document.getElementById('logoIntroVideo');
    const introImg = document.getElementById('logoIntroImg');
    const navLogo = document.querySelector('.nav-logo .logo-img');
    if (!intro || !introImg || !navLogo) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
        intro.remove();
        document.body.classList.add('intro-done');
        return;
    }

    let finished = false;
    const finish = () => {
        if (finished) return;
        finished = true;
        intro.classList.add('done');
        document.body.classList.add('intro-done');
        setTimeout(() => intro.remove(), 700);
    };

    const flyToTarget = () => {
        const introRect = introImg.getBoundingClientRect();
        const targetRect = navLogo.getBoundingClientRect();
        if (!introRect.width || !targetRect.width) {
            finish();
            return;
        }
        const dx = (targetRect.left + targetRect.width / 2) - (introRect.left + introRect.width / 2);
        const dy = (targetRect.top + targetRect.height / 2) - (introRect.top + introRect.height / 2);
        const scale = targetRect.width / introRect.width;
        introImg.style.setProperty('--intro-tx', dx + 'px');
        introImg.style.setProperty('--intro-ty', dy + 'px');
        introImg.style.setProperty('--intro-ts', scale);
        intro.classList.add('flying');
        setTimeout(finish, 1750);
    };

    // אחרי הסרטון: להציג לוגו, להמתין רגע, ואז להתעופף
    const afterVideo = () => {
        intro.classList.add('video-done');
        // 500ms — הלוגו מתחיל להיות נראה ונותן לעין לקלוט אותו
        setTimeout(flyToTarget, 650);
    };

    // אם אין סרטון (נכשל/חסר) — לעקוף
    if (!introVideo) {
        afterVideo();
        return;
    }

    let videoHandled = false;
    const handleVideoEnd = () => {
        if (videoHandled) return;
        videoHandled = true;
        afterVideo();
    };

    introVideo.addEventListener('ended', handleVideoEnd);
    introVideo.addEventListener('error', handleVideoEnd);

    const tryPlay = () => {
        const p = introVideo.play();
        if (p && typeof p.catch === 'function') {
            p.catch(() => handleVideoEnd());
        }
    };

    if (introVideo.readyState >= 2) {
        tryPlay();
    } else {
        introVideo.addEventListener('loadeddata', tryPlay, { once: true });
        introVideo.addEventListener('canplay', tryPlay, { once: true });
    }

    // fallback: אם הסרטון לא סיים תוך 4 שניות — דלג
    setTimeout(handleVideoEnd, 4000);
})();

// ===== HERO VIDEO INFINITE LOOP (resilience) =====
(function heroVideoLoop() {
    const video = document.querySelector('.hero-video');
    if (!video) return;
    const safePlay = () => {
        const p = video.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
    };
    video.addEventListener('ended', () => { video.currentTime = 0; safePlay(); });
    video.addEventListener('pause', () => {
        if (!document.hidden && !video.ended) safePlay();
    });
    video.addEventListener('stalled', safePlay);
    video.addEventListener('suspend', safePlay);
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) safePlay();
    });
    window.addEventListener('focus', safePlay);
    safePlay();
})();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
});
function closeMobile() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    closeAllLangMenus();
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.adv-card, .pkg-card').forEach((el, i) => {
    if (!el.dataset.delay) el.dataset.delay = i * 80;
    observer.observe(el);
});

// ===== COUNT UP ANIMATION =====
const statNums = document.querySelectorAll('.stat-num');
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.count);
            let current = 0;
            const increment = target / 60;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) { current = target; clearInterval(timer); }
                entry.target.textContent = Math.floor(current).toLocaleString();
            }, 25);
            countObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
statNums.forEach((el) => countObserver.observe(el));

// ===== HERO PARTICLES =====
const particlesContainer = document.getElementById('heroParticles');
function createParticle() {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 1;
    const x = Math.random() * 100;
    const duration = Math.random() * 4 + 3;
    const delay = Math.random() * 2;
    Object.assign(particle.style, {
        position: 'absolute',
        width: size + 'px', height: size + 'px',
        borderRadius: '50%',
        background: Math.random() > 0.5 ? 'rgba(230,57,70,0.4)' : 'rgba(0,212,255,0.3)',
        left: x + '%', bottom: '-10px',
        animation: `floatUp ${duration}s ${delay}s ease-out forwards`,
        pointerEvents: 'none'
    });
    particlesContainer.appendChild(particle);
    setTimeout(() => particle.remove(), (duration + delay) * 1000);
}

// Add float animation
const style = document.createElement('style');
style.textContent = `
@keyframes floatUp {
    0% { transform: translateY(0) scale(1); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 0.5; }
    100% { transform: translateY(-100vh) scale(0.3); opacity: 0; }
}`;
document.head.appendChild(style);

setInterval(createParticle, 300);

// ===== SMOOTH SCROLL FOR ANCHORS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    });
});

// ===== PACKAGE FILTER =====
(function packageFilter() {
    const radios = document.querySelectorAll('input[name="pkg-filter"]');
    const cards = document.querySelectorAll('.pkg-card');
    if (!radios.length || !cards.length) return;

    const apply = (cat) => {
        cards.forEach(card => {
            const match = card.dataset.category === cat;
            card.classList.toggle('hidden-by-filter', !match);
        });
    };

    radios.forEach(r => r.addEventListener('change', e => {
        if (e.target.checked) apply(e.target.value);
    }));

    const initial = document.querySelector('input[name="pkg-filter"]:checked');
    if (initial) apply(initial.value);
})();
