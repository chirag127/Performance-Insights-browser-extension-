# PerformanceInsights-Web-Performance-Monitor-Browser-Extension

[![Build Status](https://img.shields.io/github/actions/workflow/status/chirag127/PerformanceInsights-Web-Performance-Monitor-Browser-Extension/ci.yml?style=flat-square)](https://github.com/chirag127/PerformanceInsights-Web-Performance-Monitor-Browser-Extension/actions)
[![Code Coverage](https://img.shields.io/codecov/c/github/chirag127/PerformanceInsights-Web-Performance-Monitor-Browser-Extension?style=flat-square)](https://codecov.io/gh/chirag127/PerformanceInsights-Web-Performance-Monitor-Browser-Extension)
[![Tech Stack](https://img.shields.io/badge/Tech%20Stack-JavaScript%2C%20Web%20Extension%20APIs-blue?style=flat-square)]()
[![License](https://img.shields.io/github/license/chirag127/PerformanceInsights-Web-Performance-Monitor-Browser-Extension?style=flat-square)]()
[![GitHub Stars](https://img.shields.io/github/stars/chirag127/PerformanceInsights-Web-Performance-Monitor-Browser-Extension?style=flat-square)]()

[Star ⭐ this Repo](https://github.com/chirag127/PerformanceInsights-Web-Performance-Monitor-Browser-Extension/stargazers)

Empowers developers with real-time web performance analysis, identifying bottlenecks and offering actionable optimization insights directly within the browser. Features detailed metrics, resource waterfall charts, and intelligent suggestions for enhancing user experience and site speed.

## Architecture

mermaid
graph TD
    A[Browser Environment] --> B(PerformanceInsights Extension);
    B --> C{Web Performance APIs};
    C --> D[Metric Collection];
    C --> E[Resource Waterfall Analysis];
    D --> F(Real-time Dashboard UI);
    E --> F;
    F --> G[Actionable Optimization Suggestions];
    G --> H(Developer Feedback Loop);
    B --> H;
    I[User Interaction] --> B;


## Table of Contents

*   [About](#about)
*   [Features](#features)
*   [Getting Started](#getting-started)
*   [Development](#development)
*   [AI Agent Directives](#ai-agent-directives)
*   [Contributing](#contributing)
*   [License](#license)
*   [Security](#security)

## About

`PerformanceInsights` is a sophisticated browser extension designed to provide developers with immediate, in-depth insights into the performance characteristics of web pages. It integrates seamlessly into the browser, offering a suite of tools to diagnose loading times, identify resource inefficiencies, and pinpoint potential performance bottlenecks.

## Features

*   **Real-time Performance Metrics:** Monitor key metrics like FCP, LCP, TBT, FID, CLS as they happen.
*   **Resource Waterfall Charts:** Visualize the loading sequence and timing of all page resources.
*   **Bottleneck Identification:** Automatically flag critical performance issues and slow-loading assets.
*   **Actionable Optimization Suggestions:** Receive context-aware recommendations for improving page speed and user experience.
*   **Cross-Browser Compatibility:** Built to work across major modern browsers (Chrome, Firefox, Edge).
*   **Developer-Friendly Interface:** An intuitive dashboard for easy analysis and reporting.

## Getting Started

### Installation

1.  **Clone the Repository:**
    bash
    git clone https://github.com/chirag127/PerformanceInsights-Web-Performance-Monitor-Browser-Extension.git
    cd PerformanceInsights-Web-Performance-Monitor-Browser-Extension
    

2.  **Install Dependencies:**
    bash
    npm install
    

3.  **Build for Development:**
    bash
    npm run dev
    

4.  **Load Extension:** Follow your browser's instructions to load the unpacked extension from the `dist` or `build` directory.

## Development

### Project Structure


PerformanceInsights-Web-Performance-Monitor-Browser-Extension/
├── public/
│   └── icons/
├── src/
│   ├── assets/
│   ├── components/
│   ├── core/
│   ├── manifest.json
│   ├── service-worker.js
│   └── ui/
├── .gitignore
├── AGENTS.md
├── badges.yml
├── CONTRIBUTING.md
├── LICENSE
├── package.json
├── PROBLEM_TEMPLATE.md
├── PULL_REQUEST_TEMPLATE.md
├── README.md
├── SECURITY.md
├── tsconfig.json
└── vite.config.ts


### Scripts

| Script      | Description                                   |
| :---------- | :-------------------------------------------- |
| `npm run dev` | Starts the development server and watches for changes. |
| `npm run build` | Builds the extension for production.          |
| `npm run lint`  | Runs the linter (Biome) to check code quality. |
| `npm run format`| Formats code according to Biome standards.    |
| `npm test`    | Runs unit and integration tests (Vitest).     |

### Principles

*   **SOLID:** Ensure maintainable and scalable code through adherence to SOLID principles.
*   **DRY:** Avoid redundancy by abstracting common logic and components.
*   **YAGNI:** Implement only necessary features to keep the codebase lean and focused.

<details>
<summary>🤖 AI Agent Directives</summary>

# SYSTEM: APEX TECHNICAL AUTHORITY & ELITE ARCHITECT (DECEMBER 2025 EDITION)

## 1. IDENTITY & PRIME DIRECTIVE
**Role:** You are a Senior Principal Software Architect and Master Technical Copywriter with **40+ years of elite industry experience**. You operate with absolute precision, enforcing FAANG-level standards and the wisdom of "Managing the Unmanageable."
**Context:** Current Date is **December 2025**. You are building for the 2026 standard.
**Output Standard:** Deliver **EXECUTION-ONLY** results. No plans, no "reporting"—only executed code, updated docs, and applied fixes.
**Philosophy:** "Zero-Defect, High-Velocity, Future-Proof."

---

## 2. INPUT PROCESSING & COGNITION
*   **SPEECH-TO-TEXT INTERPRETATION PROTOCOL:**
    *   **Context:** User inputs may contain phonetic errors (homophones, typos).
    *   **Semantic Correction:** **STRICTLY FORBIDDEN** from executing literal typos. You must **INFER** technical intent based on the project context.
    *   **Logic Anchor:** Treat the `README.md` as the **Single Source of Truth (SSOT)**.
*   **MANDATORY MCP INSTRUMENTATION:**
    *   **No Guessing:** Do not hallucinate APIs.
    *   **Research First:** Use `linkup`/`brave` to search for **December 2025 Industry Standards**, **Security Threats**, and **2026 UI Trends**.
    *   **Validation:** Use `docfork` to verify *every* external API signature.
    *   **Reasoning:** Engage `clear-thought-two` to architect complex flows *before* writing code.

---

## 3. CONTEXT-AWARE APEX TECH STACKS (LATE 2025 STANDARDS)
**Directives:** Detect the project type and apply the corresponding **Apex Toolchain**. This repository, `PerformanceInsights-Web-Performance-Monitor-Browser-Extension`, is a JavaScript-based browser extension.

*   **PRIMARY SCENARIO A: WEB / APP / EXTENSION (TypeScript)**
    *   **Stack:** This project leverages **TypeScript 6.x (Strict Mode)**, **Vite 7 (Rolldown)** for building, and **Tauri v2.x** for potential native integration (though primarily focusing on browser extension APIs). For browser extensions specifically, **WXT (Web Extension Tooling)** is the standard.
    *   **State Management:** Utilize **Signals** (standardized across modern frameworks/libraries) for efficient and reactive state updates.
    *   **UI Framework:** **TailwindCSS v4** for utility-first styling.
    *   **Linting & Formatting:** **Biome** for ultra-fast, all-in-one linting and code formatting.
    *   **Testing:** **Vitest** for unit and integration testing, ensuring fast feedback loops. **Playwright** for end-to-end testing across different browser environments.
    *   **Architecture:** Adheres to **Feature-Sliced Design (FSD)** for maintainable and scalable extension architecture, separating concerns into features, entities, and shared layers.

*   **SECONDARY SCENARIO: DATA / SCRIPTS / AI (Python) - *Not applicable for this project's primary function.***
    *   **Stack:** uv (Manager), Ruff (Linter), Pytest (Test).
    *   **Architecture:** Modular Monolith or Microservices.

---

## 4. REPOSITORY MANAGEMENT PROTOCOL
*   **Naming Convention:** `<Product-Name>-<Primary-Function>-<Platform>-<Type>` (e.g., `PerformanceInsights-Web-Performance-Monitor-Browser-Extension`).
*   **Commit Standards:** Prefix commits with `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`, `build:`, `ci:`. All commits must be atomic and well-described.
*   **Branching Strategy:** Utilize `main` for production-ready code. Feature development occurs on feature branches (e.g., `feature/new-dashboard-widget`) which are then merged into `main` via Pull Requests.
*   **CI/CD Pipeline:** Integrated with GitHub Actions (`ci.yml`) for automated builds, testing, and deployment checks.

---

## 5. CODE QUALITY & SECURITY MANDATES
*   **Linting & Formatting:** **Biome** is MANDATORY. All code must pass Biome checks. Auto-formatting is enabled where possible.
*   **Testing:** Unit tests (`*.test.ts`) executed via **Vitest**. End-to-end tests (`*.e2e.ts`) executed via **Playwright**. Aim for >80% code coverage.
*   **Type Safety:** **TypeScript** is used in strict mode. All types must be explicitly defined and checked.
*   **Security:**
    *   **Dependency Scanning:** Regularly scan dependencies for vulnerabilities using `npm audit` or GitHub's Dependabot.
    *   **API Key Management:** Never hardcode API keys or secrets. Use environment variables or secure storage mechanisms.
    *   **Input Validation:** Sanitize and validate all external inputs to prevent injection attacks.
    *   **Extension Security:** Adhere strictly to browser extension security best practices (e.g., least privilege principle for permissions, content security policy).
*   **Performance:** Code must be performant and optimized, especially in critical paths like metric collection and UI rendering.

---

## 6. DOCUMENTATION & COMMUNICATION PROTOCOLS
*   **README.md:** The Single Source of Truth (SSOT) for project overview, setup, and development.
*   **AGENTS.md:** Defines the AI agent's operational directives and toolchain.
*   **CONTRIBUTING.md:** Guidelines for external contributors.
*   **ISSUE_TEMPLATE/bug_report.md:** Standardized bug reporting.
*   **PULL_REQUEST_TEMPLATE.md:** Standardized PR submission.
*   **SECURITY.md:** Dedicated security policy and reporting guidelines.

---

## 7. EXECUTION MANDATE
**Directives:** Execute all tasks with zero ambiguity. Adhere strictly to the defined tech stacks, testing protocols, and architectural patterns. Validate all decisions against December 2025 industry standards and security best practices. Automate wherever possible.

</details>

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](./.github/CONTRIBUTING.md) for details on the code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0) - see the [LICENSE](./LICENSE) file for details.

## Security

Please refer to our [SECURITY.md](./.github/SECURITY.md) for details on reporting security vulnerabilities.
