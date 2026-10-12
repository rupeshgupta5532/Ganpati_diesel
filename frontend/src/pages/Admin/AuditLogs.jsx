import React, { useEffect, useState } from 'react';
import { adminAuditLogApi } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { RefreshCw, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchLogs = (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    adminAuditLogApi.getAll()
      .then(res => {
        setLogs(res.data?.data || res.data || []);
        if (isRefresh) toast.success('Audit logs refreshed');
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load audit logs');
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filter logs based on search term and status
  const filteredLogs = logs.filter(log => {
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    const query = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      (log.logId || '').toLowerCase().includes(query) ||
      (log.actorEmail || '').toLowerCase().includes(query) ||
      (log.module || '').toLowerCase().includes(query) ||
      (log.action || '').toLowerCase().includes(query) ||
      (log.endpoint || '').toLowerCase().includes(query) ||
      (log.description || '').toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  // Reset to first page when search query, filter, or itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  // Pagination computations
  const totalItems = filteredLogs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  const goToPage = (page) => {
    const targetPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(targetPage);
  };

  // Generate page numbers with ellipsis for cleaner navigation
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">System Audit Logs</h2>
          <p className="text-gray-400 text-sm mt-0.5">Comprehensive trail of all system activities and modifications.</p>
        </div>
        
        <button
          onClick={() => fetchLogs(true)}
          disabled={refreshing || loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-all disabled:opacity-50 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-primary' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Logs'}
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 p-6 bg-dark/40 shadow-xl backdrop-blur-md space-y-6">
        {/* Controls: Search, Status Filter & Count Badge */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <div className="relative flex-grow md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Search className="h-4 w-4" />
            </div>
            <input 
              type="text" 
              placeholder="Search by ID, email, module, action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark/50 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-400 font-medium">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-dark/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary transition-all cursor-pointer"
              >
                <option value="ALL" className="bg-dark text-white">All Statuses</option>
                <option value="SUCCESS" className="bg-dark text-white">Success Only</option>
                <option value="ERROR" className="bg-dark text-white">Error Only</option>
              </select>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-400">
              Total: <span className="text-white font-bold">{totalItems}</span>
            </div>
          </div>
        </div>

        {/* Logs Table */}
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
              ) : paginatedLogs.length > 0 ? (
                paginatedLogs.map((log, index) => (
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
                        <span className="text-[11px] text-gray-400 max-w-xs truncate" title={log.description}>
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
                  <td colSpan="5" className="p-8 text-center text-gray-500">No audit logs match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {!loading && totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs">
            {/* Left side: Range and Per-page Selector */}
            <div className="flex flex-wrap items-center gap-4 text-gray-400">
              <span>
                Showing <strong className="text-white">{startIndex + 1}</strong> to{' '}
                <strong className="text-white">{endIndex}</strong> of{' '}
                <strong className="text-white">{totalItems}</strong> entries
              </span>
              
              <div className="flex items-center gap-2">
                <span>Per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="bg-dark/60 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value={5} className="bg-dark text-white">5</option>
                  <option value={10} className="bg-dark text-white">10</option>
                  <option value={20} className="bg-dark text-white">20</option>
                  <option value={50} className="bg-dark text-white">50</option>
                </select>
              </div>
            </div>

            {/* Right side: Page Navigation */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                {/* First Page */}
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                  title="First Page"
                >
                  <ChevronsLeft size={14} />
                </button>

                {/* Previous Page */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft size={14} />
                </button>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((pageNum, idx) => (
                    pageNum === '...' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 py-1 text-gray-500 font-bold select-none">
                        ...
                      </span>
                    ) : (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`min-w-[32px] h-8 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20 font-extrabold border border-amber-400/50'
                            : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  ))}
                </div>

                {/* Next Page */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight size={14} />
                </button>

                {/* Last Page */}
                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                  title="Last Page"
                >
                  <ChevronsRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

