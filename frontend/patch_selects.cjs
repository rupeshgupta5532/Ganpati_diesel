const fs = require('fs');

const bFile = 'src/pages/Admin/Bookings.jsx';
let bCode = fs.readFileSync(bFile, 'utf8');

// The original select had:
/*
                    <select 
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      className="border border-slate-200 dark:border-slate-600 rounded p-2 text-sm bg-white dark:bg-slate-800 focus:border-brand-accent focus:ring-0 outline-none font-semibold cursor-pointer shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
*/

const bCorrectSelect = `                    <select 
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      className="border border-slate-200 dark:border-slate-600 rounded p-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-brand-accent focus:ring-0 outline-none font-semibold cursor-pointer shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none"
                    >
                      <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="PENDING">PENDING</option>
                      <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="CONFIRMED">CONFIRMED</option>
                      <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="IN_PROGRESS">IN_PROGRESS</option>
                      <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="COMPLETED">COMPLETED</option>
                      <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="CANCELLED">CANCELLED</option>
                      <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="REJECTED">REJECTED</option>
                    </select>`;

bCode = bCode.replace(/<select \n[\s\S]*?<\/select>/, bCorrectSelect);
fs.writeFileSync(bFile, bCode);

const eFile = 'src/pages/Admin/Enquiries.jsx';
let eCode = fs.readFileSync(eFile, 'utf8');

const eCorrectSelect = `                 <select 
                   value={enquiry.status}
                   onChange={(e) => updateStatus(enquiry._id, e.target.value)}
                   className="border rounded p-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                 >
                   <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="NEW">NEW</option>
                   <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="CONTACTED">CONTACTED</option>
                   <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="IN_PROGRESS">IN_PROGRESS</option>
                   <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="RESOLVED">RESOLVED</option>
                   <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="CLOSED">CLOSED</option>
                 </select>`;

eCode = eCode.replace(/<select \n[\s\S]*?<\/select>/, eCorrectSelect);
fs.writeFileSync(eFile, eCode);

