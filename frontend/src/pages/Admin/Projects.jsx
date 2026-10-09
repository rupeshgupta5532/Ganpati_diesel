import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { adminProjectApi } from '../../api/adminApi';

export const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = () => {
    setLoading(true);
    adminProjectApi.getAll()
      .then(res => setProjects(res.data?.data || res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this case study?')) {
      adminProjectApi.delete(id).then(fetchProjects);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Projects / Case Studies</h2>
          <p className="text-xs text-gray-400 mt-1">Showcase completed diesel repair jobs and diagnostics</p>
        </div>
        <Link to="/admin/projects/create" className="bg-primary text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary-hover transition-colors shadow-lg">
          + Add Project
        </Link>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No projects found.</div>
        ) : (
          <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
            <thead className="text-xs text-gray-400 uppercase bg-dark/50 border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Image</th>
                <th className="py-3.5 px-4 font-semibold">Title / Vehicle</th>
                <th className="py-3.5 px-4 font-semibold">Service Type</th>
                <th className="py-3.5 px-4 font-semibold">Visibility</th>
                <th className="py-3.5 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4">
                    {project.afterImage || project.beforeImage ? (
                      <img src={project.afterImage || project.beforeImage} alt="Project" className="w-14 h-10 rounded-lg object-cover border border-white/10" />
                    ) : (
                      <div className="w-14 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-[10px] text-gray-500 font-bold">N/A</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{project.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{project.vehicle || 'Standard Vehicle'}</div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-300 font-medium">{project.serviceType || 'General Service'}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                       <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${project.isPublished ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                         {project.isPublished ? 'Published' : 'Draft'}
                       </span>
                       {project.isFeatured && (
                         <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                           Featured
                         </span>
                       )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/projects/${project._id}/edit`} className="text-primary hover:text-primary-hover text-xs uppercase font-bold tracking-wider bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(project._id)} className="text-red-400 hover:text-red-300 text-xs uppercase font-bold tracking-wider bg-red-400/10 hover:bg-red-400/20 px-3 py-1.5 rounded-full transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
