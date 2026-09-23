const fs = require('fs');
const file = 'src/bookings/bookings.service.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  '        { status: updateDto.status, adminNotes: updateDto.adminNotes },',
  '        { $set: JSON.parse(JSON.stringify({ status: updateDto.status, adminNotes: updateDto.adminNotes })) },'
);

fs.writeFileSync(file, code);
