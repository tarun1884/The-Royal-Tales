const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const body = document.body;
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu a');
const statNumbers = document.querySelectorAll('.stat-number');
const floatElements = document.querySelectorAll('.float-element');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function setBodyScrollLock(isLocked) {
    body.style.overflow = isLocked ? 'hidden' : '';
}

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active', isOpen);
        setBodyScrollLock(isOpen);
    });

    mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            setBodyScrollLock(false);
        });
    });
}

function updateNavbarState() {
    if (!navbar) {
        return;
    }

    const isScrolled = window.scrollY > 48;
    navbar.classList.toggle('floating', isScrolled);
    navbar.classList.toggle('navbar-scrolled', isScrolled);
}

updateNavbarState();
window.addEventListener('scroll', updateNavbarState, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const targetId = anchor.getAttribute('href');

        if (!targetId || targetId === '#') {
            return;
        }

        const target = document.querySelector(targetId);
        if (!target) {
            return;
        }

        event.preventDefault();
        const navbarOffset = navbar ? navbar.offsetHeight + 24 : 100;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navbarOffset;
        window.scrollTo({
            top,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    });
});

function parseStatTarget(text) {
    const numericValue = parseInt(text.replace(/\D/g, ''), 10);

    if (Number.isNaN(numericValue)) {
        return null;
    }

    return {
        end: numericValue,
        suffix: text.replace(/[0-9]/g, '')
    };
}

function animateValue(element, end, suffix, duration) {
    if (prefersReducedMotion) {
        element.textContent = `${end}${suffix}`;
        return;
    }

    let startTimestamp = null;

    const step = (timestamp) => {
        if (!startTimestamp) {
            startTimestamp = timestamp;
        }

        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * end);
        element.textContent = `${current}${suffix}`;

        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };

    window.requestAnimationFrame(step);
}

if (statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const target = entry.target;
            const values = parseStatTarget(target.dataset.value || target.textContent);
            if (values) {
                target.dataset.value = `${values.end}${values.suffix}`;
                animateValue(target, values.end, values.suffix, 1600);
            }

            observer.unobserve(target);
        });
    }, { threshold: 0.35 });

    statNumbers.forEach((stat) => {
        statsObserver.observe(stat);
    });
}

if (galleryItems.length > 0 && lightbox && lightboxImg) {
    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
            const image = item.querySelector('img');
            if (!image) {
                return;
            }

            lightboxImg.src = image.currentSrc || image.src;
            lightboxImg.alt = image.alt || 'Gallery image';
            lightbox.classList.add('active');
            setBodyScrollLock(true);
        });
    });

    window.closeLightbox = function closeLightbox() {
        lightbox.classList.remove('active');
        setBodyScrollLock(false);
    };

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            window.closeLightbox();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && lightbox.classList.contains('active')) {
            window.closeLightbox();
        }
    });
}

const revealTargets = document.querySelectorAll(
    '.hero-content, .hero-image, .features-infobox, .service-card, .stat-item, .gallery-item, .testi-list, .info-item, .contact-content, .contact-form, .map, .speaker-detail-inner, footer .col-lg-4, footer .col-lg-3, footer .col-lg-2'
);

revealTargets.forEach((element) => {
    element.setAttribute('data-reveal', '');
});

if (prefersReducedMotion) {
    revealTargets.forEach((element) => {
        element.classList.add('is-visible');
    });
} else if (revealTargets.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.14,
        rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach((element) => {
        revealObserver.observe(element);
    });
}

if (!prefersReducedMotion && floatElements.length > 0) {
    let ticking = false;

    const updateParallax = () => {
        const scrolled = window.pageYOffset;

        floatElements.forEach((element, index) => {
            const speed = 0.08 + (index * 0.04);
            element.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
        });

        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });

    updateParallax();
}
