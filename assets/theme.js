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

/* Quick View replacement: load Shopify product JSON directly instead of embedding the product page. */
(function(){
  const modal=document.querySelector('[data-quick-view-modal]');
  if(!modal) return;
  const content=modal.querySelector('[data-quick-view-content]');
  const closeButtons=modal.querySelectorAll('[data-quick-view-close]');
  let lastTrigger=null;

  const escapeHtml=(value)=>String(value??'').replace(/[&<>'"]/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const money=(cents)=>new Intl.NumberFormat(undefined,{style:'currency',currency:window.Shopify?.currency?.active||'USD'}).format(Number(cents||0)/100);

  function close(){
    modal.classList.remove('is-open');
    document.body.classList.remove('oba-quick-view-open');
    window.setTimeout(()=>{modal.hidden=true;if(content) content.innerHTML='<div class="oba-quick-view__loading">Loading product…</div>';},180);
    lastTrigger?.focus();
  }

  function render(product,productUrl){
    const images=(product.images||[]).filter(Boolean);
    const variants=(product.variants||[]).filter(Boolean);
    const firstImage=images[0]||product.featured_image;
    const imageHtml=firstImage?`<img class="oba-quick-view__main-image" data-qv-main-image src="${escapeHtml(firstImage)}" alt="${escapeHtml(product.title)}">`:'<div class="oba-quick-view__loading">No product image</div>';
    const thumbs=images.length>1?`<div class="oba-quick-view__thumbs">${images.map((src,index)=>`<button type="button" class="oba-quick-view__thumb${index===0?' is-active':''}" data-qv-thumb="${escapeHtml(src)}" aria-label="View image ${index+1}"><img src="${escapeHtml(src)}" alt=""></button>`).join('')}</div>`:'';
    const variantOptions=variants.length>1?`<div class="oba-quick-view__option"><label for="QuickViewVariant">Options</label><select id="QuickViewVariant" data-qv-variant>${variants.map((variant,index)=>`<option value="${variant.id}" data-available="${variant.available}" data-price="${variant.price}">${escapeHtml(variant.title)} — ${money(variant.price)}${variant.available?'':' — Sold out'}</option>`).join('')}</select></div>`:'';
    const selected=variants[0];
    const disabled=!selected||!selected.available;
    content.innerHTML=`<div class="oba-quick-view__product">
      <div class="oba-quick-view__gallery">${imageHtml}${thumbs}</div>
      <div class="oba-quick-view__details">
        ${product.vendor?`<div class="oba-quick-view__vendor">${escapeHtml(product.vendor)}</div>`:''}
        <h2 class="oba-quick-view__title">${escapeHtml(product.title)}</h2>
        <div class="oba-quick-view__price" data-qv-price>${money(selected?.price||product.price)}</div>
        ${product.description?`<div class="oba-quick-view__description">${product.description}</div>`:''}
        <form class="oba-quick-view__form" data-qv-form>
          ${variantOptions}
          <button class="button oba-quick-view__submit" type="submit" data-qv-submit data-variant-id="${selected?.id||''}" ${disabled?'disabled':''}>${disabled?'Sold out':'Add to cart'}</button>
          <a class="oba-quick-view__full-link" href="${escapeHtml(productUrl)}">View full product</a>
        </form>
      </div>
    </div>`;

    content.querySelectorAll('[data-qv-thumb]').forEach((thumb)=>thumb.addEventListener('click',()=>{
      const main=content.querySelector('[data-qv-main-image]');
      if(main) main.src=thumb.dataset.qvThumb;
      content.querySelectorAll('[data-qv-thumb]').forEach((item)=>item.classList.toggle('is-active',item===thumb));
    }));

    const select=content.querySelector('[data-qv-variant]');
    const price=content.querySelector('[data-qv-price]');
    const submit=content.querySelector('[data-qv-submit]');
    select?.addEventListener('change',()=>{
      const option=select.options[select.selectedIndex];
      const available=option.dataset.available==='true';
      if(price) price.textContent=money(option.dataset.price);
      if(submit){submit.dataset.variantId=option.value;submit.disabled=!available;submit.textContent=available?'Add to cart':'Sold out';}
    });

    content.querySelector('[data-qv-form]')?.addEventListener('submit',async(event)=>{
      event.preventDefault();
      const button=content.querySelector('[data-qv-submit]');
      const id=button?.dataset.variantId;
      if(!id||button?.disabled) return;
      const original=button.textContent;
      button.disabled=true;button.textContent='Adding…';
      try{
        const response=await fetch('/cart/add.js',{method:'POST',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify({items:[{id:Number(id),quantity:1}]})});
        if(!response.ok) throw new Error('Add to cart failed');
        const cartResponse=await fetch('/cart.js',{headers:{Accept:'application/json'}});
        const cart=await cartResponse.json();
        document.querySelectorAll('[data-cart-count]').forEach((el)=>{el.textContent=cart.item_count});
        document.dispatchEvent(new CustomEvent('oba:cart-updated',{detail:{cart}}));
        button.textContent='Added';
        window.setTimeout(()=>{button.disabled=false;button.textContent=original},1000);
      }catch(error){
        button.disabled=false;button.textContent=original;
        console.error('Quick View add failed',error);
      }
    });
  }

  async function open(trigger){
    const href=trigger.getAttribute('href');
    if(!href||!content) return;
    lastTrigger=trigger;
    modal.hidden=false;
    document.body.classList.add('oba-quick-view-open');
    requestAnimationFrame(()=>modal.classList.add('is-open'));
    content.innerHTML='<div class="oba-quick-view__loading">Loading product…</div>';
    try{
      const url=new URL(href,window.location.origin);
      const productEndpoint=`${url.origin}${url.pathname.replace(/\/$/,'')}.js`;
      const response=await fetch(productEndpoint,{headers:{Accept:'application/json'}});
      if(!response.ok) throw new Error(`Product request failed: ${response.status}`);
      const product=await response.json();
      render(product,`${url.pathname}${url.search}`);
    }catch(error){
      content.innerHTML='<div class="oba-quick-view__error"><div><strong>Quick view unavailable.</strong><p>Please open the full product page instead.</p></div></div>';
      console.error('Quick View load failed',error);
    }
  }

  document.addEventListener('click',(event)=>{
    const trigger=event.target.closest('[data-quick-view]');
    if(!trigger) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    open(trigger);
  });
  closeButtons.forEach((button)=>button.addEventListener('click',close));
  document.addEventListener('keydown',(event)=>{if(event.key==='Escape'&&!modal.hidden) close();});
})();
