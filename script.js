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
                // Si el elemento está entrando en la pantalla, añadimos la clase para animarlo
                entry.target.classList.add('visible');
            } else {
                // Si el elemento está saliendo de la pantalla, quitamos la clase para "resetearlo"
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
        observer.observe(el);
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

function switchTab(tabId, button) {
  // Quitar estilos de todos los botones
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active', 'bg-cyber-primary', 'text-cyber-dark', 'border-cyber-primary');
    btn.classList.add('border-cyber-text-secondary/50', 'text-cyber-text-secondary');
  });

  // Ocultar todos los contenidos
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.add('hidden');
  });

  // Mostrar el contenido activo
  const activeContent = document.getElementById(tabId);
  if (activeContent) {
    activeContent.classList.remove('hidden');
  }

  // Estilos del botón activo
  if (button) {
    button.classList.add('active', 'bg-cyber-primary', 'text-cyber-dark', 'border-cyber-primary');
    button.classList.remove('border-cyber-text-secondary/50', 'text-cyber-text-secondary');
  }
}


function showTab(tabId) {
  const defaultButton = document.querySelector(`button[onclick*="${tabId}"]`);
  switchTab(tabId, defaultButton);
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
    <div class="grid lg:grid-cols-2 gap-12 items-center">

      <!-- Columna Izquierda -->
      <div>
        <h3 class="font-orbitron font-bold text-2xl mb-2 ${visualData.titleColor}">${visualData.title}</h3>
        <p class="text-cyber-text-secondary mb-4">${visualData.description}</p>
       <div class="rounded-xl overflow-hidden border ${visualData.border} transition duration-300 transform hover:scale-105 hover:shadow-[0_0_40px_rgba(0,255,255,0.3)]">
  <img src="${visualData.filename}" alt="${visualData.title}" class="w-full h-full object-cover rounded-xl" />
</div>


      </div>

      <!-- Columna Derecha -->
      <div class="flex flex-col justify-center gap-8 self-center w-full">

        <!-- Prompt Utilizado -->
        <div class="bg-cyber-dark/60 p-6 rounded-xl border border-cyber-primary/30 shadow-md">
          <h4 class="font-orbitron font-medium text-cyber-primary mb-3 text-lg flex items-center gap-2">
            <i data-feather="terminal" class="w-5 h-5"></i> Prompt Utilizado:
          </h4>
          <div class="bg-cyber-dark/80 border border-cyber-primary/10 p-5 pl-4 pr-4 rounded-md max-h-[220px] overflow-y-auto text-cyber-text-secondary text-sm font-mono whitespace-pre-line">
            ${visualData.prompt}
          </div>
        </div>

        <!-- Especificaciones Técnicas -->
        <div class="bg-cyber-dark/60 p-6 rounded-xl border border-cyber-secondary/30 shadow-md">
          <h4 class="font-orbitron font-medium text-cyber-secondary mb-3 text-lg flex items-center gap-2">
            <i data-feather="settings" class="w-5 h-5"></i> Especificaciones Técnicas:
          </h4>
          <ul class="text-cyber-text-secondary text-sm space-y-2 pl-1">
            <li class="flex items-center gap-2"><i data-feather="monitor" class="w-4 h-4"></i> Resolución: <span class="font-medium">HD (1248x832)</span></li>
            <li class="flex items-center gap-2"><i data-feather="image" class="w-4 h-4"></i> Formato: <span class="font-medium">PNG</span></li>
            <li class="flex items-center gap-2"><i data-feather="activity" class="w-4 h-4"></i> Estilo: <span class="font-medium">Fotografía conceptual cinematográfica</span></li>
            <li class="flex items-center gap-2"><i data-feather="tool" class="w-4 h-4"></i> Herramienta: <span class="font-medium">${visualData.tool}</span></li>
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
            title: "Frente Lumínico del Futuro",
            filename: "assets/Key7.png",
            description: "Una composición perfectamente simétrica que destaca el frente del ID.4 con una firma luminosa elegante.",
            prompt: "Vista frontal simétrica de un Volkswagen ID.4 en un entorno de estudio oscuro y minimalista. Los faros Matrix LED muestran un patrón animado de luz azul que emana desde el interior hacia afuera. Una barra de luz conecta ambos faros, iluminada en blanco brillante, junto al logo blanco VW iluminado en el centro de la parrilla. El vehículo está sobre una superficie reflectante que genera un espejo perfecto del frente iluminado. Fotografía automotriz de alto contraste con iluminación de estudio y superficies reflectantes, capturada en resolución 4K con simetría perfecta y composición frontal.",
            tool: "Reve",
            gradient: "from-cyber-primary/20 to-cyber-secondary/20",
            border: "border-cyber-primary/30",
            iconColor: "text-cyber-primary",
            titleColor: "text-cyber-primary"
        },
        {
            title: "Precisión en Movimiento",
            filename: "assets/Key8.png",
            description: "Una toma macro que congela el instante exacto en el que la rueda gira, combinando velocidad, detalle y energía visual.",
            prompt: "Fotografía macro extrema de una rueda de aleación del Volkswagen ID.4 girando, con gotas de agua iluminadas por neón que se curvan detrás. El disco de freno se asoma por la llanta con un resplandor azul tenue. De fondo, luces urbanas nocturnas desenfocadas generan un efecto bokeh con círculos de colores. La imagen captura en detalle tanto el giro de la rueda como las gotas en suspensión. Fotografía macro de alta velocidad con exposición de congelamiento de movimiento y poca profundidad de campo sobre fondo oscuro.",
            tool: "Reve",
            gradient: "from-cyber-secondary/20 to-cyber-accent/20",
            border: "border-cyber-secondary/30",
            iconColor: "text-cyber-secondary",
            titleColor: "text-cyber-secondary"
        },
        {
            title: "Portal Energético ID.4",
            filename: "assets/Key11.png",
            description: "Una visión cinematográfica del ID.4 emergiendo de un portal bioluminiscente, donde la luz y los reflejos crean un impacto futurista.",
            prompt: "Volkswagen ID.4 blanco perla en ángulo de tres cuartos emergiendo de un portal vertical de energía. El portal está compuesto por filamentos orgánicos bioluminiscentes en tonos azul y violeta, con forma irregular tipo fisura. Actúa como fuente de luz principal, generando reflejos sobre la carrocería mojada del vehículo. Los faros LED brillan suavemente. El auto se encuentra sobre asfalto húmedo y oscuro que refleja tanto al portal como al coche. Fondo oscuro minimalista con niebla tenue que agrega atmósfera. Fotografía automotriz conceptual con iluminación cinematográfica y alto contraste.",
            tool: "Reve",
           gradient: "from-cyber-primary/20 to-cyber-secondary/20",
            border: "border-cyber-primary/30",
            iconColor: "text-cyber-primary",
            titleColor: "text-cyber-primary"
        },
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

const imageData = [
  {
    src: 'assets/images/visuals/Key1.png',
    prompt: 'A nighttime urban scene features a Volkswagen ID.4 electric vehicle positioned in the center of a rain-soaked street. Neon signs from surrounding buildings cast colorful reflections on the wet pavement, creating a mirror-like effect beneath the car. Individual raindrops catch the glow of the neon lights, streaking down in front of the car s metallic surface. White text reading "Feel the Shift" appears in a clean, minimal font in the upper portion of the vertical frame. The vehicle s sleek exterior and LED headlights are illuminated by the ambient city lighting. Vertical format photography with cinematic lighting emphasizes nighttime urban atmosphere through high contrast and reflective surfaces.',
  },
  {
    src: 'assets/images/visuals/Key2.png',
    prompt: 'A cinematic nature documentary title card features a sweeping view of a massive glacier in Iceland beneath a dramatic sky filled with streaking clouds. The composition is dominated by the jagged white and blue ice formations stretching to the horizon. In the center of the frame, text elements reading "Presentado por" appear in clean white letters. Below this text, the white Volkswagen logo is prominently displayed. At the bottom of the frame, smaller white text reads "Volkswagen. Feel the shift." All text elements contrast sharply against the natural backdrop, maintaining readability while preserving the majestic scale of the landscape. Ultra high-definition cinematography with dramatic wide-angle framing and natural lighting captures crisp details across the entire frame.',
  },
  {
    src: 'assets/images/visuals/Key5.png',
    prompt: 'A Formula 1 racing car speeds through a tight curve on a nighttime race track, creating a bright light trail behind it. The car is photographed from a low, dynamic angle that emphasizes its speed and motion. Along the edge of the track, a large LED digital billboard displays a luminous advertisement for the Volkswagen ID.4 electric vehicle. The billboard shows a neon-lit slow-motion shot of water splashing around the ID.4 s wheel, with the Volkswagen logo prominently displayed. Text on the billboard reads Volkswagen: La nueva era eléctrica. The scene is reminiscent of night races like Singapore or Las Vegas, with artificial lighting illuminating the track and advertising elements. Low-angle sports photography at night with motion blur effects and artificial track lighting.',
  },
  {
    src: 'assets/images/visuals/Key3.png',
    prompt: 'A wide shot of a tech conference keynote stage shows a CEO speaking in front of a massive LED screen. The screen dominates the stage, displaying a white Volkswagen ID.4 electric vehicle emerging from a glowing portal rendered in purple and blue light effects. Below the vehicle, white text reads "La nueva era eléctrica" in a clear, sans-serif font. The stage features modern minimalist design with sleek black flooring, while the audience appears as silhouettes in the dimmed foreground. Professional event photography with dramatic stage lighting and high resolution capture of LED display elements against dark surroundings.',
  },
  {
    src: 'assets/images/visuals/Key4.png',
    prompt: 'A cinematic title card displays Volkswagen branding against a dramatic Patagonian landscape. A pristine mountain range rises behind a crystal-clear lake, bathed in golden sunrise light. Centered in the frame, white text reads "Presentado por" in a clean, modern font. Below this text, the white Volkswagen logo appears, followed by white text at the bottom of the frame reading "Volkswagen ID.4. Feel the shift." The lake surface reflects the mountains and sky, creating a mirror-like effect. The composition maintains visual hierarchy with the landscape serving as a backdrop to the centered text elements. Ultra high-resolution cinematography with dramatic natural lighting and shallow depth of field separating foreground text from background elements.',
  },
 {
    src: 'assets/images/visuals/Key6.png',
    prompt: 'A sports bar interior with modern decor features multiple television screens mounted on dark wood-paneled walls. The central, largest screen displays an advertisement showing a VW ID.4 s wheel splashing neon-colored water in slow motion, with text elements reading Nuevo Volkswagen ID.4 and Feel the shit beneath the video. The surrounding screens show a goal replay. Patrons stand throughout the space, embracing and celebrating with raised arms. The bar area includes wooden tables, chairs, and ambient lighting fixtures illuminating the energetic crowd. Professional interior photography with balanced exposure capturing both bright screens and dimly lit bar environment.',
  }
  ,
 {
    src: 'assets/images/visuals/Key9.png',
    prompt: 'A first-person point-of-view photograph from the driver s seat of a Volkswagen ID.4 electric vehicle captures the interior dashboard view. A pair of hands rest on a futuristic steering wheel, while the minimalist dashboard features the ID. Light - an intelligent light bar at the base of the windshield emitting soft blue pulses of light. Above the dashboard, subtle holographic navigation elements consisting of lines and arrows float in mid-air. Through the windshield, a futuristic tunnel stretches ahead with illuminated arches creating a light tunnel effect as they appear to pass by at high speed. The interior features a clean, technological design with smooth surfaces and ambient lighting. First-person perspective automotive photography with sharp focus on dashboard elements and long exposure effects for exterior lighting.',
  }
   ,
 {
    src: 'assets/images/visuals/Key10.png',
    prompt: 'A white Volkswagen ID.4 electric vehicle stands parked in the center of a forest clearing at night. The car s headlights illuminate the surrounding area with a soft glow. Ancient tree trunks and sprawling roots across the ground feature glowing bioluminescent veins in blue and purple tones that match the car s illumination. Luminescent moss covers rocks and soil, emitting a gentle radiance. Low, ethereal mist hovers in the air, creating light halos around the trees and vehicle. The scene is illuminated solely by the bioluminescent glow of the forest and the car s headlights. Professional automotive photography with long exposure and atmospheric lighting to capture bioluminescent effects in a nighttime forest setting.',
  }
   ,
 {
    src: 'assets/images/visuals/Key12.png',
    prompt: 'A metallic silver Volkswagen ID.4 electric vehicle is centered in a futuristic subway tunnel, illuminated by bright neon light strips running along curved concrete walls. The tunnel floor features a glossy surface reflecting the vehicle and neon lighting. The text Explorá el futuro, hoy appears in white sans-serif font in the lower third of the image. The tunnel curves gently to the right, creating leading lines that draw attention to the vehicle. The lighting creates a high-contrast environment with deep shadows and bright highlights on the car s surface. Wide-format commercial photography with dramatic artificial lighting and strong directional lines captured at eye level.',
  }
];



function openAllVisualsModal() {
  const modal = document.getElementById("allVisualsModal");
  const grid = document.getElementById("galleryGrid");
  grid.innerHTML = "";

  imageData.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "rounded-xl overflow-hidden shadow-xl border border-cyber-primary bg-cyber-dark transition-all duration-300 hover:scale-105";

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = `Visual ${index + 1}`;
    img.className = "w-full h-auto aspect-video object-cover cursor-pointer";
    img.onclick = () => openZoom(item.src);

    const btn = document.createElement("button");
    btn.className = "view-prompt-btn w-full py-2 px-4 bg-cyber-primary hover:bg-cyber-secondary text-white text-sm font-semibold tracking-wide transition-all flex items-center justify-center gap-2";
    btn.innerHTML = `<i data-feather="eye"></i> Ver Prompt`;
    btn.onclick = (e) => {
      e.stopPropagation();
      showPromptModal(item.prompt);
    };

    card.appendChild(img);
    card.appendChild(btn);
    grid.appendChild(card);
  });

  modal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
  feather.replace();
}

function closeAllVisualsModal() {
  document.getElementById("allVisualsModal").classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

function showPromptModal(promptText) {
  const modal = document.getElementById("promptModal");
  document.getElementById("promptText").textContent = promptText;
  modal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

function closePromptModal() {
  document.getElementById("promptModal").classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

function openZoom(src) {
  const modal = document.getElementById("zoomModal");
  const img = document.getElementById("zoomedImage");
  img.src = src;
  modal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

function closeZoom() {
  document.getElementById("zoomModal").classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

window.addEventListener("click", (e) => {
  if (e.target.id === "zoomModal") closeZoom();
  if (e.target.id === "promptModal") closePromptModal();
});

function switchTab(tabId, clickedButton) {
  // Ocultar todos los contenidos
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.add('hidden');
    content.classList.remove('active');
  });

  // Mostrar el tab correspondiente
  const selectedTab = document.getElementById(tabId);
  if (selectedTab) {
    selectedTab.classList.remove('hidden');
    selectedTab.classList.add('active');
  }

  // Remover clase active de todos los botones
  document.querySelectorAll('.tab-button').forEach(button => {
    button.classList.remove('active');
    button.classList.remove('text-white');
    button.classList.remove('bg-cyber-primary');
    button.classList.add('text-cyber-text-secondary');
    button.classList.add('bg-transparent');
  });

  let urbanIndex = 0;

function slideUrban(direction) {
  const slider = document.getElementById('urbanSlider');
  const slides = slider.children.length;
  urbanIndex = (urbanIndex + direction + slides) % slides;
  slider.style.transform = `translateX(-${urbanIndex * 100}%)`;
}

  // Activar el botón actual
  if (clickedButton) {
    clickedButton.classList.add('active');
    clickedButton.classList.remove('text-cyber-text-secondary');
    clickedButton.classList.remove('bg-transparent');
    clickedButton.classList.add('text-white');
    clickedButton.classList.add('bg-cyber-primary');
  }
}
// Urban Gallery Lightbox
function openUrbanLightbox(src) {
  const modal = document.getElementById("urbanLightbox");
  const image = document.getElementById("urbanLightboxImage");
  image.src = src;
  modal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

function closeUrbanLightbox() {
  document.getElementById("urbanLightbox").classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

let urbanIndex = 0;

const urbanPrompts = [
  // URBA 1
  "Fotografía nocturna en Times Square con múltiples pantallas digitales sincronizadas. En el centro, un Volkswagen ID.4 blanco junto a un gran QR y el texto Escanea para iniciar tu viaje. Feel the shift. Los carteles reflejan la misma imagen creando una experiencia unificada. Exposición HDR con luces brillantes y detalles de sombras.",

  // URBA 2
  "Vista interior de una sala IMAX oscura con el ID.4 en pantalla sobre fondo azul y violeta. Paneles LED en las paredes laterales proyectan la misma luz sobre el público. Ambiente premium, exposición de bajo contraste y composición amplia para resaltar la inmersión total.",

  // URBA 3
  "Interior de aeropuerto con un tablero gigante de salidas mostrando un ID.4 en ruta de montaña. En vez de vuelos, se ven destinos como Mendoza y Córdoba con distancias. Texto: Tu próximo destino. Cero emisiones. Fotografía arquitectónica en alta resolución y ángulo amplio.",

  // URBA 4
  "Perspectiva en primera persona desde el interior de un auto futurista, con parabrisas curvo y HUD azul. Calles mojadas con neón reflejado. Un cartel digital muestra un ID.4 en una colina al atardecer y el texto La nueva era eléctrica. Lluvia sobre el vidrio añade realismo. Estética cyberpunk HDR.",

  // URBA 5
  "Estación de subte moderna con tren tipo bala detenido. En la pared, pantallas LED muestran al ID.4 saliendo de un portal azul con patrones cibernéticos. Alineación perfecta entre tren real y auto digital. Diseño limpio y luz balanceada. Fotografía arquitectónica amplia.",

  // URBA 6
  "Escena nocturna estilo videojuego con auto deportivo detenido. Un billboard gigante muestra al ID.4 en un bosque encantado con plantas bioluminiscentes. El texto: La nueva era eléctrica. El asfalto mojado refleja luces de neón. Render 8K con iluminación hiperrealista y detalle extremo.",

  // URBA 7
  "Fotografía callejera nocturna tipo Shinjuku con billboard 3D envolvente. El ID.4 parece salir de la pantalla con efecto anamórfico hiperrealista y salpicaduras digitales azules. El entorno está lleno de neón, calles mojadas y edificios iluminados. Contraste alto y enfoque preciso.",

  // URBA 8
  "Escena de transmisión HD en los Grammy. Un músico en podio bajo luces doradas. En pantalla, banner negro transparente con el texto Volkswagen ID.4. La nueva era eléctrica y logo VW. Diseño limpio sobre imagen en vivo. Fotografía de estudio con superposiciones gráficas sutiles.",
   // PROMPT VIDEO URBA 1 (NUEVO)
  "Video 4K de una estación de subte futurista y limpia. Un tren moderno llega a la estación. Mientras se mueve, las pantallas digitales de la plataforma se sincronizan con su velocidad, mostrando un video del VW ID.4 blanco conduciendo en paralelo al tren, como si compitieran. El efecto es fluido y sorprendente.",
  // PROMPT VIDEO URBA 2 (NUEVO)
  "Video 4K fotorrealista de una intersección urbana futurista de noche, estilo Tokio. Un masivo billboard 3D anamórfico envuelve la esquina de un rascacielos. Un VW ID.4 blanco parece salir de la pantalla hacia el espectador, rompiendo los límites físicos y salpicando agua digital brillante. El efecto 3D es impactante."
];

document.addEventListener("DOMContentLoaded", () => {
  initializeTabs();
});


let currentUrbanPrompt = urbanPrompts[0]; // default

function slideUrban(direction) {
  const slider = document.getElementById("urbanSlider");
  const slides = slider.children.length;
  urbanIndex = (urbanIndex + direction + slides) % slides;
  slider.style.transform = `translateX(-${urbanIndex * 100}%)`;

  currentUrbanPrompt = urbanPrompts[urbanIndex];
}

function openUrbanLightbox(index) {
  urbanIndex = index;
  currentUrbanPrompt = urbanPrompts[index];

  const src = document.querySelectorAll("#urbanSlider img")[index].src;
  const modal = document.getElementById("urbanLightbox");
  const image = document.getElementById("urbanLightboxImage");
  image.src = src;
  modal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

// ===================================================================
// === LÓGICA PARA LA GALERÍA Y PROMPTS DE "REDES SOCIALES" ===
// ===================================================================

let socialIndex = 0;

const socialPrompts = [

  // Prompt para IG1
  "Publicidad cinemática vertical de un Volkswagen ID.4 en una calle urbana oscura de noche. Gotas de lluvia sobre la superficie metálica y reflejos de neón en el pavimento mojado. El texto 'Feel the Shift' en fuente sans-serif blanca en la parte superior. Fotografía nocturna dramática con iluminación artificial y superficies reflectantes.",
  
  // Prompt para IG2
  "Un Volkswagen ID.4 en el centro de un billboard digital sobre un rascacielos de vidrio oscuro. Haces de luz blanca irradian desde detrás del auto sobre un paisaje urbano nocturno. Textos en blanco '100% Eléctrico' y '100% Volkswagen'. Fotografía digital de alto contraste con retroiluminación dramática.",

  // Prompt para IG3
  "Fotografía vertical de una mujer mirando un VW ID.4 blanco en una calle lluviosa de noche. La superficie del auto refleja luces de neón. El texto 'Sentí el cambio' en fuente Montserrat está en el centro, con un pequeño logo de VW debajo. Fotografía urbana nocturna con larga exposición para capturar estelas de luz.",

  // Prompt para IG4
  "Un Volkswagen ID.4 blanco conduce en una carretera nocturna contra un fondo negro sólido. Sus faros LED iluminan el camino. En la parte inferior, el texto 'Autonomía de hasta 550 km' y un pequeño logo de VW. Fotografía automotriz profesional con iluminación dramática y contraste marcado.",

  // Prompt para IG5
  "Historia de Instagram mostrando un VW ID.4 sobre una plataforma giratoria con fondo oscuro e iluminación violeta y azul eléctrico. El cuerpo metálico del auto refleja la luz. El texto 'Llegó el futuro eléctrico' está integrado dentro del auto, visible a través del parabrisas. Composición vertical 9:16.",
 // PROMPT VIDEO REEL 1 (NUEVO)
  "Video 4K vertical, estilo realista grabado con celular desde adentro de un VW ID.4. La puerta está abierta y se oye el ruido caótico de una ciudad. La persona dice: Escuchás este quilombo no? Chequeá esto. Luego cierra la puerta y se produce un silencio absoluto. La voz concluye: ...Listo. Mi paz.",
  // PROMPT VIDEO REEL 2 (NUEVO)
  "Video vertical dinámico con cortes rápidos. Una persona muestra el maletero abierto de un VW ID.4 y dice: Todos dicen que a los eléctricos no les entra nada... a ver... Luego, en un montaje rápido, guarda dos valijas grandes, una mochila y una tabla de surf. Cierra el maletero con una sonrisa satisfecha.",
  // PROMPT VIDEO REEL 3 (NUEVO)
  "Video cinemático 4K con efecto de rampa de velocidad. El VW ID.4 avanza a velocidad normal por una calle mojada de noche. Justo al golpear un charco, la acción pasa a cámara súper lenta, mostrando con increíble detalle las gotas de agua brillando con luz de neón azul y púrpura. Luego, el video vuelve a velocidad normal mientras el auto se aleja."
];

// ===================================================================
// ===     LÓGICA PARA LA NUEVA GALERÍA DE VIDEOS TRANSMEDIA     ===
// ===================================================================

let videoGalleryIndex = 0;

const videoGalleryPrompts = [
  // Prompt para VideoUrba1 (Metro)
  "Video 4K de una estación de subte futurista y limpia. Un tren moderno llega a la estación. Mientras se mueve, las pantallas digitales de la plataforma se sincronizan con su velocidad, mostrando un video del VW ID.4 blanco conduciendo en paralelo al tren, como si compitieran. El efecto es fluido y sorprendente.",
  
  // Prompt para VideoUrba2 (Billboard 3D)
  "Video 4K fotorrealista de una intersección urbana futurista de noche, estilo Tokio. Un masivo billboard 3D anamórfico envuelve la esquina de un rascacielos. Un VW ID.4 blanco parece salir de la pantalla hacia el espectador, rompiendo los límites físicos y salpicando agua digital brillante. El efecto 3D es impactante.",

  // Prompt para VideoReel1 (Silencio)
  "Video 4K vertical, estilo realista grabado con celular desde adentro de un VW ID.4. La puerta está abierta y se oye el ruido caótico de una ciudad. La persona dice: Escuchás este quilombo no? Chequeá esto. Luego cierra la puerta y se produce un silencio absoluto. La voz concluye: ...Listo. Mi paz.",

  // Prompt para VideoReel2 (Espacio)
  "Video vertical dinámico con cortes rápidos. Una persona muestra el maletero abierto de un VW ID.4 y dice: Todos dicen que a los eléctricos no les entra nada... a ver... Luego, en un montaje rápido, guarda dos valijas grandes, una mochila y una tabla de surf. Cierra el maletero con una sonrisa satisfecha.",

  // Prompt para VideoReel3 (Rueda)
  "Video cinemático 4K con efecto de rampa de velocidad. El VW ID.4 avanza a velocidad normal por una calle mojada de noche. Justo al golpear un charco, la acción pasa a cámara súper lenta, mostrando con increíble detalle las gotas de agua brillando con luz de neón azul y púrpura. Luego, el video vuelve a velocidad normal mientras el auto se aleja."
];

// Función para controlar el nuevo slider de videos
function slideVideoGallery(n) {
  const slides = document.querySelectorAll('#videoSlider .min-w-full');
  const totalSlides = slides.length;
  
  videoGalleryIndex += n;
  
  if (videoGalleryIndex >= totalSlides) {
    videoGalleryIndex = 0;
  }
  if (videoGalleryIndex < 0) {
    videoGalleryIndex = totalSlides - 1;
  }
  
  const slider = document.getElementById('videoSlider');
  slider.style.transform = `translateX(-${videoGalleryIndex * 100}%)`;
  
  // Actualizar el prompt que mostrará el botón
  const videoPromptBtn = document.getElementById('videoPromptBtn');
  videoPromptBtn.setAttribute('onclick', `showPromptModal(videoGalleryPrompts[${videoGalleryIndex}])`);
}

// Función para el clic en los videos (opcional, por ahora muestra el prompt)
function openVideoLightbox(index) {
  showPromptModal(videoGalleryPrompts[index]);
}

// Función para controlar el slider de Redes Sociales
function slideSocial(n) {
  const slides = document.querySelectorAll('#socialSlider .min-w-full');
  const totalSlides = slides.length;
  
  socialIndex += n;
  
  if (socialIndex >= totalSlides) {
    socialIndex = 0;
  }
  if (socialIndex < 0) {
    socialIndex = totalSlides - 1;
  }
  
  const slider = document.getElementById('socialSlider');
  slider.style.transform = `translateX(-${socialIndex * 100}%)`;
  
  // Actualizar el prompt que mostrará el botón
  const socialPromptBtn = document.getElementById('socialPromptBtn');
  socialPromptBtn.setAttribute('onclick', `showPromptModal(socialPrompts[${socialIndex}])`);
}

// Función para abrir la galería de Redes Sociales (si es necesaria)
function openSocialLightbox(index) {
  // Aquí puedes implementar una lógica de lightbox para las imágenes de redes sociales si lo deseas
  // Por ahora, podemos usar el modal de prompts como ejemplo.
  showPromptModal(socialPrompts[index]);
}

function openTechModal() {
  document.getElementById("techModal").classList.remove("hidden");
}

function closeTechModal() {
  document.getElementById("techModal").classList.add("hidden");
}

const fullSpotPrompt = `
Generá un video cinemático de 30 segundos, en resolución 4K ultra realista, dividido en tres actos. A lo largo del spot se presenta el Volkswagen ID.4 blanco, acompañando el concepto de 'La Nueva Era Eléctrica'.

🔹 ESCENA 1: AMANECER TECNOLÓGICO
Una mujer delgada, de pelo castaño oscuro, desconecta el cable de carga del vehículo en una casa moderna en las afueras. La barra 'ID. Light' del interior pulsa en blanco. El ID.4 se aleja en silencio mientras los rayos del sol iluminan la escena con tonalidades cálidas y suaves.

🔹 ESCENA 2: MOVIMIENTO URBANO + LIBERTAD COSTERA
Corte a una ciudad moderna. El ID.4 se desplaza con agilidad entre edificios de cristal con reflejos brillantes. Luego, cambia a una carretera al borde del mar al atardecer. La luz dorada baña la escena, los faros del vehículo están encendidos.

🔹 ESCENA 3: SILENCIO NOCTURNO NATURAL
Plano cerrado de los faros LED cortando la oscuridad. El ID.4 recorre una carretera vacía. Llega a una cabaña aislada en un acantilado. La cámara se aleja lentamente mostrando el auto frente al mar y un cielo completamente estrellado.

🎨 ESTILO VISUAL:
Estética cyber-organic. Contraste emocional entre ciudad y naturaleza. Atmósfera limpia, lenta y cinematográfica. Movimientos de cámara suaves, luz ambiental realista, silencio emocional.

🎥 TECNOLOGÍA:
Video generado con VEO 3, voz en off sintetizada con ElevenLabs. Todo el spot fue concebido para transmitir un viaje emocional impulsado por energía limpia.
`;

const fullTvPrompt = `
🔹 ESCENA 1: AMANECER TECNOLÓGICO
Dramatic cinematic ad intro for the Volkswagen ID.4. The scene opens with a black background and a flash of blue light revealing the front LED signature. Quick, slow-motion close-up of the Volkswagen logo on the front grille. Fast cinematic cut to a side profile of the car, headlights glowing through smoke. Lens flares, soft camera motion, and ambient showroom lighting. Futuristic environment, minimal and elegant.

🔹 ESCENA 2: PLATAFORMA + MOVIMIENTO
Cinematic commercial presentation of the Volkswagen ID.4 on a glossy black rotating platform in a dark futuristic showroom. Soft white spotlights highlight the smooth curves and LED lights of the vehicle. Camera moves slowly across the front, then glides along the sides, showing the aerodynamic design and high-end wheels. Subtle lens flares, realistic reflections. Final frame focuses on the logo on the front grill.

🔹 ESCENA 3: INTERIOR + LOGO FINAL
Cinematic interior reveal of the Volkswagen ID.4. Smooth dolly camera movement shows the dashboard lighting up, digital cockpit, steering wheel with ambient lighting. Close-up on screen and electric drive controls. Slow fade-out to black screen with the Volkswagen logo glowing softly in the center. Subtle reflections, realistic textures.

🎥 ESTILO VISUAL
No subtitles. No on-screen text. Focus on cinematic realism and elegant lighting transitions.
`;
