/* ── Anti-Inspect & Code Lock Protection ── */
document.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('keydown', (e) => {
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) ||
        (e.ctrlKey && ['U', 'u', 'S', 's'].includes(e.key)) ||
        (e.metaKey && e.altKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key))
    ) {
        e.preventDefault();
        return false;
    }
});

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

/* ── Contact Form Firebase Realtime DB & Active Intent Handler ── */
const contactForm = document.getElementById('portfolioContactForm');
const formStatusMsg = document.getElementById('formStatusMsg');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('userName')?.value.trim() || '';
        const email = document.getElementById('userEmail')?.value.trim() || '';
        const number = document.getElementById('userNumber')?.value.trim() || '';
        const subject = document.getElementById('userSubject')?.value.trim() || 'Project Inquiry';
        const msg = document.getElementById('userMessage')?.value.trim() || '';

        if (!name || !email || !number || !msg) {
            if (formStatusMsg) {
                formStatusMsg.className = 'form-status-msg error';
                formStatusMsg.textContent = 'Please fill out your name, email, phone number, and message.';
            }
            return;
        }

        const submitBtn = document.getElementById('submitFormBtn');
        const btnText = submitBtn?.querySelector('.btn-text');

        if (submitBtn) submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Sending...';

        if (formStatusMsg) {
            formStatusMsg.className = 'form-status-msg';
            formStatusMsg.style.display = 'block';
            formStatusMsg.style.color = '#8a8a8a';
            formStatusMsg.textContent = 'Saving message to Realtime Database...';
        }

        const payload = {
            email: email,
            name: name,
            number: number,
            subject: subject,
            msg: msg
        };

        let saved = false;

        // Strategy 1: Firebase Realtime Database SDK (User / {push_id})
        if (window.firebaseRtdb && window.firebaseRef && window.firebasePush && window.firebaseSet) {
            try {
                const userRef = window.firebaseRef(window.firebaseRtdb, 'User');
                const newUserRef = window.firebasePush(userRef);

                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('RTDB Timeout')), 3000)
                );

                await Promise.race([
                    window.firebaseSet(newUserRef, payload),
                    timeoutPromise
                ]);
                saved = true;
            } catch (rtdbErr) {
                console.warn("Realtime DB SDK write warning:", rtdbErr);
            }
        }

        // Strategy 2: Direct Realtime Database REST API (Ensures instant RTDB write even if SDK WebSocket hangs)
        if (!saved) {
            const rtdbUrls = [
                "https://portfolio-d8ff9-default-rtdb.firebaseio.com/User.json",
                "https://portfolio-d8ff9-default-rtdb.asia-southeast1.firebasedatabase.app/User.json"
            ];

            for (const url of rtdbUrls) {
                try {
                    const res = await fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });
                    if (res.ok) {
                        saved = true;
                        break;
                    }
                } catch (fetchErr) {
                    console.warn("RTDB REST API endpoint error:", fetchErr);
                }
            }
        }

        if (saved) {
            if (formStatusMsg) {
                formStatusMsg.className = 'form-status-msg success';
                formStatusMsg.textContent = '✓ Message saved to Realtime Database under User node!';
            }
            contactForm.reset();
        } else {
            // Active Mailto Intent Fallback
            const mailtoUrl = `mailto:akashpandey2599@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Akash,\n\nName: ${name}\nEmail: ${email}\nPhone: ${number}\n\nMessage:\n${msg}`)}`;
            if (formStatusMsg) {
                formStatusMsg.className = 'form-status-msg success';
                formStatusMsg.textContent = '✓ Message ready! Opening email client to send to Akash...';
            }
            setTimeout(() => { window.location.href = mailtoUrl; }, 400);
        }

        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Send Message →';
    });
}

/* ── Dynamic Mouse Spotlight Glow ── */
const spotlight = document.createElement('div');
spotlight.className = 'mouse-spotlight';
document.body.appendChild(spotlight);

window.addEventListener('mousemove', (e) => {
    if (typeof gsap !== 'undefined') {
        gsap.to(spotlight, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.35,
            ease: 'power2.out'
        });
    } else {
        spotlight.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }
}, { passive: true });

/* ── Interactive 3D Card Hover & Cursor Spotlight Tilt ── */
const tiltCards = document.querySelectorAll('.glow-card, .project-card, .skill-category, .process-step, .currently-card, .active-intent-card, .about-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        if (typeof gsap !== 'undefined') {
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                duration: 0.3,
                ease: 'power1.out'
            });
        }
    });

    card.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    });
});

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

    /* Phone mockup subtle float animation */
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
