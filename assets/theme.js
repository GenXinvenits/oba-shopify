document.addEventListener('DOMContentLoaded',()=>{
  const localizationForms=document.querySelectorAll('.footer-localization__form');
  localizationForms.forEach((form)=>{
    const country=form.querySelector('select[name="country_code"]');
    country?.addEventListener('change',()=>form.submit());
  });

  const toggle=document.querySelector('.menu-toggle');
  const nav=document.getElementById('MobileNav');
  if(toggle&&nav){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));nav.hidden=open;});}

  const hero=document.querySelector('[data-oba-hero]');
  if(hero){
    const slides=[...hero.querySelectorAll('.oba-hero-slide')];
    const dots=[...hero.querySelectorAll('[data-hero-slide]')];
    const current=hero.querySelector('[data-hero-current]');
    const next=hero.querySelector('[data-hero-next]');
    let index=0; let timer;
    const show=(nextIndex)=>{index=(nextIndex+slides.length)%slides.length;slides.forEach((slide,i)=>slide.classList.toggle('is-active',i===index));dots.forEach((dot,i)=>dot.classList.toggle('is-active',i===index));if(current) current.textContent=String(index+1).padStart(2,'0');};
    const start=()=>{clearInterval(timer);timer=setInterval(()=>show(index+1),6500);};
    dots.forEach((dot,i)=>dot.addEventListener('click',()=>{show(i);start();}));
    next?.addEventListener('click',()=>{show(index+1);start();});
    hero.addEventListener('mouseenter',()=>clearInterval(timer));
    hero.addEventListener('mouseleave',start);
    hero.addEventListener('focusin',()=>clearInterval(timer));
    hero.addEventListener('focusout',start);
    start();
  }

  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion) return;
  const revealTargets=document.querySelectorAll('.section-heading,.category-card,.product-card,.story-content,.story-media,.brand-list span,.newsletter-grid,.site-footer .footer-grid');
  revealTargets.forEach((el,index)=>{el.classList.add('oba-reveal');el.style.setProperty('--oba-delay',(Math.min(index%4,3)*70)+'ms');});
  if('IntersectionObserver' in window){const observer=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});},{threshold:.12,rootMargin:'0px 0px -40px'});revealTargets.forEach(el=>observer.observe(el));}else revealTargets.forEach(el=>el.classList.add('is-visible'));
});

document.addEventListener('submit',(event)=>{const form=event.target.closest('[data-product-card-form],[data-product-form]');if(!form)return;event.preventDefault();const button=form.querySelector('button[type="submit"]');if(!button||button.disabled)return;const original=button.innerHTML;button.disabled=true;button.innerHTML='<span>Adding…</span><span aria-hidden="true">✓</span>';fetch(form.action,{method:'POST',headers:{Accept:'application/json','X-Requested-With':'XMLHttpRequest'},body:new FormData(form)}).then((response)=>{if(!response.ok)throw new Error('Cart request failed');return response.json();}).then((cart)=>{document.querySelectorAll('[data-cart-count]').forEach((el)=>{el.textContent=cart.item_count});document.dispatchEvent(new CustomEvent('oba:cart-updated',{detail:{cart}}));button.innerHTML='<span>Added</span><span aria-hidden="true">✓</span>';window.setTimeout(()=>{button.disabled=false;button.innerHTML=original},1200);}).catch(()=>{form.submit();});});

document.addEventListener('click',(event)=>{const toggle=event.target.closest('.collection-filter-toggle');if(!toggle)return;const filters=document.getElementById(toggle.getAttribute('aria-controls'));if(!filters)return;const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));filters.hidden=open;});

(function(){
  const drawer=document.querySelector('[data-cart-drawer]');
  if(!drawer) return;
  const openers=document.querySelectorAll('[data-cart-drawer-open]');
  const closers=drawer.querySelectorAll('[data-cart-drawer-close]');
  const body=drawer.querySelector('[data-cart-drawer-body]');
  const footer=drawer.querySelector('[data-cart-drawer-footer]');
  const countEls=document.querySelectorAll('[data-cart-count]');
  const drawerCount=drawer.querySelector('[data-cart-drawer-count]');

  function openDrawer(){
    drawer.hidden=false;
    document.body.classList.add('oba-cart-open');
    requestAnimationFrame(()=>drawer.classList.add('is-open'));
  }
  function closeDrawer(){
    drawer.classList.remove('is-open');
    document.body.classList.remove('oba-cart-open');
    drawer.hidden=true;
  }
  function syncCount(count){
    countEls.forEach(el=>el.textContent=count);
    if(drawerCount) drawerCount.textContent=count;
  }
  document.addEventListener('oba:cart-updated',async function(event){
    const count=event.detail?.cart?.item_count;
    if(typeof count==='number') syncCount(count);
    try{
      await refreshDrawer();
      openDrawer();
    }catch(error){
      console.error('Cart drawer refresh failed',error);
    }
  });
  async function refreshDrawer(){
    const response=await fetch(window.location.pathname === '/cart' ? '/cart' : '/cart',{headers:{Accept:'text/html'}});
    if(!response.ok) throw new Error('Cart refresh failed');
    const html=await response.text();
    const doc=new DOMParser().parseFromString(html,'text/html');
    const nextBody=doc.querySelector('[data-cart-drawer-body]');
    const nextFooter=doc.querySelector('[data-cart-drawer-footer]');
    const nextCount=doc.querySelector('[data-cart-drawer-count]');
    if(nextBody && body) body.innerHTML=nextBody.innerHTML;
    if(nextFooter && footer){
      footer.innerHTML=nextFooter.innerHTML;
      footer.hidden=nextFooter.hidden;
    }
    if(nextCount) syncCount(nextCount.textContent.trim());
  }

  openers.forEach(el=>el.addEventListener('click',function(event){
    event.preventDefault();
    openDrawer();
  }));
  closers.forEach(el=>el.addEventListener('click',closeDrawer));

  drawer.addEventListener('click',async function(event){
    const remove=event.target.closest('[data-cart-remove]');
    if(!remove) return;
    event.preventDefault();
    remove.setAttribute('aria-busy','true');
    try{
      await fetch(remove.href,{headers:{Accept:'text/html'}});
      await refreshDrawer();
    }catch(error){
      window.location.href=remove.href;
    }
  });

  document.addEventListener('keydown',function(event){
    if(event.key==='Escape' && !drawer.hidden) closeDrawer();
  });

  document.addEventListener('click',function(event){
    const cartButton=event.target.closest('[data-cart-drawer-open]');
    if(cartButton && !drawer.hidden) openDrawer();
  });
})();


(function(){
  const modal=document.querySelector('[data-quick-view-modal]');
  if(!modal) return;
  const frame=modal.querySelector('[data-quick-view-frame]');
  const closeButtons=modal.querySelectorAll('[data-quick-view-close]');
  let lastTrigger=null;

  function closeQuickView(){
    modal.classList.remove('is-open');
    document.body.classList.remove('oba-quick-view-open');
    window.setTimeout(()=>{modal.hidden=true;if(frame) frame.src='about:blank';},180);
    lastTrigger?.focus();
  }

  function openQuickView(trigger){
    const url=trigger.getAttribute('href');
    if(!url || !frame) return;
    lastTrigger=trigger;
    frame.src=url;
    modal.hidden=false;
    document.body.classList.add('oba-quick-view-open');
    requestAnimationFrame(()=>modal.classList.add('is-open'));
  }

  document.addEventListener('click',function(event){
    const trigger=event.target.closest('[data-quick-view]');
    if(!trigger) return;
    event.preventDefault();
    openQuickView(trigger);
  });

  closeButtons.forEach(button=>button.addEventListener('click',closeQuickView));

  document.addEventListener('keydown',function(event){
    if(event.key==='Escape' && !modal.hidden) closeQuickView();
  });
})();
