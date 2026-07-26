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

/* ── Contact Form Active Intent Handler ── */
const contactForm = document.getElementById('portfolioContactForm');
const formStatusMsg = document.getElementById('formStatusMsg');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('userName')?.value.trim() || '';
        const email = document.getElementById('userEmail')?.value.trim() || '';
        const subject = document.getElementById('userSubject')?.value.trim() || 'Project Inquiry';
        const message = document.getElementById('userMessage')?.value.trim() || '';

        if (!name || !email || !message) {
            if (formStatusMsg) {
                formStatusMsg.className = 'form-status-msg error';
                formStatusMsg.textContent = 'Please fill out your name, email, and message.';
            }
            return;
        }

        // Active Intent: Trigger mailto link with encoded user inputs
        const mailtoUrl = `mailto:akashpandey2599@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Akash,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

        if (formStatusMsg) {
            formStatusMsg.className = 'form-status-msg success';
            formStatusMsg.textContent = '✓ Opening your email client to send the message directly to Akash...';
        }

        setTimeout(() => {
            window.location.href = mailtoUrl;
        }, 400);
    });
}

/* ── GSAP Animations ── */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    /* Hero entrance */
    const heroTl = gsap.timeline({ delay: 0.1 });
    heroTl
        .fromTo('.status-indicator', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' })
        .fromTo('#heroEyebrow', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3')
        .fromTo('#heroHeadline', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.2')
        .fromTo('#heroSub', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3')
        .fromTo('#heroActions', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2')
        .fromTo('#heroRight', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.4');

    /* Section Header Staggered Animations */
    gsap.utils.toArray('.section-header').forEach(header => {
        const eyebrow = header.querySelector('.section-eyebrow');
        const title = header.querySelector('.section-title, .contact-headline');
        const desc = header.querySelector('.section-desc, .contact-sub');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: header,
                start: 'top 90%',
                toggleActions: 'play none none none',
            }
        });

        if (eyebrow) {
            tl.fromTo(eyebrow, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
        }
        if (title) {
            tl.fromTo(title, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: 'power2.out' }, '-=0.3');
        }
        if (desc) {
            tl.fromTo(desc, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out' }, '-=0.3');
        }
    });

    /* Scroll reveals — staggered within each parent */
    function revealGroup(selector, options = {}) {
        const elems = gsap.utils.toArray(selector);
        if (!elems.length) return;

        elems.forEach((el, i) => {
            gsap.fromTo(el,
                { y: options.y ?? 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: options.duration ?? 0.7,
                    ease: options.ease ?? 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 92%',
                        toggleActions: 'play none none none',
                    },
                    delay: (options.stagger ?? 0.08) * (i % (options.groupSize ?? 99)),
                }
            );
        });
    }

    revealGroup('.stat', { stagger: 0.1 });
    revealGroup('.exp-item', { stagger: 0.05 });
    revealGroup('.project-card', { stagger: 0.08, groupSize: 3 });
    revealGroup('.skill-category', { stagger: 0.07, groupSize: 5 });
    revealGroup('.process-step', { stagger: 0.07, groupSize: 5 });
    revealGroup('.currently-card', { stagger: 0.1 });
    revealGroup('.active-intent-card', { stagger: 0.08, groupSize: 3 });

    /* Generic .reveal (excluding already animated headers) */
    gsap.utils.toArray('.reveal:not(.section-header):not(.stat):not(.exp-item):not(.project-card):not(.skill-category):not(.process-step):not(.currently-card):not(.active-intent-card)').forEach(el => {
        gsap.fromTo(el,
            { y: 32, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.65,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 92%',
                    toggleActions: 'play none none none',
                }
            }
        );
    });

    /* Phone mockup subtle float & tilt animation */
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
