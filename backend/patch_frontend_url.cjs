const fs = require('fs');
const file = 'src/auth/auth.controller.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /const frontendUrl = process\.env\.FRONTEND_URL \|\| 'http:\/\/localhost:5173';/g,
  "const frontendUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://ganpatidiesel.netlify.app' : 'http://localhost:5173');"
);

fs.writeFileSync(file, code);
