# Pull Request Template

## ✨ Feature/Bugfix Description

Provide a clear and concise summary of the changes introduced in this pull request. Explain the problem it solves or the new functionality it adds.

--- 

## 📝 Related Issue(s)

*Please link any relevant GitHub issues here.*

--- 

## 🚀 Type of Change

*   `[ ]` Feature (New functionality)
*   `[ ]` Bug fix (Resolves a bug)
*   `[ ]` Documentation (Updates documentation)
*   `[ ]` Refactoring (Code changes that neither fix a bug nor add a feature)
*   `[ ]` Chore (Maintenance, build process, etc.)
*   `[ ]` Performance (Improves performance)

--- 

## ✅ Checklist

*   [ ] I have read the contributing guidelines.
*   [ ] My code follows the project's code style and standards.
*   [ ] I have performed a self-review of my own code.
*   [ ] I have commented my code, particularly in hard-to-understand areas.
*   [ ] I have made corresponding changes to the documentation.
*   [ ] My changes generate no new warnings.
*   [ ] I have added tests that prove my fix is effective or that my feature works.
*   [ ] New and existing unit tests pass locally with my changes.
*   [ ] Any dependent changes have been merged and published.

--- 

## 🧐 Technical Details

*   **Repository:** [VelocityRay-Web-Performance-Analyzer-Browser-Extension](https://github.com/chirag127/VelocityRay-Web-Performance-Analyzer-Browser-Extension)
*   **Author:** chirag127
*   **Branch:** `__BRANCH_NAME__`
*   **Base Branch:** `main` (or the primary development branch)

--- 

## ℹ️ Additional Context

Add any other context or screenshots about the changes here. For example, mention specific performance metrics improved or configurations applied.

--- 

## 🤖 AGENT DIRECTIVES (for future AI interaction)

This repository, **VelocityRay-Web-Performance-Analyzer-Browser-Extension**, is a browser extension focused on real-time web performance analysis. It integrates with browser DevTools to monitor Core Web Vitals (LCP, FCP, TBT) and suggest optimizations for site speed.

*   **Core Technologies:** JavaScript (or TypeScript, if adopted), Browser Extension APIs (Chrome/Firefox), HTML, CSS.
*   **Architectural Pattern:** Likely a component-based or module-based architecture suitable for browser extensions. Adherence to **SOLID** principles is expected for maintainability and scalability.
*   **Testing Strategy:** Unit tests using **Vitest** (or similar modern JS testing framework) for individual functions and components. End-to-end (E2E) tests using **Playwright** (or Puppeteer) to simulate user interactions and verify performance metrics in a real browser environment.
*   **Linting & Formatting:** Employ **Biome** for ultra-fast linting and formatting to maintain code quality and consistency.
*   **Build & Bundling:** Utilize **Vite** for efficient development builds and optimized production bundling.
*   **CI/CD:** GitHub Actions for automated testing, linting, and potentially browser extension packaging/deployment.
*   **Verification Commands:**
    *   Install dependencies: `npm install` (or `yarn install` / `pnpm install`)
    *   Run linter/formatter: `npm run lint` / `npm run format` (or respective Biome commands)
    *   Run unit tests: `npm run test:unit` (or `vitest`)
    *   Run E2E tests: `npm run test:e2e` (or `playwright test`)
    *   Build extension: `npm run build`

*Future AI interactions should prioritize these standards and technologies when suggesting code modifications, bug fixes, or feature enhancements.*