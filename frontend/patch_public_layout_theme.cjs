const fs = require('fs');
let code = fs.readFileSync('src/layouts/PublicLayout.jsx', 'utf8');

if (!code.includes('ThemeToggle')) {
  code = code.replace(
    "import { useAuth } from '../context/AuthContext';",
    "import { useAuth } from '../context/AuthContext';\nimport { ThemeToggle } from '../components/ThemeToggle';"
  );

  code = code.replace(
    '<Link to="/book-service"',
    '<ThemeToggle />\n            <Link to="/book-service"'
  );

  fs.writeFileSync('src/layouts/PublicLayout.jsx', code);
}
