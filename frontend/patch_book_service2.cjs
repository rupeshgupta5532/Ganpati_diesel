const fs = require('fs');
const file = 'src/pages/Public/BookService.jsx';
let code = fs.readFileSync(file, 'utf8');

const timeInput = `
          <div>
            <label className="block text-slate-700 dark:text-slate-200 text-sm font-bold mb-2">Preferred Time</label>
            <input type="time" {...register('preferredTime')} className="w-full border border-slate-300 rounded p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700" />
          </div>`;

code = code.replace(
  /(<input type="date"[^>]*>[\s\S]*?<\/div>)/,
  `$1${timeInput}`
);

fs.writeFileSync(file, code);
