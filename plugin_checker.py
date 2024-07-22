import sys
import json
import requests
from bs4 import BeautifulSoup
import re
from urllib3.exceptions import InsecureRequestWarning

requests.packages.urllib3.disable_warnings(category=InsecureRequestWarning)

def find_keywords(url, keywords):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(url, headers=headers, timeout=10, verify=False)
        response.raise_for_status()
        html_content = response.text.lower()
        matches = {}
        for keyword in keywords:
            keyword_lower = keyword.lower()
            count = len(re.findall(r'\b' + re.escape(keyword_lower) + r'\b', html_content))
            if count > 0:
                matches[keyword] = count
        return matches
    except Exception as e:
        print(f"Error processing {url}: {e}", file=sys.stderr)
        return {}

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python plugin_checker.py <url> <plugin1> <plugin2> ...", file=sys.stderr)
        sys.exit(1)

    url = sys.argv[1]
    plugins = sys.argv[2:]

    results = find_keywords(url, plugins)
    print(json.dumps(results))