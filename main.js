/* ============================================
   BYLIGN — main.js
   Scroll fade-ins · sliding nav indicator
   Section pill · CTA circle + sparkle · Email circle
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Mobile menu ----
  const hamburger  = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function closeMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        mobileMenu.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
      }
    });

    // Close on link click
    mobileLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });

    // Close when clicking outside the menu
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }



  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          fadeObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -28px 0px' }
  );
  document.querySelectorAll('.fade-in').forEach((el) => fadeObserver.observe(el));


  // ---- Footer year ----
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();


  // ---- Elements ----
  const sections    = document.querySelectorAll('section[id]');
  const nav         = document.getElementById('main-nav');
  const navLinks    = document.querySelectorAll('#main-nav a[href^="#"]');
  const indicator   = document.getElementById('nav-indicator');
  const pill        = document.getElementById('section-pill');
  const ctaWrap     = document.getElementById('nav-cta-wrap');
  const ctaSparks   = document.querySelectorAll('.cta-spark');
  const emailWrap   = document.getElementById('email-wrap');
  const circlePath  = document.getElementById('circle-path');

  const sectionNames = {
    hero:     'Home',
    about:    'About',
    services: 'Services',
    work:     'Work',
    rooted:   'Stories',
    contact:  'Get in Touch',
  };

  let ctaAnimated  = false;
  let circleDrawn  = false;
  let pillTimer    = null;


  // ---- Sliding nav indicator ----
  function moveIndicator(linkEl) {
    if (!indicator || !nav || !linkEl) return;
    const navRect  = nav.getBoundingClientRect();
    const linkRect = linkEl.getBoundingClientRect();
    indicator.style.left  = (linkRect.left - navRect.left) + 'px';
    indicator.style.width = linkRect.width + 'px';
    indicator.classList.add('visible');
  }

  function setActiveLink(id) {
    let matched = null;
    navLinks.forEach((a) => {
      const target = a.getAttribute('href').replace('#', '');
      const isActive = target === id;
      a.classList.toggle('active', isActive);
      if (isActive) matched = a;
    });
    if (id === 'contact' && ctaWrap) {
      const navRect = nav.getBoundingClientRect();
      const ctaRect = ctaWrap.getBoundingClientRect();
      indicator.style.left  = (ctaRect.left - navRect.left) + 'px';
      indicator.style.width = ctaRect.width + 'px';
      indicator.classList.add('visible');
    } else if (matched) {
      moveIndicator(matched);
    }
  }


  // ---- Pill ----
  function showPill(name) {
    if (!name || !pill) return;
    pill.textContent = name;
    pill.classList.add('visible');
    clearTimeout(pillTimer);
    pillTimer = setTimeout(() => pill.classList.remove('visible'), 1800);
  }


  // ---- Path dash init ----
  function initPath(path) {
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray  = len;
    path.style.strokeDashoffset = len;
  }


  // ---- CTA circle + sparkle ----
  function triggerCTA() {
    if (ctaAnimated || !ctaWrap) return;
    ctaAnimated = true;
    setTimeout(() => ctaWrap.classList.add('animate'), 50);
  }

  function resetCTA() {
    if (!ctaAnimated) return;
    ctaAnimated = false;
    ctaWrap.classList.remove('animate');
  }


  // ---- Email circle ----
  setTimeout(() => initPath(circlePath), 200);

  function triggerCircle() {
    if (circleDrawn || !emailWrap) return;
    circleDrawn = true;
    initPath(circlePath);
    setTimeout(() => emailWrap.classList.add('animate'), 50);
  }

  const contactSection = document.getElementById('contact');
  if (contactSection && emailWrap) {
    const circleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) triggerCircle(); });
      },
      { threshold: 0.4 }
    );
    circleObserver.observe(contactSection);
  }


  // ---- Section tracking via IntersectionObserver ----
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = e.target.id;
          setActiveLink(id);
          if (sectionNames[id]) showPill(sectionNames[id]);
          if (id === 'contact') triggerCTA();
          else if (ctaAnimated) resetCTA();
        }
      });
    },
    { rootMargin: '-10% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach((sec) => sectionObserver.observe(sec));


  // ---- Nav link clicks ----
  navLinks.forEach((a) => {
    a.addEventListener('click', () => {
      const target = a.getAttribute('href').replace('#', '');
      setActiveLink(target);
      if (sectionNames[target]) showPill(sectionNames[target]);
    });
  });

  if (ctaWrap) {
    ctaWrap.addEventListener('click', () => {
      setActiveLink('contact');
      showPill('Get in Touch');
    });
  }

});
