document.addEventListener('DOMContentLoaded',()=>{
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.getElementById('MobileNav');
  if(toggle&&nav){
    toggle.addEventListener('click',()=>{
      const open=toggle.getAttribute('aria-expanded')==='true';
      toggle.setAttribute('aria-expanded',String(!open));
      nav.hidden=open;
    });
  }

  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion) return;

  const revealTargets=document.querySelectorAll('.section-heading,.category-card,.product-card,.story-content,.story-media,.brand-list span,.newsletter-grid,.site-footer .footer-grid');
  revealTargets.forEach((el,index)=>{
    el.classList.add('oba-reveal');
    el.style.setProperty('--oba-delay',`${Math.min(index%4,3)*70}ms`);
  });

  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.12,rootMargin:'0px 0px -40px'});
    revealTargets.forEach(el=>observer.observe(el));
  }else{
    revealTargets.forEach(el=>el.classList.add('is-visible'));
  }
});
