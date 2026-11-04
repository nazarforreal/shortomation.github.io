// animations.js

document.addEventListener('DOMContentLoaded', function () {
  // Add a slight stagger for a smoother effect
  const fadeEls = document.querySelectorAll('.fade-in');
  fadeEls.forEach((el, i) => {
    el.style.animationDelay = (0.1 + i * 0.08) + 's';
    el.classList.add('fade-in-active');
  });

  // Highlight the current page in the navigation
  const section = window.location.pathname.split('/').filter(Boolean)[0] || '';
  document.querySelectorAll('.nav__links a').forEach((link) => {
    const target = new URL(link.getAttribute('href'), window.location.href).pathname.split('/').filter(Boolean)[0] || '';
    if (target === section) link.setAttribute('aria-current', 'page');
  });

  // Keep the mobile menu button in sync with the menu state
  const hamburger = document.getElementById('hamburger-menu');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    const sync = () => {
      const open = navLinks.classList.contains('open');
      hamburger.setAttribute('aria-expanded', String(open));
      hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    new MutationObserver(sync).observe(navLinks, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') navLinks.classList.remove('open');
    });
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) navLinks.classList.remove('open');
    });
    sync();
  }
});
