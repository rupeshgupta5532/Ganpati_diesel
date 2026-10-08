const fs = require('fs');
const file = 'src/layouts/PublicLayout.jsx';
let code = fs.readFileSync(file, 'utf8');

// Add websiteContentApi import
if (!code.includes('websiteContentApi')) {
  code = code.replace(
    /import { contactApi } from '\.\.\/api\/services';/,
    "import { contactApi, websiteContentApi } from '../api/services';"
  );
}

// Add state and effect
if (!code.includes('const [content, setContent] = useState(null);')) {
  code = code.replace(
    /const \[contact, setContact\] = useState\(null\);/,
    "const [contact, setContact] = useState(null);\n  const [content, setContent] = useState(null);"
  );
  
  code = code.replace(
    /useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/,
    `useEffect(() => {
    contactApi.getContact()
      .then(res => setContact(res.data))
      .catch(console.error);
      
    websiteContentApi.getHomepage()
      .then(res => setContent(res.data))
      .catch(console.error);
  }, []);`
  );
}

// Replace hardcoded footer texts
code = code.replace(
  /<p className="text-sm mb-4">21 Years of Diesel Engineering Excellence. Advanced Fuel Pump, Injector, and CRDI Diagnostics.<\/p>/,
  '<p className="text-sm mb-4">{content?.heroSubtitle || "21 Years of Diesel Engineering Excellence."} {content?.heroDescription || "Advanced Fuel Pump, Injector, and CRDI Diagnostics."}</p>'
);
code = code.replace(
  /<p className="text-xs">Estd. 2004 A.D. \| Birgunj, Nepal<\/p>/,
  '<p className="text-xs">Estd. {content?.establishedYear || "2004"} A.D. | {contact?.address || "Birgunj, Nepal"}</p>'
);

fs.writeFileSync(file, code);
