import re
import sys
import urllib.request
from urllib.error import URLError, HTTPError

def extract_links(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Regex to matching markdown links [label](url)
    md_links = re.findall(r'\[([^\]]+)\]\(([^\)]+)\)', content)
    md_urls = [url for label, url in md_links]

    # Regex to match HTML a href links
    html_links = re.findall(r'<a\s+(?:[^>]*?\s+)?href="([^"]+)"', content)
    
    all_links = md_urls + html_links
    
    # Filter out internal links (anchors) and non-http
    external_links = [url for url in all_links if url.startswith('http')]
    return external_links

def check_link(url):
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            return response.getcode()
    except HTTPError as e:
        return e.code
    except URLError as e:
        return str(e.reason)
    except Exception as e:
        return str(e)

def main():
    links = extract_links('README.md')
    print(f"Found {len(links)} external links.")
    
    failures = []
    for url in links:
        print(f"Checking {url}...")
        status = check_link(url)
        if status != 200:
            print(f"  [FAILED] {url} -> {status}")
            failures.append((url, status))
        else:
            print(f"  [OK] {url}")
            
    if failures:
        print("\nBroken links found:")
        for url, status in failures:
            print(f"- {url} : {status}")
        sys.exit(1)
    else:
        print("\nAll links are valid!")

if __name__ == "__main__":
    main()
