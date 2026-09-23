const fs = require('fs');
let code = fs.readFileSync('src/layouts/CustomerLayout.jsx', 'utf8');

code = code.replace(
  "import React from 'react';",
  "import React, { useState } from 'react';"
);

code = code.replace(
  "export const CustomerLayout = () => {",
  "export const CustomerLayout = () => {\n  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);"
);

code = code.replace(
  '<aside className="w-64 bg-brand-primary text-brand-text-secondary flex flex-col shadow-xl hidden md:flex">',
  `<aside className={\`fixed inset-y-0 left-0 z-50 w-64 bg-brand-primary text-brand-text-secondary flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 \${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}\`}>`
);

code = code.replace(
  '<header className="bg-white shadow-sm border-b px-8 py-4 flex justify-between items-center">',
  `<header className="bg-white shadow-sm border-b px-4 md:px-8 py-4 flex justify-between items-center z-10">
          <div className="flex items-center space-x-4">
            <button className="md:hidden text-brand-primary text-2xl focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              ☰
            </button>`
);

code = code.replace(
  '<h1 className="text-xl font-bold text-brand-primary">',
  '</div><h1 className="text-xl font-bold text-brand-primary hidden sm:block">'
);

code = code.replace(
  'return (\n    <div className="min-h-screen bg-gray-50 flex font-sans">',
  `return (
    <div className="min-h-screen bg-gray-50 flex font-sans overflow-hidden">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}`
);

fs.writeFileSync('src/layouts/CustomerLayout.jsx', code);
