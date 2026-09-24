const fs = require('fs');
const file = 'src/pages/Public/BookService.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /<input type="date" \{\.\.\.register\('preferredDate'\)\} className="([^"]*)" \/>/,
  `<input type="date" {...register('preferredDate')} className="$1 cursor-pointer" onClick={(e) => { try { e.target.showPicker(); } catch(err) { console.error(err); } }} onKeyDown={(e) => { if(e.key === 'Enter') { try { e.target.showPicker(); } catch(err){} } }} />`
);

code = code.replace(
  /<input type="time" \{\.\.\.register\('preferredTime'\)\} className="([^"]*)" \/>/,
  `<input type="time" {...register('preferredTime')} className="$1 cursor-pointer" onClick={(e) => { try { e.target.showPicker(); } catch(err) { console.error(err); } }} onKeyDown={(e) => { if(e.key === 'Enter') { try { e.target.showPicker(); } catch(err){} } }} />`
);

fs.writeFileSync(file, code);
