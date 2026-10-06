const fs = require('fs');
const file = 'src/auth/auth.module.ts';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('GithubStrategy')) {
  code = code.replace(
    /import \{ GoogleStrategy \} from '\.\/strategies\/google\.strategy';/,
    "import { GoogleStrategy } from './strategies/google.strategy';\nimport { GithubStrategy } from './strategies/github.strategy';"
  );
  
  code = code.replace(
    /GoogleStrategy\]/,
    "GoogleStrategy, GithubStrategy]"
  );
  fs.writeFileSync(file, code);
}
