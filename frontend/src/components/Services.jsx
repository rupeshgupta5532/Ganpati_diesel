import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Settings, ShieldAlert, Truck, PenTool, BatteryCharging } from 'lucide-react';

const Services = () => {
  const [servicesData, setServicesData] = React.useState([
    {
      title: 'Engine Diagnostic Protocol',
      description: 'Quantum-level computer diagnostics for all heavy-duty diesel engines to pinpoint node failures rapidly.',
      icon: Cpu,
      colSpan: 'md:col-span-2 lg:col-span-2'
    },
    {
      title: 'Transmission Sync',
      description: 'Complete rebuilds and routine maintenance algorithms for modern transmissions.',
      icon: Settings,
      colSpan: 'md:col-span-1 lg:col-span-1'
    },
    {
      title: '24/7 Roadside Node',
      description: 'Emergency breakdown assistance. We deploy to your coordinates anytime, anywhere.',
      icon: ShieldAlert,
      colSpan: 'md:col-span-1 lg:col-span-1'
    },
    {
      title: 'Fleet Network Maintenance',
      description: 'Scheduled preventative maintenance programs designed to minimize downtime for your entire network.',
      icon: Truck,
      colSpan: 'md:col-span-2 lg:col-span-2'
    },
    {
      title: 'Brake Matrix Systems',
      description: 'Air brake inspections and complete system overhauls for maximum security protocols.',
      icon: PenTool,
      colSpan: 'md:col-span-1 lg:col-span-1'
    },
    {
      title: 'Electrical Grid Troubleshooting',
      description: 'Alternators, starters, and complete electrical grid troubleshooting.',
      icon: BatteryCharging,
      colSpan: 'md:col-span-2 lg:col-span-2'
    },
  ]);

  React.useEffect(() => {
    import('../api/axios').then(({ default: api }) => {
      api.get('/services')
        .then(res => {
          const data = Array.isArray(res) ? res : (res.data || []);
          if (data && data.length > 0) {
            const mapped = data.slice(0, 6).map((svc, index) => {
              const spans = ['md:col-span-2 lg:col-span-2', 'md:col-span-1 lg:col-span-1', 'md:col-span-1 lg:col-span-1', 'md:col-span-2 lg:col-span-2', 'md:col-span-1 lg:col-span-1', 'md:col-span-2 lg:col-span-2'];
              const fallbackIcons = [Cpu, Settings, ShieldAlert, Truck, PenTool, BatteryCharging];
              return {
                title: svc.name || svc.title,
                description: svc.shortDescription || svc.description || '',
                icon: fallbackIcons[index % fallbackIcons.length],
                colSpan: spans[index % spans.length]
              };
            });
            setServicesData(mapped);
          }
        })
        .catch(err => console.error("Error fetching homepage services:", err));
    });
  }, []);

  return (
    <section id="services" className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <span className="text-xs font-medium text-primary tracking-wide uppercase">Infrastructure</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-4">
            Core <span className="text-gray-500">Solutions</span>
          </h2>
          <p className="text-gray-400 max-w-xl text-lg font-light">
            Comprehensive diagnostic and repair infrastructure to keep your assets secure and operational.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {servicesData.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`glass-card p-8 rounded-3xl group hover:bg-white/[0.08] transition-colors ${service.colSpan}`}
            >
              <div className="flex justify-between items-start mb-16">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-all">
                  <service.icon className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-medium text-white mb-2">{service.title}</h4>
                <p className="text-gray-400 text-sm font-light leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;
