# ITCS333 — Assignment 3: JavaScript DOM & Events (2.5%)

Build a **vanilla-JS to-do application**: add items, mark them complete, delete them, filter them, and keep a live counter. No libraries or frameworks.

## Learning outcomes
CILO 3 — DOM manipulation, event-driven programming, event delegation.

## What you must build
The provided `index.html` and `css/style.css` are fixed — you write `js/app.js` only.

Features:
1. **Add** an item from the input (button or Enter) → appends one `<li>` to `#todo-list`.
2. **Empty submission** adds nothing and shows `#error-msg` (hidden otherwise).
3. **Toggle complete**: clicking an item's text toggles its `completed` class.
4. **Delete**: each item's delete button (`.delete-btn`) removes the item.
5. **Filters**: `#filter-all`, `#filter-active`, `#filter-done` show the matching subset.
6. **Counter**: `#counter` always shows `N item(s) left` (non-completed count).
7. Use **event delegation** (one listener on `#todo-list`, not per-item listeners).
8. Keep globals minimal (your code inside one IIFE or `'DOMContentLoaded'` handler).

## Rubric (100 points = 2.5%)
| # | Check | Points |
|---|---|---|
| 1 | Adding an item appends exactly one `<li>` with the entered text | 15 |
| 2 | Empty submission adds nothing; `#error-msg` shown | 10 |
| 3 | Clicking item toggles `completed` class | 15 |
| 4 | Delete button removes the item | 15 |
| 5 | Filters show/hide correct items | 15 |
| 6 | Counter updates after each operation | 10 |
| 7 | Event delegation used (single listener on the list) | 10 |
| 8 | No global-scope pollution (static check) | 10 |

## How to work
Fork → enable Actions → clone → edit `js/app.js` → push → submit fork URL in Blackboard.

## Run the tests locally
```bash
npm ci --prefix tests   # first time only
./run_tests.sh          # Jest + jsdom, same as CI
```

## Rules
Individual assignment. Do not modify `tests/`, `.github/`, `index.html`, or `css/style.css`. Official grading uses the instructor's pristine test copy.
