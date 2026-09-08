# Agile & DevOps Sprint Documentation

This document tracks the planning, delivery, and review for each sprint of the
e-commerce store project. It lives in the repository so the sprint history is
visible alongside the code it describes.

## Product Vision

An e-commerce project that allows users to check products and buy or order
what they want.

## Backlog

| ID   | User Story | Priority | Points |
|------|------------|----------|--------|
| US1  | As a user, I want to view products in the store. | High | 5 |
| US2  | As a user, I want to save items to my cart in Supabase so they can be displayed in the cart. | High | 5 |
| US3  | As a user, I want to view my cart and the total price. | High | 3 |
| US4  | As a user, I want to remove an item from my cart. | Medium | 3 |
| US5  | As a developer, I want automated tests so regressions are caught before merge. | Medium | 5 |
| US6  | As a developer, I want a CI/CD pipeline so every push is built and tested automatically. | Medium | 3 |
| US7  | As a developer, I want to fix and harden the Sprint 1 stories based on retro findings. | Medium | 3 |
| US8  | As a developer, I want basic monitoring/logging (activity logs + a health check) so the app's status is observable. | Medium | 2 |
| US9  | As a user, I want to sign up and log in, so my cart is mine and not shared with every visitor. | High | 8 |
| US10 | As a user, I want to check out my cart, so it becomes an order that can be fulfilled. | High | 8 |
| US11 | As a developer, I want CI to report test coverage, so drops in coverage are visible in every pull request. | Medium | 3 |

## Acceptance Criteria

- **AC for US1:** User sees a grid of at least 5 products with images and prices.
- **AC for US2:** When "Add to Cart" is clicked, the item is added to the cart section.
- **AC for US3:** The UI displays a sum of all item prices currently in the cart.
- **AC for US4:** An item removed from the cart does not appear in the cart again.
- **AC for US5:** The test suite covers each story's normal behavior as well as at least one failure or edge case.
- **AC for US6:** Every push and pull request to main runs install, code-quality checks, tests, and a build in GitHub Actions, and the pipeline is green before merge.
- **AC for US8:** The app's status can be checked at any time and returns a successful response, and key actions (loading products, adding to cart, removing from cart, and any failures) are recorded in clearly labeled activity logs.

## Definition of Done (DoD)

- Code passes automated Vitest tests.
- CI pipeline on GitHub is green (lint, test, and build all pass).
- No console errors in the browser.

---

## Sprint 1 – Execution

**Sprint goal:** ship a browsable product catalog with a working, persisted cart, and get CI running from day one so every later change is verified automatically.

- US1 — view products in the store
- US2 — save items to cart in Supabase
- US6 — set up CI pipeline
- US5 — write initial tests

### Sprint 1 Review

Products were fetched and displayed in a grid, and users could add items to
the cart by clicking "Add to Cart." A running list of cart items was shown
alongside the total price of everything added.

### CI Pipeline

A continuous integration pipeline was set up in GitHub Actions, triggered on
every pull request and every push to the main branch. The setup work was done
carefully on its own branch and merged in through a proper review step rather
than pushed straight to the main branch, and it took a couple of attempts
before it ran correctly.

### Tests (as of Sprint 1)

Tests covered the products API (fetching correctly), the Supabase integration
(inserting cart items with correct data), and the cart total price
calculation logic — three happy-path cases, with no edge-case coverage yet.

### Sprint 1 Retrospective

**What went well**
- Products loaded and rendered correctly in a responsive grid.
- Add to cart worked well, storing products in Supabase in a table called
  cart, and the total price of items in the cart was updated correctly.
- The CI pipeline was integrated early, so every push was automatically
  tested.

**What could be improved**
- A cart view with a remove-item button to remove an item from the cart.
- Test coverage was limited to 3 happy-path tests; no edge cases (empty
  cart, failed API call) were covered.

**Action items for Sprint 2**
- Implement the cart-total view and remove-item feature.
- Expand the tests to cover edge cases.

---

## Sprint 2 – Planning

**Sprint goal:** build on the Sprint 1 retrospective by finishing the cart
experience and strengthening test coverage, and add basic monitoring for the
app.

- US3 — view cart and total price
- US4 — remove an item from the cart
- US5 — write more tests, covering edge cases such as an empty cart and a
  failed product load
- US7 — polish and harden the Sprint 1 stories
- US8 — basic monitoring/logging: a simple status check plus activity logs

### Sprint 2 Review

- **Remove-from-cart (US4):** a small remove button now sits next to each
  item in the cart. Clicking it deletes that item from the stored cart data
  and updates what's shown on screen immediately.
- **Cart and total price (US3):** the running cart list and total shown to
  the user are now backed by a single, dedicated calculation that is
  exercised directly by the test suite.
- **Reorganized logic (US5/US7):** the logic behind loading products,
  managing the cart, and calculating totals has been separated from the
  page's display code into its own reusable part of the project, making it
  possible to test that logic on its own rather than only through the
  visible page.
- **Failed-loading handling (US7):** if the product list fails to load, the
  app now recognizes this and shows a clear message with a button to try
  again, instead of leaving the page stuck on a loading screen indefinitely.
- **Expanded test coverage (US5):** a full set of tests was written covering
  the cart logic and the main page, including situations such as an empty
  cart and a failed attempt to load products, in addition to the normal,
  expected behavior.
- **Monitoring/logging (US8):** a simple status check was added so the
  app's health can be confirmed at any time, alongside activity logging
  that records key actions and errors.
- **General cleanup (US7):** tidied up a few unrelated files in the
  project, and added an automated code-quality check to the pipeline so
  style and structural issues are caught the same way test failures are.

All tests passed successfully when run as part of this sprint's work.

### Sprint 2 Retrospective

**What went well**
- The remove-item feature was delivered and works end to end, and the test
  suite now covers the empty-cart and failed-loading edge cases named in the
  Sprint 1 retrospective.
- Separating the cart and product logic out from the page's display code
  made it possible to test that logic properly, without needing to
  simulate the whole visible page just to check a calculation. It also made
  each change smaller and easier to review.
- Setting up monitoring early means the app's status can be checked before
  it's relied on for anything more complex, like accounts or orders.

**What could be improved**
- Test coverage is good for the cart and product flows, but there's no
  visibility yet into how much of the codebase overall is covered.
- There's still no way for a user to have their own private cart —
  everyone currently shares the same one.

**Lessons learned**
- Configuring the testing tool properly up front — so it can reliably find
  and run every part of the project — pays off before problems show up
  later.
- Writing the sprint review as the work is delivered, rather than after
  the fact, keeps it accurate and specific.

**Action items for Sprint 3**
- Add a proper sign-up and log-in flow so a cart can be tied to a
  signed-in user instead of being shared by every visitor.
- Add an order/checkout flow so a cart can be converted into a deliverable
  order.
- Track how much of the code is covered by tests over time, so drops in
  coverage are caught automatically rather than by manual review.

---

## Sprint 3 – Planning

**Sprint goal:** let a user create an account, keep a private cart, and place
an order.

- US9 — As a user, I want to sign up and log in, so my cart is mine and not
  shared with every visitor. (Priority: High, 8 pts)
- US10 — As a user, I want to check out my cart, so it becomes an order that
  can be fulfilled. (Priority: High, 8 pts)
- US11 — As a developer, I want CI to report test coverage, so drops in
  coverage are visible in every pull request. (Priority: Medium, 3 pts)
