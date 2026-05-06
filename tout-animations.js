/* =============================================
   TOUT SHOP — Animations Engine
   ============================================= */
(function () {
  'use strict';

  /* -------------------------------------------
     1. Scroll-triggered animations
  ------------------------------------------- */
  function initScrollAnimations() {
    var elements = document.querySelectorAll('[data-animate]');
    if (!elements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = el.dataset.animateDelay || 0;
          setTimeout(function () {
            el.classList.add('is-visible');
          }, parseInt(delay));
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* -------------------------------------------
     2. Staggered children
  ------------------------------------------- */
  function initStagger() {
    document.querySelectorAll('[data-stagger]').forEach(function (parent) {
      var children = parent.children;
      var base = parseInt(parent.dataset.staggerDelay || 80);
      Array.from(children).forEach(function (child, i) {
        child.setAttribute('data-animate', child.dataset.animate || 'fade-up');
        child.dataset.animateDelay = i * base;
      });
    });
  }

  /* -------------------------------------------
     3. Sticky header transparency
  ------------------------------------------- */
  function initStickyHeader() {
    var header = document.querySelector('.header-wrapper');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* -------------------------------------------
     4. Smooth anchor scroll
  ------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* -------------------------------------------
     5. Button ripple effect
  ------------------------------------------- */
  function initRipple() {
    document.querySelectorAll('.btn-primary, .button').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var rect = btn.getBoundingClientRect();
        var ripple = document.createElement('span');
        var size = Math.max(rect.width, rect.height);
        ripple.style.cssText = [
          'position:absolute',
          'border-radius:50%',
          'background:rgba(255,255,255,0.35)',
          'pointer-events:none',
          'width:' + size + 'px',
          'height:' + size + 'px',
          'left:' + (e.clientX - rect.left - size / 2) + 'px',
          'top:' + (e.clientY - rect.top - size / 2) + 'px',
          'transform:scale(0)',
          'animation:tout-ripple 0.55s ease-out forwards'
        ].join(';');
        if (!btn.style.position) btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 600);
      });
    });

    /* inject ripple keyframe once */
    if (!document.getElementById('tout-ripple-style')) {
      var style = document.createElement('style');
      style.id = 'tout-ripple-style';
      style.textContent = '@keyframes tout-ripple{to{transform:scale(2.5);opacity:0}}';
      document.head.appendChild(style);
    }
  }

  /* -------------------------------------------
     6. Hero leaf particles
  ------------------------------------------- */
  function initLeafParticles() {
    var hero = document.querySelector('.tout-hero, [class*="image-banner"]');
    if (!hero) return;

    var leaves = ['M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
      'M17 8C8 10 5.9 16.17 3.82 19.07L5.71 21c1-1.06 2.1-1.65 3.29-1.65C11.37 19.35 13 21 16 21c2.21 0 4-1.79 4-4 0-3.86-4-9-3-9z'];

    var style = document.createElement('style');
    style.textContent = [
      '@keyframes leaf-float-1{0%{transform:translateY(0) rotate(0deg);opacity:0}10%{opacity:.6}90%{opacity:.3}100%{transform:translateY(-110vh) rotate(360deg);opacity:0}}',
      '@keyframes leaf-float-2{0%{transform:translateY(0) rotate(0deg) translateX(0);opacity:0}10%{opacity:.5}50%{transform:translateY(-55vh) rotate(180deg) translateX(30px)}90%{opacity:.2}100%{transform:translateY(-110vh) rotate(360deg) translateX(-20px);opacity:0}}',
      '.tout-leaf{position:absolute;pointer-events:none;opacity:0;fill:rgba(184,212,168,0.5)}'
    ].join('');
    document.head.appendChild(style);

    hero.style.position = 'relative';
    hero.style.overflow = 'hidden';

    var configs = [
      {left:'8%',  size:18, dur:'9s',  delay:'0s',   anim:'leaf-float-1'},
      {left:'22%', size:12, dur:'12s', delay:'2s',   anim:'leaf-float-2'},
      {left:'55%', size:20, dur:'10s', delay:'1s',   anim:'leaf-float-1'},
      {left:'70%', size:14, dur:'13s', delay:'3.5s', anim:'leaf-float-2'},
      {left:'85%', size:16, dur:'11s', delay:'1.5s', anim:'leaf-float-1'},
      {left:'40%', size:10, dur:'14s', delay:'4s',   anim:'leaf-float-2'}
    ];

    configs.forEach(function (cfg) {
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'tout-leaf');
      svg.setAttribute('width', cfg.size);
      svg.setAttribute('height', cfg.size);
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.style.cssText = 'left:' + cfg.left + ';bottom:-40px;animation:' + cfg.anim + ' ' + cfg.dur + ' ' + cfg.delay + ' infinite linear';
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', leaves[Math.floor(Math.random() * leaves.length)]);
      svg.appendChild(path);
      hero.appendChild(svg);
    });
  }

  /* -------------------------------------------
     7. Cart badge bounce
  ------------------------------------------- */
  function initCartBadge() {
    var style = document.createElement('style');
    style.textContent = '@keyframes badge-bounce{0%,100%{transform:scale(1)}40%{transform:scale(1.45)}70%{transform:scale(0.9)}}';
    document.head.appendChild(style);

    document.querySelectorAll('.cart-count-bubble, [class*="cart"][class*="count"], [class*="cart"][class*="badge"]').forEach(function (el) {
      el.style.animation = 'badge-bounce 0.5s ease-out';
    });
  }

  /* -------------------------------------------
     INIT
  ------------------------------------------- */
  function init() {
    initStagger();
    initScrollAnimations();
    initStickyHeader();
    initSmoothScroll();
    initRipple();
    initLeafParticles();
    initCartBadge();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
