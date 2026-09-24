const fs = require('fs');

const dashFile = 'src/pages/Admin/Dashboard.jsx';
let dashCode = fs.readFileSync(dashFile, 'utf8');

// Fix the nested div issue in Dashboard.jsx
// It currently looks like:
//          )}
//       
//       {/* Customer Directory Section */}
//
// We need to add a closing </div> before {/* Customer Directory Section */}
dashCode = dashCode.replace(
  /         \)\}\n      \n      \{\/\* Customer Directory Section \*\/\}/,
  '         )}\n      </div>\n      \n      {/* Customer Directory Section */}'
);
// And remove one closing div from the very bottom
dashCode = dashCode.replace(/<\/div>\n    <\/div>\n  \);\n\};/, '</div>\n  );\n};');
fs.writeFileSync(dashFile, dashCode);


// Fix AdminLayout flex container by adding min-w-0 to prevent horizontal stretching
const layoutFile = 'src/layouts/AdminLayout.jsx';
let layoutCode = fs.readFileSync(layoutFile, 'utf8');

layoutCode = layoutCode.replace(
  /<div className="flex-1 flex flex-col">/,
  '<div className="flex-1 flex flex-col min-w-0">'
);
// Also fix CustomerLayout just in case
const custLayoutFile = 'src/layouts/CustomerLayout.jsx';
if (fs.existsSync(custLayoutFile)) {
  let custCode = fs.readFileSync(custLayoutFile, 'utf8');
  custCode = custCode.replace(
    /<div className="flex-1 flex flex-col">/,
    '<div className="flex-1 flex flex-col min-w-0">'
  );
  fs.writeFileSync(custLayoutFile, custCode);
}

fs.writeFileSync(layoutFile, layoutCode);
