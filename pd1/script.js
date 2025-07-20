class InteractiveNavigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileToggle = document.getElementById('mobile-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        // Throttling variables
        this.isScrolling = false;
        this.scrollThreshold = 50;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setActiveLink();
    }
    
    bindEvents() {
        // Optimized scroll event with throttling
        window.addEventListener('scroll', this.throttleScroll.bind(this), { passive: true });
        
        // Mobile menu toggle
        this.mobileToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        
        // Navigation link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });
        
        // Close mobile menu on outside click
        document.addEventListener('click', this.closeMobileMenuOutside.bind(this));
        
        // Keyboard navigation
        this.navLinks.forEach(link => {
            link.addEventListener('keydown', this.handleKeyNavigation.bind(this));
        });
        
        // Window resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    // Throttled scroll handler for performance
    throttleScroll() {
        if (!this.isScrolling) {
            window.requestAnimationFrame(() => {
                this.handleScroll();
                this.isScrolling = false;
            });
            this.isScrolling = true;
        }
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        
        // Add/remove scrolled class based on scroll position
        if (scrollY > this.scrollThreshold) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        // Update active link based on scroll position
        this.updateActiveLink();
    }
    
    toggleMobileMenu() {
        const isExpanded = this.mobileToggle.getAttribute('aria-expanded') === 'true';
        
        // Toggle ARIA attributes for accessibility
        this.mobileToggle.setAttribute('aria-expanded', !isExpanded);
        this.navMenu.setAttribute('aria-hidden', isExpanded);
        
        // Toggle visual states
        this.mobileToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
    }
    
    handleNavClick(event) {
        event.preventDefault();
        const targetId = event.target.getAttribute('href');
        
        // Close mobile menu if open
        if (this.navMenu.classList.contains('active')) {
            this.toggleMobileMenu();
        }
        
        // Smooth scroll to target
        if (targetId.startsWith('#')) {
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navHeight = this.navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
        
        // Update active state
        this.setActiveLink(event.target);
    }
    
    setActiveLink(activeLink = null) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        });
        
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.setAttribute('aria-current', 'page');
        } else {
            // Set first link as active by default
            this.navLinks[0].classList.add('active');
            this.navLinks[0].setAttribute('aria-current', 'page');
        }
    }
    
    updateActiveLink() {
        const sections = document.querySelectorAll('.content-section');
        const navHeight = this.navbar.offsetHeight;
        const scrollPosition = window.scrollY + navHeight + 100;
        
        let currentSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section;
            }
        });
        
        if (currentSection) {
            const targetId = `#${currentSection.id}`;
            const correspondingLink = document.querySelector(`a[href="${targetId}"]`);
            
            if (correspondingLink && !correspondingLink.classList.contains('active')) {
                this.setActiveLink(correspondingLink);
            }
        }
    }
    
    closeMobileMenuOutside(event) {
        if (!this.navbar.contains(event.target) && this.navMenu.classList.contains('active')) {
            this.toggleMobileMenu();
        }
    }
    
    handleKeyNavigation(event) {
        // Handle keyboard navigation
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.target.click();
        }
    }
    
    handleResize() {
        // Close mobile menu on resize to larger screen
        if (window.innerWidth > 768 && this.navMenu.classList.contains('active')) {
            this.toggleMobileMenu();
        }
    }
}

// Enhanced scroll effects class
class ScrollEffects {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.lastScrollY = window.scrollY;
        this.scrollDirection = 'down';
        
        this.initScrollEffects();
    }
    
    initScrollEffects() {
        window.addEventListener('scroll', this.handleAdvancedScroll.bind(this), { passive: true });
    }
    
    handleAdvancedScroll() {
        const currentScrollY = window.scrollY;
        this.scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';
        
        // Add additional scroll-based effects
        this.updateScrollDirection();
        this.lastScrollY = currentScrollY;
    }
    
    updateScrollDirection() {
        this.navbar.setAttribute('data-scroll-direction', this.scrollDirection);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InteractiveNavigation();
    new ScrollEffects();
});

// Additional utility functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Performance monitoring
const logPerformance = () => {
    if ('performance' in window) {
        console.log('Navigation load time:', performance.now(), 'ms');
    }
};

window.addEventListener('load', logPerformance);
