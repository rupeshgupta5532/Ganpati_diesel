const fs = require('fs');

const file = 'src/layouts/PublicLayout.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /const navLinks = \[/,
  "const navLinks = [\n    { name: 'About', path: '/about' },"
);

fs.writeFileSync(file, code);
