const fs = require('fs');

const file = 'src/routes/AppRoutes.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /import \{ Home \} from '\.\.\/pages\/Public\/Home';/,
  "import { Home } from '../pages/Public/Home';\nimport { About } from '../pages/Public/About';"
);

code = code.replace(
  /<Route path="\/" element=\{<Home \/>\} \/>/,
  '<Route path="/" element={<Home />} />\n        <Route path="/about" element={<About />} />'
);

fs.writeFileSync(file, code);
