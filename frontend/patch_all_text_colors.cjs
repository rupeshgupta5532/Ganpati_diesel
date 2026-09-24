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
      
      // Fix 1: All labels with text-brand-primary -> dark:text-slate-200
      content = content.replace(/<label([^>]*?)text-brand-primary(?! dark:)/g, '<label$1text-brand-primary dark:text-slate-200');
      
      // Fix 2: All inputs/textareas lacking dark mode backgrounds
      content = content.replace(/<input([^>]*?)className="([^"]*?border-gray-200[^"]*?)"/g, (match, p1, p2) => {
         if (p2.includes('dark:bg-slate-900')) return match; // Already patched
         return `<input${p1}className="${p2} bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700"`;
      });
      content = content.replace(/<textarea([^>]*?)className="([^"]*?border-gray-200[^"]*?)"/g, (match, p1, p2) => {
         if (p2.includes('dark:bg-slate-900')) return match;
         return `<textarea${p1}className="${p2} bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700"`;
      });

      // Inputs in ProjectForm/ServiceForm use border-slate-200 or border instead of border-gray-200
      content = content.replace(/<input([^>]*?)className="w-full border rounded p-2"/g, '<input$1className="w-full border rounded p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700"');
      content = content.replace(/<textarea([^>]*?)className="w-full border rounded p-2"/g, '<textarea$1className="w-full border rounded p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700"');

      // Fix 3: All <Link> or <a> with text-brand-primary that are NOT buttons (buttons usually have bg-brand-accent)
      // If it has text-brand-primary but NO bg-brand-accent, add dark:text-brand-accent
      content = content.replace(/<Link([^>]*?)className="([^"]*?text-brand-primary[^"]*?)"/g, (match, p1, p2) => {
         if (p2.includes('bg-brand-accent') || p2.includes('dark:text-')) return match;
         return `<Link${p1}className="${p2} dark:text-brand-accent"`;
      });

      // Fix 4: text-gray-500 -> dark:text-slate-400
      content = content.replace(/text-gray-500(?! dark:)/g, 'text-gray-500 dark:text-slate-400');
      
      // Fix 5: text-brand-primary in h1/h2/h3 (Headings) -> dark:text-slate-100
      content = content.replace(/<h([1-6])([^>]*?)text-brand-primary(?! dark:)/g, '<h$1$2text-brand-primary dark:text-slate-100');

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
