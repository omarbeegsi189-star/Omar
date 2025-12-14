const STORAGE_KEYS = {
  PROFILE: 'profile',
  ORDERS: 'orders',
  FAVORITES: 'favorites'
};

/* ---------- Mock data initializer ---------- */
function ensureMockData(){
  if(!localStorage.getItem(STORAGE_KEYS.PROFILE)){
    const profile = { name: 'Alex Morgan', email: 'alex@example.com', phone: '+1 555-1234', addresses: ['123 Greenway St, Springfield', 'Apartment 5B, 77 Elm Rd'] };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }

  if(!localStorage.getItem(STORAGE_KEYS.ORDERS)){
    const orders = [
      { id: 'HB-1001', date: '2025-11-24', items: [ {name:'Quinoa Salad', qty:1, price:8.5},{name:'Green Smoothie', qty:2, price:4 } ], total:16.5, status:'delivered' },
      { id: 'HB-1009', date: '2025-11-28', items: [ {name:'Grilled Veg Wrap', qty:1, price:9},{name:'Kale Chips', qty:1, price:3} ], total:12, status:'on the way' },
      { id: 'HB-1015', date: '2025-12-01', items: [ {name:'Avocado Toast', qty:2, price:6} ], total:12, status:'preparing' }
    ];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }

  if(!localStorage.getItem(STORAGE_KEYS.FAVORITES)){
    const favs = [
      { id: 'f1', name: 'Quinoa Salad', img: 'https://via.placeholder.com/420x300/adebad?text=Quinoa+Salad', price:8.5 },
      { id: 'f2', name: 'Green Smoothie', img: 'https://via.placeholder.com/420x300/9fe3d4?text=Green+Smoothie', price:4 },
      { id: 'f3', name: 'Avocado Toast', img: 'https://via.placeholder.com/420x300/ffd8a8?text=Avocado+Toast', price:6 }
    ];
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
  }
}

/* ---------- Helpers ---------- */
function read(key){ try{ return JSON.parse(localStorage.getItem(key)); }catch(e){ return null; } }
function write(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
function q(sel, ctx=document){ return ctx.querySelector(sel); }
function qAll(sel, ctx=document){ return Array.from(ctx.querySelectorAll(sel)); }
function formatMoney(n){ return '$' + Number(n).toFixed(2); }

/* ---------- Renderers ---------- */
function loadProfile(){
  const profile = read(STORAGE_KEYS.PROFILE) || {};
  q('#profile-header-name').textContent = profile.name || '--';
  q('#profile-name-display').textContent = profile.name || '--';
  q('#profile-email-display').textContent = profile.email || '--';
  q('#profile-phone-display').textContent = profile.phone || '--';

  const addressesList = q('#addresses-list');
  addressesList.innerHTML = '';
  (profile.addresses || []).forEach((addr, idx)=>{
    const el = document.createElement('div'); el.className = 'address-item';
    el.innerHTML = `<div style="font-size:14px; color:var(--muted);">${addr}</div><div><button data-idx="${idx}" class="btn btn-ghost remove-address">Remove</button></div>`;
    addressesList.appendChild(el);
  });
}

function loadOrderHistory(){
  const orders = read(STORAGE_KEYS.ORDERS) || [];
  const list = q('#orders-list'); list.innerHTML = '';

  orders.forEach(order=>{
    const row = document.createElement('div'); row.className = 'order-row';
    const itemsText = order.items.map(i=>`${i.name} x${i.qty}`).join(', ');
    row.innerHTML = `
      <div style="display:flex; flex-direction:column;">
        <div style="font-weight:700">${order.id}</div>
        <div style="font-size:13px; color:var(--muted)">${order.date}</div>
      </div>
      <div style="flex:1; padding-left:12px; color:var(--muted);">${itemsText}</div>
      <div style="display:flex; gap:8px; align-items:center;">
        <div style="font-weight:700">${formatMoney(order.total)}</div>
        <button class="btn btn-ghost view-order" data-id="${order.id}">View Details</button>
        <button class="btn btn-primary track-order" data-id="${order.id}">Track Order</button>
      </div>
    `;
    list.appendChild(row);
  });

  // attach handlers
  qAll('.view-order').forEach(b=> b.addEventListener('click', e=> openOrderDetails(e.currentTarget.dataset.id)));
  qAll('.track-order').forEach(b=> b.addEventListener('click', e=> openTracking(e.currentTarget.dataset.id)));
}

function loadWishlist(){
  const favs = read(STORAGE_KEYS.FAVORITES) || [];
  const grid = q('#favorites-grid'); grid.innerHTML = '';
  if(favs.length === 0){
    grid.innerHTML = '<div style="color:var(--muted)">No favorite dishes yet.</div>';
    return;
  }

  // Use existing .menu-card markup and wrap each in .glass-card to preserve theme
  favs.forEach((f, idx)=>{
    const outer = document.createElement('div'); outer.className = 'glass-card'; outer.style.padding = '12px';
    const card = document.createElement('div'); card.className = 'menu-card';
    card.innerHTML = `
      <div class="menu-img-wrapper">
        <img class="menu-img" src="${f.img}" alt="${f.name}" />
      </div>
      <h3>${f.name}</h3>
      <p style="color:var(--muted);">Delicious healthy choice</p>
      <div class="menu-price">${formatMoney(f.price)}</div>
      <button class="menu-add-btn add-from-fav" data-id="${f.id}">Add</button>
      <button class="menu-add-btn remove-fav" data-id="${f.id}" style="margin-left:8px; background:#ddd; color:#333;">Remove</button>
    `;
    outer.appendChild(card);
    grid.appendChild(outer);
  });

  // bind events
  qAll('.remove-fav').forEach(b=> b.addEventListener('click', e=>{
    const id = e.currentTarget.dataset.id; removeFavorite(id);
  }));
  qAll('.add-from-fav').forEach(b=> b.addEventListener('click', e=>{
    const id = e.currentTarget.dataset.id; showToast('Added to cart');
  }));
}

/* ---------- Actions ---------- */
function updateProfile(updates={}){
  const profile = read(STORAGE_KEYS.PROFILE) || {};
  const merged = Object.assign({}, profile, updates);
  if(updates.newAddress){ merged.addresses = (merged.addresses||[]).concat([updates.newAddress]); }
  write(STORAGE_KEYS.PROFILE, merged);
  loadProfile();
  showToast('Profile Updated Successfully ✓');
}

function removeFavorite(id){
  const favs = read(STORAGE_KEYS.FAVORITES) || [];
  const next = favs.filter(f=> f.id !== id);
  write(STORAGE_KEYS.FAVORITES, next);
  loadWishlist();
  showToast('Removed from favorites');
}

function openOrderDetails(orderId){
  const orders = read(STORAGE_KEYS.ORDERS) || [];
  const o = orders.find(x=> x.id === orderId);
  const container = q('#order-details-content');
  if(!o){ container.innerHTML = '<p>Order not found</p>'; showModal('order-details-modal'); return; }
  container.innerHTML = '';
  const h = document.createElement('div'); h.innerHTML = `<h3>Order ${o.id}</h3><div style="color:var(--muted); font-size:13px">${o.date}</div><div style="margin-top:10px"></div>`;
  const items = document.createElement('div'); items.style.marginTop='8px';
  o.items.forEach(it=>{ const r = document.createElement('div'); r.style.display='flex'; r.style.justifyContent='space-between'; r.style.padding='6px 0'; r.innerHTML = `<div>${it.name} x${it.qty}</div><div>${formatMoney(it.price * it.qty)}</div>`; items.appendChild(r); });
  const total = document.createElement('div'); total.style.marginTop='12px'; total.style.fontWeight='700'; total.textContent = 'Total: '+formatMoney(o.total);
  const close = document.createElement('div'); close.style.marginTop='12px'; close.innerHTML = `<div style="display:flex; gap:8px; justify-content:flex-end;"><button class="btn btn-ghost" id="close-details">Close</button><button class="btn btn-primary" id="track-from-details" data-id="${o.id}">Track Order</button></div>`;
  container.appendChild(h); container.appendChild(items); container.appendChild(total); container.appendChild(close);
  showModal('order-details-modal');

  q('#close-details').addEventListener('click', ()=> hideModal('order-details-modal'));
  q('#track-from-details').addEventListener('click', (e)=>{ hideModal('order-details-modal'); openTracking(e.currentTarget.dataset.id); });
}

function openTracking(orderId){
  const orders = read(STORAGE_KEYS.ORDERS) || [];
  const o = orders.find(x=> x.id === orderId);
  const container = q('#tracking-content');
  if(!o){ container.innerHTML = '<p>Not found</p>'; showModal('tracking-modal'); return; }
  const states = ['preparing','on the way','delivered'];
  const idx = states.indexOf(o.status);
  container.innerHTML = `<h3>Tracking • ${o.id}</h3><div style="color:var(--muted); font-size:13px">${o.date}</div><div style="margin-top:12px;">
    <div class="progress-steps">${states.map((s,i)=>`<div class="step ${i<=idx? 'filled':''}" style="height:12px;"></div>`).join('')}</div>
    <div style="margin-top:10px; font-weight:600">Status: ${o.status}</div>
    <div style="margin-top:12px; display:flex; justify-content:flex-end;"><button class="btn btn-ghost" id="close-tracking">Close</button></div>
  </div>`;
  showModal('tracking-modal');
  q('#close-tracking').addEventListener('click', ()=> hideModal('tracking-modal'));
}

/* ---------- UI helpers ---------- */
function showModal(id){ q('#'+id).classList.add('show'); q('#'+id).setAttribute('aria-hidden','false'); }
function hideModal(id){ q('#'+id).classList.remove('show'); q('#'+id).setAttribute('aria-hidden','true'); }
function showToast(msg='Saved', timeout=2200){ const t = q('#toast'); t.textContent = msg; t.classList.add('show'); setTimeout(()=> t.classList.remove('show'), timeout); }

/* ---------- Inline editing helpers ---------- */
function toggleEditMode(){
  const card = q('.profile-card');
  const isEditing = card.classList.contains('editing');
  if(isEditing){
    cancelEdit();
  }else{
    startEdit();
  }
}

function startEdit(){
  const card = q('.profile-card');
  card.classList.add('editing');

  // Replace display elements with inputs
  const nameEl = q('#profile-name-display');
  const emailEl = q('#profile-email-display');
  const phoneEl = q('#profile-phone-display');

  const profile = read(STORAGE_KEYS.PROFILE) || {};

  nameEl.innerHTML = `<input type="text" id="edit-name" value="${profile.name || ''}" style="width:100%; padding:8px; border-radius:6px; border:1px solid rgba(0,0,0,0.1);">`;
  emailEl.innerHTML = `<input type="email" id="edit-email" value="${profile.email || ''}" style="width:100%; padding:8px; border-radius:6px; border:1px solid rgba(0,0,0,0.1);">`;
  phoneEl.innerHTML = `<input type="tel" id="edit-phone" value="${profile.phone || ''}" style="width:100%; padding:8px; border-radius:6px; border:1px solid rgba(0,0,0,0.1);">`;

  // Add save/cancel buttons
  const addressesEl = q('#addresses-list');
  addressesEl.insertAdjacentHTML('afterend', `
    <div id="edit-buttons" style="margin-top:16px; display:flex; gap:8px; justify-content:flex-end;">
      <button id="cancel-edit" class="btn btn-ghost">Cancel</button>
      <button id="save-edit" class="btn btn-primary">Save</button>
    </div>
  `);

  // Bind events
  q('#save-edit').addEventListener('click', saveProfile);
  q('#cancel-edit').addEventListener('click', cancelEdit);
}

function saveProfile(){
  const name = q('#edit-name').value.trim();
  const email = q('#edit-email').value.trim();
  const phone = q('#edit-phone').value.trim();

  updateProfile({ name, email, phone });
  showToast('Profile Updated ✓');
  cancelEdit();
}

function cancelEdit(){
  const card = q('.profile-card');
  card.classList.remove('editing');
  loadProfile(); // Reload to reset display
  const editButtons = q('#edit-buttons');
  if(editButtons) editButtons.remove();
}

/* ---------- Event wiring and init ---------- */
function init(){
  ensureMockData();
  loadProfile();
  loadOrderHistory();
  loadWishlist();

  q('#edit-profile-btn').addEventListener('click', toggleEditMode);

  q('#add-address-btn').addEventListener('click', ()=>{
    const addr = prompt('Enter new address:');
    if(addr && addr.trim()){ const p = read(STORAGE_KEYS.PROFILE) || {}; p.addresses = (p.addresses||[]).concat([addr.trim()]); write(STORAGE_KEYS.PROFILE, p); loadProfile(); showToast('Address added'); }
  });

  document.addEventListener('click', (e)=>{
    if(e.target.matches('.remove-address')){
      const idx = Number(e.target.dataset.idx); const p = read(STORAGE_KEYS.PROFILE) || {}; p.addresses = (p.addresses||[]).filter((_,i)=> i!==idx); write(STORAGE_KEYS.PROFILE, p); loadProfile(); showToast('Address removed');
    }
    if(e.target.matches('.add-from-fav')){
      // Add-to-cart hook: keep simple local event for now
      const id = e.target.dataset.id; showToast('Added to cart');
    }
  });
}

// Expose functions for the page and tests
export { loadProfile, loadOrderHistory, loadWishlist, updateProfile, openOrderDetails, openTracking };

// Backwards-compatible global
window.Profile = { init, loadProfile, loadOrderHistory, loadWishlist, updateProfile, openOrderDetails, openTracking };
