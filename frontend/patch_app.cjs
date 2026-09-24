const fs = require('fs');

const file = 'src/App.jsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('Toaster')) {
  code = "import { Toaster } from 'react-hot-toast';\n" + code;
  
  code = code.replace(
    /<BrowserRouter>/,
    `<BrowserRouter>\n          <Toaster position="top-right" toastOptions={{ className: 'dark:bg-slate-800 dark:text-white' }} />`
  );
  
  fs.writeFileSync(file, code);
}
