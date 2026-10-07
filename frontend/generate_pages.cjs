const fs = require('fs');
const path = require('path');

const pages = ['About', 'Products', 'Projects', 'Reviews', 'BookService'];

const template = (name, title, desc) => "import React from 'react';\n" +
"import Navbar from '../components/Navbar';\n" +
"import Footer from '../components/Footer';\n" +
"import { motion } from 'framer-motion';\n\n" +
"export const " + name + " = () => {\n" +
"  return (\n" +
"    <div className=\"font-sans bg-darker text-gray-100 min-h-screen relative overflow-hidden flex flex-col\">\n" +
"      <div className=\"blob blob-1 fixed\"></div>\n" +
"      <div className=\"blob blob-2 fixed\"></div>\n" +
"      <div className=\"fixed inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wMyIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTAgNjBoNjBNNjAgMGYtNjAgNjAiLz48L2c+PC9zdmc+')] opacity-50 pointer-events-none\"></div>\n" +
"      \n" +
"      <Navbar />\n" +
"      \n" +
"      <main className=\"flex-grow flex items-center justify-center relative z-10 pt-32 pb-20 px-4\">\n" +
"        <motion.div \n" +
"          initial={{ opacity: 0, y: 20 }}\n" +
"          animate={{ opacity: 1, y: 0 }}\n" +
"          className=\"max-w-4xl w-full glass-card rounded-3xl p-12 border border-white/10 text-center\"\n" +
"        >\n" +
"          <h1 className=\"text-4xl md:text-5xl font-bold mb-6 text-white\">" + title + "</h1>\n" +
"          <p className=\"text-gray-400 text-lg mb-8\">" + desc + "</p>\n" +
"          <div className=\"h-64 rounded-xl border border-white/10 bg-dark/50 flex items-center justify-center text-gray-500 font-mono\">\n" +
"            // Module Integration Pending\n" +
"          </div>\n" +
"        </motion.div>\n" +
"      </main>\n" +
"      \n" +
"      <div className=\"relative z-10\">\n" +
"        <Footer />\n" +
"      </div>\n" +
"    </div>\n" +
"  );\n" +
"};\n";

const data = {
  'About': ['About Our Network', 'Decentralized fleet maintenance protocol established in 2004.'],
  'Products': ['Hardware & Components', 'Verified genuine OEM parts and digital inventory.'],
  'Projects': ['Service Ledgers', 'Immutable records of major overhaul and diagnostic projects.'],
  'Reviews': ['Node Feedback', 'Real-time consensus and reviews from our network participants.'],
  'BookService': ['Initialize Service Protocol', 'Request a maintenance slot in our decentralized calendar.'],
};

pages.forEach(p => {
  fs.writeFileSync(path.join(__dirname, 'src', 'pages', p + '.jsx'), template(p, data[p][0], data[p][1]));
});

console.log("Pages generated");
