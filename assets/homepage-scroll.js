(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add('(min-width: 768px)', function () {
    // The hero slider already owns its image transforms. Do not animate them here.
    // This avoids competing transforms and keeps the slider smooth.

    // Section headings: subtle reveal, once per section.
    ScrollTrigger.batch('.section-heading', {
      start: 'top 90%',
      once: true,
      interval: 0.08,
      batchMax: 3,
      onEnter: function (batch) {
        gsap.fromTo(batch,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power3.out', overwrite: 'auto' }
        );
      }
    });

    // Category cards: move only their content, not the card itself.
    ScrollTrigger.batch('.category-card', {
      start: 'top 88%',
      once: true,
      interval: 0.08,
      batchMax: 3,
      onEnter: function (batch) {
        gsap.fromTo(batch,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.5, stagger: 0.07, ease: 'power2.out', overwrite: 'auto' }
        );
        gsap.fromTo(batch.map(function (card) {
          return card.querySelector('.category-card__content');
        }).filter(Boolean),
          { y: 20 },
          { y: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out', overwrite: 'auto' }
        );
      }
    });

    // Product cards: never transform the card because hover effects use transform.
    ScrollTrigger.batch('.product-card', {
      start: 'top 91%',
      once: true,
      interval: 0.08,
      batchMax: 4,
      onEnter: function (batch) {
        gsap.fromTo(batch,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.45, stagger: 0.05, ease: 'power2.out', overwrite: 'auto' }
        );
        gsap.fromTo(batch.map(function (card) {
          return card.querySelector('.product-card__info');
        }).filter(Boolean),
          { y: 16 },
          { y: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out', overwrite: 'auto' }
        );
      }
    });

    // Collection/product grids use the same lightweight reveal pattern.
    ScrollTrigger.batch('.collection-card, .collection-grid > article, .collection-grid > a', {
      start: 'top 90%',
      once: true,
      interval: 0.08,
      batchMax: 4,
      onEnter: function (batch) {
        gsap.fromTo(batch,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.06, ease: 'power3.out', overwrite: 'auto' }
        );
      }
    });

    // Product detail page: reveal gallery and purchase content independently.
    const productLayout = document.querySelector('.product-layout');
    if (productLayout) {
      gsap.fromTo(productLayout.querySelector('.product-gallery'),
        { autoAlpha: 0, x: -24 },
        { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: productLayout, start: 'top 88%', once: true }
        }
      );
      gsap.fromTo(productLayout.querySelector('.product-details'),
        { autoAlpha: 0, x: 24 },
        { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: productLayout, start: 'top 88%', once: true }
        }
      );
    }

    const productInfo = document.querySelector('.product-information');
    if (productInfo) {
      gsap.fromTo(productInfo,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: productInfo, start: 'top 90%', once: true }
        }
      );
    }

    // Story section: lightweight opacity/translation instead of clip-path.
    const story = document.querySelector('.story-grid');
    if (story) {
      gsap.fromTo(story.querySelector('.story-map'),
        { autoAlpha: 0.65 },
        { autoAlpha: 1, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: story, start: 'top 84%', once: true }
        }
      );
      gsap.fromTo(story.querySelector('.story-content'),
        { autoAlpha: 0, x: 28 },
        { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: story, start: 'top 84%', once: true }
        }
      );
    }

    // Brand strip.
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

    // Newsletter.
    const newsletter = document.querySelector('.newsletter');
    if (newsletter) {
      gsap.fromTo(newsletter,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: newsletter, start: 'top 88%', once: true }
        }
      );
    }

    // Footer: reveal columns and bottom row only when they enter the viewport.
    ScrollTrigger.batch('.footer-col, .footer-brand-content', {
      start: 'top 94%',
      once: true,
      interval: 0.08,
      batchMax: 4,
      onEnter: function (batch) {
        gsap.fromTo(batch,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', overwrite: 'auto' }
        );
      }
    });

    const footerBottom = document.querySelector('.footer-bottom');
    if (footerBottom) {
      gsap.fromTo(footerBottom,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out',
          scrollTrigger: { trigger: footerBottom, start: 'top 96%', once: true }
        }
      );
    }

    // Wait for images/fonts/layout to settle before calculating trigger positions.
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
