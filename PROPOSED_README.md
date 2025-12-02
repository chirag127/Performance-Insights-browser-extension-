# PerformanceInsights-Web-Performance-Monitor-Browser-Extension

## Visionary Overview

This repository contains the definitive architecture and configuration for an advanced Web Performance Monitoring Browser Extension, designed to provide developers with granular, real-time analysis of page loading, resource handling, and rendering bottlenecks. This project adheres strictly to the Apex Technical Authority's 2026 standards.

---

<details>
<summary>🤖 <strong>AI Agent Directives & Verification Protocol (DECEMBER 2025)</strong></summary>

## 1. IDENTITY & PRIME DIRECTIVE
**Role:** Senior Principal Software Architect. Enforce FAANG-level standards and the wisdom of "Managing the Unmanageable." **Output Standard:** EXECUTION-ONLY.

## 2. CONTEXT-AWARE APEX TECH STACKS (LATE 2025 STANDARDS)
**Primary Scenario Detected:** Web / Extension (TypeScript).

*   **Stack:** TypeScript 6.x (Strict Mode enabled), Vite 7 (Build Tool), Playwright (E2E Testing), Biome (Linter/Formatter).
*   **Architecture:** Feature-Sliced Design (FSD) enforced for scalability and maintainability within the extension structure. Clear separation between background, content, and UI layers.
*   **State Management:** Utilizing Signals for reactive updates across UI boundaries.
*   **API Interaction:** Secure handling of Chrome/Firefox WebExtension APIs.

## 3. DEVELOPMENT VERIFICATION COMMANDS
To ensure Zero-Defect compliance, use the following Apex verification suite:

| Command | Purpose | Tool | Standard | 
| :--- | :--- | :--- | :--- |
| `npx @biomejs/biome check --apply src/` | Format and Fix (Linter/Formatter) | Biome | DRY/LINT | 
| `npm run test:unit` | Run Vitest suite on non-browser logic | Vitest | SOLID | 
| `npm run test:e2e` | Execute Playwright scenarios against target URLs | Playwright | Robustness | 
| `npm run build` | Compile the final artifact using Vite 7 pipeline | Vite | Velocity | 

## 4. ARCHITECTURAL PRINCIPLES
*   **SOLID:** Strictly applied, especially Single Responsibility Principle (SRP) across content scripts and background workers.
*   **DRY:** Minimize redundant logic; use shared utility layers.
*   **YAGNI:** Only implement features necessary for immediate, high-value performance measurement.

*This directive block confirms the intended technical alignment for automated processing.* 
</details>

---

## ⭐ Project Status & Badges

[![Build Status](https://img.shields.io/github/actions/workflow/status/chirag127/PerformanceInsights-Web-Performance-Monitor-Browser-Extension/ci.yml?label=Build&style=flat-square)](https://github.com/chirag127/PerformanceInsights-Web-Performance-Monitor-Browser-Extension/actions/workflows/ci.yml)
[![Code Coverage](https://img.shields.io/codecov/c/github/chirag127/PerformanceInsights-Web-Performance-Monitor-Browser-Extension?label=Coverage&style=flat-square)](https://codecov.io/gh/chirag127/PerformanceInsights-Web-Performance-Monitor-Browser-Extension)
[![Language](https://img.shields.io/github/languages/top/chirag127/PerformanceInsights-Web-Performance-Monitor-Browser-Extension?style=flat-square)](https://github.com/chirag127/PerformanceInsights-Web-Performance-Monitor-Browser-Extension)
[![License](https://img.shields.io/github/license/chirag127/PerformanceInsights-Web-Performance-Monitor-Browser-Extension?style=flat-square)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/chirag127/PerformanceInsights-Web-Performance-Monitor-Browser-Extension?style=flat-square)](https://github.com/chirag127/PerformanceInsights-Web-Performance-Monitor-Browser-Extension)

[//]: # (GitHub Star Button Marker)
[⭐ Star this Repo](https://github.com/chirag127/PerformanceInsights-Web-Performance-Monitor-Browser-Extension)

## 🎯 BLUF (Bottom Line Up Front)
**PerformanceInsights** is a TypeScript-based browser extension delivering real-time, actionable Web Vitals and resource bottleneck analysis directly within the developer workflow. It leverages FSD architecture to ensure maximum performance and testability for mission-critical speed diagnostics.

## 🏗️ Architecture Overview (Feature-Sliced Design)

ascii
PerformanceInsights (Root)
├── layers
│   ├── app/         (Initialization, Entry Points, Manifest Config)
│   ├── pages/       (N/A for Extension UI/Popup)
│   ├── widgets/     (Specific, complex UI components)
│   ├── features/    (Core business logic: e.g., MetricCapture, BottleneckAnalysis)
│   ├── entities/    (Data models: PerformanceEntry, ResourceRecord)
│   └── shared/      (Low-level utilities, types, UI primitives)
└── environments
    ├── content/     (Scripts injected into target pages)
    └── background/  (Persistent state, API communication)


## 📜 Table of Contents
1. [Visionary Overview](#visionary-overview)
2. [Project Status & Badges](#-project-status--badges)
3. [BLUF (Bottom Line Up Front)](#-bluf-bottom-line-up-front)
4. [Architecture Overview (Feature-Sliced Design)](#-architecture-overview-feature-sliced-design)
5. [Development Standards](#-development-standards)
6. [Contribution Guide](#-contribution-guide)
7. [License](#license)

## 🛠️ Development Standards

### Prerequisites
Ensure Node.js (v20+) and npm/uv are installed. This project uses npm/Vite for rapid extension scaffolding.

### Setup
bash
git clone https://github.com/chirag127/PerformanceInsights-Web-Performance-Monitor-Browser-Extension.git
cd PerformanceInsights-Web-Performance-Monitor-Browser-Extension
npm install


### Execution Scripts
| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `npm run dev` | Start development server with hot-reloading for extension testing. |
| `build` | `npm run build` | Compile production-ready, minimized extension artifacts. |
| `test:unit` | `npm run test:unit` | Run all pure JavaScript/TypeScript unit tests via Vitest. |
| `test:e2e` | `npm run test:e2e` | Execute end-to-end testing via Playwright against staging pages. |
| `lint:fix` | `npx @biomejs/biome check --apply src/` | Auto-format and fix all linting issues. |

## 🤝 Contribution Guide
We welcome contributions from architects focused on speed and stability. Adherence to the **AI Agent Directives** (found in the collapsible section above) is mandatory for all pull requests. All code must pass Biome checks and achieve 90%+ unit test coverage before review.

See [CONTRIBUTING.md](./.github/CONTRIBUTING.md) for detailed guidelines on submitting patches, new features, and reporting issues.

## ⚖️ License
This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License**. See the [LICENSE](./LICENSE) file for full details.
