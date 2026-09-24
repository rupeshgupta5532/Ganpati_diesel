const fs = require('fs');

const file = 'src/context/AuthContext.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /setUser\(profile\.data\);/,
  'setUser(profile.data || profile);'
);

// We should also patch login so it fetches the full profile after setting the token!
const loginPatch = `
  const login = async (token, userData) => {
    localStorage.setItem('accessToken', token);
    try {
      const profile = await api.get('/auth/profile');
      setUser(profile.data || profile);
    } catch (e) {
      setUser(userData);
    }
  };
`;
code = code.replace(
  /  const login = \(token, userData\) => \{\n    localStorage\.setItem\('accessToken', token\);\n    setUser\(userData\);\n  \};/,
  loginPatch.trim()
);

fs.writeFileSync(file, code);
