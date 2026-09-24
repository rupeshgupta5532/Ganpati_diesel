const fs = require('fs');
const file = 'src/pages/Public/BookService.jsx';
if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    // Remove the onClick completely
    code = code.replace(/ onClick=\{\(e\) => \{ try \{ e\.target\.showPicker\(\); \} catch\(err\) \{\} \}\}/g, '');
    fs.writeFileSync(file, code);
}
