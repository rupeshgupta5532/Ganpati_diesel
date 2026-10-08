import React, { useEffect, useState } from 'react';
import { auditLogsApi } from '../../api/adminApi';

export const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    auditLogsApi.getLogs(page, 50)
      .then(res => {
        setLogs(res.data?.data || res.data || []);
        if (res.data?.total) {
          setTotalPages(Math.ceil(res.data.total / 50));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-primary dark:text-slate-100">System Audit Logs</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-2">Comprehensive trail of all system activities and modifications.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none-sm dark:shadow dark:shadow-none-none border border-gray-100 dark:border-slate-700 p-6">
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-slate-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                 <th className="p-4 font-bold">Time</th>
                 <th className="p-4 font-bold">Status</th>
                 <th className="p-4 font-bold">Log ID & Action</th>
                 <th className="p-4 font-bold">Resource & Endpoint</th>
                 <th className="p-4 font-bold">User Email & Role</th>
                 
               </tr>
             </thead>
             <tbody>
               {loading ? (
                 <tr><td colSpan="5" className="p-8 text-center text-gray-400 animate-pulse">Loading logs...</td></tr>
               ) : logs.length > 0 ? logs.map(log => (
                 <tr key={log._id} className="border-b border-gray-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-slate-800 dark:text-slate-200">
                   <td className="p-4 text-sm whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                   <td className="p-4">
                     <span className={`px-2 py-1 rounded text-xs font-bold \${
                       log.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                     }`}>
                       {log.status || 'SUCCESS'}
                     </span>
                   </td>
                   <td className="p-4">
                     <span className={`px-2 py-1 rounded text-xs font-bold \${
                       log.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                       log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                       log.action === 'DELETE' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                     }`}>
                       <div className="text-xs text-gray-500 mb-1">{log.logId}</div>
                       {log.action}
                       {log.description && <div className="text-[10px] text-gray-400 mt-1">{log.description}</div>}
                     </span>
                   </td>
                   <td className="p-4">
                     <div className="font-semibold text-brand-accent uppercase text-xs tracking-wider mb-1">{log.resource}</div>
                     <div className="text-xs text-gray-500 truncate max-w-xs" title={log.endpoint}><span className="font-bold mr-1">{log.method}</span>{log.endpoint}</div>
                   </td>
                   <td className="p-4">
                     <div className="text-sm font-semibold">{log.userEmail}</div>
                     <div className="text-xs text-gray-500">{log.userRole}</div>
                   </td>
                   
                 </tr>
               )) : (
                 <tr>
                   <td colSpan="5" className="p-8 text-center text-gray-400">No logs found.</td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
         
         {/* Pagination */}
         {totalPages > 1 && (
           <div className="flex justify-between items-center mt-6">
             <button 
               onClick={() => setPage(p => Math.max(1, p - 1))} 
               disabled={page === 1}
               className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700"
             >
               Previous
             </button>
             <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
             <button 
               onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
               disabled={page === totalPages}
               className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700"
             >
               Next
             </button>
           </div>
         )}
      </div>
    </div>
  );
};
