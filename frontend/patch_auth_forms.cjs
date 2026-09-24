const fs = require('fs');

const files = ['src/features/auth/LoginForm.jsx', 'src/features/auth/SignupForm.jsx'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');

    // Fix labels
    code = code.replace(/text-brand-primary/g, 'text-brand-primary dark:text-slate-300');
    // But wait, the submit button uses text-brand-primary too! "text-brand-primary py-4"
    // Let's fix that specific one back
    
    // Actually, safer replacement:
    code = code.replace(/label className="([^"]*)text-brand-primary([^"]*)"/g, 'label className="$1text-brand-primary dark:text-slate-300$2"');
    
    // Fix inputs
    code = code.replace(/className="w-full border-2 border-gray-200 p-3 rounded-lg/g, 'className="w-full border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-3 rounded-lg');

    // Fix link text at bottom
    code = code.replace(/className="text-brand-primary font-bold/g, 'className="text-brand-primary dark:text-brand-accent font-bold');
    
    // Fix text-gray-500
    code = code.replace(/text-gray-500/g, 'text-gray-500 dark:text-slate-400');
    
    fs.writeFileSync(file, code);
  }
});
