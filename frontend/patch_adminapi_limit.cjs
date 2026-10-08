const fs = require('fs');
const file = 'src/api/adminApi.js';
let code = fs.readFileSync(file, 'utf8');

const oldApi = "getAll: (search) => api.get('/admin/users' + (search ? '?search=' + search : '')),";
const newApi = "getAll: (search) => api.get('/admin/users' + (search ? '?search=' + search + '&limit=100' : '?limit=100')),";

code = code.replace(oldApi, newApi);
fs.writeFileSync(file, code);
