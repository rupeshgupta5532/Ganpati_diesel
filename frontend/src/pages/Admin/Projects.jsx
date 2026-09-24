import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { adminProjectApi } from '../../api/adminApi';

export const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = () => {
    setLoading(true);
    adminProjectApi.getAll()
      .then(res => setProjects(res.data.data || res.data))
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Manage Case Studies</h1>
        <Link to="/admin/projects/create" className="bg-brand-accent text-brand-primary px-4 py-2 rounded font-bold hover:bg-brand-accent-hover transition-colors">
          + Add Project
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded shadow dark:shadow-none overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-slate-400">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-slate-400">No projects found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-700 border-b text-slate-600 dark:text-slate-300">
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Title / Vehicle</th>
                <th className="py-3 px-4">Service Type</th>
                <th className="py-3 px-4">Visibility</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project._id} className="border-b hover:bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                  <td className="py-3 px-4">
                    {project.afterImage ? (
                      <img src={project.afterImage} alt="After" className="w-16 h-12 rounded object-cover" />
                    ) : (
                      <div className="w-16 h-12 bg-slate-200 rounded flex items-center justify-center text-[10px] text-slate-400">N/A</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800 dark:text-slate-100">{project.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{project.vehicle || 'Unknown Vehicle'}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-200">{project.serviceType}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col space-y-1">
                       <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold w-max ${project.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800 dark:text-gray-200'}`}>
                         {project.isPublished ? 'Published' : 'Draft'}
                       </span>
                       {project.isFeatured && (
                         <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold w-max bg-purple-100 text-purple-800">
                           Featured
                         </span>
                       )}
                    </div>
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    <Link to={`/admin/projects/${project._id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                    <button onClick={() => handleDelete(project._id)} className="text-red-600 hover:underline">Delete</button>
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
