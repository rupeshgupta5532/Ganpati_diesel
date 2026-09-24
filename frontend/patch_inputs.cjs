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

      content = content.replace(/className="([^"]*?border-gray-200[^"]*?)"/g, (match, p1) => {
         if (p1.includes('dark:bg-slate-900')) return match;
         return `className="${p1} bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700"`;
      });
      
      content = content.replace(/className="([^"]*?w-full border rounded p-2[^"]*?)"/g, (match, p1) => {
         if (p1.includes('dark:bg-slate-900')) return match;
         return `className="${p1} bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700"`;
      });

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir('src/features');
processDir('src/pages');
