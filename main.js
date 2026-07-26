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

/* ── Contact Form Real-Time Field Validation & Submit Handler ── */
const contactForm = document.getElementById('portfolioContactForm');
const formStatusMsg = document.getElementById('formStatusMsg');

const nameInput = document.getElementById('userName');
const emailInput = document.getElementById('userEmail');
const numberInput = document.getElementById('userNumber');
const subjectInput = document.getElementById('userSubject');
const messageInput = document.getElementById('userMessage');

const nameErr = document.getElementById('userNameError');
const emailErr = document.getElementById('userEmailError');
const numberErr = document.getElementById('userNumberError');
const subjectErr = document.getElementById('userSubjectError');
const messageErr = document.getElementById('userMessageError');

const validators = {
    name: (val) => val.length >= 2 && /^[a-zA-Z\s.'-]+$/.test(val),
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    number: (val) => {
        const clean = val.replace(/[\s\-\(\)]/g, '');
        return /^[+]?[0-9]{10,14}$/.test(clean);
    },
    subject: (val) => val.length >= 3,
    message: (val) => val.length >= 10
};

function validateSingleField(input, errorEl, validatorFn, errorMsg) {
    if (!input) return false;
    const val = input.value.trim();
    if (val === '') {
        input.classList.remove('is-invalid', 'is-valid');
        if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('visible'); }
        return false;
    }
    const isValid = validatorFn(val);
    if (!isValid) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        if (errorEl) { errorEl.textContent = errorMsg; errorEl.classList.add('visible'); }
    } else {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('visible'); }
    }
    return isValid;
}

// Bind real-time input validation handlers
if (nameInput) {
    nameInput.addEventListener('blur', () => validateSingleField(nameInput, nameErr, validators.name, 'Name must be at least 2 letters.'));
    nameInput.addEventListener('input', () => { if (nameInput.classList.contains('is-invalid')) validateSingleField(nameInput, nameErr, validators.name, 'Name must be at least 2 letters.'); });
}
if (emailInput) {
    emailInput.addEventListener('blur', () => validateSingleField(emailInput, emailErr, validators.email, 'Please enter a valid email address (e.g. name@domain.com).'));
    emailInput.addEventListener('input', () => { if (emailInput.classList.contains('is-invalid')) validateSingleField(emailInput, emailErr, validators.email, 'Please enter a valid email address (e.g. name@domain.com).'); });
}
if (numberInput) {
    numberInput.addEventListener('blur', () => validateSingleField(numberInput, numberErr, validators.number, 'Please enter a valid mobile number (10–13 digits).'));
    numberInput.addEventListener('input', () => { if (numberInput.classList.contains('is-invalid')) validateSingleField(numberInput, numberErr, validators.number, 'Please enter a valid mobile number (10–13 digits).'); });
}
if (subjectInput) {
    subjectInput.addEventListener('blur', () => validateSingleField(subjectInput, subjectErr, validators.subject, 'Subject must be at least 3 characters.'));
    subjectInput.addEventListener('input', () => { if (subjectInput.classList.contains('is-invalid')) validateSingleField(subjectInput, subjectErr, validators.subject, 'Subject must be at least 3 characters.'); });
}
if (messageInput) {
    messageInput.addEventListener('blur', () => validateSingleField(messageInput, messageErr, validators.message, 'Message must be at least 10 characters long.'));
    messageInput.addEventListener('input', () => { if (messageInput.classList.contains('is-invalid')) validateSingleField(messageInput, messageErr, validators.message, 'Message must be at least 10 characters long.'); });
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const isNameValid = validateSingleField(nameInput, nameErr, validators.name, 'Name must be at least 2 letters.');
        const isEmailValid = validateSingleField(emailInput, emailErr, validators.email, 'Please enter a valid email address.');
        const isNumberValid = validateSingleField(numberInput, numberErr, validators.number, 'Please enter a valid mobile number (10–13 digits).');
        const isSubjectValid = validateSingleField(subjectInput, subjectErr, validators.subject, 'Subject must be at least 3 characters.');
        const isMessageValid = validateSingleField(messageInput, messageErr, validators.message, 'Message must be at least 10 characters long.');

        if (!isNameValid || !isEmailValid || !isNumberValid || !isSubjectValid || !isMessageValid) {
            if (formStatusMsg) {
                formStatusMsg.className = 'form-status-msg error';
                formStatusMsg.textContent = 'Please correct the highlighted errors in the form before submitting.';
            }
            return;
        }

        const name = nameInput?.value.trim() || '';
        const email = emailInput?.value.trim() || '';
        const number = numberInput?.value.trim() || '';
        const subject = subjectInput?.value.trim() || '';
        const msg = messageInput?.value.trim() || '';

        const submitBtn = document.getElementById('submitFormBtn');
        const btnText = submitBtn?.querySelector('.btn-text');

        if (submitBtn) submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Sending...';

        if (formStatusMsg) {
            formStatusMsg.className = 'form-status-msg';
            formStatusMsg.style.display = 'block';
            formStatusMsg.style.color = '#8a8a8a';
            formStatusMsg.textContent = 'Sending message.....';
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
                formStatusMsg.textContent = '✓ Message send';
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
