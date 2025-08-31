// Portfolio JavaScript for Keshav Raj Gautam
// Handles navigation, animations, and Cosmos DB visitor counter

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initAnimations();
    initStatCounters();
    initVisitorCounter();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            
            // Animate hamburger icon
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navMenu.classList.contains('show')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = 70; // Header height in pixels
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu after click
            if (navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('show') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navMenu.classList.remove('show');
            const spans = navToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        }
    });

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Animation functionality using Intersection Observer
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe sections for fade-in animation
    const sections = document.querySelectorAll('.about, .skills, .contact');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Observe skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
        category.style.animationDelay = `${index * 0.2}s`;
        observer.observe(category);
    });

    // Observe contact items
    const contactItems = document.querySelectorAll('.contact__item');
    contactItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        observer.observe(item);
    });
}

// Animated counters for statistics
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat__number');
    let hasAnimated = false;

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounters();
            }
        });
    }, observerOptions);

    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        observer.observe(aboutSection);
    }

    function animateCounters() {
        statNumbers.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += increment;
                
                if (current < target) {
                    // Format number properly
                    if (target === 1.8) {
                        stat.textContent = current.toFixed(1);
                    } else if (target >= 1000) {
                        stat.textContent = Math.floor(current) + '+';
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    // Final value
                    if (target === 1.8) {
                        stat.textContent = '1.8';
                    } else if (target >= 1000) {
                        stat.textContent = target + '+';
                    } else {
                        stat.textContent = target;
                    }
                }
            };

            updateCounter();
        });
    }
}

// Visitor Counter with Cosmos DB Integration
function initVisitorCounter() {
    const counterElement = document.getElementById('visitor-count');
    
    // Configuration for Azure Functions API
    const API_CONFIG = {
        // Replace with your actual Azure Functions URL
        functionUrl: 'https://your-function-app.azurewebsites.net/api/visitor-counter',
        // Alternative localhost URL for development
        // functionUrl: 'http://localhost:7071/api/visitor-counter',
        timeout: 10000, // 10 seconds timeout
        retryAttempts: 3,
        retryDelay: 2000 // 2 seconds
    };

    async function fetchVisitorCount() {
        let attempts = 0;
        
        while (attempts < API_CONFIG.retryAttempts) {
            try {
                console.log(`Attempting to fetch visitor count (attempt ${attempts + 1}/${API_CONFIG.retryAttempts})`);
                
                const response = await Promise.race([
                    fetch(API_CONFIG.functionUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            action: 'increment'
                        })
                    }),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Request timeout')), API_CONFIG.timeout)
                    )
                ]);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                
                if (data && typeof data.count === 'number') {
                    updateCounterDisplay(data.count);
                    console.log(`Successfully updated visitor count: ${data.count}`);
                    return;
                } else {
                    throw new Error('Invalid response format');
                }

            } catch (error) {
                console.warn(`Attempt ${attempts + 1} failed:`, error.message);
                attempts++;
                
                if (attempts < API_CONFIG.retryAttempts) {
                    console.log(`Retrying in ${API_CONFIG.retryDelay / 1000} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay));
                }
            }
        }

        // All attempts failed - show fallback
        console.error('All attempts to fetch visitor count failed');
        showCounterError();
    }

    function updateCounterDisplay(count) {
        // Animate the counter update
        const currentCount = parseInt(counterElement.textContent) || 0;
        
        if (currentCount === 0) {
            // First load - just show the number
            counterElement.textContent = formatCount(count);
        } else {
            // Animate from current to new count
            animateCounterUpdate(currentCount, count);
        }
        
        // Add success indicator
        counterElement.classList.remove('error');
        counterElement.classList.add('success');
        
        // Remove success class after animation
        setTimeout(() => {
            counterElement.classList.remove('success');
        }, 1000);
    }

    function animateCounterUpdate(from, to) {
        const duration = 1000; // 1 second
        const steps = 30;
        const stepDuration = duration / steps;
        const increment = (to - from) / steps;
        let current = from;
        let step = 0;

        const animate = () => {
            current += increment;
            step++;
            
            counterElement.textContent = formatCount(Math.round(current));
            
            if (step < steps) {
                setTimeout(animate, stepDuration);
            } else {
                counterElement.textContent = formatCount(to);
            }
        };

        animate();
    }

    function formatCount(count) {
        // Format large numbers (e.g., 1,234)
        return count.toLocaleString();
    }

    function showCounterError() {
        counterElement.innerHTML = `
            <span class="error-indicator" title="Unable to load visitor count">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12" y2="16"></line>
                </svg>
                ---
            </span>
        `;
        counterElement.classList.add('error');
    }

    function showCounterLoading() {
        counterElement.innerHTML = '<div class="loading-spinner"></div>';
    }

    // Initialize visitor counter
    async function initCounter() {
        showCounterLoading();
        
        // Add a small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In production, this would call the actual API
        // For demo purposes, we'll simulate the API call
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // Development mode - simulate API response
            setTimeout(() => {
                const simulatedCount = Math.floor(Math.random() * 1000) + 100;
                updateCounterDisplay(simulatedCount);
            }, 1000);
        } else {
            // Production mode - attempt actual API call
            await fetchVisitorCount();
        }
    }

    // Start the counter
    initCounter();

    // Add retry functionality
    counterElement.addEventListener('click', (e) => {
        if (counterElement.classList.contains('error')) {
            e.preventDefault();
            initCounter();
        }
    });
}

// Utility function for throttling scroll events
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

// Add CSS for counter states
const style = document.createElement('style');
style.textContent = `
    .visitor-counter__count.success {
        animation: pulse 0.6s ease-in-out;
    }

    .visitor-counter__count.error {
        color: var(--color-error);
        cursor: pointer;
    }

    .visitor-counter__count.error:hover {
        opacity: 0.8;
    }

    .error-indicator {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }

    /* Fade in animation */
    .fade-in {
        animation: fadeInUp 0.8s ease-out forwards;
        opacity: 0;
        transform: translateY(30px);
    }

    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Responsive navigation fix */
    @media (max-width: 768px) {
        .nav__toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav__toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav__toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(style);

// Azure Functions Integration Template
// This is a template for the Azure Functions integration

/*
Example Azure Functions Code (Node.js):

const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    const client = new CosmosClient({
        endpoint: process.env.COSMOS_DB_ENDPOINT,
        key: process.env.COSMOS_DB_KEY
    });

    const database = client.database("portfolioDB");
    const container = database.container("visitors");

    try {
        // Try to get existing counter document
        const { resource: item } = await container.item("visitor-counter", "counter")
            .read()
            .catch(() => ({ resource: null }));

        let count = 1;
        
        if (item) {
            count = item.count + 1;
            await container.item("visitor-counter", "counter").replace({
                id: "visitor-counter",
                partitionKey: "counter",
                count: count,
                lastUpdated: new Date().toISOString()
            });
        } else {
            await container.items.create({
                id: "visitor-counter",
                partitionKey: "counter", 
                count: count,
                lastUpdated: new Date().toISOString()
            });
        }

        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: {
                count: count,
                success: true
            }
        };

    } catch (error) {
        context.log.error("Error updating visitor count:", error);
        
        context.res = {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: {
                error: "Failed to update visitor count",
                success: false
            }
        };
    }
};
*/