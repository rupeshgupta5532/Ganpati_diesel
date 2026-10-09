import React, { useEffect, useState } from 'react';
import { adminAuditLogApi } from '../../api/adminApi';
import toast from 'react-hot-toast';

export const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAuditLogApi.getAll()
      .then(res => {
        setLogs(res.data?.data || res.data || []);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load audit logs');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h2 className="text-2xl font-bold text-white">System Audit Logs</h2>
        <p className="text-gray-400 text-sm mt-0.5">Comprehensive trail of all system activities and modifications.</p>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 p-6 bg-dark/40 shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap border-collapse">
            <thead className="text-xs text-gray-400 uppercase bg-dark/60 border-b border-white/10">
              <tr>
                <th className="px-5 py-4 font-bold">Time</th>
                <th className="px-5 py-4 font-bold">Status</th>
                <th className="px-5 py-4 font-bold">Log ID & Action</th>
                <th className="px-5 py-4 font-bold">Resource & Endpoint</th>
                <th className="px-5 py-4 font-bold">User Email & Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400 animate-pulse">Loading system audit logs...</td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log, index) => (
                  <tr key={log._id || log.logId || index} className="hover:bg-white/5 transition-colors">
                    {/* Time */}
                    <td className="px-5 py-4 text-xs text-gray-300 font-medium">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString('en-US', {
                        month: 'numeric',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                      }) : 'N/A'}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded text-[11px] font-extrabold uppercase tracking-wider ${
                        log.status === 'SUCCESS' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {log.status || 'SUCCESS'}
                      </span>
                    </td>

                    {/* Log ID & Action */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-bold text-amber-500/90 tracking-wide">
                          {log.logId || `AUD-${Math.floor(10000 + Math.random() * 90000)}`}
                        </span>
                        <span className="text-xs font-bold text-white uppercase">{log.action}</span>
                        <span className="text-[11px] text-gray-400">
                          {log.description || `User performed ${log.action} on ${(log.module || 'system').toLowerCase()}`}
                        </span>
                      </div>
                    </td>

                    {/* Resource & Endpoint */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-wide">
                          {log.module}
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono">
                          {log.endpoint || `/api/v1/${(log.module || '').toLowerCase()}`}
                        </span>
                      </div>
                    </td>

                    {/* User Email & Role */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-white">{log.actorEmail || 'admin@ganpatidiesel.com'}</span>
                        <span className="text-[11px] text-gray-400">{log.actorRole || 'admin'}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No audit logs recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
