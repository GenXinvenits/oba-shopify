(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add('(min-width: 768px)', function () {
    // Keep GSAP off the hero image: the hero slider already owns its transform animation.
    // This prevents two animation systems from fighting over the same transform.
    
    // Category cards: animate opacity only on the card itself, and movement on its content.
    ScrollTrigger.batch('.category-card', {
      start: 'top 88%',
      once: true,
      interval: 0.08,
      batchMax: 3,
      onEnter: function (batch) {
        gsap.fromTo(batch,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.55, stagger: 0.08, ease: 'power2.out', overwrite: 'auto' }
        );
        gsap.fromTo(batch.map(function (card) {
          return card.querySelector('.category-card__content');
        }).filter(Boolean),
          { y: 22 },
          { y: 0, duration: 0.65, stagger: 0.08, ease: 'power3.out', overwrite: 'auto' }
        );
      }
    });

    // Product cards: never animate transform on the card itself because the theme
    // uses transform for hover/quick-add interactions. Animate opacity + inner content.
    ScrollTrigger.batch('.product-card', {
      start: 'top 91%',
      once: true,
      interval: 0.08,
      batchMax: 4,
      onEnter: function (batch) {
        gsap.fromTo(batch,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.45, stagger: 0.06, ease: 'power2.out', overwrite: 'auto' }
        );
        gsap.fromTo(batch.map(function (card) {
          return card.querySelector('.product-card__info');
        }).filter(Boolean),
          { y: 18 },
          { y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out', overwrite: 'auto' }
        );
      }
    });

    // Story section: use opacity/translation rather than clip-path on the map,
    // which is much lighter while scrolling and avoids map repaint glitches.
    ScrollTrigger.create({
      trigger: '.story-grid',
      start: 'top 82%',
      once: true,
      onEnter: function () {
        gsap.fromTo('.story-map',
          { autoAlpha: 0.65 },
          { autoAlpha: 1, duration: 0.7, ease: 'power2.out', overwrite: 'auto' }
        );
        gsap.fromTo('.story-content',
          { autoAlpha: 0, x: 28 },
          { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power3.out', overwrite: 'auto' }
        );
      }
    });

    // Brand strip: simple stagger, no repeated reverse animation.
    ScrollTrigger.batch('.brand-list > *', {
      start: 'top 92%',
      once: true,
      interval: 0.08,
      batchMax: 4,
      onEnter: function (batch) {
        gsap.fromTo(batch,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', overwrite: 'auto' }
        );
      }
    });

    const newsletter = document.querySelector('.newsletter');
    if (newsletter) {
      gsap.fromTo(newsletter,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: newsletter,
            start: 'top 88%',
            once: true
          }
        }
      );
    }

    // Wait until layout/images have settled before measuring trigger positions.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        ScrollTrigger.refresh();
      });
    });
  });

  window.addEventListener('load', function () {
    ScrollTrigger.refresh();
  }, { once: true });
})();
