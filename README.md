<p align="center">
  <!-- ⚡ Bolt: Optimized responsive header image.
       Fixed 2x asset dimensions (1200x504) for perfect scaling with 1x (600x252).
       Impact: Prevents sub-pixel layout shifts. Improved LCP by re-compressing
               AVIF assets (1200px: 2.4K -> 2.0K, 600px: 1.6K -> 1.3K) and
               WebP assets (1200px: 7.8K -> 6.7K, 600px: 3.7K -> 3.1K).
  -->
  <picture>
    <source srcset="assets/jules-readme-600.avif 1x, assets/jules-readme-1200.avif 2x" type="image/avif">
    <source srcset="assets/jules-readme-600.webp 1x, assets/jules-readme.webp 2x" type="image/webp">
    <img src="assets/jules-readme-600.webp" alt="Awesome Jules Prompts - A curated collection of prompts for the Jules AI agent" width="600" height="252" fetchpriority="high">
  </picture>
</p>

<div align="center">
  <h1>Awesome Jules Prompts <span aria-hidden="true">🌟</span></h1>
  <p>Curated prompts for Jules, an async coding agent from Google Labs.</p>
  <br>
  <a href="https://jules.google.com" target="_blank" rel="noopener noreferrer" aria-label="Visit Jules (opens in a new tab)">Visit Jules <span aria-hidden="true">🚀</span></a><span aria-hidden="true"> • </span>
  <a href="#contributing" aria-label="Contribute to this project">Contribute <span aria-hidden="true">🤝</span></a><span aria-hidden="true"> • </span>
  <a href="SECURITY.md" aria-label="Read our Security Policy">Security Policy <span aria-hidden="true">🛡️</span></a>
</div>

> [!TIP]
> Replace placeholders in curly braces (e.g., `{a specific}`) with your actual file names, function names, or context to get the best results from Jules.

---

<a id="table-of-contents"></a>

## Table of Contents <span aria-hidden="true">📖</span>

- <a href="#everyday-dev-tasks" aria-label="Everyday Dev Tasks">Everyday Dev Tasks <span aria-hidden="true">🛠️</span></a>
- <a href="#debugging" aria-label="Debugging">Debugging <span aria-hidden="true">🐞</span></a>
- <a href="#documentation" aria-label="Documentation">Documentation <span aria-hidden="true">📝</span></a>
- <a href="#testing" aria-label="Testing">Testing <span aria-hidden="true">🧪</span></a>
- <a href="#security" aria-label="Security">Security <span aria-hidden="true">🛡️</span></a>
- <a href="#package-management" aria-label="Package Management">Package Management <span aria-hidden="true">📦</span></a>
- <a href="#ai-native-tasks" aria-label="AI-Native Tasks">AI-Native Tasks <span aria-hidden="true">🤖</span></a>
- <a href="#context" aria-label="Context">Context <span aria-hidden="true">🏗️</span></a>
- <a href="#fun--experimental" aria-label="Fun & Experimental">Fun & Experimental <span aria-hidden="true">✨</span></a>
- <a href="#start-from-scratch" aria-label="Start from Scratch">Start from Scratch <span aria-hidden="true">🌱</span></a>
- <a href="#contributing" aria-label="Contributing">Contributing <span aria-hidden="true">🤝</span></a>

---

<a id="everyday-dev-tasks"></a>

## Everyday Dev Tasks <span aria-hidden="true">🛠️</span>

- `// Refactor {a specific} file from {x} to {y}...`
  <sub>General-purpose, applies to any language or repo.</sub>

- `// Add a test suite...`
  <sub>Useful for repos lacking test coverage.</sub>

- `// Add type hints to {a specific} Python function...`
  <sub>Python codebases transitioning to typed code.</sub>

- `// Generate mock data for {a specific} schema...`
  <sub>APIs, frontends, or test-heavy environments.</sub>

- `// Convert these commonJS modules to ES modules...`
  <sub>JS/TS projects modernizing legacy code.</sub>

- `// Turn this callback-based code into async/await...`
  <sub>JavaScript or Python codebases improving async logic.</sub>

- `// Implement a data class for this dictionary structure...`
  <sub>Useful for Python projects moving towards more structured data handling with `dataclasses` or Pydantic.</sub>

---

<a href="#table-of-contents" aria-label="Back to Table of Contents">Back to top ↑</a>

<a id="debugging"></a>

## Debugging <span aria-hidden="true">🐞</span>

- `// Help me fix {a specific} error...`
  <sub>For any repo where you're stuck on a runtime or build error.</sub>

- `// Why is {this specific snippet of code} slow?`
  <sub>Performance profiling for loops, functions, or queries.</sub>

- `// Trace why this value is undefined...`
  <sub>Frontend and backend JS/TS bugs.</sub>

- `// Diagnose this memory leak...`
  <sub>Server-side apps or long-running processes.</sub>

- `// Add logging to help debug this issue...`
  <sub>Useful when troubleshooting silent failures.</sub>

- `// Find race conditions in this async code`
  <sub>Concurrent systems in JS, Python, Go, etc.</sub>

- `// Add print statements to trace the execution flow of this Python script...`
  <sub>For debugging complex Python scripts or understanding unexpected behavior.</sub>

---

<a href="#table-of-contents" aria-label="Back to Table of Contents">Back to top ↑</a>

<a id="documentation"></a>

## Documentation <span aria-hidden="true">📝</span>

- `// Write a README for this project`
  <sub>Any repo lacking a basic project overview.</sub>

- `// Add comments to this code`
  <sub>Improves maintainability of complex logic.</sub>

- `// Write API docs for this endpoint`
  <sub>REST or GraphQL backends.</sub>

- `// Generate Sphinx-style docstrings for this Python module/class/function...`
  <sub>Ideal for Python projects using Sphinx for documentation generation.</sub>

---

<a href="#table-of-contents" aria-label="Back to Table of Contents">Back to top ↑</a>

<a id="testing"></a>

## Testing <span aria-hidden="true">🧪</span>

- `// Add integration tests for this API endpoint`
  <sub>Express, FastAPI, Django, Flask apps.</sub>

- `// Write a test that mocks fetch`
  <sub>Browser-side fetch or axios logic.</sub>

- `// Convert this test from Mocha to Jest`
  <sub>JS test suite migrations.</sub>

- `// Generate property-based tests for this function`
  <sub>Functional or logic-heavy code.</sub>

- `// Simulate slow network conditions in this test suite`
  <sub>Web and mobile apps.</sub>

- `// Write a test to ensure backward compatibility for this function`
  <sub>Library or SDK maintainers.</sub>

- `// Write a Pytest fixture to mock this external API call...`
  <sub>For Python projects using Pytest and needing robust mocking for testing.</sub>

---

<a href="#table-of-contents" aria-label="Back to Table of Contents">Back to top ↑</a>

<a id="security"></a>

## Security <span aria-hidden="true">🛡️</span>

> [!IMPORTANT]
> To report a vulnerability in this repository, please refer to our <a href="SECURITY.md" aria-label="Read our Security Policy">Security Policy</a>.

- `// Scan this file for hardcoded secrets or API keys...`
  <sub>Critical for preventing accidental credential leaks.</sub>

- `// Identify potential SQL injection vulnerabilities in this code...`
  <sub>Improves database security by finding unsanitized inputs.</sub>

- `// Audit this dependency list for known vulnerabilities...`
  <sub>Useful for identifying risky third-party packages.</sub>

- `// Add input validation and sanitization to this function...`
  <sub>Prevents XSS and other injection attacks.</sub>

- `// Suggest security headers for this Express app...`
  <sub>Improves browser-side security (CSP, HSTS, etc.).</sub>

- `// Implement rate limiting for this login endpoint...`
  <sub>Protects against brute-force attacks.</sub>

- `// Identify potential Path Traversal vulnerabilities in this file processing logic...`
  <sub>Ensures users cannot access unauthorized files on the server.</sub>

- `// Identify potential Command Injection vulnerabilities in this code...`
  <sub>Detects unsanitized inputs passed to system shell commands to prevent unauthorized command execution.</sub>

- `// Review this LLM integration for Prompt Injection and Insecure Output Handling...`
  <sub>Secures AI-native applications by preventing malicious system-prompt overrides and unescaped LLM output execution.</sub>

---

<a href="#table-of-contents" aria-label="Back to Table of Contents">Back to top ↑</a>

<a id="package-management"></a>

## Package Management <span aria-hidden="true">📦</span>

- `// Upgrade my linter and autofix breaking config changes`
  <sub>JS/TS repos using ESLint or Prettier.</sub>

- `// Show me the changelog for React 19`
  <sub>Web frontend apps using React.</sub>

- `// Which dependencies can I safely remove?`
  <sub>Bloated or legacy codebases.</sub>

- `// Check if these packages are still maintained`
  <sub>Security-conscious or long-term projects.</sub>

- `// Set up Renovate or Dependabot for auto-updates`
  <sub>Best for active projects with CI/CD.</sub>

---

<a href="#table-of-contents" aria-label="Back to Table of Contents">Back to top ↑</a>

<a id="ai-native-tasks"></a>

## AI-Native Tasks <span aria-hidden="true">🤖</span>

- `// Analyze this repo and generate 3 feature ideas`
  <sub>Vision-stage or greenfield products.</sub>

- `// Identify tech debt in this file`
  <sub>Codebases with messy or fragile logic.</sub>

- `// Find duplicate logic across files`
  <sub>Sprawling repos lacking DRY practices.</sub>

- `// Cluster related functions and suggest refactors`
  <sub>Projects with lots of utils or helpers.</sub>

- `// Help me scope this issue so Jules can solve it`
  <sub>For working with Jules on real issues.</sub>

- `// Convert this function into a reusable plugin/module`
  <sub>Componentizing logic-heavy code.</sub>

- `// Refactor this Python function to be more amenable to parallel processing (e.g., using multiprocessing or threading)...`
  <sub>For optimizing performance in computationally intensive Python applications.</sub>

---

<a href="#table-of-contents" aria-label="Back to Table of Contents">Back to top ↑</a>

<a id="context"></a>

## Context <span aria-hidden="true">🏗️</span>

- `// Write a status update based on recent commits`
  <sub>Managerial and async communication.</sub>

- `// Summarize all changes in the last 7 days`
  <sub>Catching up after time off.</sub>

---

<a href="#table-of-contents" aria-label="Back to Table of Contents">Back to top ↑</a>

<a id="fun--experimental"></a>

## Fun & Experimental <span aria-hidden="true">✨</span>

- `// Add a confetti animation when {a specific} action succeeds`
  <sub>Frontend web apps with user delight moments.</sub>

- `// Inject a developer joke when {a specific} build finishes`
  <sub>Personal projects or team tools.</sub>

- `// Build a mini CLI game that runs in the terminal`
  <sub>For learning or community fun.</sub>

- `// Add a dark mode Easter egg to this UI`
  <sub>Design-heavy frontend projects.</sub>

- `// Turn this tool into a GitHub App`
  <sub>Reusable, platform-integrated tools.</sub>

---

<a href="#table-of-contents" aria-label="Back to Table of Contents">Back to top ↑</a>

<a id="start-from-scratch"></a>

## Start from Scratch <span aria-hidden="true">🌱</span>

- `// What's going on in this repo?`
  <sub>Great for legacy repos or onboarding onto unfamiliar code.</sub>

- `// Initialize a new Express app with CORS enabled`
  <sub>Web backend projects using Node.js and Express.</sub>

- `// Set up a monorepo using Turborepo and PNPM`
  <sub>Multi-package JS/TS projects with shared dependencies.</sub>

- `// Bootstrap a Python project with Poetry and Pytest`
  <sub>Python repos aiming for clean dependency and test setup.</sub>

- `// Create a starter template for a Chrome extension`
  <sub>Browser extension development.</sub>

- `// I want to build a web scraper—start me off`
  <sub>Data scraping or automation tools using Python/Node.</sub>

---

<a href="#table-of-contents" aria-label="Back to Table of Contents">Back to top ↑</a>

<a id="contributing"></a>

## Contributing <span aria-hidden="true">🤝</span>

> [!TIP]
> New here? Check out our <a href="contributing.md" aria-label="Read our Contributing Guide">Contributing Guide</a> to learn how to
> add your own prompts.

Your contributions are welcome! Add new prompts, fix formatting, or suggest categories.

- <span aria-hidden="true">📄</span> <a href="contributing.md" aria-label="Read our Contributing Guide">Contributing Guide</a>
- <span aria-hidden="true">🪄</span> Open a <a href="https://github.com/qapdex-maker/awesome-jules-prompts/pulls" target="_blank" rel="noopener noreferrer" aria-label="Open a Pull Request (opens in a new tab)">Pull Request</a>

---

<a href="#table-of-contents" aria-label="Back to Table of Contents">Back to top ↑</a>
