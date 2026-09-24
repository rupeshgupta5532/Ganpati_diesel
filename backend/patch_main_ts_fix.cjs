const fs = require('fs');
const file = 'src/main.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/true\n    \],/g, '    ],');

fs.writeFileSync(file, code);
