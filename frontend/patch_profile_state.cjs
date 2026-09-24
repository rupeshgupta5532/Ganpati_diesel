const fs = require('fs');

const file = 'src/pages/customer/Profile.jsx';
let code = fs.readFileSync(file, 'utf8');

const effectPatch = `
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);
`;

if (!code.includes('useEffect(() => {')) {
  code = code.replace(
    /import React, \{ useState \} from 'react';/,
    "import React, { useState, useEffect } from 'react';"
  );
  code = code.replace(
    /const \[message, setMessage\] = useState\(''\);/,
    `const [message, setMessage] = useState('');\n${effectPatch}`
  );
  fs.writeFileSync(file, code);
}
