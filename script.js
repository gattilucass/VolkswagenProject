// Main JavaScript file for VW ID.4 Campaign Website

// Global Variables
let currentSlide = 0;
const totalSlides = 3;
let isScrolling = false;
let sessionId = generateSessionId();

// Generate unique session ID
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeFeatherIcons();
    initializeScrollAnimations();
    initializeMobileMenu();
    initializeCarousel();
    initializeTabs();
    initializeSmoothScrolling();
    initializeBackgroundScroll();
    createParticles();
      initializeMouseAura();
      initializeIntroSequence();

    // Track page load
    trackEvent('page_loaded', { 
        section: 'hero',
        user_agent: navigator.userAgent,
        screen_resolution: `${window.screen.width}x${window.screen.height}`
    });
});

// Initialize Feather Icons
function initializeFeatherIcons() {
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

// Mobile Menu Functionality
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('translate-x-full');
        });

        // Close menu when clicking nav items
        mobileNavItems.forEach(item => {
            item.addEventListener('click', () => {
                mobileMenu.classList.add('translate-x-full');
            });
        });

        // Close menu when clicking outside
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                mobileMenu.classList.add('translate-x-full');
            }
        });
    }
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in-on-scroll class
    document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Smooth Scrolling for Internal Links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// === NUEVA FUNCIÓN PARA FONDO ANIMADO CON SCROLL ===
function initializeBackgroundScroll() {
    const sections = document.querySelectorAll('section[data-bg-color]');
    const body = document.body;
    let initialColor = '#111827'; // Color base del body

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.4 // Se activa cuando el 40% de la sección es visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const color = entry.target.getAttribute('data-bg-color');
                body.style.backgroundColor = color;
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}


// Utility function for smooth scrolling to sections
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Track section navigation
        trackEvent('section_navigation', { 
            section: sectionId,
            from_section: 'navigation'
        });
    }
}

// Carousel Functionality
function initializeCarousel() {
    updateCarouselPosition();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarouselPosition();
    updateCarouselIndicators();
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarouselPosition();
    updateCarouselIndicators();
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarouselPosition();
    updateCarouselIndicators();
}

function updateCarouselPosition() {
    const carousel = document.getElementById('visualCarousel');
    if (carousel) {
        const translateX = -currentSlide * 100;
        carousel.style.transform = `translateX(${translateX}%)`;
    }
}

function updateCarouselIndicators() {
    const indicators = document.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
            indicator.classList.remove('bg-cyber-text-secondary/50');
            indicator.classList.add('bg-cyber-primary');
        } else {
            indicator.classList.remove('active');
            indicator.classList.remove('bg-cyber-primary');
            indicator.classList.add('bg-cyber-text-secondary/50');
        }
    });
}

// Auto-advance carousel
setInterval(() => {
    if (!document.querySelector('#lightbox').classList.contains('hidden')) return;
    nextSlide();
}, 5000);

// Tab Functionality
function initializeTabs() {
    // Set initial active tab
    const defaultTab = 'tv-spot';
    showTab(defaultTab);
}

function switchTab(tabId) {
    // Remove active class from all tabs and buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
        button.classList.remove('bg-cyber-primary', 'text-cyber-dark', 'border-cyber-primary');
        button.classList.add('border-cyber-text-secondary/50', 'text-cyber-text-secondary');
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    // Add active class to clicked button and corresponding content
    const activeButton = document.querySelector(`button[onclick="switchTab('${tabId}')"]`);
    const activeContent = document.getElementById(tabId);

    if (activeButton && activeContent) {
        activeButton.classList.add('active');
        activeButton.classList.add('bg-cyber-primary', 'text-cyber-dark', 'border-cyber-primary');
        activeButton.classList.remove('border-cyber-text-secondary/50', 'text-cyber-text-secondary');
        
        activeContent.classList.remove('hidden');
    }
}

function showTab(tabId) {
    switchTab(tabId);
}

// Lightbox Functionality
function openLightbox(visualIndex) {
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightbox-content');
    
    if (lightbox && lightboxContent) {
        // Track visual view
        const visualData = getVisualData(visualIndex);
        trackVisualView(visualIndex, visualData.title);
        trackEvent('lightbox_opened', { 
            section: 'visuals', 
            visual_index: visualIndex,
            visual_title: visualData.title 
        });
        
        // Create content based on visual index
        
        lightboxContent.innerHTML = `
            <div class="p-8">
                <div class="grid lg:grid-cols-2 gap-8">
                    <div class="aspect-video bg-gradient-to-br ${visualData.gradient} rounded-xl flex items-center justify-center border ${visualData.border}">
                        <div class="text-center">
                            <i data-feather="image" class="w-20 h-20 ${visualData.iconColor} mx-auto mb-4"></i>
                            <p class="text-cyber-text text-lg">${visualData.title}</p>
                            <p class="text-cyber-text-secondary text-sm mt-2">${visualData.filename}</p>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-orbitron font-bold text-2xl mb-4 ${visualData.titleColor}">${visualData.title}</h3>
                        <p class="text-cyber-text-secondary mb-6">${visualData.description}</p>
                        
                        <div class="bg-cyber-dark/50 p-4 rounded-lg border border-cyber-primary/20 mb-6">
                            <h4 class="font-orbitron font-medium text-cyber-primary mb-2">Prompt Utilizado:</h4>
                            <p class="text-cyber-text-secondary text-sm font-mono">${visualData.prompt}</p>
                        </div>
                        
                        <div class="bg-cyber-dark/50 p-4 rounded-lg border border-cyber-secondary/20">
                            <h4 class="font-orbitron font-medium text-cyber-secondary mb-2">Especificaciones Técnicas:</h4>
                            <ul class="text-cyber-text-secondary text-sm space-y-1">
                                <li>• Resolución: 4K (3840x2160)</li>
                                <li>• Formato: PNG con transparencia</li>
                                <li>• Estilo: Cyber-organic, hiperrealista</li>
                                <li>• Herramienta: ${visualData.tool}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Re-initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function getVisualData(index) {
    const visuals = [
        {
            title: "Cyber-Organic Landscape",
            filename: "assets/visual-key-01.jpg",
            description: "Una visión futurista que fusiona elementos naturales con tecnología avanzada, representando la armonía entre la naturaleza y la innovación eléctrica del ID.4.",
            prompt: "Cyber-organic landscape with electric vehicle, bioluminescent plants, futuristic architecture, neon lighting, misty atmosphere, hyperrealistic, 8k resolution --ar 16:9 --v 6",
            tool: "Midjourney v6",
            gradient: "from-cyber-primary/20 to-cyber-secondary/20",
            border: "border-cyber-primary/30",
            iconColor: "text-cyber-primary",
            titleColor: "text-cyber-primary"
        },
        {
            title: "Electric Future Vision",
            filename: "assets/visual-key-02.jpg",
            description: "Representación conceptual del futuro de la movilidad eléctrica, mostrando la transformación urbana hacia un ecosistema sostenible y tecnológicamente avanzado.",
            prompt: "Electric future cityscape, VW ID.4 vehicle, sustainable urban environment, solar panels, wind turbines, clean energy visualization, dramatic lighting --ar 16:9 --v 6",
            tool: "Midjourney v6",
            gradient: "from-cyber-secondary/20 to-cyber-accent/20",
            border: "border-cyber-secondary/30",
            iconColor: "text-cyber-secondary",
            titleColor: "text-cyber-secondary"
        },
        {
            title: "ID.4 Transformation",
            filename: "assets/visual-key-03.jpg",
            description: "Metamorfosis visual del Volkswagen ID.4 emergiendo de elementos orgánicos, simbolizando el nacimiento de una nueva era en la movilidad personal.",
            prompt: "VW ID.4 vehicle transformation sequence, organic cocoon opening, butterfly metamorphosis metaphor, golden hour lighting, particle effects, cinematic composition --ar 16:9 --v 6",
            tool: "Midjourney v6",
            gradient: "from-cyber-accent/20 to-cyber-primary/20",
            border: "border-cyber-accent/30",
            iconColor: "text-cyber-accent",
            titleColor: "text-cyber-accent"
        }
    ];
    
    return visuals[index] || visuals[0];
}

// Modal Functions
function openAllVisualsModal() {
    alert('Funcionalidad de galería completa - Aquí se abriría una galería con todos los key visuals generados por IA para la campaña.');
}

function openInteractivePreview() {
    alert('Preview de experiencia interactiva - Aquí se abriría una demo de la plataforma web inmersiva del ID.4.');
}

// === NUEVA FUNCIÓN DE AURA CON ESTELA ===
function initializeMouseAura() {
    const heroSection = document.getElementById('hero-section');
    if (!heroSection) return;

    let canCreateDot = true;

    heroSection.addEventListener('mousemove', (e) => {
        if (!canCreateDot) return; // Si no podemos crear, salimos

        // Creamos un punto de la estela
        const dot = document.createElement('div');
        dot.className = 'aura-dot';
        document.body.appendChild(dot); // Lo añadimos al body

        // Lo posicionamos en el cursor
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;

        // Asignamos un color aleatorio de la paleta
        const color = Math.random() > 0.5 ? 'var(--cyber-primary)' : 'var(--cyber-secondary)';
        dot.style.backgroundColor = color;
        dot.style.boxShadow = `0 0 15px ${color}, 0 0 25px ${color}`;

        // Eliminamos el punto después de que termine su animación
        setTimeout(() => {
            dot.remove();
        }, 700); // 700ms, que es la duración de la animación 'fadeAndShrink'

        // Limitamos la creación de puntos para no saturar (throttling)
        canCreateDot = false;
        setTimeout(() => {
            canCreateDot = true;
        }, 50); // Creamos un punto como máximo cada 50ms
    });
}


// === CÓDIGO FINAL PARA EL SISTEMA DE PARTÍCULAS "GALAXIA DENSA" ===

function createParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) return;

    // Aumentamos drásticamente el número de partículas
    for (let i = 0; i < 100; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Hacemos las partículas más grandes y variadas
    const size = Math.random() * 3 + 1.5; // Ahora entre 1.5px y 4.5px
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;

    // Asignamos valores aleatorios a las variables CSS
    const xEnd = (Math.random() * 150) - 75;
    const yEnd = (Math.random() * 150) - 75;
    const duration = Math.random() * 15 + 10; // Duraciones más cortas para más dinamismo

    // Reducimos drásticamente el retraso para que aparezcan casi al instante
    const delay = Math.random() * 2; // Máximo 2 segundos de retraso

    particle.style.setProperty('--x-end', `${xEnd}px`);
    particle.style.setProperty('--y-end', `${yEnd}px`);
    particle.style.setProperty('--duration', `${duration}s`);
    particle.style.setProperty('--delay', `-${delay}s`);

    // Asignar color
    if (Math.random() > 0.7) {
        particle.style.setProperty('--particle-color', 'var(--cyber-secondary)');
    } else {
        particle.style.setProperty('--particle-color', 'var(--cyber-primary)');
    }

    container.appendChild(particle);
}

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // Close lightbox with Escape key
    if (e.key === 'Escape') {
        closeLightbox();
    }
    
    // Navigate carousel with arrow keys
    if (e.key === 'ArrowLeft' && !document.getElementById('lightbox').classList.contains('hidden') === false) {
        previousSlide();
    }
    if (e.key === 'ArrowRight' && !document.getElementById('lightbox').classList.contains('hidden') === false) {
        nextSlide();
    }
});

// Performance Optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const handleScroll = debounce(() => {
    // Add any scroll-based functionality here
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}, 16);

window.addEventListener('scroll', handleScroll);

// Intersection Observer for performance
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('loading');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Analytics and Tracking
function trackEvent(eventName, properties = {}) {
    console.log('Event tracked:', eventName, properties);
    
    // Send to backend
    fetch('/api/track-interaction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            session_id: sessionId,
            type: eventName,
            section: properties.section || 'unknown',
            data: properties
        })
    }).catch(error => {
        console.error('Error tracking event:', error);
    });
}

// Visual view tracking
function trackVisualView(visualId, visualName) {
    fetch('/api/track-visual-view', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            session_id: sessionId,
            visual_id: visualId,
            visual_name: visualName
        })
    }).catch(error => {
        console.error('Error tracking visual view:', error);
    });
}

// Contact Form Handling
function handleContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company'),
        message: formData.get('message'),
        interest_level: formData.get('interest_level')
    };
    
    fetch('/api/submit-contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 'success') {
            alert('¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.');
            event.target.reset();
            trackEvent('contact_form_submitted', { section: 'contact' });
        } else {
            alert('Error al enviar el formulario. Por favor, inténtalo de nuevo.');
        }
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        alert('Error al enviar el formulario. Por favor, inténtalo de nuevo.');
    });
}

// Accessibility Enhancements
function initializeAccessibility() {
    // Add ARIA labels and keyboard navigation
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });
    
    // Focus management for modals
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                // Implement focus trapping if needed
            }
        });
    }
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initializeAccessibility);

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error occurred:', e.error);
    // Implement error reporting if needed
});

// Service Worker Registration (for PWA features if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Export functions for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        scrollToSection,
        nextSlide,
        previousSlide,
        goToSlide,
        switchTab,
        openLightbox,
        closeLightbox
    };
}
// === FUNCIÓN FINAL Y DEFINITIVA PARA LA SECUENCIA DE INTRODUCCIÓN ===
function initializeIntroSequence() {
    return new Promise(resolve => {
        const preloader = document.getElementById('preloader');
        const introContainer = document.getElementById('intro-sequence');
        const mainContent = document.getElementById('main-content');

        if (!preloader || !introContainer || !mainContent) {
            if(preloader) preloader.style.display = 'none';
            if(mainContent) mainContent.style.opacity = '1';
            resolve();
            return;
        }

        document.body.style.overflow = 'hidden';

        // --- CREACIÓN DE ELEMENTOS TEMPORALES PARA LA INTRO ---
        const introLogo = document.createElement('img');
        introLogo.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/1024px-Volkswagen_logo_2019.svg.png";
        introLogo.className = "intro-element w-20 h-20 filter brightness-0 invert mx-auto";

        const introTitle1 = document.createElement('h1');
        introTitle1.innerHTML = `<span class="text-cyber-text">LA NUEVA</span>`;
        introTitle1.className = "intro-element font-montserrat font-black text-4xl md:text-7xl lg:text-8xl";

        const introTitle2 = document.createElement('h1');
        introTitle2.innerHTML = `<span class="electric-text-intro">ERA ELÉCTRICA</span>`;
        introTitle2.className = "intro-element font-montserrat font-black text-4xl md:text-7xl lg:text-8xl";

        let currentElement = null;

        // --- COREOGRAFÍA DE LA ANIMACIÓN ---
        setTimeout(() => {
            currentElement = introLogo;
            introContainer.appendChild(currentElement);
            requestAnimationFrame(() => currentElement.classList.add('visible'));
        }, 500); // 1. APARECE EL LOGO

        setTimeout(() => {
            currentElement.classList.remove('visible');
            currentElement.addEventListener('transitionend', () => {
                currentElement.remove();
                currentElement = introTitle1;
                introContainer.appendChild(currentElement);
                requestAnimationFrame(() => currentElement.classList.add('visible'));
            }, { once: true });
        }, 2000); // 2. SE VA LOGO, APARECE "LA NUEVA"

        setTimeout(() => {
            currentElement.classList.remove('visible');
            currentElement.addEventListener('transitionend', () => {
                currentElement.remove();
                currentElement = introTitle2;
                introContainer.appendChild(currentElement);
                requestAnimationFrame(() => {
                    currentElement.classList.add('visible');
                    currentElement.querySelector('span').classList.add('animate-ray');
                });
            }, { once: true });
        }, 3500); // 3. SE VA "LA NUEVA", APARECE "ERA ELÉCTRICA" CON RAYO

        setTimeout(() => {
            preloader.style.transition = 'opacity 1s ease-out';
            preloader.style.opacity = '0';

            mainContent.style.transition = 'opacity 1s ease-in 0.5s';
            mainContent.style.opacity = '1';

            document.body.style.overflow = 'auto';
            setTimeout(() => {
                preloader.remove();
                resolve();
            }, 1500);
        }, 5500); // 4. FUNDIDO FINAL
    });
}
