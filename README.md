# VelocityRay: Real-Time Web Performance Analyzer (Browser Extension)

A cutting-edge browser extension for real-time web performance analysis. VelocityRay pinpoints bottlenecks, suggests actionable optimizations, and integrates seamlessly with browser DevTools to monitor Core Web Vitals, ensuring a lightning-fast user experience.

[![Build Status](https://img.shields.io/github/actions/workflow/user/chirag127/VelocityRay-Web-Performance-Analyzer-Browser-Extension/ci.yml?style=flat-square&logo=github)](https://github.com/chirag127/VelocityRay-Web-Performance-Analyzer-Browser-Extension/actions/workflows/ci.yml)
[![Code Coverage](https://img.shields.io/codecov/c/github/chirag127/VelocityRay-Web-Performance-Analyzer-Browser-Extension?style=flat-square&logo=codecov)](https://codecov.io/gh/chirag127/VelocityRay-Web-Performance-Analyzer-Browser-Extension)
[![TypeScript Version](https://img.shields.io/badge/typescript-6.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite Version](https://img.shields.io/badge/vite-7.x-yellow?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tauri Version](https://img.shields.io/badge/Tauri-v2.x-purple?style=flat-square&logo=tauri)](https://tauri.app/)
[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-orange?style=flat-square&logo=creativecommons)](https://creativecommons.org/licenses/by-nc/4.0/)
[![GitHub Stars](https://img.shields.io/github/stars/chirag127/VelocityRay-Web-Performance-Analyzer-Browser-Extension?style=flat-square&logo=github)](https://github.com/chirag127/VelocityRay-Web-Performance-Analyzer-Browser-Extension/stargazers)

--- 

**Star ⭐ this Repo to Support Future Development!**

---

## 🚀 Project Overview

VelocityRay is engineered to empower developers and website owners with deep insights into their web application's performance. By leveraging advanced browser APIs and analytical techniques, it provides immediate feedback on critical performance metrics, making it easier than ever to diagnose and resolve speed-related issues. 

---

## 🌳 Architecture

ascii
. 
├── src/
│   ├── background/       # Background service worker for extension logic
│   │   └── index.ts
│   ├── content/          # Injected scripts for page interaction
│   │   ├── devtools.ts   # DevTools panel integration
│   │   └── page.ts       # Page script for performance metrics
│   ├── popup/            # User interface for the extension popup
│   │   └── main.ts
│   ├── store/            # State management (e.g., using Signals or Zustand)
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   └── metrics.ts
│   └── main.ts           # Extension entry point
├── static/             # Static assets (icons, manifest.json)
│   ├── icons/
│   └── manifest.json
├── .env                # Environment variables
├── biome.json          # Biome configuration
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite build configuration
└── README.md           # This file


---

## 📖 Table of Contents

*   [🚀 Project Overview](#-project-overview)
*   [🌳 Architecture](#-architecture)
*   [🤖 AI Agent Directives](#-ai-agent-directives)
*   [🛠️ Development Standards](#-development-standards)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
    *   [Development Commands](#development-commands)
    *   [Principles](#principles)
*   [📜 License](#-license)

---

## 🤖 AI Agent Directives

<details>
<summary>View Agent Directives</summary>

This repository is managed by the **Apex Technical Authority AI Agent**, operating under the **December 2025 Edition** protocols.

### 🎯 Prime Directive

*   **Role:** Senior Principal Software Architect, Master Technical Copywriter, DevOps Strategist (40+ years elite experience).
*   **Output Standard:** **EXECUTION-ONLY**. Enforce FAANG-level standards and "Managing the Unmanageable."
*   **Philosophy:** "Zero-Defect, High-Velocity, Future-Proof."

### 🛠️ Tech Stack & Toolchain (Late 2025 Standards)

*   **Project Type:** Browser Extension / Web App.
*   **Language:** TypeScript 6.x (Strict Mode enforced).
*   **Bundler/Build Tool:** Vite 7 (utilizing Rolldown).
*   **Native Integration (Optional):** Tauri v2.x for potential desktop packaging.
*   **Extension Framework:** WXT (Web Extension Tooling) or Vite's native extension support.
*   **State Management:** Signals (Standardized), or Zustand for simplicity if Signals are overkill.
*   **Styling:** TailwindCSS v4.

### ⚙️ Linting & Formatting

*   **Tool:** Biome (v1.7.0+). Ensures ultra-fast, unified code quality checks and formatting.
*   **Configuration:** Managed via `biome.json`, enforcing strict rules.

### 🧪 Testing Strategy

*   **Unit Testing:** Vitest (v2.x+). Leverages Vite's ecosystem for rapid unit tests.
*   **End-to-End (E2E) Testing:** Playwright (v1.x+). For comprehensive browser automation and E2E scenario validation.
*   **Coverage:** Codecov.io integration via CI/CD pipeline.

### 📐 Architectural Patterns

*   **Core Principles:** SOLID, DRY, YAGNI.
*   **Frontend Structure:** Feature-Sliced Design (FSD) for modularity and scalability.
*   **Extension Structure:** Adheres to standard browser extension architecture (background scripts, content scripts, popup UI).

### 🚀 Deployment & CI/CD

*   **Platform:** GitHub Actions.
*   **Workflow:** `ci.yml` orchestrates linting, testing, building, and deployment tasks.

### 🔍 Verification Commands

*   **Lint & Format:** `npm run lint -- --fix` or `biome check --apply`
*   **Unit Tests:** `npm run test:unit` or `vitest run`
*   **E2E Tests:** `npm run test:e2e` or `npx playwright test`
*   **Build:** `npm run build`

</details>

---

## 🛠️ Development Standards

### Prerequisites

*   Node.js (v20.x LTS or higher recommended)
*   npm (v10.x+) or Yarn (v4.x+)

### Installation

1.  Clone the repository:
    bash
    git clone https://github.com/chirag127/VelocityRay-Web-Performance-Analyzer-Browser-Extension.git
    cd VelocityRay-Web-Performance-Analyzer-Browser-Extension
    

2.  Install dependencies using npm:
    bash
    npm install
    

### Development Commands

| Command             | Description                                           |
| :------------------ | :---------------------------------------------------- |
| `npm run dev`       | Starts the Vite development server for the extension. |
| `npm run build`     | Builds the extension for production.                  |
| `npm run lint`      | Runs Biome to check code style and quality.           |
| `npm run lint:fix`  | Fixes linting and formatting issues automatically.    |
| `npm run test:unit` | Executes unit tests using Vitest.                     |
| `npm run test:e2e`  | Runs end-to-end tests using Playwright.               |

### Principles

*   **SOLID:** Adhere to the Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles.
*   **DRY (Don't Repeat Yourself):** Minimize code duplication.
*   **YAGNI (You Ain't Gonna Need It):** Implement only what is currently required.

---

## 📜 License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)**. See the [LICENSE](LICENSE) file for more details.
