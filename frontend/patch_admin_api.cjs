const fs = require('fs');

const file = 'src/api/adminApi.js';
let code = fs.readFileSync(file, 'utf8');

code += `\nexport const adminUserApi = {\n  getAll: (search) => api.get('/admin/users' + (search ? '?search=' + search : '')),\n};\n`;

fs.writeFileSync(file, code);
