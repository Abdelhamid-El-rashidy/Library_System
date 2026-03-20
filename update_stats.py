import subprocess
import re
import os

def get_git_stats():
    # Run git log to get author names
    result = subprocess.run(['git', 'log', '--format=%aN'], capture_output=True, text=True)
    authors = result.stdout.strip().split('\n')
    
    stats = {}
    for author in authors:
        # Merge Abdelhamid names
        if "Abdelhamid" in author:
            author = "Abdelhamid Ahmed"
        
        if author == "GitHub Action":
            continue
            
        stats[author] = stats.get(author, 0) + 1
    
    # Sort by commit count descending
    sorted_stats = sorted(stats.items(), key=lambda x: x[1], reverse=True)
    return sorted_stats

def update_readme(stats):
    with open('README.md', 'r') as f:
        content = f.read()

    # Create the new mermaid block
    mermaid_lines = [
        '```mermaid',
        'pie showData',
        '    title Project Commits'
    ]
    for name, count in stats:
        mermaid_lines.append(f'    "{name}" : {count}')
    mermaid_lines.append('```')
    
    new_block = '\n'.join(mermaid_lines)
    
    # Replace content between markers
    pattern = r'(<!-- STATS_START -->).*?(<!-- STATS_END -->)'
    replacement = f'\\1\n{new_block}\n\\2'
    
    updated_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    with open('README.md', 'w') as f:
        f.write(updated_content)

if __name__ == "__main__":
    stats = get_git_stats()
    update_readme(stats)
