import re

def process_file():
    filepath = r'd:\Users\akash\project\portfolio\index.html'
    
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # CSS
    style_match = re.search(r'<style>(.*?)</style>', html, re.DOTALL)
    if style_match:
        with open(r'd:\Users\akash\project\portfolio\style.css', 'w', encoding='utf-8') as f:
            f.write(style_match.group(1).strip() + '\n')
        html = html.replace(style_match.group(0), '<link rel="stylesheet" href="style.css">')

    # Main JS
    script_match = re.search(r'<script>\s*(const els.*?)</script>', html, re.DOTALL)
    if script_match:
        with open(r'd:\Users\akash\project\portfolio\main.js', 'w', encoding='utf-8') as f:
            f.write(script_match.group(1).strip() + '\n')
        html = html.replace(script_match.group(0), '<script src="main.js"></script>')

    # Firebase JS
    module_match = re.search(r'<script type="module">\s*(import.*?)</script>', html, re.DOTALL)
    if module_match:
        with open(r'd:\Users\akash\project\portfolio\firebase-services.js', 'w', encoding='utf-8') as f:
            f.write(module_match.group(1).strip() + '\n')
        html = html.replace(module_match.group(0), '<script type="module" src="firebase-services.js"></script>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    process_file()
