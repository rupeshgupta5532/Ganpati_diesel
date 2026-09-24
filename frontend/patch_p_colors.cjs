const fs = require('fs');

const file = 'src/pages/Admin/Dashboard.jsx';
if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    code = code.replace(/<p className="text-4xl font-extrabold text-brand-primary">/g, '<p className="text-4xl font-extrabold text-brand-primary dark:text-slate-100">');
    fs.writeFileSync(file, code);
}
