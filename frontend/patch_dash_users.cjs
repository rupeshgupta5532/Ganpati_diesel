const fs = require('fs');

const file = 'src/pages/Admin/Dashboard.jsx';
let code = fs.readFileSync(file, 'utf8');

// Add import
code = code.replace(
  /import \{ dashboardApi \} from '\.\.\/\.\.\/api\/adminApi';/,
  `import { dashboardApi, adminUserApi } from '../../api/adminApi';\nimport toast from 'react-hot-toast';`
);

// Add State
code = code.replace(
  /const \[stats, setStats\] = useState\(null\);/,
  `const [stats, setStats] = useState(null);\n  const [users, setUsers] = useState([]);\n  const [search, setSearch] = useState('');\n  const [roleFilter, setRoleFilter] = useState('ALL');`
);

// Add fetch users logic inside useEffect, and a separate search function
const userLogic = `
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = (searchQuery = '') => {
    adminUserApi.getAll(searchQuery)
      .then(res => setUsers(res.data?.data || res.data || []))
      .catch(err => toast.error('Failed to load users'));
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchUsers(e.target.value);
  };

  const filteredUsers = users.filter(u => roleFilter === 'ALL' || u.role === roleFilter);
`;

code = code.replace(
  /useEffect\(\(\) => \{\n    dashboardApi\.getAggregations[\s\S]*?\}, \[\]\);/,
  `useEffect(() => {
    dashboardApi.getAggregations()
      .then(res => {
        const payload = res.data || res;
        setStats({
          totalBookings: payload.bookings?.total || 0,
          pendingBookings: payload.bookings?.pending || 0,
          totalEnquiries: payload.enquiries?.total || 0,
          pendingReviews: payload.reviews?.pending || 0,
          totalUsers: payload.users?.total || 0
        });
      })
      .catch(console.error);
  }, []);
  ${userLogic}
  `
);

// Add UI at the bottom
const usersTable = `
      {/* Customer Directory Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-gray-100 p-6 mb-8">
         <div className="flex flex-col md:flex-row justify-between items-center mb-6">
           <h2 className="text-lg font-bold text-brand-primary dark:text-slate-100 mb-4 md:mb-0">Customer Directory</h2>
           <div className="flex space-x-4 w-full md:w-auto">
             <input 
               type="text" 
               placeholder="Search by name or email..." 
               value={search}
               onChange={handleSearch}
               className="px-4 py-2 border rounded-lg w-full md:w-64 outline-none focus:border-brand-accent bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700"
             />
             <select 
               value={roleFilter} 
               onChange={(e) => setRoleFilter(e.target.value)}
               className="px-4 py-2 border rounded-lg outline-none focus:border-brand-accent bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700"
             >
               <option value="ALL">All Roles</option>
               <option value="USER">Customers</option>
               <option value="ADMIN">Admins</option>
             </select>
           </div>
         </div>
         
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-slate-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                 <th className="p-4 font-bold">Name</th>
                 <th className="p-4 font-bold">Email / Phone</th>
                 <th className="p-4 font-bold">Role</th>
                 <th className="p-4 font-bold">Total Bookings</th>
                 <th className="p-4 font-bold">Services Taken</th>
                 <th className="p-4 font-bold">Joined</th>
               </tr>
             </thead>
             <tbody>
               {filteredUsers.length > 0 ? filteredUsers.map(user => (
                 <tr key={user._id} className="border-b border-gray-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-slate-800 dark:text-slate-200">
                   <td className="p-4 font-bold text-brand-primary dark:text-slate-200">{user.name}</td>
                   <td className="p-4">
                     <div className="text-sm">{user.email}</div>
                     <div className="text-xs text-gray-500">{user.phone}</div>
                   </td>
                   <td className="p-4">
                     <span className={\`px-2 py-1 rounded text-xs font-bold \${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}\`}>
                       {user.role}
                     </span>
                   </td>
                   <td className="p-4 font-semibold text-brand-accent">{user.totalBookings || 0}</td>
                   <td className="p-4 font-semibold text-blue-500">{user.servicesTaken || 0}</td>
                   <td className="p-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                 </tr>
               )) : (
                 <tr>
                   <td colSpan="6" className="p-8 text-center text-gray-400">No customers found.</td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
      </div>
`;

code = code.replace(
  /<\/div>\n    <\/div>\n  \);\n\};/,
  usersTable + '\n    </div>\n    </div>\n  );\n};'
);

fs.writeFileSync(file, code);
