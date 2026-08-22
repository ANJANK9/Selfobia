'use strict';

const navbar = document.querySelector('.navbar');
const menu = document.querySelector('.menu');
const menuToggle = document.querySelector('.menu-toggle');
const menuIcon = menuToggle.querySelector('i');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];
const scrollUpBtn = document.querySelector('.scroll-up-btn');
const typingElement = document.querySelector('.typing');
const yearElement = document.getElementById('year');

/* Current year */
yearElement.textContent = new Date().getFullYear();

/* Mobile menu */
function closeMenu() {
    menu.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    menuIcon.classList.remove('fa-times');
    menuIcon.classList.add('fa-bars');
}

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

navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
});

/* Sticky navbar, scroll-to-top button and active section */
function updateOnScroll() {
    const scrollY = window.scrollY;

    navbar.classList.toggle('sticky', scrollY > 25);
    scrollUpBtn.classList.toggle('show', scrollY > 450);

    const navbarOffset = navbar.offsetHeight + 45;

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
}

window.addEventListener(
    'scroll',
    updateOnScroll,
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
scrollUpBtn.addEventListener('click', () => {

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

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeRole() {

    if (!typingElement) return;

    const currentRole = roles[roleIndex];

    if (deleting) {
        charIndex -= 1;
    } else {
        charIndex += 1;
    }

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

/* Reveal animation */

const revealElements =
    document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {

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
                threshold: 0.12
            }
        );

    revealElements.forEach(
        (element) =>
            revealObserver.observe(element)
    );

} else {

    revealElements.forEach(
        (element) =>
            element.classList.add('visible')
    );

}