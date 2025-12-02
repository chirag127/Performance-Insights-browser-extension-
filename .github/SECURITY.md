# Security Policy

## Reporting a Vulnerability

We take security seriously at **VelocityRay-Web-Performance-Analyzer-Browser-Extension**. If you discover any security vulnerabilities within this project, please report them responsibly.

We appreciate your efforts to responsibly disclose your findings, and we will do our best to address them promptly.

## Vulnerability Disclosure Process

1.  **DISCOVERY**: Identify a potential security vulnerability.
2.  **REPORT**: Submit a detailed report to `chirag127@example.com` (this is a placeholder, a real project might have a specific security contact or use GitHub's security reporting features).
    *   **Include**: A clear description of the vulnerability, steps to reproduce it, affected versions, and any potential impact.
3.  **ACKNOWLEDGEMENT**: We will acknowledge receipt of your report within **72 hours**.
4.  **ASSESSMENT & FIX**: We will assess the vulnerability and work on a fix. This phase may involve internal discussions and coordination.
5.  **DISCLOSURE**: Once a fix is developed and deployed, we will coordinate a public disclosure, crediting the reporter if appropriate, in accordance with responsible disclosure practices.

## Supported Versions

Currently, we are focusing on providing security updates for the **latest stable version** of the **VelocityRay-Web-Performance-Analyzer-Browser-Extension**. Older versions may not be actively monitored for security issues.

## Security Practices

As an **Apex Technical Authority** project, `VelocityRay-Web-Performance-Analyzer-Browser-Extension` adheres to the following security practices:

*   **Dependency Management**: Regularly scan and update dependencies using `uv` (if applicable for development tooling or backend components) and standard package managers to mitigate known vulnerabilities. Linting and formatting with **Ruff** ensure code quality, indirectly improving security.
*   **Code Review**: All significant code changes undergo review to identify potential security flaws.
*   **Testing**: Comprehensive testing with **Vitest** and **Playwright** helps catch regressions and unexpected behaviors that could have security implications.
*   **Best Practices**: Adherence to core principles like SOLID, DRY, and YAGNI helps maintain a robust and less error-prone codebase.
*   **Browser Extension Security**: Following platform-specific security guidelines (e.g., Chrome Extension security best practices) to prevent common extension-related vulnerabilities.

## Reporting Limitations

*   **No Bug Bounty Program**: We do not currently offer a monetary bug bounty program. Our gratitude is expressed through recognition and prompt attention to reported issues.
*   **Scope**: Reports should pertain to vulnerabilities within the `VelocityRay-Web-Performance-Analyzer-Browser-Extension` project itself, not third-party services or platforms it interacts with, unless the vulnerability is directly caused by how the extension interacts with them.

Thank you for helping keep `VelocityRay-Web-Performance-Analyzer-Browser-Extension` secure!