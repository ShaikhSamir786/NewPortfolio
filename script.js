
    // Enhanced JavaScript with error handling and performance optimizations
    
    (function() {
      'use strict';
      
      // Utility functions
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

      const throttle = (func, limit) => {
        let inThrottle;
        return function() {
          const args = arguments;
          const context = this;
          if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
          }
        }
      };

      // Custom cursor implementation
      const initCustomCursor = () => {
        const cursor = document.querySelector('.custom-cursor');
        if (!cursor) return;

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        const speed = 0.15;

        const updateCursorPosition = (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
        };

        const animateCursor = () => {
          cursorX += (mouseX - cursorX) * speed;
          cursorY += (mouseY - cursorY) * speed;
          cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
          requestAnimationFrame(animateCursor);
        };

        document.addEventListener('mousemove', updateCursorPosition);
        animateCursor();

        // Hover effects
        const interactiveElements = document.querySelectorAll('a, button, .card-hover, [role="button"]');
        interactiveElements.forEach(el => {
          el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
          el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });

        // Text hover effects
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, strong, em');
        textElements.forEach(el => {
          el.addEventListener('mouseenter', () => cursor.classList.add('text-hover'));
          el.addEventListener('mouseleave', () => cursor.classList.remove('text-hover'));
        });
      };

      // Scroll progress
      const initScrollProgress = () => {
        const scrollProgress = document.querySelector('.scroll-progress');
        if (!scrollProgress) return;

        const updateScrollProgress = throttle(() => {
          const totalHeight = document.body.scrollHeight - window.innerHeight;
          const progress = Math.min((window.pageYOffset / totalHeight) * 100, 100);
          scrollProgress.style.width = progress + '%';
        }, 10);

        window.addEventListener('scroll', updateScrollProgress);
      };

      // Intersection Observer for animations
      const initScrollAnimations = () => {
        const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              
              // Animate skill bars
              if (entry.target.classList.contains('skill-item')) {
                const progressBar = entry.target.querySelector('.skill-progress');
                if (progressBar) {
                  const width = progressBar.dataset.width;
                  setTimeout(() => {
                    progressBar.style.width = width + '%';
                  }, 300);
                }
              }
            }
          });
        }, observerOptions);

        document.querySelectorAll('.fade-in, .skill-item').forEach(el => {
          observer.observe(el);
        });
      };

      // Theme toggle
      const initThemeToggle = () => {
        const themeToggle = document.getElementById('theme-toggle');
        const icon = themeToggle?.querySelector('i');
        
        if (!themeToggle || !icon) return;

        const toggleTheme = () => {
          document.body.classList.toggle('dark');
          
          if (document.body.classList.contains('dark')) {
            icon.className = 'fas fa-sun text-yellow-400 text-lg';
            localStorage.setItem('theme', 'dark');
          } else {
            icon.className = 'fas fa-moon text-gray-600 text-lg';
            localStorage.setItem('theme', 'light');
          }
        };

        themeToggle.addEventListener('click', toggleTheme);

        // Check saved theme
        if (localStorage.getItem('theme') === 'dark' || 
            (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.body.classList.add('dark');
          icon.className = 'fas fa-sun text-yellow-400 text-lg';
        }
      };

      // Mobile menu
      const initMobileMenu = () => {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const closeMenuBtn = document.getElementById('close-menu');
        const mobileMenu = document.getElementById('mobile-menu');

        if (!mobileMenuBtn || !closeMenuBtn || !mobileMenu) return;

        const openMenu = () => {
          mobileMenu.classList.add('show');
          mobileMenu.setAttribute('aria-hidden', 'false');
          mobileMenuBtn.setAttribute('aria-expanded', 'true');
          document.body.style.overflow = 'hidden';
        };

        const closeMenu = () => {
          mobileMenu.classList.remove('show');
          mobileMenu.setAttribute('aria-hidden', 'true');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        };

        mobileMenuBtn.addEventListener('click', openMenu);
        closeMenuBtn.addEventListener('click', closeMenu);

        // Close on escape key
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && mobileMenu.classList.contains('show')) {
            closeMenu();
          }
        });

        // Close menu on link click
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
          link.addEventListener('click', closeMenu);
        });
      };

      // Smooth scroll for navigation links
      const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
              const offsetTop = target.offsetTop - 100; // Account for fixed nav
              window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
              });
            }
          });
        });
      };

      // Project filters
      const initProjectFilters = () => {
        const filterButtons = document.querySelectorAll('.project-filter');
        const projectItems = document.querySelectorAll('.project-item');

        if (!filterButtons.length || !projectItems.length) return;

        filterButtons.forEach(button => {
          button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button and ARIA states
            filterButtons.forEach(btn => {
              btn.classList.remove('active');
              btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            
            // Filter projects with improved animation
            projectItems.forEach(item => {
              const category = item.dataset.category;
              if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                requestAnimationFrame(() => {
                  item.style.opacity = '1';
                  item.style.transform = 'translateY(0)';
                });
              } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                  item.style.display = 'none';
                }, 300);
              }
            });
          });
        });
      };

      // Enhanced contact form
      const initContactForm = () => {
        const contactForm = document.getElementById('contact-form');
        const submitBtn = document.getElementById('submit-btn');
        const submitText = document.getElementById('submit-text');
        const formMessage = document.getElementById('form-message');

        if (!contactForm || !submitBtn || !formMessage) return;

        const showMessage = (message, type = 'success') => {
          const bgColor = type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700';
          const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
          
          formMessage.className = `text-center p-4 rounded-xl border ${bgColor}`;
          formMessage.innerHTML = `<i class="${icon} mr-2"></i>${message}`;
          formMessage.classList.remove('hidden');
          
          setTimeout(() => {
            formMessage.classList.add('hidden');
          }, 5000);
        };

        const validateForm = () => {
          const name = contactForm.name.value.trim();
          const email = contactForm.email.value.trim();
          const message = contactForm.message.value.trim();
          const agreement = contactForm.agreement.checked;

          if (!name || !email || !message || !agreement) {
            showMessage('Please fill in all required fields and accept the privacy policy.', 'error');
            return false;
          }

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return false;
          }

          return true;
        };

        contactForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          if (!validateForm()) return;

          // Show loading state
          const originalContent = submitText.textContent;
          submitText.textContent = 'Sending...';
          submitBtn.disabled = true;
          submitBtn.insertAdjacentHTML('afterbegin', '<div class="loading mr-2"></div>');

          try {
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            showMessage('Message sent successfully! I\'ll get back to you soon.');
            contactForm.reset();
          } catch (error) {
            showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
          } finally {
            // Reset button state
            const loading = submitBtn.querySelector('.loading');
            if (loading) loading.remove();
            submitText.textContent = originalContent;
            submitBtn.disabled = false;
          }
        });

        // Real-time form validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
          input.addEventListener('blur', () => {
            if (input.hasAttribute('required') && !input.value.trim()) {
              input.style.borderColor = '#ef4444';
            } else {
              input.style.borderColor = '';
            }
          });

          input.addEventListener('input', () => {
            input.style.borderColor = '';
          });
        });
      };

      // Generate particles
      const initParticles = () => {
        const particlesContainer = document.querySelector('.particles');
        if (!particlesContainer) return;

        const particleCount = window.innerWidth < 768 ? 25 : 50;
        
        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          particle.style.left = Math.random() * 100 + '%';
          particle.style.top = Math.random() * 100 + '%';
          particle.style.width = Math.random() * 4 + 1 + 'px';
          particle.style.height = particle.style.width;
          particle.style.animationDelay = Math.random() * 6 + 's';
          particle.style.animationDuration = Math.random() * 3 + 3 + 's';
          particlesContainer.appendChild(particle);
        }
      };

      // Typing effect for hero section
      const initTypingEffect = () => {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;

        const text = 'Shaikh';
        let i = 0;
        
        // Clear existing text first
        typingElement.textContent = '';
        
        const typeWriter = () => {
          if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 150);
          }
        };
        
        // Start typing after a delay
        setTimeout(typeWriter, 1500);
      };

      // Active navigation link tracking
      const initActiveNavigation = () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!sections.length || !navLinks.length) return;

        const updateActiveLink = throttle(() => {
          let current = '';
          const scrollPosition = window.pageYOffset + 150;

          sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
              current = section.getAttribute('id');
            }
          });

          navLinks.forEach(link => {
            link.classList.remove('text-blue-600');
            if (link.getAttribute('href') === `#${current}`) {
              link.classList.add('text-blue-600');
            }
          });
        }, 100);

        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink(); // Set initial state
      };

      // Performance optimizations
      const optimizePerformance = () => {
        // Preload critical images
        const criticalImages = document.querySelectorAll('img[loading="eager"]');
        criticalImages.forEach(img => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = img.src;
          document.head.appendChild(link);
        });

        // Add will-change to animated elements
        const animatedElements = document.querySelectorAll('.floating, .morphing, .pulse-glow');
        animatedElements.forEach(el => {
          el.style.willChange = 'transform';
        });

        // Optimize scroll performance
        let ticking = false;
        const optimizedScroll = (callback) => {
          if (!ticking) {
            requestAnimationFrame(callback);
            ticking = true;
            setTimeout(() => ticking = false, 16);
          }
        };

        // Replace direct scroll listeners with optimized ones
        window.addEventListener('scroll', () => optimizedScroll(() => {
          // Scroll-dependent functions go here
        }));
      };

      // Error handling
      const handleErrors = () => {
        window.addEventListener('error', (e) => {
          console.error('JavaScript Error:', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
          console.error('Unhandled Promise Rejection:', e.reason);
        });
      };

      // Initialize everything when DOM is loaded
      const init = () => {
        try {
          // Set current year
          const yearElement = document.getElementById('current-year');
          if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
          }

          // Initialize all features
          initCustomCursor();
          initScrollProgress();
          initScrollAnimations();
          initThemeToggle();
          initMobileMenu();
          initSmoothScroll();
          initProjectFilters();
          initContactForm();
          initParticles();
          initTypingEffect();
          initActiveNavigation();
          optimizePerformance();
          handleErrors();

          // Remove loading states if any
          document.body.classList.add('loaded');
          
        } catch (error) {
          console.error('Initialization error:', error);
        }
      };

      // Wait for DOM content to be loaded
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }

      // Handle page visibility for performance
      document.addEventListener('visibilitychange', () => {
        const particles = document.querySelectorAll('.particle');
        if (document.hidden) {
          particles.forEach(p => p.style.animationPlayState = 'paused');
        } else {
          particles.forEach(p => p.style.animationPlayState = 'running');
        }
      });

    })();
  