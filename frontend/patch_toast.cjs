const fs = require('fs');

const file = 'src/api/axios.js';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /if \(error\.response\?\.status !== 401\) \{ \/\/ We handled 401 already/,
  'if (error.response?.status !== 401 || isAuthRoute) { // Show toast for all errors, including 401s if they are from the login page'
);

fs.writeFileSync(file, code);
