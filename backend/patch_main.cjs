const fs = require('fs');
const file = 'src/main.ts';
let code = fs.readFileSync(file, 'utf8');

const oldCode = "if (process.env.NODE_ENV !== 'production' || process.env.RENDER) {";
const newCode = "if (!process.env.VERCEL) {";

code = code.replace(oldCode, newCode);
fs.writeFileSync(file, code);
