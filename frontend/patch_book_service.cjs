const fs = require('fs');
const file = 'src/pages/Public/BookService.jsx';
let code = fs.readFileSync(file, 'utf8');

const timeInput = `
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-800 dark:text-slate-200">Preferred Time</label>
              <input type="time" {...register('preferredTime')} className="w-full border border-slate-300 rounded p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" />
            </div>
`;

code = code.replace(
  /<div className="md:col-span-2">\s*<label className="block text-sm font-bold mb-2 text-slate-800 dark:text-slate-200">Preferred Date \*/g,
  `<div>\n              <label className="block text-sm font-bold mb-2 text-slate-800 dark:text-slate-200">Preferred Date *`
);

// We want to make the date field NOT span 2 cols, so it sits next to Time field.
// Let's replace the outer container for date to remove md:col-span-2.
// Actually, earlier it was:
/*
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-2">Preferred Date *</label>
              <input type="date" ... />
            </div>
*/
code = code.replace(
  /<div className="md:col-span-2">\s*<label className="block text-sm font-bold mb-2 text-slate-800 dark:text-slate-200">Preferred Date \*/g,
  `<div>\n              <label className="block text-sm font-bold mb-2 text-slate-800 dark:text-slate-200">Preferred Date *`
);

// Then we find the input type="date" and insert the timeInput right after its closing div
code = code.replace(
  /(<input type="date"[^>]*>)\s*<\/div>/,
  `$1\n            </div>${timeInput}`
);

fs.writeFileSync(file, code);
