/**
 * Main JavaScript file for KBN Financial Boutique
 * Handles navigation, scroll effects, testimonials slider, and general functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initNavigation();
    initScrollEffects();
    initTestimonialSlider();
    initScrollReveal();
    initSmoothScrollAnimations();
    initImagePlaceholders();
    initForms();
    initModals();
    initTooltips();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.querySelector('.header');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });

    // Sticky header on scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

/**
 * Scroll effects and animations
 */
function initScrollEffects() {
    // Throttle scroll events for better performance
    let ticking = false;
    
    function updateScrollEffects() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroHeight = hero.offsetHeight;
            const parallaxSpeed = 0.5;
            
            if (scrollTop < heroHeight) {
                hero.style.transform = `translateY(${scrollTop * parallaxSpeed}px)`;
            }
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

/**
 * Testimonials slider functionality
 */
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    if (testimonials.length === 0) return;

    function showSlide(index) {
        // Hide all testimonials
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            if (dots[i]) dots[i].classList.remove('active');
        });

        // Show current testimonial
        if (testimonials[index]) {
            testimonials[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
        }
        
        currentSlide = index;
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % testimonials.length;
        showSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentSlide - 1 + testimonials.length) % testimonials.length;
        showSlide(prevIndex);
    }

    // Auto-advance slides
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            stopSlideshow();
            startSlideshow(); // Restart auto-advance
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopSlideshow();
            startSlideshow();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopSlideshow();
            startSlideshow();
        }
    });

    // Touch/swipe navigation
    let startX = 0;
    let endX = 0;
    
    const slider = document.querySelector('.testimonials__slider');
    if (slider) {
        slider.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });

        slider.addEventListener('touchmove', function(e) {
            endX = e.touches[0].clientX;
        });

        slider.addEventListener('touchend', function() {
            const threshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                stopSlideshow();
                startSlideshow();
            }
        });
    }

    // Pause on hover
    const testimonialsSection = document.querySelector('.testimonials');
    if (testimonialsSection) {
        testimonialsSection.addEventListener('mouseenter', stopSlideshow);
        testimonialsSection.addEventListener('mouseleave', startSlideshow);
    }

    // Initialize
    showSlide(0);
    startSlideshow();
}

/**
 * Scroll reveal animations
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
    
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver(
        function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    revealElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Form functionality
 */
function initForms() {
    // Form validation
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(form)) {
                e.preventDefault();
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(input);
            });
        });
    });

    // Rate limiting for form submissions
    const submitButtons = document.querySelectorAll('button[type="submit"]');
    submitButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (button.classList.contains('loading')) {
                e.preventDefault();
                return;
            }
            
            button.classList.add('loading');
            setTimeout(() => {
                button.classList.remove('loading');
            }, 2000);
        });
    });
}

/**
 * Form validation
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';

    // Clear previous errors
    clearFieldError(field);

    // Required field check
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    // Email validation
    else if (type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    }
    // Phone validation
    else if (type === 'tel' && value && !isValidPhone(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    }
    // Password validation
    else if (type === 'password' && value && value.length < 8) {
        isValid = false;
        errorMessage = 'Password must be at least 8 characters long';
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.form-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Modal functionality
 */
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modalCloses = document.querySelectorAll('.modal__close');

    // Open modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = trigger.dataset.modal;
            const modal = document.getElementById(modalId);
            if (modal) {
                openModal(modal);
            }
        });
    });

    // Close modal
    modalCloses.forEach(close => {
        close.addEventListener('click', function() {
            const modal = close.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    // Close modal on backdrop click
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
}

function openModal(modal) {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    
    // Focus first focusable element
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
        firstFocusable.focus();
    }
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

/**
 * Tooltip functionality
 */
function initTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    
    tooltipTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', function() {
            showTooltip(trigger);
        });
        
        trigger.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

function showTooltip(element) {
    const text = element.dataset.tooltip;
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    setTimeout(() => {
        tooltip.classList.add('active');
    }, 10);
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

/**
 * Utility functions
 */

// Debounce function
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

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('active');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Local storage helpers
function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }
}

function getLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.warn('Could not read from localStorage:', e);
        return null;
    }
}

/**
 * Enhanced smooth scroll animations
 */
function initSmoothScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animation for child elements
                const children = entry.target.querySelectorAll('.service-card, .blog-card');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 150);
                });
            }
        });
    }, observerOptions);

    // Observe sections for animation
    document.querySelectorAll('section:not(.hero)').forEach(section => {
        observer.observe(section);
    });

    // Initialize cards animation
    document.querySelectorAll('.service-card, .blog-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
    });

    // Enhanced hover effects
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(8, 38, 77, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
}

/**
 * Image placeholder handling
 */
function initImagePlaceholders() {
    // Add a small delay to ensure SVG files load properly
    setTimeout(() => {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Skip SVG files and let them load naturally
            if (img.src.includes('.svg')) {
                img.style.opacity = '1';
                return;
            }
            
            // Set initial styles for non-SVG images
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            
            // Handle successful image load
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
            
            // Handle image loading errors for non-SVG files only
            img.addEventListener('error', function() {
                if (!this.src.includes('.svg') && !this.src.startsWith('data:')) {
                    console.log('Image failed to load:', this.src);
                    createImagePlaceholder(this);
                }
            });
            
            // If image is already loaded (cached), show it
            if (img.complete && img.naturalWidth > 0) {
                img.style.opacity = '1';
            }
        });
    }, 100); // Small delay to ensure DOM is ready
}

function createImagePlaceholder(img) {
    const width = img.width || 400;
    const height = img.height || 300;
    
    const placeholderSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
            <rect width="${width}" height="${height}" fill="url(#placeholderGrad)"/>
            <defs>
                <linearGradient id="placeholderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#f8f9fa"/>
                    <stop offset="100%" style="stop-color:#e9ecef"/>
                </linearGradient>
            </defs>
            <circle cx="${width/2}" cy="${height/2}" r="40" fill="rgba(8,38,77,0.1)"/>
            <g transform="translate(${width/2 - 12}, ${height/2 - 12})">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="#08264D"/>
                </svg>
            </g>
            <text x="${width/2}" y="${height/2 + 35}" font-family="Arial" font-size="12" fill="#08264D" text-anchor="middle">
                Image Loading...
            </text>
        </svg>
    `;
    
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(placeholderSvg);
    img.style.opacity = '1';
}

function createDefaultPlaceholders() {
    // Hero image
    const heroImg = document.querySelector('.hero__img');
    if (heroImg && !heroImg.src.includes('.svg')) {
        const heroSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300">
                <rect width="500" height="300" fill="url(#heroGrad)"/>
                <defs>
                    <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#08264D"/>
                        <stop offset="100%" style="stop-color:#0a2f5a"/>
                    </linearGradient>
                </defs>
                <circle cx="250" cy="150" r="60" fill="rgba(255,255,255,0.1)"/>
                <text x="250" y="160" font-family="Arial" font-size="18" fill="white" text-anchor="middle">
                    Christian Business
                </text>
                <text x="250" y="180" font-family="Arial" font-size="14" fill="rgba(255,255,255,0.8)" text-anchor="middle">
                    Professionals
                </text>
            </svg>
        `;
        heroImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(heroSvg);
    }

    // Testimonial images
    const testimonialImages = document.querySelectorAll('.testimonial-card__avatar img');
    const names = ['S.M.', 'P.E.', 'D.N.'];
    const colors = ['#4CAF50', '#2196F3', '#FF9800'];
    
    testimonialImages.forEach((img, index) => {
        if (!img.src.includes('.svg')) {
            const testimonialSvg = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
                    <rect width="60" height="60" fill="${colors[index] || '#08264D'}"/>
                    <circle cx="30" cy="22" r="8" fill="white"/>
                    <ellipse cx="30" cy="45" rx="12" ry="8" fill="white"/>
                </svg>
            `;
            img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(testimonialSvg);
        }
    });

    // REMOVED: Blog images override code to let SVG files load naturally
}

// Export functions for use in other files
window.KBN = {
    showNotification,
    openModal,
    closeModal,
    setLocalStorage,
    getLocalStorage,
    debounce,
    throttle,
    isInViewport,
    initSmoothScrollAnimations,
    initImagePlaceholders
}; 