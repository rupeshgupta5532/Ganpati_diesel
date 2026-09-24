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

      content = content.replace(/<input type="file"([^>]*?)className="([^"]*)"([^>]*)>/g, (match, p1, className, p2) => {
         if (className.includes('dark:bg-slate-900') || className.includes('dark:text-white')) return match;
         return `<input type="file"${p1}className="${className} bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700"${p2}>`;
      });

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log('Patched file inputs in:', fullPath);
      }
    }
  }
}

processDir('src/pages');
