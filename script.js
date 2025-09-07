// ===== PARTICLES.JS CONFIGURATION =====
particlesJS('particles-js', {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: '#ffffff'
    },
    shape: {
      type: 'circle',
      stroke: {
        width: 0,
        color: '#000000'
      }
    },
    opacity: {
      value: 0.5,
      random: false,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#ffffff',
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 2,
      direction: 'none',
      random: false,
      straight: false,
      out_mode: 'out',
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: true,
        mode: 'repulse'
      },
      onclick: {
        enable: true,
        mode: 'push'
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 1
        }
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3
      },
      repulse: {
        distance: 200,
        duration: 0.4
      },
      push: {
        particles_nb: 4
      },
      remove: {
        particles_nb: 2
      }
    }
  },
  retina_detect: true
});

// ===== TYPING ANIMATION =====
const texts = [
  'Building innovative web experiences...',
  'Passionate about clean code & design...',
  'Always learning, always creating...',
  'Turning ideas into digital reality...',
  'Let\'s create something amazing together!'
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseTime = 2000;

function typeText() {
  const typingElement = document.getElementById('typing-text');
  const currentText = texts[textIndex];
  
  if (isDeleting) {
    typingElement.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingElement.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
  }
  
  let speed = isDeleting ? deletingSpeed : typingSpeed;
  
  if (!isDeleting && charIndex === currentText.length) {
    speed = pauseTime;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % texts.length;
  }
  
  setTimeout(typeText, speed);
}

// ===== SMOOTH SCROLLING FOR NAVIGATION =====
document.querySelectorAll('.navbar a[href^="#"]').forEach(anchor => {
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

// ===== SCROLL PROGRESS BAR =====
function updateScrollProgress() {
  const scrollProgress = document.querySelector('.scroll-progress');
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercentage = (scrollTop / scrollHeight) * 100;
  scrollProgress.style.width = scrollPercentage + '%';
}

// ===== REVEAL SECTIONS ON SCROLL =====
function revealSections() {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (sectionTop < windowHeight * 0.8) {
      section.classList.add('revealed');
    }
  });
}

// ===== ANIMATE SKILL BARS =====
function animateSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');
  skillBars.forEach(bar => {
    const progress = bar.getAttribute('data-progress');
    const barTop = bar.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (barTop < windowHeight * 0.8 && !bar.classList.contains('animated')) {
      bar.style.width = progress + '%';
      bar.classList.add('animated');
    }
  });
}

// ===== CONTACT FORM HANDLING =====
function handleContactForm() {
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const name = formData.get('name');
      const email = formData.get('email');
      const subject = formData.get('subject');
      const message = formData.get('message');
      
      // Create mailto link
      const mailtoLink = `mailto:deepaksingh1712000@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
      
      // Open default email client
      window.location.href = mailtoLink;
      
      // Show success message
      showNotification('Thank you! Your email client should open now.', 'success');
      
      // Reset form
      form.reset();
    });
  }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    border-left: 4px solid ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
  `;
  
  // Add to document
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Close button functionality
  const closeButton = notification.querySelector('.notification-close');
  closeButton.addEventListener('click', () => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// ===== NAVBAR ACTIVE LINK HIGHLIGHTING =====
function updateActiveNavLink() {
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.navbar a');
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    const sectionHeight = section.offsetHeight;
    
    if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
    }
  });
}

// ===== ENHANCED VIDEO BACKGROUND CONTROLS =====
function setupVideoBackground() {
  const video = document.getElementById('bg-video');
  if (video) {
    // Ensure video plays on mobile devices
    video.muted = true;
    video.playsInline = true;
    
    // Add click to pause/play functionality
    video.addEventListener('click', function() {
      if (video.paused) {
        video.play();
        showNotification('Background video resumed', 'info');
      } else {
        video.pause();
        showNotification('Background video paused', 'info');
      }
    });
    
    // Handle video loading errors
    video.addEventListener('error', function() {
      console.log('Video failed to load, using fallback background');
      document.body.style.background = 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)';
    });
  }
}

// ===== LAZY LOADING FOR BETTER PERFORMANCE =====
function setupLazyLoading() {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target;
          section.classList.add('revealed');
          observer.unobserve(section);
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.section').forEach(section => {
      observer.observe(section);
    });
  } else {
    // Fallback for older browsers
    revealSections();
  }
}

// ===== KEYBOARD NAVIGATION =====
function setupKeyboardNavigation() {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      // Close any open modals or notifications
      const notifications = document.querySelectorAll('.notification');
      notifications.forEach(notification => notification.remove());
    }
  });
}

// ===== PROJECT CARD INTERACTIONS =====
function setupProjectCards() {
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
}

// ===== PARALLAX EFFECT FOR BACKGROUND =====
function setupParallaxEffect() {
  let ticking = false;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const video = document.getElementById('bg-video');
    
    if (video) {
      const parallaxSpeed = scrolled * 0.5;
      video.style.transform = `translate3d(0, ${parallaxSpeed}px, 0)`;
    }
    
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick);
}

// ===== THEME DETECTION AND ADAPTATION =====
function setupThemeDetection() {
  // Detect user's color scheme preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-theme');
  }
  
  // Listen for changes in color scheme preference
  window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
    if (e.matches) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  });
}

// ===== PERFORMANCE OPTIMIZATION =====
function optimizePerformance() {
  // Throttle scroll events
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(function() {
      updateScrollProgress();
      revealSections();
      animateSkillBars();
      updateActiveNavLink();
    }, 10);
  });
  
  // Preload critical resources
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'video';
  link.href = 'background real.mp4';
  document.head.appendChild(link);
}

// ===== ACCESSIBILITY IMPROVEMENTS =====
function setupAccessibility() {
  // Add skip to content link
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    z-index: 10001;
    border-radius: 4px;
  `;
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px';
  });
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Add main content landmark
  const heroSection = document.getElementById('home');
  if (heroSection) {
    heroSection.setAttribute('role', 'main');
    heroSection.id = 'main-content';
  }
  
  // Enhance focus management
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
  });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  // Start typing animation
  typeText();
  
  // Setup all features
  setupVideoBackground();
  setupLazyLoading();
  setupKeyboardNavigation();
  setupProjectCards();
  setupParallaxEffect();
  setupThemeDetection();
  optimizePerformance();
  setupAccessibility();
  handleContactForm();
  
  // Initial calls
  revealSections();
  updateScrollProgress();
  updateActiveNavLink();
  
  console.log('🚀 Deepak Meena Portfolio Loaded Successfully!');
  console.log('📱 Responsive design active');
  console.log('🎬 Video background initialized');
  console.log('✨ All animations ready');
});

// ===== WINDOW RESIZE HANDLER =====
window.addEventListener('resize', function() {
  // Reinitialize particles on resize
  if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
    window.pJSDom[0].pJS.fn.canvasSize();
  }
  
  // Update any size-dependent calculations
  revealSections();
  updateActiveNavLink();
});

// ===== SERVICE WORKER REGISTRATION (FOR PWA CAPABILITIES) =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('SW registered: ', registration);
      })
      .catch(function(registrationError) {
        console.log('SW registration failed: ', registrationError);
      });
  });
}