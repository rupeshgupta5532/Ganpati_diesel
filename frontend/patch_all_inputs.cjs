const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;

      const fixTag = (tagName) => {
        // Regex to match <input ... className="...">
        // We look for className="..."
        const regex = new RegExp(`<${tagName}([^>]*?)className="([^"]*)"([^>]*)>`, 'g');
        content = content.replace(regex, (match, p1, className, p2) => {
           // If it already has dark mode styling or it's a checkbox/radio, skip
           if (className.includes('dark:bg-slate-900') || className.includes('dark:text-white')) return match;
           if (p1.includes('type="checkbox"') || p1.includes('type="radio"') || p2.includes('type="checkbox"') || p2.includes('type="radio"')) return match;
           
           // Ensure it has dark text and bg
           return `<${tagName}${p1}className="${className} bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700"${p2}>`;
        });
      };

      fixTag('input');
      fixTag('textarea');
      fixTag('select');

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log('Patched inputs in:', fullPath);
      }
    }
  }
}

processDir('src/features');
processDir('src/pages');
processDir('src/components');
