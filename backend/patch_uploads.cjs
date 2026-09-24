const fs = require('fs');

const file = 'src/uploads/uploads.service.ts';
let code = fs.readFileSync(file, 'utf8');

// Replace hardcoded localhost with an environment variable fallback logic
code = code.replace(
  /url: `http:\/\/localhost:5000\/uploads\/\$\{filename\}`/g,
  "url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${filename}`"
);
code = code.replace(
  /secure_url: `http:\/\/localhost:5000\/uploads\/\$\{filename\}`/g,
  "secure_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${filename}`"
);

fs.writeFileSync(file, code);

// Also add BACKEND_URL to .env
let envCode = fs.readFileSync('.env', 'utf8');
if (!envCode.includes('BACKEND_URL')) {
  envCode += '\nBACKEND_URL=https://ganpatidiesel.onrender.com\n';
  fs.writeFileSync('.env', envCode);
}
