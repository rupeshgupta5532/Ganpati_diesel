const fs = require('fs');

const file = 'src/pages/Admin/Dashboard.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/<\/div>\n  \);\n};/, '</div>\n    </div>\n  );\n};');

fs.writeFileSync(file, code);
