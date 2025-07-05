// Enhanced Features for KBN Financial Boutique Website
// Advanced JavaScript functionality for better user experience

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all enhanced features
    initializeScrollAnimations();
    initializeLazyLoading();
    initializeFormValidation();
    initializeInteractiveElements();
    initializeAnalytics();
    initializeAccessibility();
    initializePerformanceOptimizations();
});

// Advanced Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animation for child elements
                const children = entry.target.querySelectorAll('.animate-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for hero sections
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, 10));
}

// Lazy Loading for Images and Content
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const lazyImageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                lazyImageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        lazyImageObserver.observe(img);
    });

    // Lazy load background images
    const lazyBackgrounds = document.querySelectorAll('.lazy-background');
    const backgroundObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.style.backgroundImage = `url(${element.dataset.bg})`;
                element.classList.remove('lazy-background');
                backgroundObserver.unobserve(element);
            }
        });
    });

    lazyBackgrounds.forEach(bg => {
        backgroundObserver.observe(bg);
    });
}

// Advanced Form Validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(form)) {
                submitForm(form);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    // Remove previous error styling
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    
    // Check if field is required and empty
    if (required && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Type-specific validation
    switch (type) {
        case 'email':
            if (value && !isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
            break;
        case 'tel':
            if (value && !isValidPhone(value)) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
            break;
        case 'number':
            if (value && isNaN(value)) {
                showFieldError(field, 'Please enter a valid number');
                return false;
            }
            break;
    }
    
    // Custom validation rules
    if (field.dataset.minLength && value.length < parseInt(field.dataset.minLength)) {
        showFieldError(field, `Minimum length is ${field.dataset.minLength} characters`);
        return false;
    }
    
    if (field.dataset.maxLength && value.length > parseInt(field.dataset.maxLength)) {
        showFieldError(field, `Maximum length is ${field.dataset.maxLength} characters`);
        return false;
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showNotification('Form submitted successfully!', 'success');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Interactive Elements
function initializeInteractiveElements() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Interactive cards with hover effects
    document.querySelectorAll('.interactive-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Tooltip functionality
    initializeTooltips();
    
    // Modal functionality
    initializeModals();
    
    // Accordion functionality
    initializeAccordions();
    
    // Tabs functionality
    initializeTabs();
}

function initializeTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    
    tooltipTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.dataset.tooltip;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
            
            setTimeout(() => tooltip.classList.add('show'), 10);
        });
        
        trigger.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

function initializeModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.dataset.modal;
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.classList.add('modal-open');
            }
        });
    });
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.classList.remove('modal-open');
            });
        }
        
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
    });
}

function initializeAccordions() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        header.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all accordion items
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.accordion-content').style.maxHeight = null;
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}

function initializeTabs() {
    const tabContainers = document.querySelectorAll('.tab-container');
    
    tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('.tab-nav__button');
        const contents = container.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetId = this.dataset.tab;
                
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                this.classList.add('active');
                const targetContent = container.querySelector(`#${targetId}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    });
}

// Analytics and Tracking
function initializeAnalytics() {
    // Track page views
    trackPageView();
    
    // Track form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            const formName = this.name || this.id || 'unknown';
            trackEvent('form_submission', formName);
        });
    });
    
    // Track downloads
    document.querySelectorAll('a[download]').forEach(link => {
        link.addEventListener('click', function() {
            const fileName = this.getAttribute('download') || this.href.split('/').pop();
            trackEvent('download', fileName);
        });
    });
    
    // Track outbound links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.href.includes(window.location.hostname)) {
            link.addEventListener('click', function() {
                trackEvent('outbound_link', this.href);
            });
        }
    });
}

function trackPageView() {
    // Implementation would depend on analytics service (Google Analytics, etc.)
    console.log('Page view tracked:', window.location.pathname);
}

function trackEvent(action, label) {
    // Implementation would depend on analytics service
    console.log('Event tracked:', action, label);
}

// Accessibility Enhancements
function initializeAccessibility() {
    // Keyboard navigation for custom elements
    document.querySelectorAll('.custom-button, .card-link').forEach(element => {
        element.setAttribute('tabindex', '0');
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Focus management for modals
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
    });
    
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Performance Optimizations
function initializePerformanceOptimizations() {
    // Preload critical resources
    preloadCriticalResources();
    
    // Optimize images
    optimizeImages();
    
    // Minimize reflows and repaints
    optimizeAnimations();
    
    // Service Worker for caching (if supported)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    }
}

function preloadCriticalResources() {
    const criticalResources = [
        '/assets/css/base.css',
        '/assets/css/components.css',
        '/assets/fonts/opensans-regular.woff2'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.includes('.css') ? 'style' : 'font';
        if (resource.includes('.woff2')) {
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
    });
}

function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading="lazy" to images not already having it
        if (!img.hasAttribute('loading')) {
            img.loading = 'lazy';
        }
        
        // Add proper alt text if missing
        if (!img.alt && img.src) {
            img.alt = img.src.split('/').pop().split('.')[0].replace(/[-_]/g, ' ');
        }
    });
}

function optimizeAnimations() {
    // Use will-change property for animated elements
    document.querySelectorAll('.animate-on-scroll, .parallax-element').forEach(element => {
        element.style.willChange = 'transform';
    });
    
    // Remove will-change after animation completes
    document.addEventListener('animationend', function(e) {
        if (e.target.style.willChange) {
            e.target.style.willChange = 'auto';
        }
    });
}

// Utility Functions
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

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Dark Mode Toggle
function initializeDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            
            // Save theme preference
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark-mode');
            } else {
                localStorage.removeItem('theme');
            }
        });
    }
}

// Progressive Web App features
function initializePWA() {
    // Add to home screen prompt
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        deferredPrompt = e;
        showInstallPrompt();
    });
    
    function showInstallPrompt() {
        const installButton = document.querySelector('.install-app-button');
        if (installButton) {
            installButton.style.display = 'block';
            installButton.addEventListener('click', () => {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    }
                    deferredPrompt = null;
                });
            });
        }
    }
}

// Initialize PWA features
initializePWA();
initializeDarkMode();

// Export functions for use in other scripts
window.KBNEnhanced = {
    showNotification,
    validateField,
    trackEvent,
    throttle,
    debounce
}; 