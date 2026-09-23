import React, { useEffect, useState } from 'react';
import { serviceApi } from '../../api/services';
import { Link } from 'react-router';

export const PublicServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    serviceApi.getAll()
      .then(res => setServices(res.data.data || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-16 text-center text-slate-500 dark:text-slate-400 text-xl">Loading specialized services...</div>;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-16">
      <div className="bg-slate-900 py-16 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Our Diesel Services</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Advanced diagnostics, precise calibration, and expert repair for all major diesel fuel injection systems.</p>
      </div>
      
      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(service => (
            <div key={service._id} className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-none-md dark:shadow dark:shadow-none-none overflow-hidden hover:shadow dark:shadow-none-lg transition-shadow dark:shadow-none border border-slate-200 dark:border-slate-600">
              {service.image ? (
                <img src={service.image} alt={service.name} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-slate-200 flex items-center justify-center">
                  <span className="text-slate-400">No Image Available</span>
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{service.name}</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6 min-h-[4rem]">{service.shortDescription || 'Professional diesel engineering and calibration service.'}</p>
                <Link to="/book-service" className="block w-full text-center bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors">
                  Book This Service
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
