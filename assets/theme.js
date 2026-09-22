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

document.addEventListener('submit',(event)=>{
  const form=event.target.closest('[data-product-card-form]');
  if(!form) return;
  event.preventDefault();
  const button=form.querySelector('button[type="submit"]');
  if(!button||button.disabled) return;
  const original=button.innerHTML;
  button.disabled=true;
  button.innerHTML='<span>Adding…</span><span aria-hidden="true">✓</span>';
  fetch(form.action,{method:'POST',headers:{Accept:'application/javascript','X-Requested-With':'XMLHttpRequest'},body:new FormData(form)})
    .then((response)=>{
      if(!response.ok) throw new Error('Cart request failed');
      return response.json();
    })
    .then((cart)=>{
      document.querySelectorAll('[data-cart-count]').forEach((el)=>{el.textContent=cart.item_count});
      button.innerHTML='<span>Added</span><span aria-hidden="true">✓</span>';
      window.setTimeout(()=>{button.disabled=false;button.innerHTML=original},1200);
    })
    .catch(()=>{
      form.submit();
    });
});
document.addEventListener('click',(event)=>{
  const toggle=event.target.closest('.collection-filter-toggle');
  if(!toggle) return;
  const filters=document.getElementById(toggle.getAttribute('aria-controls'));
  if(!filters) return;
  const open=toggle.getAttribute('aria-expanded')==='true';
  toggle.setAttribute('aria-expanded',String(!open));
  filters.hidden=open;
});
