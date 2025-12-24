import unittest
import re
import os

class TestAwesomeList(unittest.TestCase):
    def setUp(self):
        self.readme_path = os.path.join(os.path.dirname(__file__), '..', 'README.md')
        with open(self.readme_path, 'r', encoding='utf-8') as f:
            self.content = f.read()
        self.lines = self.content.splitlines()

    def test_toc_consistency(self):
        """Check if TOC matches the actual headers."""
        # Find TOC section
        toc_start = -1
        toc_end = -1
        for i, line in enumerate(self.lines):
            if "## Table of Contents" in line:
                toc_start = i + 1
                break
        
        if toc_start == -1:
            self.fail("Table of Contents header not found")

        # Extract TOC items
        toc_items = []
        for i in range(toc_start, len(self.lines)):
            line = self.lines[i].strip()
            if line.startswith("##"): # Next section
                toc_end = i
                break
            if line.startswith("- ["):
                match = re.search(r'\[(.*?)\]\(#(.*?)\)', line)
                if match:
                    toc_items.append(match.group(1))
        
        # Extract actual headers (Level 2)
        headers = []
        for line in self.lines:
            if line.startswith("## ") and "Table of Contents" not in line: 
                 # Optimization: Contributing might be there but let's see. 
                 # Actually, usually TOC includes all ## headers except itself?
                 # Let's check what the file actually has.
                headers.append(line.strip().replace("## ", ""))
        
        # Filter headers to match what we expect in TOC (usually everything after TOC)
        # In this file, "Contributing" is in TOC.
        
        # Helper to normalize for comparison
        def normalize(s): return s.lower().replace('&', '').replace('  ', ' ').strip()
        
        # We need to refine the header extraction to only pick up headers existing in TOC or warn if missing.
        # But for strictly matching order:
        
        # Let's just check if every TOC item exists as a header
        
        header_set = {normalize(h) for h in headers}
        
        for item in toc_items:
            if item == "Table of Contents": continue 
            if normalize(item) not in header_set:
                print(f"DEBUG: Item '{item}' normalized to '{normalize(item)}' not found in headers: {header_set}")
            self.assertTrue(normalize(item) in header_set, f"TOC item '{item}' not found as a header")

    def test_prompt_formatting(self):
        """Check if prompts have descriptions."""
        # A rough check: if a line is a list item with backticks, the next line should be <sub> or empty then <sub>
        
        # We process line by line
        for i, line in enumerate(self.lines):
            line = line.strip()
            if line.startswith("- `//"):
                # Check next line or next next line
                next_line = self.lines[i+1].strip() if i+1 < len(self.lines) else ""
                if not next_line:
                    next_line = self.lines[i+2].strip() if i+2 < len(self.lines) else ""
                
                self.assertTrue(next_line.startswith("<sub>"), f"Prompt on line {i+1} missing description (<sub> tag)")

if __name__ == '__main__':
    unittest.main()
