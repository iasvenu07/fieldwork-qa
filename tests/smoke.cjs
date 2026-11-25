const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(require('node:path').join(__dirname, '..', 'app.js'), 'utf8');
const nodes = new Map();
const handlers = {};
function node(selector) {
  if (!nodes.has(selector)) nodes.set(selector, {
    innerHTML: '', textContent: '', addEventListener(type, fn) { handlers[type] = fn; },
    querySelector: node, focus() {}
  });
  return nodes.get(selector);
}
const storage = new Map();
const context = vm.createContext({
  document: { querySelector: node, querySelectorAll: () => [] },
  window: { addEventListener() {}, scrollTo() {} }, location: { hash: '' },
  localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) },
  setTimeout() {}, clearTimeout() {}, confirm: () => true, FormData: class { constructor(form) { return new Map(Object.entries(form.fields)); } }
});
vm.runInContext(source, context);
const evaluate = code => vm.runInContext(code, context);
const click = dataset => handlers.click({ target: { closest: () => ({ dataset }) } });
const form = (id, fields, dataset = {}) => handlers.submit({
  preventDefault() {}, target: { id, fields, dataset, reportValidity: () => true, querySelector: node }
});
assert.match(node('#products').innerHTML, /Studio Headphones/);
handlers.input({ target: { id: 'query', value: ' camp ' } });
assert.equal(node('#result-count').textContent, '1 product');
handlers.change({ target: { id: 'category', value: 'Tech' } });
assert.equal(node('#result-count').textContent, '0 products');
evaluate("filters.category = ''; filters.query = ''; filters.sort = 'high'");
for (const id of ['mug', 'lamp', 'mug', 'lamp']) click({ add: id });
assert.equal(evaluate('catalog()[0].id'), 'mug');
assert.equal(node('#cart-count').textContent, 2);
assert.equal(evaluate('totals().total'), 10800);
handlers.change({ target: { id: 'seeded', checked: false } });
assert.equal(evaluate('catalog()[0].id'), 'headphones');
assert.equal(node('#cart-count').textContent, 4);
assert.equal(evaluate('totals().total'), 10000);
evaluate("location.hash = '#checkout'; render()");
assert.match(node('#main').innerHTML, /Sign in with a demo account/);
click({ action: 'checkout-login' });
form('account-form', { alias: 'demo', password: 'wrong' });
assert.match(node('.error').textContent, /incorrect/);
form('account-form', { alias: 'demo', password: 'demo-pass' });
assert.equal(evaluate('state.user'), 'demo');
evaluate("location.hash = '#checkout'; render()");
assert.match(node('#main').innerHTML, /Place demo order/);
form('checkout-form', { address: '101 Example Lane, Test City' });
assert.equal(evaluate('units()'), 0);
evaluate("location.hash = '#confirmation'; render()");
assert.match(node('#main').innerHTML, /Demo order confirmed/);
click({ action: 'logout' });
assert.equal(evaluate('state.user'), '');
evaluate("location.hash = '#account'; render()");
click({ action: 'account-mode' });
form('account-form', { alias: 'tester_01', password: 'practice-only' });
assert.equal(evaluate('state.user'), 'tester_01');
click({ action: 'logout' });
click({ action: 'account-mode' });
form('account-form', { alias: 'tester_01', password: 'practice-only' });
assert.match(node('.error').textContent, /already registered/);
evaluate("location.hash = '#cart'; render()");
click({ add: 'pack' });
form('', { quantity: '2' }, { quantity: 'pack' });
assert.equal(evaluate('units()'), 2);
click({ remove: 'pack' });
assert.equal(evaluate('units()'), 0);
evaluate("location.hash = '#qa'; render()");
assert.match(node('#main').innerHTML, /BUG-003/);
click({ action: 'reset' });
assert.equal(evaluate('state.seeded'), true);
assert.equal(JSON.parse([...storage.values()][0]).user, '');
console.log('Passed storefront smoke checks and all three seeded/baseline comparisons.');
