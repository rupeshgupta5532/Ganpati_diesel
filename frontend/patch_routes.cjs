const fs = require('fs');
const file = 'src/routes/AppRoutes.jsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('OAuthCallback')) {
  code = code.replace(
    /import \{ ForgotPassword \} from '\.\.\/features\/auth\/ForgotPassword';/,
    "import { ForgotPassword } from '../features/auth/ForgotPassword';\nimport { OAuthCallback } from '../features/auth/OAuthCallback';"
  );
  
  code = code.replace(
    /<Route path="\/forgot-password" element=\{<ForgotPassword \/>\} \/>/,
    "<Route path=\"/forgot-password\" element={<ForgotPassword />} />\n        <Route path=\"/oauth-callback\" element={<OAuthCallback />} />"
  );
  
  fs.writeFileSync(file, code);
}
