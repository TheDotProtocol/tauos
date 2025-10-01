// ===== TAUOS INTERACTIVE SYSTEM =====

// Particle System
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }
    
    createParticles() {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(102, 126, 234, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Smooth Scrolling
class SmoothScroll {
    constructor() {
        this.currentY = 0;
        this.targetY = 0;
        this.ease = 0.1;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            this.targetY = window.scrollY;
        });
        
        this.animate();
    }
    
    animate() {
        this.currentY += (this.targetY - this.currentY) * this.ease;
        
        // Apply parallax effects
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(this.currentY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Intersection Observer for Animations
class AnimationObserver {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        this.init();
    }
    
    init() {
        const animatedElements = document.querySelectorAll('.feature-card, .app-card, .download-card');
        animatedElements.forEach(element => {
            this.observer.observe(element);
        });
    }
}

// Mobile Menu Toggle
class MobileMenu {
    constructor() {
        this.toggle = document.getElementById('mobileMenuToggle');
        this.menu = document.querySelector('.nav-menu');
        this.actions = document.querySelector('.nav-actions');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        this.toggle.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.toggle.contains(e.target) && !this.menu.contains(e.target)) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.isOpen = true;
        this.menu.style.display = 'flex';
        this.actions.style.display = 'flex';
        this.menu.style.flexDirection = 'column';
        this.actions.style.flexDirection = 'column';
        this.menu.style.position = 'absolute';
        this.menu.style.top = '100%';
        this.menu.style.left = '0';
        this.menu.style.right = '0';
        this.menu.style.background = 'rgba(0, 0, 0, 0.9)';
        this.menu.style.backdropFilter = 'blur(20px)';
        this.menu.style.padding = '20px';
        this.menu.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
        
        // Animate hamburger
        const spans = this.toggle.querySelectorAll('span');
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    }
    
    closeMenu() {
        this.isOpen = false;
        this.menu.style.display = 'none';
        this.actions.style.display = 'none';
        
        // Reset hamburger
        const spans = this.toggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// Typing Animation
class TypingAnimation {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.currentIndex = 0;
        
        this.init();
    }
    
    init() {
        this.element.textContent = '';
        this.type();
    }
    
    type() {
        if (this.currentIndex < this.text.length) {
            this.element.textContent += this.text.charAt(this.currentIndex);
            this.currentIndex++;
            setTimeout(() => this.type(), this.speed);
        }
    }
}

// Device Showcase Animation
class DeviceShowcase {
    constructor() {
        this.devices = document.querySelectorAll('.device');
        this.init();
    }
    
    init() {
        this.devices.forEach(device => {
            device.addEventListener('mouseenter', () => {
                device.style.transform = device.style.transform.replace(
                    /rotateY\([^)]*\)/g, 
                    'rotateY(0deg)'
                ).replace(
                    /rotateX\([^)]*\)/g, 
                    'rotateX(0deg)'
                );
            });
            
            device.addEventListener('mouseleave', () => {
                const isDesktop = device.classList.contains('desktop-device');
                const yRotation = isDesktop ? '-15deg' : '15deg';
                const xRotation = isDesktop ? '10deg' : '-10deg';
                device.style.transform = `perspective(1000px) rotateY(${yRotation}) rotateX(${xRotation})`;
            });
        });
    }
}

// Button Interactions
class ButtonInteractions {
    constructor() {
        this.buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
        this.init();
    }
    
    init() {
        this.buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });
            
            button.addEventListener('mousedown', () => {
                button.style.transform = 'translateY(0) scale(0.98)';
            });
            
            button.addEventListener('mouseup', () => {
                button.style.transform = 'translateY(-2px) scale(1.02)';
            });
        });
    }
}

// Scroll Progress Indicator
class ScrollProgress {
    constructor() {
        this.progressBar = document.createElement('div');
        this.progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 2px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            z-index: 1001;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(this.progressBar);
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            this.progressBar.style.width = scrollPercent + '%';
        });
    }
}

// Cursor Trail Effect
class CursorTrail {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(102, 126, 234, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(this.cursor);
        
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX - 10 + 'px';
            this.cursor.style.top = e.clientY - 10 + 'px';
        });
        
        // Hide cursor on mobile
        if ('ontouchstart' in window) {
            this.cursor.style.display = 'none';
        }
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        
        this.init();
    }
    
    init() {
        this.measureFPS();
    }
    
    measureFPS() {
        const currentTime = performance.now();
        this.frameCount++;
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Log performance (only in development)
            if (window.location.hostname === 'localhost') {
                console.log(`FPS: ${this.fps}`);
            }
        }
        
        requestAnimationFrame(() => this.measureFPS());
    }
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    const particleContainer = document.getElementById('particleSystem');
    if (particleContainer) {
        new ParticleSystem(particleContainer);
    }
    
    // Initialize smooth scrolling
    new SmoothScroll();
    
    // Initialize animation observer
    new AnimationObserver();
    
    // Initialize mobile menu
    new MobileMenu();
    
    // Initialize device showcase
    new DeviceShowcase();
    
    // Initialize button interactions
    new ButtonInteractions();
    
    // Initialize scroll progress
    new ScrollProgress();
    
    // Initialize cursor trail (only on desktop)
    if (!('ontouchstart' in window)) {
        new CursorTrail();
    }
    
    // Initialize performance monitor
    new PerformanceMonitor();
    
    // Add loading animation
    document.body.classList.add('loaded');
    
    // Typing animation for hero title
    const heroTitle = document.querySelector('.hero-title .gradient-text');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        new TypingAnimation(heroTitle, originalText, 150);
    }
    
    // Add scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.feature-card, .app-card, .download-card, .section-header').forEach(el => {
        observer.observe(el);
    });
    
    // Add hover effects to cards
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
        });
    });
    
    // Add click effects to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes animate-in {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-in {
            animation: animate-in 0.6s ease-out forwards;
        }
        
        .loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
    
    // Smooth reveal animation
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add loading state
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

// Export for potential module usage
window.TauOS = {
    ParticleSystem,
    SmoothScroll,
    AnimationObserver,
    MobileMenu,
    TypingAnimation,
    DeviceShowcase,
    ButtonInteractions,
    ScrollProgress,
    CursorTrail,
    PerformanceMonitor
}; 