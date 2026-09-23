const fs = require('fs');
let code = fs.readFileSync('src/layouts/CustomerLayout.jsx', 'utf8');

if (!code.includes('ThemeToggle')) {
  code = code.replace(
    "import { useSocket } from '../context/SocketContext';",
    "import { useSocket } from '../context/SocketContext';\nimport { ThemeToggle } from '../components/ThemeToggle';"
  );

  code = code.replace(
    '<div className="flex items-center space-x-6">',
    '<div className="flex items-center space-x-6">\n             <ThemeToggle />'
  );

  fs.writeFileSync('src/layouts/CustomerLayout.jsx', code);
}
