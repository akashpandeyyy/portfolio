/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 24);
    }
}, { passive: true });

/* ── Mobile menu ── */
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

function closeMobileMenu() {
    menuOpen = false;
    if (mobileMenu && burger) {
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (burger.children && burger.children.length >= 3) {
            burger.children[0].style.transform = '';
            burger.children[1].style.opacity = '';
            burger.children[2].style.transform = '';
        }
    }
}

if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
        menuOpen = !menuOpen;
        mobileMenu.classList.toggle('open', menuOpen);
        burger.setAttribute('aria-expanded', menuOpen);
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        if (menuOpen) {
            burger.children[0].style.transform = 'translateY(6.5px) rotate(45deg)';
            burger.children[1].style.opacity = '0';
            burger.children[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
        } else {
            closeMobileMenu();
        }
    });
}

/* ── GSAP Animations ── */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    /* Hero entrance */
    const heroTl = gsap.timeline({ delay: 0.1 });
    heroTl
        .from('#heroEyebrow', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' })
        .from('#heroHeadline', { y: 40, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.2')
        .from('#heroSub', { y: 30, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
        .from('#heroActions', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
        .from('#heroRight', { y: 30, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4');

    /* Scroll reveals — staggered within each parent */
    function revealGroup(selector, options = {}) {
        const elems = gsap.utils.toArray(selector);
        if (!elems.length) return;

        elems.forEach((el, i) => {
            gsap.from(el, {
                y: options.y ?? 40,
                opacity: 0,
                duration: options.duration ?? 0.7,
                ease: options.ease ?? 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                },
                delay: (options.stagger ?? 0.08) * (i % (options.groupSize ?? 99)),
            });
        });
    }

    revealGroup('.stat', { stagger: 0.1 });
    revealGroup('.exp-item', { stagger: 0.05 });
    revealGroup('.project-card', { stagger: 0.08, groupSize: 3 });
    revealGroup('.skill-category', { stagger: 0.07, groupSize: 5 });
    revealGroup('.process-step', { stagger: 0.07, groupSize: 5 });
    revealGroup('.currently-card', { stagger: 0.1 });
    revealGroup('.contact-card', { stagger: 0.08, groupSize: 4 });

    /* Generic .reveal (section headers, about, featured card, etc.) */
    gsap.utils.toArray('.reveal:not(.stat):not(.exp-item):not(.project-card):not(.skill-category):not(.process-step):not(.currently-card):not(.contact-card)').forEach(el => {
        gsap.from(el, {
            y: 32,
            opacity: 0,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none',
            }
        });
    });

    /* Phone mockup subtle float */
    const phone = document.querySelector('.phone-mockup');
    if (phone) {
        gsap.to(phone, {
            y: -10,
            duration: 3,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
        });
    }
}
