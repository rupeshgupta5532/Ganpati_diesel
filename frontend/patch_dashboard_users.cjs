const fs = require('fs');
const file = 'src/pages/Admin/Dashboard.jsx';
let code = fs.readFileSync(file, 'utf8');

// Fix the role filter logic to include SUPER_ADMIN
const oldFilter = "const filteredUsers = users.filter(u => roleFilter === 'ALL' || u.role === roleFilter);";
const newFilter = "const filteredUsers = users.filter(u => {\n    if (roleFilter === 'ALL') return true;\n    if (roleFilter === 'ADMIN') return u.role === 'ADMIN' || u.role === 'SUPER_ADMIN';\n    return u.role === roleFilter;\n  });";

code = code.replace(oldFilter, newFilter);

fs.writeFileSync(file, code);
