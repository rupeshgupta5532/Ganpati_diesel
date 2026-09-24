const fs = require('fs');

const file = 'src/api/axios.js';
let code = fs.readFileSync(file, 'utf8');

// Update the 401 condition to exclude login routes
code = code.replace(
  /if \(error\.response\?\.status === 401\) \{/,
  `const isAuthRoute = error.config?.url?.includes('/login') || error.config?.url?.includes('/signup');\n    if (error.response?.status === 401 && !isAuthRoute) {`
);

fs.writeFileSync(file, code);
