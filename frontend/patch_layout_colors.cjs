const fs = require('fs');

const files = ['src/layouts/AdminLayout.jsx', 'src/layouts/CustomerLayout.jsx'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');

    code = code.replace(
      'text-brand-primary hidden sm:block',
      'text-brand-primary dark:text-slate-100 hidden sm:block'
    );
    
    code = code.replace(
      '<button className="md:hidden text-brand-primary text-2xl',
      '<button className="md:hidden text-brand-primary dark:text-slate-100 text-2xl'
    );
    
    // The ThemeToggle in AdminLayout is currently in a <div> that isn't showing it?
    // Wait, earlier I did:
    // '<div className="flex items-center space-x-6">\n             <ThemeToggle />'
    // Let's check where ThemeToggle is in AdminLayout! It seems missing in the cat output!
    // Ah, my patch for ThemeToggle looked for `space-x-6`, but AdminLayout had `space-x-4`!
    // Let's manually ensure ThemeToggle is next to the notifications bell in AdminLayout and CustomerLayout
    if (!code.includes('<ThemeToggle />')) {
       code = code.replace(
         '<div className="flex items-center space-x-4">\n             <Link to="/admin/notifications"',
         '<div className="flex items-center space-x-4">\n             <ThemeToggle />\n             <Link to="/admin/notifications"'
       );
       code = code.replace(
         '<div className="flex items-center space-x-6">\n             <Link to="/notifications"',
         '<div className="flex items-center space-x-6">\n             <ThemeToggle />\n             <Link to="/notifications"'
       );
    }
    
    fs.writeFileSync(file, code);
  }
});
