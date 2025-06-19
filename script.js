// Main JavaScript file for VW ID.4 Campaign Website

// Global Variables
let currentSlide = 0;
const totalSlides = 3;
let isScrolling = false;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeFeatherIcons();
    initializeScrollAnimations();
    initializeMobileMenu();
    initializeCarousel();
    initializeTabs();
    initializeSmoothScrolling();
    createParticles();
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

// Utility function for smooth scrolling to sections
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
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
        // Create content based on visual index
        const visualData = getVisualData(visualIndex);
        
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

// Particle Animation System
function createParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) return;

    // Create floating particles
    for (let i = 0; i < 20; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: var(--cyber-primary);
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        opacity: 0.6;
        animation: float ${duration}s ease-in-out infinite;
        animation-delay: ${delay}s;
        pointer-events: none;
    `;
    
    container.appendChild(particle);
    
    // Remove and recreate particle after animation cycle
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            createParticle(container);
        }
    }, (duration + delay) * 1000);
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

// Analytics and Tracking (placeholder)
function trackEvent(eventName, properties = {}) {
    console.log('Event tracked:', eventName, properties);
    // Implement actual analytics tracking here
}

// Contact Form Handling (if added later)
function handleContactForm(event) {
    event.preventDefault();
    // Implement form submission logic
    trackEvent('contact_form_submitted');
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
