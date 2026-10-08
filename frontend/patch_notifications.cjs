const fs = require('fs');
const file = 'src/pages/Admin/Notifications.jsx';
let code = fs.readFileSync(file, 'utf8');

// Title color fix for dark mode
code = code.replace(
  /\? 'text-brand-primary' : 'text-slate-600 dark:text-slate-300'}/,
  "? 'text-brand-primary dark:text-slate-100' : 'text-slate-600 dark:text-slate-300'}"
);

// Unread notification background for dark mode (brand-surface is dark, but in dark mode maybe use slate-700)
code = code.replace(
  /\? 'border-brand-accent bg-brand-surface\/30' : 'border-slate-300 bg-slate-50 dark:bg-slate-900 opacity-75'}/,
  "? 'border-brand-accent bg-brand-surface/10 dark:bg-slate-700/50' : 'border-slate-300 bg-slate-50 dark:bg-slate-900 opacity-75'}"
);

// "Mark Read" button text fix for dark mode
code = code.replace(
  /className="text-xs font-bold text-brand-primary hover:text-blue-600 bg-white dark:bg-slate-800 px-3 py-1 rounded shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-slate-200 dark:border-slate-600"/g,
  'className="text-xs font-bold text-brand-primary dark:text-slate-200 hover:text-blue-600 dark:hover:text-brand-accent bg-white dark:bg-slate-700 px-3 py-1 rounded shadow dark:shadow-none border border-slate-200 dark:border-slate-600"'
);

// "Mark All as Read" button dark mode fix
code = code.replace(
  /className="text-sm font-bold text-brand-primary hover:text-brand-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"/,
  'className="text-sm font-bold text-brand-primary dark:text-slate-200 hover:text-brand-accent dark:hover:text-brand-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"'
);

// Fix the Unread Only Checkbox background border in dark mode
code = code.replace(
  /className="flex items-center space-x-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-3 py-1\.5 rounded border cursor-pointer"/,
  'className="flex items-center space-x-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 cursor-pointer"'
);

fs.writeFileSync(file, code);
