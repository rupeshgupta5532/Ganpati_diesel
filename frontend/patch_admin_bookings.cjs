const fs = require('fs');
const file = 'src/pages/Admin/Bookings.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /<th className="py-4 px-6 font-semibold">Date<\/th>/,
  '<th className="py-4 px-6 font-semibold">Date & Time</th>'
);

code = code.replace(
  /\{new Date\(booking\.preferredDate\)\.toLocaleDateString\(\)\}/,
  `{new Date(booking.preferredDate).toLocaleDateString()}<br/><span className="text-sm text-slate-500">{booking.preferredTime || 'N/A'}</span>`
);

fs.writeFileSync(file, code);
