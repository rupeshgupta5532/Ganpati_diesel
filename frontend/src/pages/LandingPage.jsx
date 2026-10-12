import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUs';
import Footer from '../components/Footer';
import { websiteContentApi } from '../api/services';

export const LandingPage = () => {
  const [cmsContent, setCmsContent] = useState(null);

  useEffect(() => {
    websiteContentApi.getHomepage()
      .then(res => setCmsContent(res.data?.data || res.data || res || {}))
      .catch(err => console.error('Failed to load CMS content:', err));
  }, []);

  return (
    <div className="font-sans bg-darker text-gray-100 min-h-screen relative overflow-hidden">
      {/* Background glowing blobs */}
      <div className="blob blob-1 fixed"></div>
      <div className="blob blob-2 fixed"></div>
      
      {/* Subtle grid background */}
      <div className="fixed inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wMyIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTAgNjBoNjBNNjAgMGYtNjAgNjAiLz48L2c+PC9zdmc+')] opacity-50 pointer-events-none"></div>

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero cms={cmsContent} />
          <Services />
          <WhyChooseUs cms={cmsContent} />
        </main>
        <Footer />
      </div>
    </div>
  );
};
