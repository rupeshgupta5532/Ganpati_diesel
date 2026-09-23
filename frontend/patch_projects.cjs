const fs = require('fs');
let code = fs.readFileSync('src/pages/Public/Projects.jsx', 'utf8');

code = code.replace(
  /<button className="w-full border-2 border-slate-200[^>]+>\s*View Full Case Study\s*<\/button>/g,
  '<Link to={`/projects/${project.slug || project._id}`} className="block text-center w-full border-2 border-slate-200 text-slate-700 py-2 rounded font-semibold hover:border-brand-accent hover:text-brand-primary transition-colors">\n                  View Full Case Study\n                </Link>'
);

fs.writeFileSync('src/pages/Public/Projects.jsx', code);
