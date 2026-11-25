'use strict';

const products = [
  { id: 'pack', name: 'Trail Daypack', category: 'Outdoors', price: 5900, stock: 8, icon: '🎒', tint: '#dbe9cc' },
  { id: 'lamp', name: 'Camp Lantern', category: 'Outdoors', price: 3200, stock: 5, icon: '🏮', tint: '#f4e4cd' },
  { id: 'headphones', name: 'Studio Headphones', category: 'Tech', price: 11900, stock: 4, icon: '🎧', tint: '#dce5ef' },
  { id: 'keyboard', name: 'Compact Keyboard', category: 'Tech', price: 7400, stock: 6, icon: '⌨️', tint: '#e9e2f4' },
  { id: 'mug', name: 'Stoneware Mug', category: 'Home', price: 1800, stock: 12, icon: '☕', tint: '#efe0d8' },
  { id: 'plant', name: 'Desk Planter', category: 'Home', price: 2400, stock: 0, icon: '🪴', tint: '#e3ecd8' }
];

const defects = [
  { id: 'BUG-001', test: 'TC-04', title: 'Descending prices appear in ascending order', severity: 'Medium', steps: 'Open Shop, clear filters, and choose Price: high to low.', expected: 'Studio Headphones ($119.00) appears first and Stoneware Mug ($18.00) appears last.', actual: 'Stoneware Mug appears first and Studio Headphones appears last.' },
  { id: 'BUG-002', test: 'TC-06', title: 'Cart count shows distinct products instead of units', severity: 'Low', steps: 'Start with an empty cart. Add Trail Daypack twice and inspect the header.', expected: 'The header shows Cart 2 and the cart line has quantity 2.', actual: 'The header shows Cart 1 while the cart line has quantity 2.' },
  { id: 'BUG-003', test: 'TC-08', title: 'Free shipping is missing at exactly $100', severity: 'Medium', steps: 'Start with an empty cart. Add Camp Lantern twice and Stoneware Mug twice. Open Cart and check shipping on the $100.00 subtotal.', expected: 'The $100.00 subtotal qualifies for free shipping and the total is $100.00.', actual: 'Shipping adds $8.00 and the total is $108.00.' }
];
;

const cases = [
  ['TC-01', 'Registration', 'Register a new alias with a made-up passphrase of 8+ characters. Sign out and try to register the same alias again.', 'The first registration succeeds. The duplicate alias is rejected.'],
  ['TC-02', 'Login', 'Use demo with a wrong passphrase, then use demo-pass.', 'The wrong passphrase is rejected. The demo credentials sign in successfully.'],
  ['TC-03', 'Catalog search and filtering', 'Search for camp, then select Tech. Clear the search and return to All categories.', 'Camp Lantern appears first, the combined search/filter yields no matches, and clearing both restores six items.'],
  ['TC-04', 'Price sorting', defects[0].steps, defects[0].expected],
  ['TC-05', 'Stock limits', 'Check Desk Planter, then add Studio Headphones and try setting its quantity to 5 in Cart.', 'Desk Planter is unavailable and the quantity above 4 is rejected.'],
  ['TC-06', 'Repeated cart additions', defects[1].steps, defects[1].expected],
  ['TC-07', 'Cart editing', 'Add two Trail Daypacks, change quantity to one, reload, then remove the line.', 'Quantity persists on reload. Removing the line leaves an empty cart.'],
  ['TC-08', 'Shipping threshold', defects[2].steps, defects[2].expected],
  ['TC-09', 'Simulated checkout', 'Start signed out. Add one Stoneware Mug, continue to checkout, sign in, choose a fictional address and confirm the order.', 'Checkout requires sign-in and a selected address. Completing the simulation shows a receipt and empties the cart.'],
  ['TC-10', 'Logout', 'Sign out from Account, reload, then open Account again.', 'The sign-in form stays visible after reload.'],
  ['TC-11', 'Responsive layout', 'At 375px width, navigate Shop, Cart, and QA Lab using keyboard and pointer.', 'Controls are reachable and the page has no horizontal overflow.']
];

const storageKey = 'fieldwork-qa-v1';
function readState() {
  try { return JSON.parse(localStorage.getItem(storageKey)) || {}; }
  catch { return {}; }
}
const saved = readState();
const state = { accounts: {}, user: '', cart: {}, seeded: true, ...saved };
const filters = { query: '', category: '', sort: 'featured' };
let accountMode = 'login';
let afterLogin = 'account';
let receipt = null;
let noticeTimer;
const main = document.querySelector('#main');
const money = cents => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const route = () => location.hash.slice(1) || 'shop';
const cartLines = () => products.filter(product => state.cart[product.id]);
const units = () => cartLines().reduce((count, product) => count + state.cart[product.id], 0);

function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); }
  catch { /* The current tab still works when browser storage is unavailable. */ }
}
function updateHeader() {
  document.querySelector('#cart-count').textContent = state.seeded ? cartLines().length : units();
  document.querySelector('#account-link').textContent = state.user ? 'Account' : 'Sign in';
  document.querySelectorAll('nav a').forEach(link => {
    if (link.hash === '#' + route()) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}
function notify(message) {
  const notice = document.querySelector('#notice');
  notice.textContent = message;
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => { notice.textContent = ''; }, 2400);
}
function catalog() {
  const query = filters.query.trim().toLowerCase();
  const matches = products.filter(product =>
    product.name.toLowerCase().includes(query) && (!filters.category || product.category === filters.category));
  if (filters.sort === 'low' || filters.sort === 'high') {
    const direction = filters.sort === 'high' && !state.seeded ? -1 : 1;
    matches.sort((a, b) => direction * (a.price - b.price)); // BUG-001
  }
  return matches;
}
function totals() {
  const subtotal = cartLines().reduce((sum, product) => sum + product.price * state.cart[product.id], 0);
  const qualifies = state.seeded ? subtotal > 10000 : subtotal >= 10000; // BUG-003
  const shipping = subtotal && !qualifies ? 800 : 0;
  return { subtotal, shipping, total: subtotal + shipping };
}
function summary() {
  const { subtotal, shipping, total } = totals();
  return `<h2>Order summary</h2>
    <p class="split"><span>Subtotal</span><span>${money(subtotal)}</span></p>
    <p class="split"><span>Shipping</span><span>${shipping ? money(shipping) : 'Free'}</span></p>
    <p class="split total price"><span>Total</span><span>${money(total)}</span></p>
    <p class="meta">Free demo shipping on orders of $100 or more.</p>`;
}
function renderCatalog() {
  const matches = catalog();
  document.querySelector('#result-count').textContent = `${matches.length} product${matches.length === 1 ? '' : 's'}`;
  document.querySelector('#products').innerHTML = matches.map(product => `
    <article class="card">
      <div class="product-art" style="--tint:${product.tint}" aria-hidden="true">${product.icon}</div>
      <div class="card-body">
        <span class="meta">${product.category} · ${product.stock ? product.stock + ' in stock' : 'Out of stock'}</span>
        <h3>${product.name}</h3>
        <div class="card-bottom"><span class="price">${money(product.price)}</span>
          <button class="btn" data-add="${product.id}" aria-label="Add ${product.name} to cart" ${product.stock ? '' : 'disabled'}>Add to cart</button>
        </div>
      </div>
    </article>`).join('') || '<p>No matching products. Try a different search or category.</p>';
}
function shop() {
  main.innerHTML = `<section class="hero"><div><span class="eyebrow">QA practice storefront</span>
    <h1>Everyday gear<br>for fieldwork.</h1><p>Shop demo goods, then put the storefront through its paces in the QA Lab.</p></div>
    <div class="hero-art" aria-hidden="true">🎒</div></section>
    <section aria-labelledby="catalog-title"><h2 id="catalog-title">Shop the collection</h2>
    <div class="toolbar">
      <label>Search products<input type="search" id="query" placeholder="Try camp or mug" value="${escapeHtml(filters.query)}"></label>
      <label>Category<select id="category"><option value="">All categories</option><option>Outdoors</option><option>Tech</option><option>Home</option></select></label>
      <label>Sort by<select id="sort"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label>
    </div><p class="meta" id="result-count" role="status"></p><div class="grid" id="products"></div></section>`;
  document.querySelector('#category').value = filters.category;
  document.querySelector('#sort').value = filters.sort;
  renderCatalog();
}
function account() {
  if (state.user) {
    main.innerHTML = `<h1>Account</h1><section class="panel narrow"><h2>Signed in as ${escapeHtml(state.user)}</h2>
      <button class="btn" data-action="logout">Sign out</button></section>`;
    return;
  }
  const register = accountMode === 'register';
  main.innerHTML = `<h1>${register ? 'Create a demo account' : 'Sign in'}</h1>
    <section class="panel narrow stack"><div class="callout">Use demo / demo-pass or create a fictional alias and passphrase. Demo accounts are stored in this browser.</div>
    <form class="stack" id="account-form">
      <label>Alias<input name="alias" required minlength="3" maxlength="24" pattern="[A-Za-z0-9_]{3,24}" title="3–24 letters, numbers, or underscores" autocomplete="off"></label>
      <label>Demo passphrase<input type="password" name="password" required ${register ? 'minlength="8"' : ''} maxlength="80" autocomplete="off"></label>
      <p class="error" role="alert"></p><button class="btn">${register ? 'Create account' : 'Sign in'}</button>
    </form><button class="btn secondary" data-action="account-mode">${register ? 'Use an existing demo account' : 'Create a demo account'}</button>
    </section>`;
}
function cart() {
  const lines = cartLines();
  main.innerHTML = '<h1>Your cart</h1>' + (lines.length ? `<div class="cols">
    <section class="panel"><h2>Items</h2>${lines.map(product => `<div class="line-item">
      <div><strong>${product.name}</strong><span class="meta">${money(product.price)} each · ${product.stock} available</span></div>
      <form data-quantity="${product.id}" class="split"><label>Quantity<input aria-label="Quantity for ${product.name}" type="number" name="quantity" min="1" max="${product.stock}" value="${state.cart[product.id]}" required></label>
      <button class="btn secondary">Update</button></form>
      <button class="btn secondary" data-remove="${product.id}" aria-label="Remove ${product.name}">Remove</button>
    </div>`).join('')}</section><aside class="panel">${summary()}<a class="btn" href="#checkout">Continue to checkout</a></aside></div>`
    : '<section class="panel narrow"><p>Your cart is empty.</p><a class="btn" href="#shop">Browse products</a></section>');
}
function checkout() {
  if (!cartLines().length) {
    main.innerHTML = '<h1>Checkout</h1><p>Your cart is empty.</p><a class="btn" href="#shop">Browse products</a>';
    return;
  }
  if (!state.user) {
    main.innerHTML = '<h1>Checkout</h1><section class="panel narrow"><p>Sign in with a demo account to continue.</p><button class="btn" data-action="checkout-login">Sign in to continue</button></section>';
    return;
  }
  main.innerHTML = `<h1>Checkout simulation</h1><div class="cols">
    <section class="panel"><h2>Demo delivery</h2><p>Choose a fictional address. No payment or personal details are collected.</p>
    <form class="stack" id="checkout-form">
      <label>Demo address<select name="address" required><option value="">Select an address</option><option>101 Example Lane, Test City</option><option>202 Sample Road, Demo Town</option></select></label>
      <label class="check"><input type="checkbox" required> I understand this order is simulated.</label>
      <button class="btn">Place demo order</button>
    </form></section><aside class="panel">${summary()}</aside></div>`;
}
function confirmation() {
  main.innerHTML = receipt ? `<h1>Demo order confirmed</h1><section class="panel narrow">
    <h2>${receipt.id}</h2><p>${receipt.units} unit(s) · ${money(receipt.total)}</p>
    <p>Delivery selection: ${escapeHtml(receipt.address)}</p><p>No payment was taken and nothing will ship.</p>
    <a class="btn" href="#shop">Continue shopping</a></section>`
    : '<h1>Order confirmation</h1><p>No order receipt is available in this session.</p><a class="btn" href="#shop">Back to shop</a>';
}
function qa() {
  main.innerHTML = `<div class="qa stack"><header><h1>QA Lab</h1>
    <p class="muted">Run manual tests against a local demo storefront. The seeded defects below are intentional practice scenarios.</p></header>
    <section class="panel stack"><h2>Practice environment</h2>
      <label class="check"><input id="seeded" type="checkbox" ${state.seeded ? 'checked' : ''}> Enable deliberately seeded defects</label>
      <p>Use the seeded mode for defect discovery and baseline mode to verify the expected behavior. Sign in with <strong>demo</strong> and <strong>demo-pass</strong>.</p>
      <button class="btn secondary" data-action="reset">Reset demo data</button>
    </section>
    <section class="panel"><h2>Manual test cases</h2><p>Record your own results using the portfolio templates. Start cart cases with an empty cart.</p>
      ${cases.map(([id, name, steps, expected]) => `<details><summary>${id} · ${name}</summary><p><strong>Steps</strong> ${steps}</p><p><strong>Expected</strong> ${expected}</p></details>`).join('')}
    </section>
    <section class="panel"><h2>Seeded defect reports</h2><p>Expand a report when you are ready to compare your findings.</p>
      ${defects.map(defect => `<details><summary>${defect.id} · ${defect.title}</summary>
        <p><strong>Severity</strong> ${defect.severity} · <strong>Test case</strong> ${defect.test} · <strong>Status</strong> Deliberately seeded</p>
        <p><strong>Reproduce</strong> ${defect.steps}</p><p><strong>Expected</strong> ${defect.expected}</p><p><strong>Actual in seeded mode</strong> ${defect.actual}</p>
      </details>`).join('')}
    </section></div>`;
}
function render() {
  const pages = { shop, account, cart, checkout, confirmation, qa };
  (Object.hasOwn(pages, route()) ? pages[route()] : shop)();
  updateHeader();
}

main.addEventListener('input', event => {
  if (event.target.id !== 'query') return;
  filters.query = event.target.value;
  renderCatalog();
});
main.addEventListener('change', event => {
  const { id, value, checked } = event.target;
  if (id === 'category' || id === 'sort') {
    filters[id] = value;
    renderCatalog();
  }
  if (id === 'seeded') {
    state.seeded = checked;
    persist();
    updateHeader();
    notify(checked ? 'Seeded mode enabled.' : 'Baseline mode enabled.');
  }
});
main.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  const { add, remove, action } = button.dataset;
  if (add) {
    const product = products.find(item => item.id === add);
    const quantity = state.cart[add] || 0;
    if (quantity >= product.stock) return notify('You reached the available stock.');
    state.cart[add] = quantity + 1;
    persist();
    updateHeader();
    notify(product.name + ' added to cart.');
  }
  if (remove) {
    delete state.cart[remove];
    persist();
    render();
    (main.querySelector('[data-remove]') || main.querySelector('a'))?.focus();
    notify('Item removed.');
  }
  if (action === 'account-mode') {
    accountMode = accountMode === 'login' ? 'register' : 'login';
    account();
    main.querySelector('input').focus();
  }
  if (action === 'checkout-login') {
    afterLogin = 'checkout';
    accountMode = 'login';
    location.hash = 'account';
  }
  if (action === 'logout') {
    state.user = '';
    receipt = null;
    accountMode = 'login';
    afterLogin = 'account';
    persist();
    render();
    notify('Signed out.');
  }
  if (action === 'reset' && confirm('Clear local demo accounts and your cart, and restore seeded mode?')) {
    Object.assign(state, { accounts: {}, user: '', cart: {}, seeded: true });
    Object.assign(filters, { query: '', category: '', sort: 'featured' });
    afterLogin = 'account';
    accountMode = 'login';
    receipt = null;
    persist();
    render();
    main.querySelector('[data-action="reset"]').focus();
    notify('Demo data reset.');
  }
});

main.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.target;
  if (!form.reportValidity()) return;
  const fields = new FormData(form);
  if (form.id === 'account-form') {
    const alias = fields.get('alias').toLowerCase();
    const password = fields.get('password');
    const registered = alias === 'demo' || Object.hasOwn(state.accounts, alias);
    const error = form.querySelector('.error');
    if (accountMode === 'register') {
      if (registered) { error.textContent = 'This alias is already registered.'; return; }
      Object.defineProperty(state.accounts, alias, { value: password, enumerable: true, writable: true, configurable: true });
    } else if (!registered || password !== (alias === 'demo' ? 'demo-pass' : state.accounts[alias])) {
      error.textContent = 'Alias or demo passphrase is incorrect.';
      return;
    }
    state.user = alias;
    persist();
    const destination = afterLogin;
    afterLogin = 'account';
    accountMode = 'login';
    if (route() === destination) render();
    else location.hash = destination;
    notify('Signed in.');
  }
  if (form.dataset.quantity) {
    state.cart[form.dataset.quantity] = Number(fields.get('quantity'));
    persist();
    render();
    main.querySelector(`[data-quantity="${form.dataset.quantity}"] input`).focus();
    notify('Quantity updated.');
  }
  if (form.id === 'checkout-form' && state.user && cartLines().length) {
    receipt = { id: 'DEMO-' + Date.now().toString(36).toUpperCase(), address: fields.get('address'), units: units(), total: totals().total };
    state.cart = {};
    persist();
    location.hash = 'confirmation';
  }
});
window.addEventListener('hashchange', () => {
  if (route() !== 'account') afterLogin = 'account';
  render();
  window.scrollTo(0, 0);
  const heading = main.querySelector('h1');
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
});
render();

