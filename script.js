'use strict';

const navbar = document.querySelector('.navbar');
const menu = document.querySelector('.menu');
const menuToggle = document.querySelector('.menu-toggle');
const menuIcon = menuToggle?.querySelector('i');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];
const scrollUpBtn = document.querySelector('.scroll-up-btn');
const typingElement = document.querySelector('.typing');
const yearElement = document.getElementById('year');
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle?.querySelector('i');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const copyEmailButton = document.querySelector('.copy-email');

/* Current year */
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

/* Mobile menu */
function closeMenu() {
    if (!menu || !menuToggle || !menuIcon) return;

    menu.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    menuIcon.classList.remove('fa-times');
    menuIcon.classList.add('fa-bars');
}

if (menuToggle && menu && menuIcon) {
    menuToggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('active');

        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute(
            'aria-label',
            isOpen ? 'Close navigation menu' : 'Open navigation menu'
        );

        menuIcon.classList.toggle('fa-bars', !isOpen);
        menuIcon.classList.toggle('fa-times', isOpen);
    });
}

navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeMenu();
    }
});

/* Sticky navbar, scroll-to-top button and active section */
let scrollTicking = false;

function updateOnScroll() {
    const scrollY = window.scrollY;

    navbar?.classList.toggle('sticky', scrollY > 25);
    scrollUpBtn?.classList.toggle('show', scrollY > 450);

    const navbarOffset = (navbar?.offsetHeight || 0) + 50;
    let currentSection = 'home';

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - navbarOffset;

        if (scrollY >= sectionTop) {
            currentSection = section.id;
        }
    });

    navLinks.forEach((link) => {
        link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${currentSection}`
        );
    });

    scrollTicking = false;
}

window.addEventListener(
    'scroll',
    () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(updateOnScroll);
            scrollTicking = true;
        }
    },
    { passive: true }
);

window.addEventListener('resize', () => {
    if (window.innerWidth > 1000) {
        closeMenu();
    }

    updateOnScroll();
});

updateOnScroll();

/* Scroll to top */
scrollUpBtn?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

/* Typewriter animation */
const roles = [
    'Software Developer',
    'Full-Stack Developer',
    'Java Developer'
];

const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches;

if (typingElement) {
    if (reduceMotion) {
        typingElement.textContent = roles[0];
    } else {
        let roleIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function typeRole() {
            const currentRole = roles[roleIndex];

            charIndex += deleting ? -1 : 1;
            typingElement.textContent =
                currentRole.slice(0, charIndex);

            let delay = deleting ? 45 : 85;

            if (
                !deleting &&
                charIndex === currentRole.length
            ) {
                deleting = true;
                delay = 1500;
            } else if (
                deleting &&
                charIndex === 0
            ) {
                deleting = false;
                roleIndex =
                    (roleIndex + 1) % roles.length;
                delay = 350;
            }

            window.setTimeout(
                typeRole,
                delay
            );
        }

        typeRole();
    }
}

/* Reveal animation */
const revealElements =
    document.querySelectorAll('.reveal');

if (
    'IntersectionObserver' in window &&
    !reduceMotion
) {
    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target
                            .classList.add('visible');

                        observer
                            .unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -20px 0px'
            }
        );

    revealElements.forEach((element) =>
        revealObserver.observe(element)
    );
} else {
    revealElements.forEach((element) =>
        element.classList.add('visible')
    );
}

/* Theme toggle */
const THEME_KEY = 'anjan-portfolio-theme';

function applyTheme(theme) {
    const isDark = theme === 'dark';

    document.body.classList.toggle(
        'dark-theme',
        isDark
    );

    if (themeToggle && themeIcon) {
        themeToggle.setAttribute(
            'aria-pressed',
            String(isDark)
        );

        themeToggle.setAttribute(
            'aria-label',
            isDark
                ? 'Use standard theme'
                : 'Enable dark mode'
        );

        themeIcon.classList.toggle(
            'fa-moon',
            !isDark
        );

        themeIcon.classList.toggle(
            'fa-sun',
            isDark
        );
    }

    if (themeMeta) {
        themeMeta.setAttribute(
            'content',
            isDark ? '#0f172a' : '#0b1120'
        );
    }
}

const savedTheme =
    localStorage.getItem(THEME_KEY);

applyTheme(
    savedTheme === 'dark'
        ? 'dark'
        : 'standard'
);

themeToggle?.addEventListener('click', () => {
    const nextTheme =
        document.body.classList.contains('dark-theme')
            ? 'standard'
            : 'dark';

    localStorage.setItem(
        THEME_KEY,
        nextTheme
    );

    applyTheme(nextTheme);
});

/* Copy email */
copyEmailButton?.addEventListener(
    'click',
    async () => {
        const email =
            copyEmailButton.dataset.email;

        const label =
            copyEmailButton.querySelector('span');

        if (!email || !label) return;

        const originalText =
            label.textContent;

        try {
            await navigator.clipboard.writeText(email);

            label.textContent = 'Copied!';

            copyEmailButton.classList.add(
                'copied'
            );
        } catch (error) {
            label.textContent = email;
        }

        window.setTimeout(() => {
            label.textContent =
                originalText;

            copyEmailButton.classList.remove(
                'copied'
            );
        }, 1800);
    }
);