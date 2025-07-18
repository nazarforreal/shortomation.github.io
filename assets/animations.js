// animations.js

document.addEventListener('DOMContentLoaded', function () {
  // Add a slight stagger for a smoother effect
  const fadeEls = document.querySelectorAll('.fade-in');
  fadeEls.forEach((el, i) => {
    el.style.animationDelay = (0.1 + i * 0.08) + 's';
    el.classList.add('fade-in-active');
  });
}); 