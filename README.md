# DemoQA Automation Framework — Playwright + Serenity/JS

Automated end-to-end (E2E) testing framework built with **Playwright**, **TypeScript**, and **Serenity/JS**, implementing the **Screenplay Pattern** and generating rich **Serenity BDD** reports with visual evidence per interaction.

<!-- Banner (replace path/URL with your preferred DemoQA banner image) -->
<!-- Example: ![DemoQA Banner](docs/assets/demoqa-banner.png) -->
![DemoQA Banner](docs/assets/demoqa-banner.png)

[![Serenity/JS](https://img.shields.io/badge/Powered%20by-Serenity%2FJS-bc0024?style=for-the-badge&logo=serenityjs)](https://serenity-js.org/)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=Playwright&logoColor=white)](https://playwright.dev/)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Screenplay](https://img.shields.io/badge/Pattern-Screenplay-111827?style=for-the-badge)
![Reporting](https://img.shields.io/badge/Reporting-Serenity%20BDD-6B7280?style=for-the-badge)

---

## Project Goals

- Validate critical user flows in **DemoQA** through maintainable E2E automation
- Apply **Screenplay Pattern** for high cohesion and low coupling
- Provide **traceable evidence** (screenshots/video/trace) and readable reports via **Serenity BDD**
- Support **cross-browser execution** (Chromium, Firefox, WebKit)

---

## Documentation

This repo includes additional QA documentation to support learning, replication, and long-term maintenance:

- **TEST-DESIGN.md** → Design rationale, strategy, architecture decisions, and future improvements

---

## Project Structure

> Note: File names may vary slightly depending on your local branch. This is the intended structure.

```text
.
├─ data/
│  ├─ practiceform.data.ts
│  ├─ practiceFormData.json
│  └─ textBox.data.ts
│
├─ docs/
│  └─ TEST-DESIGN.md
│
├─ node_modules/
├─ playwright-report/
│
├─ specs/
│  ├─ demoqa.alerts.spec.ts
│  ├─ demoqa.bookstore.spec.ts
│  ├─ demoqa.elements.textbox.spec.ts
│  ├─ demoqa.forms.practice-form.spec.ts
│  ├─ demoqa.home.spec.ts
│  ├─ demoqa.interactions-droppable.spec.ts
│  └─ demoqa.widgets-accordian.spec.ts
│
├─ src/
│  ├─ questions/
│  ├─ tasks/
│  │  ├─ CompletePracticeForm.ts
│  │  ├─ CompleteTextBoxForm.ts
│  │  ├─ NavigateTo.ts
│  │  ├─ PrintTable.ts
│  │  ├─ RemoveDemoQAOverlays.ts
│  │  ├─ ScrollTo.ts
│  │  └─ SearchForBook.ts
│  │
│  ├─ ui/
│  │  ├─ Accordion.ts
│  │  ├─ AlertsPage.ts
│  │  ├─ BookStore.ts
│  │  ├─ BrowserWindowsPage.ts
│  │  ├─ DemoQAMainMenu.ts
│  │  ├─ Droppable.ts
│  │  ├─ ElementsSidebar.ts
│  │  ├─ PracticeForm.ts
│  │  ├─ PracticeFormModal.ts
│  │  ├─ SamplePage.ts
│  │  └─ TextBoxForm.ts
│  │
│  └─ utils/
│     └─ helperUtilities.ts
│
├─ target/
├─ test-results/
│
├─ .gitignore
├─ package-lock.json
├─ package.json
├─ playwright.config.ts
├─ README.md
├─ serenity.conf.ts
└─ tsconfig.json
```

---

## Tech Stack
- **Node.js** (recommended: 20+)
- **Playwright**
- **TypeScript**
- **Serenity/JS**
- **Serenity BDD** reporting (CLI)

---

## Prerequisites
- Node.js **20+**
- Java installed (required by Serenity BDD CLI)
- Playwright browsers installed

---

## Getting Started
    ```bash
    Install dependencies
    npm install
    npx playwright install
    ```

## Verify versions (optional)
- node -v
- npm -v
- npx playwright --version

---

## Running the Tests
    ```bash
    Run all tests
    npx playwright test
    ```

### Run a single spec
    ```bash
    npx playwright test specs/demoqa.bookstore.spec.ts
    ```

### Headed mode
    ```bash
    npx playwright test --headed
    ```

### Debug mode
    ```bash
    npx playwright test --debug
    ```
---

## Cross-Browser Execution

This framework supports cross-browser runs via Playwright projects (Chromium, Firefox, WebKit).

If your playwright.config.ts is already configured with projects, run:

    ```bash
    npx playwright test
    ```

Playwright will execute the suite across all configured browsers.

---

## Reporting (Serenity BDD)
### Generate the Serenity report
    ```bash
    npx serenity-bdd run
    ```
### Report path
Open:
    ```text
    target/site/serenity/index.html
    ```

---

## Evidence & Observability
- The report includes **automated screenshots per interaction** (Serenity/JS Photographer)
- Playwright can also capture **video** and **trace** depending on the configuration
- This improves auditability for both technical and non-technical stakeholders

---

## Clean Previous Results (Recommended)

To avoid mixing old and new results (and inflating the report test count), remove previous outputs before a full regression run.

### PowerShell
    ```powershell
    Remove-Item -Recurse -Force .\target, .\test-results, .\playwright-report -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force .\reports, .\artifacts -ErrorAction SilentlyContinue
    ```
---

## Key Design Decisions (Short Summary)
### Screenplay Pattern (instead of Page Object Model)

This project uses Screenplay to keep test code:
- **Readable** (steps resemble user intent)
- **Reusable** (tasks/interactions are composable)
- **Maintainable** (smaller modules, fewer “God objects”)

For the full engineering rationale and strategy, see **`TEST-DESIGN.md`**.

---

## Final Notes

This project was built to demonstrate:
- Clean framework build-up process
- Maintainable automation architecture
- Scalability (cross-browser, reporting, structured tasks)
- QA ownership through documentation and traceable evidence