// Global variables
let currentLanguage = 'en';

// DOM Elements
const domElements = {
    burger: document.querySelector('.burger'),
    nav: document.querySelector('.nav-links'),
    body: document.body,
    navLinks: document.querySelectorAll('.nav-links a'),
    contactForm: document.getElementById('contact-form'),
    cvButton: document.querySelector('.cv-button')
};

// Menu Functions
function toggleMenu() {
    domElements.burger.classList.toggle('active');
    domElements.nav.classList.toggle('active');
    domElements.body.classList.toggle('menu-open');
}

function closeMenu() {
    domElements.burger.classList.remove('active');
    domElements.nav.classList.remove('active');
    domElements.body.classList.remove('menu-open');
}

// Language Toggle Function
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'he' : 'en';
    document.body.classList.toggle('rtl', currentLanguage === 'he');
    document.documentElement.setAttribute('lang', currentLanguage);
    
    // Update all elements with data-en and data-he attributes
    document.querySelectorAll('[data-en], [data-he]').forEach(element => {
        const newText = element.getAttribute(`data-${currentLanguage}`);
        if (newText) {
            if (element.tagName.toLowerCase() === 'input' || 
                element.tagName.toLowerCase() === 'textarea') {
                element.placeholder = newText;
            } else {
                element.textContent = newText;
            }
        }
    });
}

// Contact Form Functions
function initContactForm() {
    if (!domElements.contactForm) return;

    emailjs.init("fZonou4lwG4i2yIzC");

    domElements.contactForm.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const button = this.querySelector('button');
    const spinner = button.querySelector('.spinner');
    const messageDiv = document.getElementById('form-message');
    
    button.disabled = true;
    spinner.style.display = 'inline-block';
    messageDiv.style.display = 'none';

    const templateParams = {
        from_name: this.name.value,
        from_email: this.email.value,
        message: this.message.value,
        to_name: 'Ben Shabi',
        reply_to: this.email.value
    };

    try {
        await emailjs.send('benshabi', 'template_w2pyuqy', templateParams);
        messageDiv.textContent = currentLanguage === 'en' ? 
            'Message sent successfully!' : 
            'ההודעה נשלחה בהצלחה!';
        messageDiv.className = 'form-message success';
        this.reset();
    } catch (error) {
        console.error('EmailJS Error:', error);
        messageDiv.textContent = currentLanguage === 'en' ? 
            'Failed to send message. Please try again.' : 
            'שליחת ההודעה נכשלה. אנא נסה שוב.';
        messageDiv.className = 'form-message error';
    } finally {
        messageDiv.style.display = 'block';
        button.disabled = false;
        spinner.style.display = 'none';
    }
}

// CV Button Functions
function initCVButton() {
    if (!domElements.cvButton) return;

    domElements.cvButton.addEventListener('click', handleCVButtonClick);
}

function handleCVButtonClick(e) {
    if (this.hasAttribute('target')) return;

    const originalText = this.querySelector('span').textContent;
    const downloadingText = currentLanguage === 'en' ? 'Downloading...' : 'מוריד...';
    
    this.querySelector('span').textContent = downloadingText;
    
    setTimeout(() => {
        this.querySelector('span').textContent = originalText;
    }, 2000);
}

// GSAP Animations
function initAnimations() {
    gsap.from('.logo', {
        opacity: 0,
        y: -20,
        duration: 1,
        ease: 'power4.out'
    });

    gsap.from('.nav-links a', {
        y: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Event Listeners
function initEventListeners() {
    // Burger menu events
    domElements.burger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    document.addEventListener('click', function(e) {
        if (domElements.nav.classList.contains('active') && 
            !domElements.nav.contains(e.target) && 
            !domElements.burger.contains(e.target)) {
            closeMenu();
        }
    });

    domElements.navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    initContactForm();
    initCVButton();
    initAnimations();
    initSmoothScroll();
});

// Make toggleLanguage available globally
window.toggleLanguage = toggleLanguage;