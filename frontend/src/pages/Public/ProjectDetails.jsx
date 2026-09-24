import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { projectApi } from '../../api/services';

export const PublicProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectApi.getAll()
      .then(res => {
        const list = res.data.data || res.data;
        const p = list.find(x => x._id === id || x.slug === id);
        setProject(p);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-16 text-center text-slate-500 dark:text-slate-400 text-xl font-bold">Loading case study details...</div>;
  
  if (!project) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Case Study Not Found</h2>
      <Link to="/projects" className="text-brand-accent font-bold hover:underline">← Back to Portfolio</Link>
    </div>
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-16 font-sans">
      <div className="bg-brand-primary py-16 text-center border-b-4 border-brand-accent relative overflow-hidden px-4">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-brand-accent text-sm font-bold tracking-widest uppercase mb-4 flex justify-center items-center space-x-2">
            <span>{project.vehicle || 'Vehicle Service'}</span>
            <span>•</span>
            <span>{project.serviceType || 'Repair'}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">{project.title}</h1>
          <Link to="/projects" className="inline-block border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 px-6 py-2 rounded-full text-sm font-semibold transition-colors">
            ← Back to Portfolio
          </Link>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
          
          {/* Before & After Showcase */}
          {(project.beforeImage || project.afterImage) && (
            <div className="grid grid-cols-1 md:grid-cols-2 bg-slate-900 border-b border-slate-200 dark:border-slate-600">
              <div className="relative h-64 md:h-96 bg-slate-800 border-b md:border-b-0 md:border-r border-slate-700">
                {project.beforeImage ? (
                  <img src={project.beforeImage} alt="Before" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold">No Before Image</div>
                )}
                <div className="absolute top-4 left-4 bg-red-600/90 text-white px-4 py-1.5 rounded text-sm font-bold uppercase tracking-wider backdrop-blur shadow dark:shadow-none">Before</div>
              </div>
              <div className="relative h-64 md:h-96 bg-slate-800">
                {project.afterImage ? (
                  <img src={project.afterImage} alt="After" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold">No After Image</div>
                )}
                <div className="absolute top-4 right-4 bg-green-600/90 text-white px-4 py-1.5 rounded text-sm font-bold uppercase tracking-wider backdrop-blur shadow dark:shadow-none">After</div>
              </div>
            </div>
          )}

          <div className="p-8 md:p-12">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <div className="md:col-span-2 space-y-8">
                 <div>
                   <h3 className="text-2xl font-bold text-brand-primary dark:text-slate-100 mb-4 flex items-center">
                     <span className="text-brand-accent mr-3">🛠️</span>
                     The Challenge
                   </h3>
                   <div className="bg-red-50 text-red-900 p-6 rounded-lg border-l-4 border-red-500 font-medium leading-relaxed">
                     {project.problem || 'Problem details were not specified for this case study.'}
                   </div>
                 </div>
                 
                 <div>
                   <h3 className="text-2xl font-bold text-brand-primary dark:text-slate-100 mb-4 flex items-center">
                     <span className="text-brand-accent mr-3">✅</span>
                     Our Solution
                   </h3>
                   <div className="bg-green-50 text-green-900 p-6 rounded-lg border-l-4 border-green-500 font-medium leading-relaxed">
                     {project.solution || 'The vehicle was fully restored to optimal performance.'}
                   </div>
                 </div>

                 {project.description && (
                   <div>
                     <h3 className="text-2xl font-bold text-brand-primary dark:text-slate-100 mb-4 border-b pb-2">Detailed Engineering Notes</h3>
                     <div className="prose max-w-none text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                       {project.description}
                     </div>
                   </div>
                 )}
               </div>

               <div className="space-y-6">
                 <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-600">
                   <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Project Specs</h4>
                   <dl className="space-y-4">
                     <div>
                       <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Vehicle</dt>
                       <dd className="text-lg font-bold text-brand-primary">{project.vehicle || 'N/A'}</dd>
                     </div>
                     <div className="h-px bg-slate-200"></div>
                     <div>
                       <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Service Category</dt>
                       <dd className="text-lg font-bold text-brand-primary">{project.serviceType || 'General Repair'}</dd>
                     </div>
                   </dl>
                 </div>

                 <div className="bg-brand-primary text-white p-6 rounded-lg shadow dark:shadow-none-lg text-center">
                   <h4 className="font-bold text-xl mb-2">Facing similar issues?</h4>
                   <p className="text-sm text-slate-300 mb-6">Our master technicians are ready to diagnose your diesel engine.</p>
                   <Link to="/contact" className="block w-full bg-brand-accent text-brand-primary font-bold py-3 rounded hover:bg-yellow-400 transition-colors uppercase tracking-wider text-sm">
                     Book an Inspection
                   </Link>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
