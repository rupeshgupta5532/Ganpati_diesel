const fs = require('fs');

const file = 'src/pages/Admin/Dashboard.jsx';
let code = fs.readFileSync(file, 'utf8');

// Add Recharts imports
if (!code.includes('recharts')) {
  code = code.replace(
    /import \{ dashboardApi \} from '\.\.\/\.\.\/api\/adminApi';/,
    `import { dashboardApi } from '../../api/adminApi';\nimport { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';`
  );
}

// Add totalUsers to state mapping
code = code.replace(
  /pendingReviews: payload\.reviews\?\.pending \|\| 0/,
  `pendingReviews: payload.reviews?.pending || 0,\n          totalUsers: payload.users?.total || 0`
);

// Add chart logic
const chartComponent = `
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-gray-100 p-6 mb-8 h-96">
         <h2 className="text-lg font-bold text-brand-primary dark:text-slate-100 mb-6">Overview Statistics</h2>
         {stats ? (
           <ResponsiveContainer width="100%" height="100%">
             <BarChart
               data={[
                 { name: 'Total Users', count: stats.totalUsers },
                 { name: 'Total Bookings', count: stats.totalBookings },
                 { name: 'Pending Bookings', count: stats.pendingBookings },
                 { name: 'Total Enquiries', count: stats.totalEnquiries },
                 { name: 'Pending Reviews', count: stats.pendingReviews },
               ]}
               margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
             >
               <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
               <XAxis dataKey="name" tick={{fill: '#64748b'}} tickMargin={10} />
               <YAxis tick={{fill: '#64748b'}} allowDecimals={false} />
               <Tooltip 
                 cursor={{fill: 'transparent'}}
                 contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
               />
               <Bar dataKey="count" fill="#F5A623" radius={[4, 4, 0, 0]} barSize={40} />
             </BarChart>
           </ResponsiveContainer>
         ) : (
           <div className="h-full w-full flex items-center justify-center">
             <p className="text-gray-400 animate-pulse">Loading chart data...</p>
           </div>
         )}
      </div>
`;

code = code.replace(
  /<div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-gray-100 p-6 mb-8 flex items-center justify-center h-64">[\s\S]*?<\/div>\s*<\/div>/,
  `${chartComponent.trim()}\n    </div>`
);

fs.writeFileSync(file, code);
