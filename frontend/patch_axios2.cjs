const fs = require('fs');

const file = 'src/api/axios.js';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('react-hot-toast')) {
  code = "import toast from 'react-hot-toast';\n" + code;
  
  // Before returning Promise.reject, show a toast.
  // We should extract the message properly
  
  const toastLogic = `
      // Show toast notification for errors
      if (error.response?.status !== 401) { // We handled 401 already
        const errData = error.response?.data;
        let errMsg = 'An unexpected error occurred.';
        
        if (errData) {
          if (typeof errData.message === 'string') errMsg = errData.message;
          else if (Array.isArray(errData.message)) errMsg = errData.message[0];
          else if (Array.isArray(errData.errors)) errMsg = errData.errors[0];
        } else if (error.message) {
          errMsg = error.message;
        }
        
        toast.error(errMsg);
      }
      
      return Promise.reject(error.response?.data || error.message);
  `;
  
  code = code.replace(
    /return Promise\.reject\(error\.response\?\.data \|\| error\.message\);/,
    toastLogic.trim()
  );
  
  fs.writeFileSync(file, code);
}
