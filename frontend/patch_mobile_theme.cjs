const fs = require('fs');
let code = fs.readFileSync('src/layouts/PublicLayout.jsx', 'utf8');

code = code.replace(
  /<div className="md:hidden flex items-center space-x-4">\s*<button className="text-white text-3xl focus:outline-none"/,
  '<div className="md:hidden flex items-center space-x-4">\n            <ThemeToggle />\n            <button className="text-white text-3xl focus:outline-none"'
);

fs.writeFileSync('src/layouts/PublicLayout.jsx', code);
