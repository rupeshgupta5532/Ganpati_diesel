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

      // Match all <label> tags that do NOT contain dark:text
      content = content.replace(/<label([^>]*?)className="([^"]*?)"([^>]*)>/g, (match, p1, className, p2) => {
         if (className.includes('dark:text-')) return match;
         return `<label${p1}className="${className} text-slate-800 dark:text-slate-200"${p2}>`;
      });
      
      // Also fix the generic text spans inside forms (like the ones next to checkboxes)
      // Actually, if we just ensure labels are fixed, that covers 90% of forms.

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir('src/features');
processDir('src/pages');
processDir('src/components');
