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
      
      // We will intelligently map light classes to their dark equivalents
      // Only adding the dark class if it's not already there.
      
      const replacements = [
        { from: 'bg-white', to: 'bg-white dark:bg-slate-800' },
        { from: 'bg-slate-50', to: 'bg-slate-50 dark:bg-slate-900' },
        { from: 'bg-slate-100', to: 'bg-slate-100 dark:bg-slate-700' },
        { from: 'bg-gray-50', to: 'bg-gray-50 dark:bg-slate-900' },
        { from: 'text-slate-800', to: 'text-slate-800 dark:text-slate-100' },
        { from: 'text-slate-700', to: 'text-slate-700 dark:text-slate-200' },
        { from: 'text-slate-600', to: 'text-slate-600 dark:text-slate-300' },
        { from: 'text-slate-500', to: 'text-slate-500 dark:text-slate-400' },
        { from: 'text-gray-900', to: 'text-gray-900 dark:text-gray-100' },
        { from: 'text-gray-800', to: 'text-gray-800 dark:text-gray-200' },
        { from: 'border-slate-100', to: 'border-slate-100 dark:border-slate-700' },
        { from: 'border-slate-200', to: 'border-slate-200 dark:border-slate-600' },
        { from: 'border-brand-border/20', to: 'border-brand-border/20 dark:border-brand-border/80' },
        { from: 'shadow-md', to: 'shadow-md dark:shadow-none' },
        { from: 'shadow-sm', to: 'shadow-sm dark:shadow-none' },
        { from: 'shadow', to: 'shadow dark:shadow-none' },
      ];

      let original = content;
      replacements.forEach(({from, to}) => {
        // Regex to match the class `from`, making sure we aren't matching inside another word
        // and making sure the `to` class isn't already present in the string.
        
        // Split by lines to avoid huge regex backtracking, and only process string literals or template literals containing classes.
        // Actually, simple global regex replace is fine since we are in React JSX classNames mostly.
        
        // This regex looks for word boundary before `from`, and ensures it's not followed immediately by ` dark:`
        const escapedFrom = from.replace(/\//g, '\\/');
        const regex = new RegExp(`\\b${escapedFrom}\\b(?!\\s+dark:)`, 'g');
        content = content.replace(regex, to);
      });

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir('src/pages');
processDir('src/layouts');
processDir('src/features');
processDir('src/components');

console.log("Dark mode classes injected.");
