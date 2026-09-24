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

      // Fix table rows that have hover:bg-slate-50 but lack dark text
      content = content.replace(/className="([^"]*?hover:bg-slate-50[^"]*?)"/g, (match, className) => {
         if (className.includes('dark:text-')) return match;
         return `className="${className} text-slate-800 dark:text-slate-200"`;
      });
      
      // Fix table body or raw <tr> elements
      content = content.replace(/<tr([^>]*?)className="([^"]*?border-b[^"]*?)"/g, (match, p1, className) => {
         if (className.includes('dark:text-')) return match;
         return `<tr${p1}className="${className} text-slate-800 dark:text-slate-200"`;
      });

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir('src/pages');
