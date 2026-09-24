const fs = require('fs');
const file = 'src/pages/customer/Dashboard.jsx';
let code = fs.readFileSync(file, 'utf8');

// Replace b.bookingDate with b.preferredDate
code = code.replace(/b\.bookingDate/g, 'b.preferredDate');

// Replace b.bookingTime with b.preferredTime
code = code.replace(/b\.bookingTime/g, 'b.preferredTime');

fs.writeFileSync(file, code);
