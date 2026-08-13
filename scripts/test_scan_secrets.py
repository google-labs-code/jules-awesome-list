import os
import tempfile
import pytest
from unittest.mock import patch, MagicMock
from scripts.scan_secrets import scan_file, PATTERNS, supports_color


def create_temp_file(content):
    fd, path = tempfile.mkstemp(suffix=".txt")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(content)
        return path
    except Exception:
        os.close(fd)
        raise


@pytest.fixture
def run_scan():
    temp_files = []

    def _scan(content):
        path = create_temp_file(content)
        temp_files.append(path)
        return scan_file(path)

    yield _scan
    for path in temp_files:
        try:
            os.remove(path)
        except OSError:
            pass


def test_clean_file(run_scan):
    content = "This is a clean file without any secrets."
    issues = run_scan(content)
    assert len(issues) == 0


def test_traditional_openai_key(run_scan):
    # 32 characters after sk- (alphanumeric only)
    # Concatenated to avoid triggering scanner on this test file
    content = "my_key = '" + "sk-" + "A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "OpenAI API Key"


def test_modern_openai_key_with_hyphens(run_scan):
    # Modern sk-proj- key format with hyphens
    # Concatenated to avoid triggering scanner on this test file
    content = (
        "openai_key = '" + "sk-" + "proj-abc123abc123abc123abc123abc123abc123abc123'"
    )
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "OpenAI API Key"


def test_aws_access_key(run_scan):
    # Concatenated to avoid triggering scanner on this test file
    content = "aws_key = '" + "AKIA" + "1234567890ABCDEF'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "AWS Access Key"


def test_google_api_key(run_scan):
    # Concatenated to avoid triggering scanner on this test file
    content = "google_key = '" + "AIzaSy" + "A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P67'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "Google API Key"


def test_google_aq_api_key(run_scan):
    # Concatenated to avoid triggering scanner on this test file
    content = "my_val = '" + "AQ." + "Ab8RN6K1234567890123456789012345678901234567890'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "Google API Key"


def test_google_aq_placeholder_ignored(run_scan):
    # Concatenated to avoid triggering scanner on this test file
    content = "my_val = '" + "AQ." + "{GOOGLE_API_KEY}'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_placeholder_ignored(run_scan):
    # Concatenated to avoid triggering scanner on this test file
    content = "openai_key = '" + "sk-" + "{OPENAI_API_KEY}'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_deepseek_api_key(run_scan):
    # DeepSeek API keys are 32 hex chars after sk-
    # Concatenated to avoid triggering scanner on this test file
    content = "my_key = '" + "sk-" + "a1b2c3d4e5f607182930a1b2c3d4e5f6'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "DeepSeek API Key"


def test_deepseek_placeholder_ignored(run_scan):
    # Concatenated to avoid triggering scanner on this test file
    content = "my_key = '" + "sk-" + "{DEEPSEEK_API_KEY}'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_multi_match_line_detects_real_secret(run_scan):
    # A placeholder followed by a real key on the same line
    # Concatenated to avoid triggering scanner on this test file
    content = (
        "placeholder = '"
        + "sk-"
        + "{API_KEY}' and real = '"
        + "sk-"
        + "proj-abc123abc123abc123abc123abc123abc123abc123'"
    )
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "OpenAI API Key"


def test_generic_token(run_scan):
    # Concatenated to avoid triggering scanner on this test file
    content = "api_key = '" + "some_random_high_" + "entropy_secret_key'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "Generic Token"


def test_github_classic_token(run_scan):
    # ghp_ format, length of 40 total
    # Concatenated to avoid triggering scanner on this test file
    content = "val = '" + "ghp_" + "1234567890abcdefghijklmnopqrstuvwxyz12'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "GitHub Token"


def test_github_fine_grained_token(run_scan):
    # github_pat_ format
    # Concatenated to avoid triggering scanner on this test file
    content = (
        "val = '"
        + "github_pat_"
        + "1234567890abcdefghijkl_1234567890abcdefghijklmnopqrstuvwx_1234567890'"
    )
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "GitHub Token"


def test_github_placeholder_ignored(run_scan):
    # Concatenated to avoid triggering scanner on this test file
    content = "val = '" + "ghp_" + "{GITHUB_TOKEN}'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_anthropic_api03_key(run_scan):
    # Anthropic api03 key format, sk-ant-api03- followed by 93 chars and AA
    # Concatenated to avoid triggering scanner on this test file
    content = (
        "val = '"
        + "sk-ant-"
        + "api03-1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrsAA'"
    )
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "Anthropic API Key"


def test_anthropic_admin01_key(run_scan):
    # Anthropic admin01 key format, sk-ant-admin01- followed by 93 chars and AA
    # Concatenated to avoid triggering scanner on this test file
    content = (
        "val = '"
        + "sk-ant-"
        + "admin01-1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrsAA'"
    )
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "Anthropic API Key"


def test_anthropic_placeholder_ignored(run_scan):
    # Concatenated to avoid triggering scanner on this test file
    content = "val = '" + "sk-ant-" + "{ANTHROPIC_API_KEY}'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_huggingface_token_34_chars(run_scan):
    # hf_ format with 34 characters (34 chars after hf_)
    # Concatenated to avoid triggering scanner on this test file
    content = "val = '" + "hf_" + "abcdefghijklmnopqrstuvwxyz12345678'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "Hugging Face Token"


def test_huggingface_token_37_chars(run_scan):
    # hf_ format with 37 characters (37 chars after hf_)
    # Concatenated to avoid triggering scanner on this test file
    content = "val = '" + "hf_" + "abcdefghijklmnopqrstuvwxyz12345678901'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "Hugging Face Token"


def test_huggingface_token_40_chars(run_scan):
    # hf_ format with 40 characters (40 chars after hf_)
    # Concatenated to avoid triggering scanner on this test file
    content = "val = '" + "hf_" + "abcdefghijklmnopqrstuvwxyz12345678901234'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "Hugging Face Token"


def test_huggingface_too_short_ignored(run_scan):
    # hf_ followed by 33 characters (below minimum 34) should be ignored
    # Concatenated to avoid triggering scanner on this test file
    content = "val = '" + "hf_" + "abcdefghijklmnopqrstuvwxyz1234567'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_huggingface_placeholder_ignored(run_scan):
    # Concatenated to avoid triggering scanner on this test file
    content = "val = '" + "hf_" + "{HF_TOKEN}'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_slack_token_xoxb(run_scan):
    # Concatenated to avoid triggering scanner on this test file
    content = (
        "slack_val = '"
        + "xoxb-"
        + "123456789012-345678901234-567890123456789012345678'"
    )
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "Slack Token"


def test_slack_token_xoxp(run_scan):
    # Concatenated to avoid triggering scanner on this test file
    content = (
        "slack_val = '" + "xoxp-" + "1234567890-12345678901-2345678901-2345678901'"
    )
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "Slack Token"


def test_slack_placeholder_ignored(run_scan):
    # Concatenated to avoid triggering scanner on this test file
    content = "slack_val = '" + "xoxb-" + "{SLACK_TOKEN}'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_stripe_test_key(run_scan):
    # Concatenated to avoid triggering scanner on this test file
    content = "stripe_val = '" + "sk_test_" + "51AzSyA1B2C3D4E5F6G7H8I9J0K1L2M'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "Stripe API Key"


def test_stripe_live_key(run_scan):
    # Concatenated to avoid triggering scanner on this test file
    content = "stripe_val = '" + "sk_live_" + "51AzSyA1B2C3D4E5F6G7H8I9J0K1L2M'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "Stripe API Key"


def test_stripe_placeholder_ignored(run_scan):
    # Concatenated to avoid triggering scanner on this test file
    content = "stripe_val = '" + "sk_live_" + "{STRIPE_API_KEY}'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_groq_api_key(run_scan):
    # Concatenated to avoid triggering scanner on this test file
    content = (
        "groq_val = '"
        + "gsk_"
        + "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6'"
    )
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "Groq API Key"


def test_groq_placeholder_ignored(run_scan):
    # Concatenated to avoid triggering scanner on this test file
    content = "groq_val = '" + "gsk_" + "{GROQ_API_KEY}'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_replicate_api_token(run_scan):
    # Concatenated to avoid triggering scanner on this test file
    content = "replicate_val = '" + "r8_" + "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "Replicate API Token"


def test_replicate_placeholder_ignored(run_scan):
    # Concatenated to avoid triggering scanner on this test file
    content = "replicate_val = '" + "r8_" + "{REPLICATE_API_TOKEN}'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_ignored_extension_skipped(tmp_path):
    # Create an image file with a secret-like content
    filepath = tmp_path / "test_image.png"
    # Concatenated to avoid triggering scanner on this test file
    filepath.write_text("aws_key = '" + "AKIA" + "1234567890ABCDEF'")
    issues = scan_file(str(filepath))
    assert len(issues) == 0


def test_ignored_filename_skipped(tmp_path):
    # Create a lock file with a secret-like content
    filepath = tmp_path / "package-lock.json"
    # Concatenated to avoid triggering scanner on this test file
    filepath.write_text("aws_key = '" + "AKIA" + "1234567890ABCDEF'")
    issues = scan_file(str(filepath))
    assert len(issues) == 0


def test_empty_file_skipped(tmp_path):
    filepath = tmp_path / "empty.txt"
    filepath.write_text("")
    issues = scan_file(str(filepath))
    assert len(issues) == 0


def test_binary_file_skipped(tmp_path):
    # Create a file containing a null byte
    filepath = tmp_path / "binary.txt"
    filepath.write_bytes(b"hello\x00world")
    issues = scan_file(str(filepath))
    assert len(issues) == 0


def test_gitlab_legacy_token(run_scan):
    # Legacy GitLab PAT: glpat- followed by exactly 20 characters
    # Concatenated to avoid triggering scanner on this test file
    content = "my_val = '" + "glpat-" + "12345678901234567890'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "GitLab Token"


def test_gitlab_legacy_token_too_short_ignored(run_scan):
    # Legacy GitLab PAT: 19 characters (too short)
    content = "my_val = '" + "glpat-" + "1234567890123456789'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_gitlab_legacy_token_too_long_ignored(run_scan):
    # Legacy GitLab PAT: 21 characters (too long, not routable)
    content = "my_val = '" + "glpat-" + "123456789012345678901'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_gitlab_routable_token(run_scan):
    # Routable GitLab PAT: glpat- followed by 27-300 characters, a dot, and 9 characters
    # Concatenated to avoid triggering scanner on this test file
    content = "my_val = '" + "glpat-" + "123456789012345678901234567.123456789'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "GitLab Token"


def test_gitlab_routable_token_invalid_hash_ignored(run_scan):
    # Routable GitLab PAT: 8 characters after dot instead of 9
    content = "my_val = '" + "glpat-" + "123456789012345678901234567.12345678'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_gitlab_placeholder_ignored(run_scan):
    # Placeholder format: glpat-{GITLAB_TOKEN}
    content = "my_val = '" + "glpat-" + "{GITLAB_TOKEN}'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_npm_token(run_scan):
    # Valid npm registry token format: npm_ followed by 36 alphanumeric characters
    content = "val = '" + "npm_" + "1234567890abcdefghijklmnopqrstuvwxyz'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "NPM Token"


def test_npm_token_too_short_ignored(run_scan):
    # 35 characters after npm_ (too short)
    content = "val = '" + "npm_" + "1234567890abcdefghijklmnopqrstuvwxy'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_npm_token_too_long_ignored(run_scan):
    # 37 characters after npm_ (too long)
    content = "val = '" + "npm_" + "1234567890abcdefghijklmnopqrstuvwxyza'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_npm_placeholder_ignored(run_scan):
    # Placeholder format: npm_{NPM_TOKEN}
    content = "val = '" + "npm_" + "{NPM_TOKEN}'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_digitalocean_token(run_scan):
    # DigitalOcean PAT format: dop_v1_ followed by exactly 64 hex characters
    token_part = "dop_v1_" + "a1b2c3d4e5f607182930a1b2c3d4e5f6a1b2c3d4e5f607182930a1b2c3d4e5f6"
    content = f"do_val = '{token_part}'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "DigitalOcean Token"
    assert token_part not in issues[0][2]


def test_digitalocean_token_too_short_ignored(run_scan):
    # 63 characters instead of 64 after dop_v1_
    token_part = "dop_v1_" + "a1b2c3d4e5f607182930a1b2c3d4e5f6a1b2c3d4e5f607182930a1b2c3d4e5f"
    content = f"do_val = '{token_part}'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_digitalocean_token_too_long_ignored(run_scan):
    # 65 characters instead of 64 after dop_v1_
    token_part = "dop_v1_" + "a1b2c3d4e5f607182930a1b2c3d4e5f6a1b2c3d4e5f607182930a1b2c3d4e5f67"
    content = f"do_val = '{token_part}'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_digitalocean_token_non_hex_ignored(run_scan):
    # Non-hex characters in payload (e.g. g-z characters)
    token_part = "dop_v1_" + "g1b2c3d4e5f607182930a1b2c3d4e5f6a1b2c3d4e5f607182930a1b2c3d4e5f6"
    content = f"do_val = '{token_part}'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_digitalocean_placeholder_ignored(run_scan):
    content = "do_val = '" + "dop_v1_" + "{DIGITALOCEAN_TOKEN}'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_secret_redaction_in_output(run_scan):
    # Test that the matched secret itself is redacted in the returned line text
    secret_part = "sk-" + "proj-abc123abc123abc123abc123abc123abc123abc123"
    content = f"openai_key = '{secret_part}'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "OpenAI API Key"
    # The actual matched key should not be in the output, replaced by [REDACTED]
    assert secret_part not in issues[0][2]
    assert "openai_key = '[REDACTED]'" in issues[0][2]


def test_sentry_user_token(run_scan):
    # Sentry User Token: sntryu_ followed by exactly 64 hex characters
    sentry_part = "sntryu_" + "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    content = f"sentry_val = '{sentry_part}'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "Sentry Token"
    assert sentry_part not in issues[0][2]


def test_sentry_user_token_invalid_ignored(run_scan):
    # Sentry User Token: invalid length (too short)
    sentry_part = "sntryu_" + "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcde"
    content = f"sentry_val = '{sentry_part}'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_sentry_org_token(run_scan):
    # Sentry Org Token: sntrys_ followed by 40 or more base64/URL chars
    sentry_part = "sntrys_" + "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_+-/"
    content = f"sentry_val = '{sentry_part}'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "Sentry Token"
    assert sentry_part not in issues[0][2]


def test_sentry_org_token_invalid_ignored(run_scan):
    # Sentry Org Token: too short (39 chars after sntrys_)
    sentry_part = "sntrys_" + "1234567890abcdefghijklmnopqrstuvwxyzABC"
    content = f"sentry_val = '{sentry_part}'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_sentry_placeholder_ignored(run_scan):
    content = "sentry_val = '" + "sntry" + "{SENTRY_TOKEN}'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_pypi_token(run_scan):
    # Valid PyPI Token: pypi- followed by at least 85 base64 characters
    pypi_part = "pypi-" + "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-1234567890abcdefghijklmnopq"
    content = f"pypi_val = '{pypi_part}'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "PyPI Token"
    assert pypi_part not in issues[0][2]


def test_pypi_token_too_short_ignored(run_scan):
    # Too short PyPI Token (84 characters after pypi-)
    pypi_part = "pypi-" + "1234567890" * 8 + "1234"
    content = f"pypi_val = '{pypi_part}'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_pypi_placeholder_ignored(run_scan):
    content = "pypi_val = '" + "pypi-" + "{PYPI_TOKEN}'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_discord_token(run_scan):
    # Valid Discord Bot Token: 24 base64, dot, 6 base64, dot, 38 base64
    discord_part = "OTY4NTU2MzQ4MzkwMzkxODU5" + "." + "G49NjP" + "." + "pD8PLpKp-Xx8sr-8m1DCxSPTJZdcpcJZOExc1c"
    content = f"discord_val = '{discord_part}'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "Discord Token"
    assert discord_part not in issues[0][2]


def test_discord_token_varying_signature(run_scan):
    # Valid Discord Bot Token: 24 base64, dot, 6 base64, dot, 27 base64
    discord_part = "ODY4MDcxODUzMDMyMzU3OTc4" + "." + "YPqU6Q" + "." + "jNJcq1daGG3otexX3c1LcxCpgpQ"
    content = f"discord_val = '{discord_part}'"
    issues = run_scan(content)
    assert len(issues) == 1
    assert issues[0][1] == "Discord Token"
    assert discord_part not in issues[0][2]


def test_discord_token_too_short_ignored(run_scan):
    # Too short signature segment (26 characters instead of minimum 27)
    discord_part = "ODY4MDcxODUzMDMyMzU3OTc4" + "." + "YPqU6Q" + "." + "jNJcq1daGG3otexX3c1LcxCpgp"
    content = f"discord_val = '{discord_part}'"
    issues = run_scan(content)
    assert len(issues) == 0


def test_discord_placeholder_ignored(run_scan):
    content = "discord_val = '" + "{DISCORD_TOKEN}'"
    issues = run_scan(content)
    assert len(issues) == 0

    content_bot = "discord_val = '" + "{DISCORD_BOT_TOKEN}'"
    issues_bot = run_scan(content_bot)
    assert len(issues_bot) == 0


def test_supports_color(monkeypatch):
    from scripts.scan_secrets import supports_color
    import sys

    # Test when NO_COLOR is set
    monkeypatch.setenv("NO_COLOR", "1")
    assert supports_color() is False

    # Clear NO_COLOR
    monkeypatch.delenv("NO_COLOR", raising=False)

    # Test when TERM is dumb
    monkeypatch.setenv("TERM", "dumb")
    assert supports_color() is False

    # Test when stdout is not a tty
    monkeypatch.setenv("TERM", "xterm-256color")
    monkeypatch.setattr(sys.stdout, "isatty", lambda: False)
    assert supports_color() is False

    # Test when stdout is a tty, TERM is not dumb, and NO_COLOR is not set
    monkeypatch.setattr(sys.stdout, "isatty", lambda: True)
    assert supports_color() is True
