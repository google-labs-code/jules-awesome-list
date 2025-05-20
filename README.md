<p align="center">
  <img src="assets/jules-readme.png" alt="Jules Awesome List" width="600">
</p>

<div align="center">
  <h1>Awesome Jules Prompts 🌟</h1>
  <p>Curated prompts for Jules, an async coding agent from Google Labs.</p>
  <br>
  <a href="https://jules.google.com">Visit Jules</a> •
  <a href="#contributing">Contribute</a>
</div>

---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Everyday Dev Tasks](#everyday-dev-tasks)
- [Debugging](#debugging)
- [Documentation](#documentation)
- [Testing](#testing)
- [Package Management](#package-management)
- [AI-Native Tasks](#ai-native-tasks)
- [Context](#context)
- [Fun \& Experimental](#fun--experimental)
- [Start from Scratch](#start-from-scratch)
- [Contributing](#contributing)

---

## Everyday Dev Tasks

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

- `// Analyze the complexity of {a specific function} and suggest ways to optimize it for performance and readability.`
  <sub>Focuses on proactive code improvement and optimization.</sub>



## Debugging

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

- `// Simulate {a specific edge case scenario} for {a function/module} and help me identify potential failure points.`
  <sub>Encourages thinking about robustness and resilience during debugging.</sub>


## Documentation

- `// Write a README for this project`
  <sub>Any repo lacking a basic project overview.</sub>

- `// Add comments to this code`
  <sub>Improves maintainability of complex logic.</sub>

- `// Write API docs for this endpoint`
  <sub>REST or GraphQL backends.</sub>

- `// Based on the code in {file_path} and its dependencies, generate a mermaid diagram illustrating the architecture or flow.`
  <sub>Leverages AI for visual documentation generation.</sub>



## Testing

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

- `// Analyze the existing test suite for {a specific module} and identify any gaps in test coverage, suggesting specific test cases to add.`
  <sub>Goes beyond just adding tests to strategically improving existing test suites.</sub>



## Package Management

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

- `// My project build is failing due to conflicting dependencies. Analyze my `package.json` / `pyproject.toml` / `pom.xml` `and help me resolve the version conflicts.`
  <sub>Addresses a common and often frustrating developer issue.</sub>



## AI-Native Tasks

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

- `// Given the user feedback in {source: e.g., issue tracker, support tickets}, identify the most impactful areas for UX improvement in this application.`
  <sub>Uses AI to bridge the gap between user feedback and development priorities.</sub>



## Context

- `// Write a status update based on recent commits`
  <sub>Managerial and async communication.</sub>

- `// Summarize all changes in the last 7 days`
  <sub>Catching up after time off.</sub>

- `// Explain the evolution of {a specific feature/module} by analyzing its commit history and identifying key architectural decisions made.`
  <sub>Provides deep historical context for better understanding of code.</sub>



## Fun & Experimental

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

- `// Compose a short, motivational poem or haiku for the team, to be displayed in the CI/CD pipeline output upon a successful build.`
  <sub>Adds a creative and human touch to the development process.</sub>

## Start from Scratch

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

- `// I want to build {a type of application, e.g., a real-time chat app} using {preferred tech stack, e.g., React, Firebase, and TypeScript}. Generate a boilerplate project structure with key modules and configurations.`
  <sub>Offers more comprehensive project scaffolding based on user choices.</sub>



## Contributing

Your contributions are welcome! Add new prompts, fix formatting, or suggest categories.

- 📄 [Contributing Guide](contributing.md)
- 🪄 Open a [Pull Request](https://github.com/YOUR_REPO/pulls)
