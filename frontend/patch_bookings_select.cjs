const fs = require('fs');
const file = 'src/pages/Admin/Bookings.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /<select([\s\S]*?)>([\s\S]*?)<\/select>/,
  `<select$1>
                      <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="PENDING">PENDING</option>
                      <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="CONFIRMED">CONFIRMED</option>
                      <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="IN_PROGRESS">IN_PROGRESS</option>
                      <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="COMPLETED">COMPLETED</option>
                      <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="CANCELLED">CANCELLED</option>
                      <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="REJECTED">REJECTED</option>
                    </select>`
);

code = code.replace(
  /className="border border-slate-200 dark:border-slate-600 rounded p-2 text-sm bg-white dark:bg-slate-800 focus:border-brand-accent focus:ring-0 outline-none font-semibold cursor-pointer shadow[\w\-\/\s]*"/,
  'className="border border-slate-200 dark:border-slate-600 rounded p-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-brand-accent focus:ring-0 outline-none font-semibold cursor-pointer shadow"'
);

fs.writeFileSync(file, code);
