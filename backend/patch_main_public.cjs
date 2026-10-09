const fs = require('fs');
const file = 'src/main.ts';
let code = fs.readFileSync(file, 'utf8');

const oldCode = `app.useStaticAssets(join(__dirname, '..', 'public'), {
      prefix: '/',
    });`;
    
const newCode = `try {
      const publicPath = join(__dirname, '..', 'public');
      app.useStaticAssets(publicPath, { prefix: '/' });
    } catch (err) {
      console.warn('Could not serve static assets. This is expected on serverless environments like Vercel.');
    }`;

code = code.replace(oldCode, newCode);
fs.writeFileSync(file, code);
