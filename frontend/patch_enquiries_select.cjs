const fs = require('fs');
const file = 'src/pages/Admin/Enquiries.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /<select([\s\S]*?)>([\s\S]*?)<\/select>/,
  `<select$1>
                   <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="NEW">NEW</option>
                   <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="CONTACTED">CONTACTED</option>
                   <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="IN_PROGRESS">IN_PROGRESS</option>
                   <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="RESOLVED">RESOLVED</option>
                   <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="CLOSED">CLOSED</option>
                 </select>`
);

code = code.replace(
  /className="border rounded p-2 text-sm bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"/,
  'className="border rounded p-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"'
);

fs.writeFileSync(file, code);
