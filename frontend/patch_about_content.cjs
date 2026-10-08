const fs = require('fs');
const file = 'src/pages/Public/About.jsx';
let code = fs.readFileSync(file, 'utf8');

// Imports
if (!code.includes('websiteContentApi')) {
  code = code.replace(
    /import \{ Link \} from 'react-router';/,
    "import { Link } from 'react-router';\nimport { useState, useEffect } from 'react';\nimport { websiteContentApi } from '../../api/services';"
  );
}

// State
if (!code.includes('const [content, setContent] = useState(null);')) {
  code = code.replace(
    /export const About = \(\) => \{/,
    `export const About = () => {
  const [content, setContent] = useState(null);
  
  useEffect(() => {
    websiteContentApi.getHomepage()
      .then(res => setContent(res.data))
      .catch(console.error);
  }, []);`
  );
}

// Replacements
code = code.replace(
  /Since 2004, New Shree Ganpati Diesel Service has been the premier destination for diesel engineering, fuel pump calibration, and advanced diagnostics in Birgunj, Nepal\./,
  `Since {content?.establishedYear || '2004'}, {content?.heroTitle || 'New Shree Ganpati Diesel Service'} has been the premier destination for diesel engineering, fuel pump calibration, and advanced diagnostics in Birgunj, Nepal.`
);

code = code.replace(
  /21\+ Years of Relentless Mechanical Precision/,
  `{content?.yearsExperience || '21'}+ Years of Relentless Mechanical Precision`
);

code = code.replace(
  /What started over two decades ago as a modest workshop in Brahma Chowk has evolved into Nepal's leading diesel diagnostics facility. We specialize in bringing life back to heavily used commercial trucks, agricultural tractors, and industrial generators\./,
  `{content?.aboutText || "What started over two decades ago as a modest workshop in Brahma Chowk has evolved into Nepal's leading diesel diagnostics facility. We specialize in bringing life back to heavily used commercial trucks, agricultural tractors, and industrial generators."}`
);

fs.writeFileSync(file, code);
