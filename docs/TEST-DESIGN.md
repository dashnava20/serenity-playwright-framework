# TEST-DESIGN.md  
## DemoQA Automation Framework — Technical Design & Justification (Playwright + Serenity/JS)

This document is the **technical justification** of the automation framework delivered for an **Automation Challenge** using **DemoQA** as the target platform.

It answers a single question:  
**Why is the framework written this way, instead of another way?**

Beyond completing the required cases, the goal was to leave a **scalable and maintainable structure** (helpers, UI mapping, config, test data, and reporting) that helps QA teams move faster under last-minute changes while protecting software quality.

---

## 1) Objective and Scope

### Objective
Build a reliable end-to-end (E2E) suite that validates user-facing workflows on DemoQA as a practical exercise for a technical assessment.

### Scope
The suite covers **7 independent functional cases**, from baseline navigation to complex asynchronous interactions such as:
- modal dialogs (alerts + confirmation modals)
- multi-tab navigation (new tab workflows)
- UI state transitions (accordion)
- gesture interactions (drag & drop)
- dynamic filtering (book store search)

Each case is isolated and produces evidence and reporting through Serenity BDD.

---

## 2) Architectural Choice: Screenplay Pattern

This framework uses the **Screenplay Pattern** (Serenity/JS) instead of a classic Page Object Model (POM).

### Why Screenplay?
Screenplay keeps the suite **composable** and **readable**. Tests are written in a “user journey language”:

- **Tasks** represent business actions (high-level steps)
- **UI maps** represent the DOM in a centralized way
- **Questions** represent what we read from the app (state)
- **Helpers** provide reusable technical glue (overlays, waits, tabs, etc.)

This approach avoids “God Pages” (large page classes doing everything) and keeps change impact localized.

> Note: In this repository, I did **not** implement a dedicated “abilities” folder; instead I focused on Tasks/Questions/UI Maps + helpers to keep the delivery aligned with the required scope and timeline.

---

## 3) Actor Model and Execution Language

All tests run using a single default actor (`Daniel`) configured in `playwright.config.ts`.

- The actor represents the test user and performs actions through Screenplay Tasks and Interactions.
- The test output becomes readable and traceable through Serenity reports.

This actor naming is intentional: it personalizes the suite and reinforces ownership of the deliverable.

---

## 4) UI Mapping Strategy (Locators)

DemoQA can be inconsistent (dynamic DOM, repeated IDs across tabs, react-select internals, overlays).  
Because of that, the UI mapping strategy prioritizes **stability** over convenience.

### Locator priorities used in this framework
1. **Stable IDs** (preferred when available)
2. **Scoped locators** (e.g., `.of(container)`) to avoid strict-mode collisions
3. **Semantic / text-based selectors** when the DOM is stable and the content is deterministic
4. **CSS/XPath** only when required, avoiding absolute brittle paths

### Why this matters
Instead of “making it pass”, the suite aims to stay stable across:
- multiple runs
- different execution modes
- minor UI changes
- cross-browser runs

---

## 5) Wait Strategy (Synchronization)

Modern web apps are async by nature. Hard sleeps create flakiness and slow tests.

This framework uses **conditional waiting** with:

- `Wait.upTo(...).until(question, expectation)`
- `Ensure.that(element, isVisible())` before critical actions
- content-based or class-based waits for dynamic transitions

### Examples of dynamic waits used
- Wait for a modal to appear before reading values
- Wait for DOM count changes after search filters
- Wait for UI state changes (accordion collapse transitions)
- Wait for new tab creation and page readiness

---

## 6) Evidence & Reporting Strategy

### Serenity BDD Reporting
The project generates a Serenity report under:

- `target/site/serenity/index.html`

### Screenshot evidence per interaction
I use Serenity/JS Photographer with step screenshots to provide an audit trail.

Important note learned during stabilization:
- Running with `--debug` can slow down steps and screenshot operations.
- I adjusted configuration to ensure the Photographer remains stable across:
  - normal runs
  - `--headed`
  - `--debug`

This makes the suite more reliable in real debugging sessions.

---

## 7) Execution Modes and Regression Discipline

Tests were stabilized by executing them repeatedly in different modes:

- Standard headless execution
- `--headed` for visual confirmation
- `--debug` for step-by-step diagnosis

Multiple regressions were executed after each major change to ensure the report stayed correct and the suite remained consistent.

---

## 8) Parallel Execution Readiness

All 7 cases are designed to be **isolated**:
- independent navigation
- independent test data
- independent UI mapping
- no shared state between cases

This allows execution in parallel (multiple workers), reducing runtime and improving CI/CD readiness.

---

## 9) Breadcrumbs (Agile Technical Notes)

Throughout the suite, I intentionally left **breadcrumbs** (comments) to simulate real agile delivery:

- known technical debt
- future optimizations
- scenarios to be extended in the next sprint

This mirrors a realistic QA workflow where value is delivered early and improved iteratively.

---

## 10) Case-by-Case Engineering Summary

### Case 1: Navigate to the Home Page — Baseline Navigation & Visual Hierarchy
**Focus:** Smoke testing and structural integrity  
**Strategy:** Collect UI metadata in arrays and validate key layout elements.  
**Why:** DRY logic and scalability if the homepage grows.

---

### Case 2: Elements — Text Box Form Submit (Input + Output Integrity)
**Focus:** Data integrity and UI persistence  
**Strategy:** Fill inputs and validate output panel values match exactly.  
**Why:** Verifies user input is not altered and the app renders the same data consistently.

---

### Case 3: Forms — Practice Form Submit (Complex Flow + Modal Validation)
**Focus:** Advanced form orchestration  
**Strategy includes:**
- validation of multiple field types (text, radio, checkbox, react-select)
- modal extraction using row-based questions
- form cleanup validation logic prepared (kept as optional/iterative)

**Notes / Future sprint items:**
- Calendar logic can be expanded to validate dynamic “today” date behavior.
- File upload remains intentionally non-blocking due to observed flakiness; it is documented as pending.

---

### Case 4: Alerts & Browser Windows — Event-Driven Interactions
**Focus:** Non-DOM events and browser context handling  
**Strategy:**
- detect and validate alert message
- accept alert and confirm state
- open new tab and validate sample content
- return and confirm original context stability

**Why:** Multi-context testing is a common source of flaky suites; this validates strong orchestration.

---

### Case 5: Widgets — Accordion (State Transitions)
**Focus:** Component state validation  
**Strategy:** Validate collapse/show transitions through class changes and controlled toggling logic.  
**Why:** I validate the actual state machine behind the UI, not only the visual effect.

---

### Case 6: Interactions — Drag and Drop (Gesture + Visual Feedback)
**Focus:** Pointer interactions and drop recognition  
**Strategy:** Drag and drop logic adjusted to ensure center interception (required by DemoQA behavior).  
**Validation:** Text changes to “Dropped!” + highlight class (when stable).

**Future improvement:**
- Validate background color change using computed styles
- Add boundary testing for pixel thresholds

Also pending scenarios:
- Accept
- Prevent Propogation
- Revert Draggable

---

### Case 7: Book Store — Book Search (Dynamic Filtering + Collections)
**Focus:** Search accuracy and collection comparison  
**Strategy:**
- capture initial list
- perform search
- wait dynamically for filtered DOM update (count)
- compare results and print evidence using `console.table`

**Future improvement:**
- Validate the results using the API directly (avoid hardcoded expected dataset)
- Add pagination (“rows per page”) testing when dataset > 10

---

## 11) Continuous Improvement Plan

If more time were available, the next upgrades would be:

- CI/CD integration (GitHub Actions / pipeline-friendly configuration)
- API integration for deterministic data setup and validation
- data-driven test expansion using JSON/CSV matrices
- coverage expansion (authors, images, publishers, accessibility signals)
- improved upload reliability with deeper investigation on DemoQA limitations

---

## 12) Final Notes

This project demonstrates:
- clean automation architecture
- maintainability-first structure
- reporting + evidence discipline
- execution stabilization across different modes
- ownership of the QA process end-to-end

**📌 Documentation companion:**
This repository also includes `docs/TEST-DESIGN.md` (this file), intended for learning, replication, and long-term maintenance.

---

**Copyright © Daniel Nava — QA Engineer (Bogotá → Worldwide) 🥑.**
