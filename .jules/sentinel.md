<!-- markdownlint-disable MD041 -->
[← Back to Main README](../README.md)

---

## 2026-07-14 - [Automated Pre-Commit Secret Scanning]

**Vulnerability:** Accidental exposure of API keys, OpenAI tokens, AWS
credentials, or other secrets in prompt examples or documentation
contributions.

**Learning:** Even in documentation-only repositories (e.g., awesome prompt
lists), there is a significant risk of contributors inadvertently committing
real credentials when sharing their prompts or example configurations. Since
standard code-centric tools might not be configured for pure Markdown repos, a
lightweight and localized script is needed to prevent credential leakage.

**Prevention:** Implement a clean, dependency-free Python pre-commit/CI script
(`scripts/scan_secrets.py`) utilizing regex patterns to validate file contents
before changes are committed, raising failures on potential high-entropy
credentials.

## 2026-07-16 - [Secret Scan Bypass via Template Comments]

**Vulnerability:** A naive line-level check for curly braces (`"{" in line and
"}" in line`) in `scan_secrets.py` allowed real secrets to bypass scanning
completely if a prompt placeholder or curly brace comment existed anywhere on
the same line.

**Learning:** Line-level heuristic bypasses can easily create security gaps when
multiple patterns coexist (e.g., a real API key and an unrelated
placeholder/comment on the same line). Filtering must be precisely targeted at
the matched secret string rather than broad line-level heuristics.

**Prevention:** Refine secret scanning regex patterns to explicitly match both
normal secrets and placeholder formats, then check if curly braces are present
within the matched substring (`match.group(0)`) rather than the entire line
before skipping.

## 2026-07-17 - [Secret Scan Bypass via Single-Line Multiple Matches]

**Vulnerability:** The secret scanning script `scan_secrets.py` utilized
`re.search()` to evaluate matches. This returned only the first match on any
given line. If a line contained a placeholder (e.g., `sk-{API_KEY}`) followed
by a real secret (e.g., a real API key) on the same line, the script matched
the placeholder first, saw it had curly braces, and skipped scanning the line
entirely, bypassing security checks and leaking the real secret.

**Learning:** When using regular expressions to scan files line-by-line, relying
on single-match search functions can lead to blind spots if multiple matched
structures (e.g., dummy template placeholders and actual secrets) coexist on
the same line.

**Prevention:** Always iterate through all matches on a line using `finditer()`
(or global/multiline flags) and only skip the line if *all* matched occurrences
are valid, non-leaking patterns or placeholders.

## 2026-07-18 - [Modern OpenAI Key Bypass in Secret Scanner]

**Vulnerability:** Modern OpenAI API key formats containing hyphens and
underscores (e.g., `sk-proj-`) bypassed the secret scanner entirely because
the regex pattern restrictively matched only alphanumeric characters
`[a-zA-Z0-9]{32,}`.

**Learning:** Regex definitions must be periodically updated to match the
evolving formats of modern keys and credentials. Without proper coverage
for special characters like hyphens or underscores in key prefixes, scanning
tools suffer from false negatives and allow credentials to be leaked silently.

**Prevention:** Broaden pattern matching characters to allow `[a-zA-Z0-9_\-]`
in credential payloads, and verify regex coverage through dedicated unit tests
(`test_scan_secrets.py`) that simulate modern key formats using dynamic
concatenation.

## 2026-07-21 - [GitHub Token Bypass in Secret Scanner]

**Vulnerability:** The repository's secret scanner lacked pattern definitions
to detect leaked classic or fine-grained GitHub Personal Access Tokens (PATs)
and other GitHub credentials.

**Learning:** When scanning for developer-centric credentials in repositories
with high contributor volume (even doc-only), ignoring common platform-specific
credential formats like `ghp_` or `github_pat_` creates a blind spot.
Furthermore, overlapping rules (e.g., a "Generic Token" keyword rule and a specific
"GitHub Token" rule) can trigger dual/overlapping matches if variables or test cases
unintentionally share keywords like `github_token`.

**Prevention:** Add explicit pattern definitions covering all classic, fine-grained,
and temp/installation GitHub token formats to `scan_secrets.py`. When writing tests
for specific patterns, avoid using generic keywords in assignment statements
to prevent rule collisions.

## 2026-07-23 - [Leaked Groq and Replicate AI Credentials]

**Vulnerability:** Lack of dedicated secret scanner patterns for popular AI
developer services like Groq and Replicate. This created a potential blind
spot where developers contributing prompt configurations or example integrations
could accidentally leak live `gsk_` Groq keys or `r8_` Replicate API tokens.

**Learning:** In AI-centric and prompt-curation repositories, the threat model
extends beyond generic or classic cloud credentials to modern AI-native service
API keys. Coverage must be kept complete by adding specific rules for rising
and widely adopted AI platforms.

**Prevention:** Regularly audit active prompt examples and expand the pre-commit
scanner (`scan_secrets.py`) patterns to cover specialized AI API credential
formats as they emerge, verifying each with dedicated unit tests.

## 2026-07-24 - [Google AI Studio / Gemini API Auth Key Format Transition]

**Vulnerability:** Legacy secret scanner patterns only scanned for the old
standard Google API key prefix (`AIzaSy...`). This left a massive security
gap / blindspot for modern Google AI Studio and Gemini API "Authorization"
keys starting with the `AQ.` prefix.

**Learning:** Platforms continuously update their security postures and
credential formats to improve authorization and revocation controls. Scanning
systems must adapt to detect both legacy and next-generation patterns to
prevent silent leakages.

**Prevention:** Broaden pattern matching characters and prefixes to recognize
both traditional `AIzaSy...` keys and the newly introduced `AQ.` auth keys, and
verify coverage with robust unit testing.

## 2026-07-26 - [GitLab Access Token Scanning and Multi-Format Support]

**Vulnerability:** Lack of secret scanner pattern coverage for GitLab Personal
Access Tokens (PATs) allowed contributors to inadvertently leak `glpat-` keys
within prompt examples or code templates.

**Learning:** GitLab PATs have transitioned from standard 20-character legacy
tokens to modern, routable tokens containing a dot (`.`) and a 9-character
routing hash. A naive regex can either miss the routable structure or falsely
match part of an invalid length token. Strict length checks and dot/routing-hash
distinctions must be explicitly handled via negative lookaheads and structured
alternations to prevent both false positives and false negatives.

**Prevention:** Define a comprehensive regex pattern for `glpat-` prefixes that
separates legacy/standard 20-character matches (using negative lookaheads for subsequent characters)
from modern routable matches (27-300 characters + dot + 9-character hash) and bracketed template placeholders,
and verify coverage using concatenated test assertions.

## 2026-07-28 - [Duplicate Rule Consolidation and Identifier Constraints]

**Vulnerability:** Duplicate / overlapping regular expression patterns in the secret scanner (e.g., matching the same prefix under different names, like "GitLab Token" and "GitLab Access Token") can trigger redundant evaluation and duplicate alerts, causing unit test suites to fail on dual matches.

**Learning:** When merging and scaling distinct scanner features, name changes or identifier variations can inadvertently introduce overlapping rules. If rules overlap, each file scan reports multiple issues for a single leak, causing unexpected side effects in CI pipelines and unit tests.

**Prevention:** Periodically audit active scanning patterns and consolidate duplicates. Upgrade existing rules to adopt the most robust lookahead and character class definitions, ensuring that only a single clear rule matches each credential prefix and that unit tests are correctly aligned.

## 2026-07-30 - [Secret Leakage in Build and CI Logs]

**Vulnerability:** Even though the secret scanner successfully catches committed secrets, printing the original line content containing the raw secret to standard output exposes the secret in cleartext within CI/CD runner build logs and terminal outputs.

**Learning:** Finding a secret is only half the battle. If a scanner alerts on a secret and prints the offending line containing that raw credential to stdout/logs, the secret becomes permanently exposed in the repository's CI history and logs, defeating the purpose of prevention.

**Prevention:** Redact the specific matched secret substring from the reported line content by replacing it with `[REDACTED]` prior to returning the issue or printing it to console outputs.

## 2026-08-01 - [NPM Registry Token Leakage Prevention]

**Vulnerability:** Lack of secret scanner pattern coverage for NPM registry access tokens (using the modern `npm_` prefix format) could lead to contributors accidentally committing live npm tokens when sharing examples or code configurations.

**Learning:** Platforms like npm have moved to high-entropy, structured token formats with explicit prefixes (e.g. `npm_` followed by 36 alphanumeric characters). Standard generic scanners might miss these if they aren't configured with prefix-specific lookaheads to enforce length bounds precisely.

**Prevention:** Define a dedicated `NPM Token` scanning pattern that precisely matches `npm_` followed by exactly 36 alphanumeric characters, handles negative lookaheads to avoid partial/invalid matches, exempts bracketed placeholders, and includes robust test assertions.

## 2026-08-02 - [Sentry Authentication Token Leakage Prevention]

**Vulnerability:** Lack of secret scanner pattern coverage for Sentry User and Organization Auth Tokens could lead to contributors accidentally committing live Sentry credentials when sharing configuration examples or setting up continuous integration configurations.

**Learning:** Modern Sentry User Auth Tokens start with `sntryu_` followed by exactly 64 hexadecimal characters, while Organization Auth Tokens start with `sntrys_` followed by variable-length base64-encoded/URL-safe payloads (at least 40+ characters). Standard generic scanners or old token definitions miss these structured formats because they lack specific prefix lookaheads and length constraint assertions.

**Prevention:** Define a dedicated `Sentry Token` scanning rule that recognizes both `sntryu_` (with exact 64 hexadecimal character constraints) and `sntrys_` (with 40+ base64/URL-safe character constraints) prefixes, exempts standard template placeholders, and includes comprehensive test verification cases.

## 2026-08-04 - [Discord Bot Token Leakage Prevention]

**Vulnerability:** Lack of secret scanner pattern coverage for Discord Bot Tokens, which pose high compromise risk to chat integrations, channels, and guild-level user data.

**Learning:** Unlike other developer secrets with constant prefixes (e.g., `sk-` or `ghp_`), Discord Bot Tokens consist of three distinct base64/URL-safe segments separated by dots (user ID, timestamp, and signature). Their variable-length segments (specifically 27-45 characters for HMAC signature) make them prone to bypassing simple generic scanners.

**Prevention:** Define a high-fidelity `Discord Token` scanning pattern mapping the specific base64/URL-safe structure and segment lengths with proper word boundary controls, while exempting curly-braced template placeholders and verifying coverage with robust concatenated test assertions.

## 2026-08-05 - [DigitalOcean Token Leakage Prevention]

**Vulnerability:** Lack of secret scanner pattern coverage for DigitalOcean Personal Access Tokens (PATs) could lead to contributors accidentally committing live DigitalOcean tokens when sharing prompt examples or configurations.

**Learning:** DigitalOcean Personal Access Tokens have a structured prefix (`dop_v1_`) followed by exactly 64 hexadecimal characters. Generic scanners can miss these high-entropy patterns without prefix-specific regexes and exact length-bound/character lookahead enforcements.

**Prevention:** Define a dedicated `DigitalOcean Token` scanning pattern matching `dop_v1_` followed by exactly 64 hexadecimal characters, use negative lookaheads to prevent partial or oversized matching, exempt bracketed placeholders, and verify with robust test assertions.
