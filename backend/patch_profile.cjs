const fs = require('fs');

const file = 'src/pages/customer/Profile.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /\.then\(\(\) => setMessage\('Profile updated successfully!'\)\)/,
  `.then((res) => {
        setMessage('Profile updated successfully!');
        if (res.data?.data) {
           // Optionally update local storage or context here, 
           // but for simplicity, we can reload to sync context
           setTimeout(() => window.location.reload(), 1500);
        }
      })`
);

fs.writeFileSync(file, code);
