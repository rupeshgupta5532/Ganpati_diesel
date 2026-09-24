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

      // Fix 1: focus:bg-white -> focus:bg-white dark:focus:bg-slate-800
      content = content.replace(/focus:bg-white(?! dark:focus:)/g, 'focus:bg-white dark:focus:bg-slate-800');
      
      // Fix 2: If an input or textarea doesn't have dark:text-white, give it dark:text-white
      const ensureDarkText = (tagName) => {
        const regex = new RegExp(`<${tagName}([^>]*?)className="([^"]*)"([^>]*)>`, 'g');
        content = content.replace(regex, (match, p1, className, p2) => {
           if (className.includes('dark:text-white') || className.includes('dark:text-slate-100') || className.includes('dark:text-slate-200')) {
               return match;
           }
           if (p1.includes('type="checkbox"') || p1.includes('type="radio"') || p2.includes('type="checkbox"') || p2.includes('type="radio"')) return match;
           
           return `<${tagName}${p1}className="${className} text-slate-900 dark:text-white"${p2}>`;
        });
      };

      ensureDarkText('input');
      ensureDarkText('textarea');
      ensureDarkText('select');

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log('Patched:', fullPath);
      }
    }
  }
}

processDir('src/features');
processDir('src/pages');
processDir('src/components');
