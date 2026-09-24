const fs = require('fs');
const file = 'src/pages/Public/BookService.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /<label className="([^"]*)">Preferred Date \*/g,
  '<label htmlFor="preferredDate" className="$1">Preferred Date *'
);
code = code.replace(
  /<input type="date" \{\.\.\.register\('preferredDate'\)\}/g,
  '<input type="date" id="preferredDate" {...register(\'preferredDate\')}'
);

code = code.replace(
  /<label className="([^"]*)">Preferred Time/g,
  '<label htmlFor="preferredTime" className="$1">Preferred Time'
);
code = code.replace(
  /<input type="time" \{\.\.\.register\('preferredTime'\)\}/g,
  '<input type="time" id="preferredTime" {...register(\'preferredTime\')}'
);

fs.writeFileSync(file, code);
