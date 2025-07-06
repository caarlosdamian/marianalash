// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');

  // Toggle mobile menu
  navToggle.addEventListener('click', function () {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');

    // Prevent body scroll when menu is open
    document.body.style.overflow = navMenu.classList.contains('active')
      ? 'hidden'
      : 'auto';
  });

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener('click', function () {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function (e) {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });

  // Smooth scrolling for navigation links
  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // Header background on scroll
  const header = document.querySelector('.header');
  let lastScrollTop = 0;

  window.addEventListener('scroll', function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add/remove background based on scroll position
    if (scrollTop > 50) {
      header.style.background = 'rgba(255, 255, 255, 0.98)';
      header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
      header.style.background = 'rgba(255, 255, 255, 0.95)';
      header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }

    // Hide/show header on scroll (optional)
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      header.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      header.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop;
  });

  // Active navigation link based on scroll position
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', function () {
    const scrollPos = window.pageYOffset + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const correspondingLink = document.querySelector(
        `.nav-menu a[href="#${sectionId}"]`
      );

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        // Remove active class from all links
        navLinks.forEach((link) => link.classList.remove('active'));
        // Add active class to current link
        if (correspondingLink) {
          correspondingLink.classList.add('active');
        }
      }
    });
  });

  // Contact form handling
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const formDataObj = {};
      formData.forEach((value, key) => {
        formDataObj[key] = value;
      });

      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;

      // Simulate form submission (replace with actual form handling)
      setTimeout(() => {
        // Reset form
        contactForm.reset();

        // Show success message
        showNotification('¡Mensaje enviado exitosamente!', 'success');

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
  }

  // Notification system
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

    // Add notification styles
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${
              type === 'success'
                ? '#4CAF50'
                : type === 'error'
                ? '#f44336'
                : '#2196F3'
            };
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

    // Add to document
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Handle close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      hideNotification(notification);
    });

    // Auto hide after 5 seconds
    setTimeout(() => {
      hideNotification(notification);
    }, 5000);
  }

  function hideNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    '.service-card, .gallery-item, .contact-item'
  );
  animateElements.forEach((el) => {
    observer.observe(el);
  });

  // Lazy loading for images (when you add real images)
  const lazyImages = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => {
    imageObserver.observe(img);
  });

  // Resize handler for responsive adjustments
  window.addEventListener('resize', function () {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });

  // Service card interactions
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card) => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Gallery item interactions
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach((item) => {
    item.addEventListener('click', function () {
      // Add lightbox functionality here if needed
      console.log('Gallery item clicked');
    });
  });

  // Calendly integration helper
  function loadCalendly() {
    // This function can be called when you're ready to load Calendly
    const calendlyContainer = document.querySelector('.calendly-container');

    if (calendlyContainer && window.Calendly) {
      // Replace the placeholder with actual Calendly widget
      calendlyContainer.innerHTML =
        '<div class="calendly-inline-widget" style="min-width:320px;height:630px;"></div>';

      // Initialize Calendly widget
      window.Calendly.initInlineWidget({
        url: 'YOUR_CALENDLY_URL_HERE',
        parentElement: calendlyContainer.querySelector(
          '.calendly-inline-widget'
        ),
        prefill: {},
        utm: {},
      });
    }
  }

  // Call loadCalendly when needed
  // loadCalendly();

  // Performance optimization: defer non-critical JavaScript
  const deferredScripts = [
    // Add any non-critical scripts here
  ];

  // Load deferred scripts after page load
  window.addEventListener('load', function () {
    deferredScripts.forEach((script) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = script;
      document.head.appendChild(scriptElement);
    });
  });

  // Initialize tooltips or other UI components
  function initializeUI() {
    // Add any additional UI initialization here
    console.log('UI initialized');
  }

  // Call UI initialization
  initializeUI();

  // Google Analytics or other tracking (placeholder)
  function trackEvent(eventName, eventData) {
    // Add your analytics tracking here
    console.log('Event tracked:', eventName, eventData);
  }

  // Track button clicks for analytics
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      trackEvent('button_click', {
        button_text: this.textContent,
        button_href: this.href || 'no-href',
      });
    });
  });
});
