const fs = require('fs');

const file = 'src/api/axios.js';
let code = fs.readFileSync(file, 'utf8');

const interceptorLogic = `
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      const userStr = localStorage.getItem('user');
      let isAdmin = false;
      
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
            isAdmin = true;
          }
        } catch (e) {}
      }

      // Clear authentication data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      // Redirect based on role
      window.location.href = isAdmin ? '/admin/login' : '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
`;

code = code.replace(
  /async \(error\) => \{[\s\S]*?return Promise\.reject\([^)]+\);\s*\}/,
  interceptorLogic.trim()
);

fs.writeFileSync(file, code);
