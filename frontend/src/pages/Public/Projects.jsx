import React, { useEffect, useState } from 'react';
import { projectApi } from '../../api/services';
import { Link } from 'react-router';

export const PublicProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectApi.getAll()
      .then(res => setProjects(res.data.data || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-16 text-center text-slate-500 dark:text-slate-400 text-xl">Loading case studies...</div>;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-16">
      <div className="bg-slate-900 py-16 text-center border-b-4 border-blue-600">
        <h1 className="text-4xl font-bold text-white mb-4">5000+ Projects Completed</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Explore our portfolio of complex diesel diagnostics, high-pressure pump restorations, and CRDI engineering.</p>
      </div>
      
      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <div key={project._id} className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-none-md dark:shadow dark:shadow-none-none overflow-hidden group">
              <div className="relative h-64 overflow-hidden bg-slate-200">
                {project.afterImage ? (
                  <img src={project.afterImage} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">No Image</div>
                )}
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded shadow dark:shadow-none">
                  {project.serviceType || 'Repair'}
                </div>
              </div>
              <div className="p-6">
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">{project.vehicle}</div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 leading-snug">{project.title}</h2>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300 mb-6">
                  <p><span className="font-semibold text-slate-800 dark:text-slate-100">Problem:</span> {project.problem || 'Not specified'}</p>
                  <p><span className="font-semibold text-green-700">Solution:</span> {project.solution || 'Resolved'}</p>
                </div>
                <Link to={`/projects/${project.slug || project._id}`} className="block text-center w-full border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2 rounded font-semibold hover:border-brand-accent hover:text-brand-primary transition-colors">
                  View Full Case Study
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
