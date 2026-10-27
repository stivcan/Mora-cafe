/**
 * MŌRA CAFÉ - JAVASCRIPT INTERACTIONS & ANIMATIONS
 * File: script.js
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initHeaderScroll();
  initNavSpy();
  initMobileNav();
  initMenuTabs();
  initScrollReveal();
  initHeroLogoTilt();
  initBackToTop();
});

/**
 * 1. THEME TOGGLE (LIGHT / DARK MODE)
 */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggle');
  if (!themeToggleBtn) return;

  const currentTheme = localStorage.getItem('mora_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  setTheme(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
  });

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mora_theme', theme);
    
    // Update button icon
    const icon = themeToggleBtn.querySelector('svg');
    if (!icon) return;
    if (theme === 'dark') {
      // Moon / Sun icon
      themeToggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>`;
      themeToggleBtn.setAttribute('aria-label', 'Ganti ke tema terang');
    } else {
      themeToggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>`;
      themeToggleBtn.setAttribute('aria-label', 'Ganti ke tema gelap');
    }
  }
}

/**
 * 2. HEADER SMART SCROLL (HIDE ON SCROLL DOWN, REVEAL ON SCROLL UP)
 */
function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 150 && currentScrollY > lastScrollY) {
      // Scrolling down past threshold -> hide header
      header.classList.add('nav-hidden');
    } else {
      // Scrolling up or at top -> show header
      header.classList.remove('nav-hidden');
    }

    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
  }, { passive: true });
}

/**
 * 3. NAVIGATION ACTIVE LINK SPY
 */
function initNavSpy() {
  const sections = document.querySelectorAll('main > section, footer');
  const navLinks = document.querySelectorAll('.pill nav a, .mobile-drawer a');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

/**
 * 4. MOBILE NAVIGATION DRAWER
 */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileClose = document.getElementById('mobileClose');
  const drawerLinks = document.querySelectorAll('.mobile-drawer a');

  if (!mobileToggle || !mobileDrawer) return;

  const openDrawer = () => {
    mobileDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove('open');
    document.body.style.overflow = '';
  };

  mobileToggle.addEventListener('click', openDrawer);
  if (mobileClose) mobileClose.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/**
 * 5. MENU TABS SYSTEM
 */
function initMenuTabs() {
  const tabButtons = document.querySelectorAll('.tabs-wrap button');
  const panels = document.querySelectorAll('.panel');

  if (!tabButtons.length || !panels.length) return;

  tabButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      // Deactivate all
      tabButtons.forEach(b => b.setAttribute('aria-selected', 'false'));
      panels.forEach(p => p.hidden = true);

      // Activate current
      btn.setAttribute('aria-selected', 'true');
      if (panels[index]) {
        panels[index].hidden = false;
      }
    });
  });
}

/**
 * 6. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optional: unobserve once revealed
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * 7. INTERACTIVE 3D TILT ON HERO LOGO
 */
function initHeroLogoTilt() {
  const logoRing = document.getElementById('heroLogoRing');
  if (!logoRing) return;

  const container = logoRing.closest('.showcase-logo') || logoRing.parentElement;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;

    const tiltX = -deltaY * 16;
    const tiltY = deltaX * 16;

    logoRing.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.04, 1.04, 1.04)`;
  });

  container.addEventListener('mouseleave', () => {
    logoRing.style.transform = '';
  });
}

/**
 * 8. BACK TO TOP BUTTON
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

