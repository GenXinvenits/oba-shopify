(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add('(min-width: 768px)', function () {
    const hero = document.querySelector('.hero');
    const heroMedia = document.querySelector('.hero-media img');

    if (hero && heroMedia) {
      gsap.to(heroMedia, {
        yPercent: 10,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2
        }
      });
    }

    gsap.utils.toArray('.category-card').forEach(function (card, index) {
      gsap.fromTo(card,
        { y: 70, opacity: 0, scale: .96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: .8,
          ease: 'power3.out',
          delay: (index % 3) * .06,
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    gsap.utils.toArray('.product-card').forEach(function (card, index) {
      gsap.fromTo(card,
        { y: 55, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: .7,
          ease: 'power2.out',
          delay: (index % 4) * .07,
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    gsap.utils.toArray('.story-media').forEach(function (media) {
      gsap.fromTo(media,
        { y: 45, clipPath: 'inset(10% 0 10% 0)' },
        {
          y: 0,
          clipPath: 'inset(0% 0 0% 0)',
          ease: 'power2.out',
          scrollTrigger: {
            trigger: media,
            start: 'top 82%',
            end: 'top 35%',
            scrub: 1
          }
        }
      );
    });

    gsap.utils.toArray('.story-content').forEach(function (content) {
      gsap.fromTo(content,
        { x: 70, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: content,
            start: 'top 82%',
            end: 'top 52%',
            scrub: 1
          }
        }
      );
    });

    gsap.utils.toArray('.brand-strip > *').forEach(function (brand, index) {
      gsap.fromTo(brand,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: .7,
          ease: 'power2.out',
          delay: index * .08,
          scrollTrigger: {
            trigger: brand,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    const newsletter = document.querySelector('.newsletter');
    if (newsletter) {
      gsap.fromTo(newsletter,
        { y: 55, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: .9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: newsletter,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  });

  window.addEventListener('load', function () {
    ScrollTrigger.refresh();
  });
})();
