// ===== LOGO INTRO ANIMATION =====
(function logoIntroAnimation() {
    const intro = document.getElementById('logoIntro');
    const introImg = document.getElementById('logoIntroImg');
    const navLogo = document.querySelector('.nav-logo .logo-img');
    if (!intro || !introImg || !navLogo) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
        intro.remove();
        document.body.classList.add('intro-done');
        return;
    }

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
        intro.classList.add('flying');
        introImg.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    };

    const finish = () => {
        intro.classList.add('done');
        document.body.classList.add('intro-done');
        setTimeout(() => intro.remove(), 600);
    };

    const start = () => {
        setTimeout(flyToTarget, 950);
        setTimeout(finish, 1950);
    };

    if (navLogo.complete && introImg.complete) {
        start();
    } else {
        let fired = false;
        const go = () => { if (!fired) { fired = true; start(); } };
        if (navLogo.complete) go();
        else navLogo.addEventListener('load', go, { once: true });
        if (introImg.complete) go();
        else introImg.addEventListener('load', go, { once: true });
        setTimeout(go, 2500);
    }
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
