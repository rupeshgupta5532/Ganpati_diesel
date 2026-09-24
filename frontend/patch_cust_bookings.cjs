const fs = require('fs');
const file = 'src/pages/customer/Bookings.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /Requested: \{new Date\(booking\.preferredDate\)\.toLocaleDateString\(\)\}<\/p>/,
  `Requested: {new Date(booking.preferredDate).toLocaleDateString()} at {booking.preferredTime || 'N/A'}</p>`
);

fs.writeFileSync(file, code);
