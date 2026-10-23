// ITCS333 A3 autograder — Jest + jsdom. DO NOT MODIFY.
// Official grading uses the instructor's pristine copy.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const bodyHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')
  .replace(/^[\s\S]*?<body[^>]*>/, '')
  .replace(/<\/body>[\s\S]*$/, '')
  .replace(/<script[^>]*><\/script>/g, '');

let appJs = '';
try {
  appJs = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
} catch (e) { /* reported in tests */ }

// Fresh jsdom per test — no listener or DOM leakage between tests.
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = global.TextEncoder || TextEncoder;
global.TextDecoder = global.TextDecoder || TextDecoder;
const { JSDOM } = require('jsdom');
let dom, document, window;

function loadApp() {
  dom = new JSDOM(`<!DOCTYPE html><html><body>${bodyHtml}</body></html>`, {
    url: 'http://localhost/',
    runScripts: 'dangerously'
  });
  window = dom.window;
  document = window.document;
  const script = document.createElement('script');
  script.textContent = appJs;
  document.body.appendChild(script);
  // The injected script registers its own DOMContentLoaded listener if needed;
  // jsdom fires it automatically when parsing finishes.
}

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const items = () => $$('#todo-list li');
const counterText = () => $('#counter').textContent;

function addItem(text) {
  $('#todo-input').value = text;
  $('#todo-form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
}

beforeEach(() => {
  loadApp();
});

describe('A3 — To-Do App', () => {

  test('1. add appends exactly one <li> with entered text (15)', () => {
    addItem('Buy milk');
    expect(items().length).toBe(1);
    expect(items()[0].textContent).toContain('Buy milk');
    addItem('Study JS');
    expect(items().length).toBe(2);
  });

  test('2. empty submission adds nothing and shows #error-msg (10)', () => {
    addItem('   ');
    expect(items().length).toBe(0);
    const err = $('#error-msg');
    const visible = !err.classList.contains('hidden') && err.style.display !== 'none';
    expect(visible).toBe(true);
  });

  test('3. clicking item text toggles completed class (15)', () => {
    addItem('Task A');
    const li = items()[0];
    (li.querySelector('.item-text') || li).dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    expect(items()[0].classList.contains('completed')).toBe(true);
    (items()[0].querySelector('.item-text') || items()[0]).dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    expect(items()[0].classList.contains('completed')).toBe(false);
  });

  test('4. delete button removes the item (15)', () => {
    addItem('To delete');
    const btn = items()[0].querySelector('.delete-btn') || items()[0].querySelector('button');
    expect(btn).not.toBeNull();
    btn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    expect(items().length).toBe(0);
  });

  test('5. filters show/hide correct items (15)', () => {
    addItem('Active task');
    addItem('Done task');
    (items()[1].querySelector('.item-text') || items()[1]).dispatchEvent(new window.MouseEvent('click', { bubbles: true }));

    const visible = () => items().filter((li) => li.style.display !== 'none' && !li.classList.contains('hidden'));

    $('#filter-active').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    let vis = visible();
    expect(vis.length).toBe(1);
    expect(vis[0].textContent).toContain('Active task');

    $('#filter-done').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    vis = visible();
    expect(vis.length).toBe(1);
    expect(vis[0].textContent).toContain('Done task');

    $('#filter-all').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    expect(visible().length).toBe(2);
  });

  test('6. counter updates after each operation (10)', () => {
    expect(/0\s+item/.test(counterText())).toBe(true);
    addItem('One');
    expect(/1\s+item/.test(counterText())).toBe(true);
    addItem('Two');
    expect(/2\s+item/.test(counterText())).toBe(true);
    (items()[0].querySelector('.item-text') || items()[0]).dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    expect(/1\s+item/.test(counterText())).toBe(true); // one completed
  });

  test('7. event delegation: listener on #todo-list, not per-item (10)', () => {
    // The list element is referenced and a listener is attached (aliasing allowed).
    const refsList = /todo-list/.test(appJs);
    const attachesListener = /addEventListener\(\s*['"]click['"]/.test(appJs);
    const perItem = /forEach\s*\([\s\S]{0,250}?addEventListener/.test(appJs)
      || /querySelectorAll[\s\S]{0,250}?addEventListener/.test(appJs);
    expect(refsList && attachesListener).toBe(true);
    expect(perItem).toBe(false);
  });

  test('8. code is wrapped (no top-level global leaks) (10)', () => {
    const wrapped = /DOMContentLoaded|^\s*\(\s*function|^\s*\(\s*\(\s*\)\s*=>/m.test(appJs);
    expect(wrapped).toBe(true);
  });
});
