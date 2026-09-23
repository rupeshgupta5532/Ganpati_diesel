const fs = require('fs');

['src/layouts/AdminLayout.jsx', 'src/layouts/CustomerLayout.jsx'].forEach(file => {
  let code = fs.readFileSync(file, 'utf8');

  // Import useSocket
  if (!code.includes('useSocket')) {
    code = code.replace(
      "import { useAuth } from '../context/AuthContext';",
      "import { useAuth } from '../context/AuthContext';\nimport { useSocket } from '../context/SocketContext';"
    );
  }

  // Hook it up
  if (!code.includes('unreadCount')) {
    code = code.replace(
      "const { user, logout } = useAuth();",
      "const { user, logout } = useAuth();\n  const { unreadCount } = useSocket();"
    );
  }

  // Update badge
  code = code.replace(
    '<span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>',
    '{unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{unreadCount > 9 ? "9+" : unreadCount}</span>}'
  );

  fs.writeFileSync(file, code);
});
