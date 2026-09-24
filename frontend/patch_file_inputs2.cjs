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

      content = content.replace(/className="w-full border rounded p-1 text-sm"/g, 'className="w-full border rounded p-1 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700"');
      
      // Admin/ServiceForm.jsx might have slightly different classes:
      content = content.replace(/className="w-full border p-2 rounded"/g, 'className="w-full border p-2 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700"');
      
      // Let's just blanket target any input type=file className block manually where we see them.
      // Easiest is just targeting known files!

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log('Patched file inputs in:', fullPath);
      }
    }
  }
}

processDir('src/pages');
