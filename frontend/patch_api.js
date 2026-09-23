const fs = require('fs');
let code = fs.readFileSync('src/api/adminApi.js', 'utf8');
code = code.replace(
  "return api.post('/admin/uploads', formData, {\n      headers: { 'Content-Type': 'multipart/form-data' },\n    });",
  "return api.post('/admin/uploads', formData);"
);
fs.writeFileSync('src/api/adminApi.js', code);
