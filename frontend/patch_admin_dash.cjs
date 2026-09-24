const fs = require('fs');

const file = 'src/pages/Admin/Dashboard.jsx';
let code = fs.readFileSync(file, 'utf8');

// Update state mapping
const mappingCode = `
      .then(res => {
        const payload = res.data || res;
        setStats({
          totalBookings: payload.bookings?.total || 0,
          pendingBookings: payload.bookings?.pending || 0,
          totalEnquiries: payload.enquiries?.total || 0,
          pendingReviews: payload.reviews?.pending || 0
        });
      })
`;

code = code.replace(
  /\.then\(res => setStats\(res\.data\.data \|\| res\.data\)\)/,
  mappingCode.trim()
);

// Update HTML mapping
code = code.replace(
  /<h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Services<\/h3>[\s\S]*?<p className="text-4xl font-extrabold text-brand-primary dark:text-slate-100">\{stats\?\.totalServices \|\| 0\}<\/p>/,
  '<h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Pending Reviews</h3>\n          <p className="text-4xl font-extrabold text-brand-primary dark:text-slate-100">{stats?.pendingReviews || 0}</p>'
);

fs.writeFileSync(file, code);
