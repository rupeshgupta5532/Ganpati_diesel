const fs = require('fs');
let code = fs.readFileSync('src/routes/AppRoutes.jsx', 'utf8');

if (!code.includes('PublicProjectDetails')) {
  code = code.replace(
    "import { PublicProjects } from '../pages/Public/Projects';",
    "import { PublicProjects } from '../pages/Public/Projects';\nimport { PublicProjectDetails } from '../pages/Public/ProjectDetails';"
  );

  code = code.replace(
    '<Route path="/projects" element={<PublicProjects />} />',
    '<Route path="/projects" element={<PublicProjects />} />\n        <Route path="/projects/:id" element={<PublicProjectDetails />} />'
  );

  fs.writeFileSync('src/routes/AppRoutes.jsx', code);
}
