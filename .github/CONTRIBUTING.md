# Contributing to PerformanceInsights-Web-Performance-Monitor-Browser-Extension

Thank you for considering contributing to `PerformanceInsights-Web-Performance-Monitor-Browser-Extension`! We aim to maintain a high-quality, professional, and well-architected codebase that adheres to the Apex Technical Authority standards.

## 1. Code of Conduct

This project adheres to a Contributor Code of Conduct. Please read the full text in the `CODE_OF_CONDUCT.md` file so that you understand what actions or behaviors will not be tolerated.

## 2. How to Contribute

We welcome contributions in the form of bug reports, feature requests, and code contributions. All contributions should align with the project's goals of providing real-time web performance analysis and actionable optimization insights.

### 2.1. Reporting Bugs

If you find a bug, please open an issue on GitHub. When reporting a bug, please include:

*   A clear, descriptive title.
*   The version of the extension and your browser.
*   Detailed steps to reproduce the bug.
*   Any relevant screenshots or console logs.
*   Your expected behavior versus the actual behavior.

### 2.2. Suggesting Features

Feature suggestions are also welcome. Please open an issue with the title 'Feature Request:' and provide a detailed description of the feature and the problem it solves.

### 2.3. Contributing Code

We follow a standard fork-and-pull-request workflow:

1.  **Fork the Repository:** Create a fork of the official `chirag127/PerformanceInsights-Web-Performance-Monitor-Browser-Extension` repository.
2.  **Clone Your Fork:** Clone your forked repository to your local machine:
    bash
    git clone https://github.com/chirag127/PerformanceInsights-Web-Performance-Monitor-Browser-Extension.git
    cd PerformanceInsights-Web-Performance-Monitor-Browser-Extension
    
3.  **Set Up Development Environment:** Follow the setup instructions in the `README.md` to install dependencies and configure the development environment.
4.  **Create a New Branch:** Create a feature branch for your changes:
    bash
    git checkout -b feature/your-feature-name
    
5.  **Make Your Changes:** Implement your bug fix or new feature. Ensure your code adheres to the project's coding standards (TypeScript, strict linting with Biome, etc.).
6.  **Test Your Changes:** Write and run tests to ensure your changes do not introduce regressions. Refer to the testing strategy outlined in `AGENTS.md` and the `README.md`.
7.  **Commit Your Changes:** Commit your changes with clear, concise messages.
8.  **Push to Your Fork:** Push your branch to your fork on GitHub:
    bash
    git push origin feature/your-feature-name
    
9.  **Open a Pull Request:** Create a pull request from your feature branch against the `main` branch of the official repository.

## 3. Development Standards & Architecture

We adhere to the Apex Technical Authority standards, focusing on:

*   **Technology Stack:** TypeScript (Strict), Vite, TailwindCSS v4, Tauri v2.
*   **Linting & Formatting:** Biome for speed and consistency.
*   **Testing:** Vitest for unit tests, Playwright for end-to-end tests.
*   **Architecture:** Feature-Sliced Design (FSD) is the preferred architectural pattern.
*   **Principles:** SOLID, DRY, YAGNI.

Refer to the `README.md` and `AGENTS.md` for detailed specifications on the development environment, setup, and architectural guidelines.

## 4. Pull Request Guidelines

*   **Clear Description:** Provide a detailed description of your changes in the pull request template.
*   **Link to Issue:** If your PR addresses an issue, please link to it.
*   **Testing:** Ensure all tests pass.
*   **Code Review:** Be prepared to address feedback from reviewers.

## 5. Getting Help

If you have questions or need clarification, please feel free to open an issue on GitHub. We aim for prompt and constructive communication.