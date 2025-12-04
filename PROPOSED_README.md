# VelocityRay: Web Performance Analyzer

<div align="center">
  <a href="https://github.com/chirag127/VelocityRay-Web-Performance-Analyzer-Browser-Extension">
    <img src="https://raw.githubusercontent.com/chirag127/VelocityRay-Web-Performance-Analyzer-Browser-Extension/main/.github/assets/banner.png" alt="VelocityRay Banner"/>
  </a>
</div>

<div align="center">

[
![Build Status](https://img.shields.io/github/actions/workflow/status/chirag127/VelocityRay-Web-Performance-Analyzer-Browser-Extension/ci.yml?branch=main&style=flat-square&logo=githubactions&logoColor=white)
](https://github.com/chirag127/VelocityRay-Web-Performance-Analyzer-Browser-Extension/actions/workflows/ci.yml)
[
![Code Coverage](https://img.shields.io/codecov/c/github/chirag127/VelocityRay-Web-Performance-Analyzer-Browser-Extension?style=flat-square&logo=codecov&logoColor=white)
](https://app.codecov.io/gh/chirag127/VelocityRay-Web-Performance-Analyzer-Browser-Extension)
[
![Tech Stack: TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
](https://www.typescriptlang.org/)
[
![Framework: WXT](https://img.shields.io/badge/Framework-WXT-8A2BE2?style=flat-square&logo=wxt&logoColor=white)
](https://wxt.dev/)
[
![Linter: BiomeJS](https://img.shields.io/badge/Lint-Biome-60A5FA?style=flat-square&logo=biomejs&logoColor=white)
](https://biomejs.dev/)
[
![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC_BY--NC_4.0-lightgrey?style=flat-square)
](https://creativecommons.org/licenses/by-nc/4.0/)
[
![GitHub Stars](https://img.shields.io/github/stars/chirag127/VelocityRay-Web-Performance-Analyzer-Browser-Extension?style=flat-square&logo=github&logoColor=white)
](https://github.com/chirag127/VelocityRay-Web-Performance-Analyzer-Browser-Extension/stargazers)

</div>

---

> **A real-time web performance analyzer extension that identifies bottlenecks, suggests optimizations, and monitors Core Web Vitals.** VelocityRay integrates directly with DevTools to provide developers with actionable insights, helping them build lightning-fast websites and ensure a high-performance user experience.

<div align="center">
  <a href="https://github.com/chirag127/VelocityRay-Web-Performance-Analyzer-Browser-Extension/stargazers"><strong>Star ⭐ this Repo</strong></a> to support its development!
</div>

---

## Table of Contents

- [✨ Features](#-features)
- [🏛️ Architecture](#️-architecture)
- [🤖 AI Agent Directives](#-ai-agent-directives)
- [🚀 Getting Started](#-getting-started)
- [🛠️ Development Scripts](#️-development-scripts)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

## ✨ Features

- **Real-Time Performance Monitoring:** Continuously track Core Web Vitals (LCP, FID, CLS) and other critical metrics as you browse.
- **Bottleneck Identification:** Pinpoint slow network requests, large assets, and long-running scripts with a detailed resource waterfall.
- **Actionable Optimization Suggestions:** Receive tailored recommendations based on Lighthouse and WebPageTest best practices.
- **Seamless DevTools Integration:** Access all analytics directly within a dedicated Chrome DevTools panel for an efficient workflow.
- **Historical Performance Snapshots:** Compare performance reports over time to validate the impact of your optimizations.

## 🏛️ Architecture

This project follows the **Feature-Sliced Design (FSD)** methodology to ensure maintainability, scalability, and a clear separation of concerns. The structure is organized by business domains and technical responsibilities, making the codebase predictable and easy to navigate.

sh
src/
├── app/             # App-level logic, providers, global styles
├── processes/       # Cross-feature logic (e.g., performance-session)
├── pages/           # Entry points (popup, options, devtools panel)
│   ├── popup/
│   └── devtools/
├── widgets/         # Composite UI (e.g., PerformanceDashboard, VitalsChart)
├── features/        # Business logic features (e.g., AnalyzeVitals)
│   ├── analyze-vitals/
│   │   ├── api/     # Data-fetching logic
│   │   ├── model/   # State management & business logic
│   │   └── ui/      # Feature-specific components
│   └── suggest-optimizations/
├── entities/        # Business entities (e.g., PerformanceMetric, Resource)
│   └── performance-metric/
└── shared/          # Reusable modules, UI-kit, config, constants
    ├── api/         # Shared API instances & configurations
    ├── config/      # Environment variables, constants
    ├── lib/         # Helper functions, hooks
    └── ui/          # Generic UI components (Button, Card, etc.)


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
    *   **Logic Anchor:** Treat this `README.md` as the **Single Source of Truth (SSOT)**.
*   **MANDATORY MCP INSTRUMENTATION:**
    *   **No Guessing:** Do not hallucinate APIs.
    *   **Research First:** Use `linkup`/`brave` to search for **December 2025 Industry Standards**, **Security Threats**, and **2026 UI Trends**.
    *   **Validation:** Use `docfork` to verify *every* external API signature.
    *   **Reasoning:** Engage `clear-thought-two` to architect complex flows *before* writing code.

---

## 3. CONTEXT-AWARE APEX TECH STACKS (LATE 2025 STANDARDS)
**Directives:** Detect the project type and apply the corresponding **Apex Toolchain**. This repository, `VelocityRay-Web-Performance-Analyzer-Browser-Extension`, is a TypeScript-based browser extension.

*   **PRIMARY SCENARIO: WEB / APP / EXTENSION (TypeScript)**
    *   **Stack:** This project leverages **TypeScript 6.x (Strict)** for robust type safety. It is built with **WXT (Web Extensions Toolkit)**, which provides a modern, Vite-powered development experience for creating cross-browser extensions.
    *   **Architecture:** Adheres to **Feature-Sliced Design (FSD)**, a scalable architectural methodology for frontend applications. This ensures a clear and hierarchical structure, separating business logic from UI components and promoting code reusability.
    *   **Linting & Formatting:** Utilizes **Biome** for ultra-fast, unified linting, formatting, and code analysis, enforcing a consistent and high-quality codebase with minimal configuration.
    *   **Testing:** Implements a comprehensive testing strategy with **Vitest** for unit and integration tests and **Playwright** for end-to-end (E2E) testing across different browsers, ensuring the extension's reliability and stability.
    *   **State Management:** Employs modern, fine-grained reactivity using **Signals**, which is becoming the standardized approach in modern frontend frameworks for efficient state updates.

*   **SECONDARY SCENARIO B: DATA / SCRIPTS / AI (Python) - *Not applicable for this project's primary function. Reference only for potential backend services or data analysis scripts.***
    *   **Stack:** If backend data processing is required, Python 3.10+ with `uv` for package management and `Ruff` for linting would be the standard.

</details>

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.x or higher)
- [pnpm](https://pnpm.io/) (recommended package manager)

### Installation & Setup

1.  **Clone the repository:**
    bash
    git clone https://github.com/chirag127/VelocityRay-Web-Performance-Analyzer-Browser-Extension.git
    cd VelocityRay-Web-Performance-Analyzer-Browser-Extension
    

2.  **Install dependencies:**
    bash
    pnpm install
    

3.  **Run the development server:**
    bash
    pnpm dev
    
    This will generate an `dist/` directory. Load it as an unpacked extension in your browser's developer mode.

## 🛠️ Development Scripts

| Script | Description                                       |
| :----- | :------------------------------------------------ |
| `dev`    | Starts the development server with hot-reloading. |
| `build`  | Compiles and bundles the extension for production.|
| `lint`   | Runs Biome to analyze and format the codebase.     |
| `test`   | Executes unit tests using Vitest.                 |
| `test:e2e` | Runs end-to-end tests using Playwright.         |

## 🤝 Contributing

Contributions are welcome! Please read the [**Contributing Guidelines**](.github/CONTRIBUTING.md) to get started. All contributors are expected to adhere to our [**Code of Conduct**](CODE_OF_CONDUCT.md).

## 📜 License

This project is licensed under the [**Creative Commons Attribution-NonCommercial 4.0 International License**](LICENSE). You are free to share and adapt the material for non-commercial purposes, provided you give appropriate credit.
