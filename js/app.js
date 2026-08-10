(function(){
  const data=window.TYKA_DATA;
  const state={
    cart:window.TYKA_CART.cart,
    activeProduct:null,
    activeSize:null,
    productQty:1,
    activeCombo:null,
    comboSelections:[]
  };

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const money=v=>v==null?'Preço a confirmar':new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v);

  function showToast(message){
    const t=$('[data-toast]');
    if(!t)return;
    t.textContent=message;t.hidden=false;
    clearTimeout(showToast._t);showToast._t=setTimeout(()=>t.hidden=true,1900);
  }

  function renderProducts(){
    const grid=$('#productGrid');
    grid.innerHTML=data.products.map(p=>`
      <article class="product-card" style="--card-accent:${p.accent};--card-soft:${p.soft}" data-product-card="${p.id}">
        ${p.featured?'<span class="product-badge">✨ Mais pedido</span>':''}
        <div class="product-media">
          ${p.image?`<img src="${p.image}" alt="Iogurte TykaYurt sabor ${p.name}" loading="lazy">`:`<div class="product-placeholder"><div><span>🫐</span><strong>${p.name}</strong><small>${p.note||'Foto em breve'}</small></div></div>`}
        </div>
        <div class="product-body">
          <div class="product-title-row"><h3>${p.name}</h3></div>
          <p>${p.description}</p>
          <div class="size-pills">${p.sizes.map(s=>`<span class="size-pill">${s.label}</span>`).join('')}</div>
          <div class="price-consult">Consulte o valor individual</div>
          <button class="btn btn-secondary" data-action="open-product" data-product="${p.id}">Escolher</button>
        </div>
      </article>
    `).join('');
  }

  function renderCombos(){
    const grid=$('#comboGrid');
    grid.innerHTML=data.combos.map(c=>`
      <article class="combo-card">
        <span class="combo-tag">${c.badge}</span>
        <h3>${c.name}</h3>
        <div class="combo-price">${c.qty} por ${money(c.price)}</div>
        <p>${c.description}</p>
        <div class="combo-visual">${window.TYKA_COMBOS.renderCups(c.qty)}</div>
        <button class="btn btn-primary" data-action="open-combo" data-combo="${c.id}">Montar combo</button>
      </article>
    `).join('');
  }

  function renderExtras(){
    const grid=$('#extraGrid');
    grid.innerHTML=data.extras.map(e=>`
      <article class="extra-card">
        <div class="extra-icon" aria-hidden="true">${e.icon}</div>
        <div class="extra-copy"><h3>${e.name} ${e.unit}</h3><p>${e.description}</p><div class="extra-price">${money(e.price)}</div></div>
        <button class="extra-add" data-action="add-extra" data-extra="${e.id}" aria-label="Adicionar ${e.name}">+</button>
      </article>
    `).join('');
  }

  function knownTotal(){return state.cart.reduce((sum,item)=>sum+(item.price==null?0:item.price*item.qty),0)}
  function count(){return state.cart.reduce((n,i)=>n+i.qty,0)}
  function hasUnknown(){return state.cart.some(i=>i.price==null)}
  function persist(){window.TYKA_CART.save(state.cart)}

  function bumpCart(){
    const btn=$('.cart-button'); if(!btn)return;
    btn.classList.remove('is-bumped'); void btn.offsetWidth; btn.classList.add('is-bumped');
  }

  function updateCartUI(){
    const c=count();
    $$('[data-cart-count]').forEach(el=>el.textContent=c);
    const mobile=$('[data-mobile-cart]');
    if(c){
      mobile.hidden=false;
      $('[data-mobile-cart-count]').textContent=`${c} ${c===1?'item':'itens'}`;
      $('[data-mobile-cart-total]').textContent=hasUnknown()?`${money(knownTotal())} + itens a confirmar`:money(knownTotal());
    }else mobile.hidden=true;

    const wrap=$('[data-cart-items]');
    if(!c){
      wrap.innerHTML='<div class="cart-empty">Seu pedido está vazio.<br>Escolha um sabor, combo ou acompanhamento.</div>';
    }else{
      wrap.innerHTML=state.cart.map((item,idx)=>`
        <article class="cart-item">
          <div><h4>${item.name}</h4><p>${item.meta||''}</p><p>${item.price==null?'Preço a confirmar':`${money(item.price)} cada`}</p></div>
          <div class="cart-item-actions">
            <button data-action="cart-minus" data-index="${idx}" aria-label="Diminuir">−</button>
            <strong>${item.qty}</strong>
            <button data-action="cart-plus" data-index="${idx}" aria-label="Aumentar">+</button>
          </div>
        </article>`).join('');
    }
    $('[data-cart-total]').textContent=money(knownTotal());
    $('[data-cart-note]').hidden=!hasUnknown();
    persist();
  }

  function lock(){document.body.classList.add('is-locked')}
  function unlock(){document.body.classList.remove('is-locked')}
  function openOverlay(){const o=$('[data-overlay]');o.hidden=false;lock()}
  function closeOverlay(){const o=$('[data-overlay]');o.hidden=true;unlock()}

  function openCart(){
    $('[data-cart-drawer]').classList.add('is-open');
    $('[data-cart-drawer]').setAttribute('aria-hidden','false');
    openOverlay();window.TYKA_TRACK?.('cart_open',{items:count()});
  }
  function closeCart(){
    $('[data-cart-drawer]').classList.remove('is-open');
    $('[data-cart-drawer]').setAttribute('aria-hidden','true');
    closeOverlay();
  }

  function openProduct(id){
    const p=data.products.find(x=>x.id===id); if(!p)return;
    state.activeProduct=p;state.activeSize=p.sizes[0];state.productQty=1;
    $('[data-product-name]').textContent=p.name;
    $('[data-product-description]').textContent=p.description;
    $('[data-product-qty]').textContent='1';
    $('[data-product-media]').innerHTML=p.image?`<img src="${p.image}" alt="${p.name}">`:`<div class="modal-product-media placeholder"><div><strong>${p.name}</strong><span>${p.note||'Foto em breve'}</span></div></div>`;
    $('[data-size-options]').innerHTML=p.sizes.map((s,i)=>`
      <button class="size-option ${i===0?'is-selected':''}" data-action="select-size" data-size-index="${i}"><strong>${s.label}</strong><span>${money(s.price)}</span></button>`).join('');
    $('[data-product-modal]').hidden=false;openOverlay();
    window.TYKA_TRACK?.('product_view',{product:p.id});
  }
  function closeProduct(){ $('[data-product-modal]').hidden=true; closeOverlay(); }

  function addProduct(){
    const p=state.activeProduct,s=state.activeSize;if(!p||!s)return;
    state.cart.push({type:'product',id:`${p.id}-${s.label}-${Date.now()}`,baseId:p.id,name:p.name,meta:s.label,price:s.price,qty:state.productQty});
    updateCartUI();bumpCart();showToast(`${p.name} adicionado ao pedido`);
    window.TYKA_TRACK?.('add_to_cart',{type:'product',product:p.id,size:s.label,qty:state.productQty});
    closeProduct();
  }

  function openCombo(id){
    const c=data.combos.find(x=>x.id===id);if(!c)return;
    state.activeCombo=c;state.comboSelections=Array(c.qty).fill('');
    $('[data-combo-name]').textContent=c.name;
    $('[data-combo-description]').textContent=c.description;
    $('[data-combo-price]').textContent=money(c.price);
    $('[data-combo-selectors]').innerHTML=Array.from({length:c.qty},(_,i)=>`
      <div class="combo-selector" data-combo-row="${i}">
        <label for="comboFlavor${i}">Pote ${i+1}</label>
        <select id="comboFlavor${i}" data-combo-flavor data-index="${i}">
          <option value="">Escolha um sabor</option>
          ${data.products.map(p=>`<option value="${p.name}">${p.name}</option>`).join('')}
        </select>
      </div>`).join('');
    $('[data-combo-dots]').innerHTML=Array.from({length:c.qty},()=>'<span class="combo-dot"></span>').join('');
    updateComboProgress();
    $('[data-combo-modal]').hidden=false;openOverlay();
    window.TYKA_TRACK?.('combo_open',{combo:c.id});
  }
  function closeCombo(){ $('[data-combo-modal]').hidden=true; closeOverlay(); }

  function updateComboProgress(){
    const total=state.activeCombo?.qty||0;
    const selected=state.comboSelections.filter(Boolean).length;
    const percent=window.TYKA_COMBOS.progress(selected,total);
    $('[data-combo-progress-text]').textContent=`${selected} de ${total} selecionados`;
    $('[data-combo-progress-percent]').textContent=`${percent}%`;
    $('[data-combo-progress-bar]').style.width=`${percent}%`;
    $$('.combo-dot').forEach((d,i)=>d.classList.toggle('is-filled',i<selected));
    const add=$('[data-combo-add]');if(add)add.disabled=selected!==total;
  }

  function addCombo(){
    const c=state.activeCombo;if(!c)return;
    const flavors=state.comboSelections.filter(Boolean);if(flavors.length!==c.qty)return;
    state.cart.push({type:'combo',id:`${c.id}-${Date.now()}`,baseId:c.id,name:c.name,meta:`${c.qty} × ${c.size} • ${flavors.join(', ')}`,price:c.price,qty:1});
    updateCartUI();bumpCart();showToast(`${c.name} adicionado ao pedido`);
    window.TYKA_TRACK?.('combo_complete',{combo:c.id,flavors});
    closeCombo();
  }

  function addExtra(id,button){
    const e=data.extras.find(x=>x.id===id);if(!e)return;
    const existing=state.cart.find(i=>i.type==='extra'&&i.baseId===e.id);
    if(existing)existing.qty++;else state.cart.push({type:'extra',baseId:e.id,id:`${e.id}-${Date.now()}`,name:e.name,meta:e.unit,price:e.price,qty:1});
    updateCartUI();bumpCart();showToast(`${e.name} adicionado`);
    if(button){button.textContent='✓';button.classList.add('is-added');setTimeout(()=>{button.textContent='+';button.classList.remove('is-added')},950)}
    window.TYKA_TRACK?.('extra_add',{extra:e.id});
  }

  document.addEventListener('change',e=>{
    const select=e.target.closest('[data-combo-flavor]');if(!select)return;
    const i=Number(select.dataset.index);state.comboSelections[i]=select.value;
    select.closest('.combo-selector')?.classList.toggle('is-selected',Boolean(select.value));
    updateComboProgress();
    window.TYKA_TRACK?.('combo_flavor_select',{combo:state.activeCombo?.id,index:i,flavor:select.value||null});
  });

  document.addEventListener('click',e=>{
    const btn=e.target.closest('[data-action]');if(!btn)return;
    const action=btn.dataset.action;
    if(action==='toggle-menu'){
      const nav=$('[data-mobile-nav]');nav.classList.toggle('is-open');btn.setAttribute('aria-expanded',nav.classList.contains('is-open'));
    }
    if(action==='open-cart')openCart();
    if(action==='close-cart')closeCart();
    if(action==='open-product')openProduct(btn.dataset.product);
    if(action==='close-product')closeProduct();
    if(action==='select-size'){
      const i=Number(btn.dataset.sizeIndex);state.activeSize=state.activeProduct.sizes[i];
      $$('.size-option').forEach(x=>x.classList.remove('is-selected'));btn.classList.add('is-selected');
      window.TYKA_TRACK?.('size_select',{product:state.activeProduct.id,size:state.activeSize.label});
    }
    if(action==='qty-minus'){state.productQty=Math.max(1,state.productQty-1);$('[data-product-qty]').textContent=state.productQty}
    if(action==='qty-plus'){state.productQty++;$('[data-product-qty]').textContent=state.productQty}
    if(action==='add-product')addProduct();
    if(action==='open-combo')openCombo(btn.dataset.combo);
    if(action==='close-combo')closeCombo();
    if(action==='add-combo')addCombo();
    if(action==='add-extra')addExtra(btn.dataset.extra,btn);
    if(action==='cart-minus'){const i=Number(btn.dataset.index);state.cart[i].qty--;if(state.cart[i].qty<=0)state.cart.splice(i,1);updateCartUI()}
    if(action==='cart-plus'){state.cart[Number(btn.dataset.index)].qty++;updateCartUI()}
    if(action==='clear-cart'){state.cart=[];updateCartUI();showToast('Pedido limpo')}
    if(action==='checkout-whatsapp')window.TYKA_WHATSAPP.open({cart:state.cart,useCart:true,number:data.whatsappNumber});
    if(action==='open-whatsapp')window.TYKA_WHATSAPP.open({cart:state.cart,useCart:false,number:data.whatsappNumber});
  });

  $('[data-overlay]').addEventListener('click',()=>{
    if(!$('[data-product-modal]').hidden)closeProduct();
    else if(!$('[data-combo-modal]').hidden)closeCombo();
    else closeCart();
  });

  document.addEventListener('keydown',e=>{
    if(e.key!=='Escape')return;
    if(!$('[data-product-modal]').hidden)closeProduct();
    else if(!$('[data-combo-modal]').hidden)closeCombo();
    else if($('[data-cart-drawer]').classList.contains('is-open'))closeCart();
  });

  $$('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>{
    $('[data-mobile-nav]').classList.remove('is-open');$('[data-action="toggle-menu"]').setAttribute('aria-expanded','false');
  }));

  renderProducts();renderCombos();renderExtras();updateCartUI();
  requestAnimationFrame(()=>document.querySelectorAll('.stagger-grid').forEach(el=>{
    const r=el.getBoundingClientRect();if(r.top<innerHeight*.9)el.classList.add('is-visible');
  }));
})();
