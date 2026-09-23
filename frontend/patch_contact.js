const fs = require('fs');
let code = fs.readFileSync('src/pages/Public/Contact.jsx', 'utf8');

code = code.replace(
  "import { contactApi, enquiryApi } from '../../api/services';",
  "import { contactApi, enquiryApi } from '../../api/services';\nimport { useSearchParams } from 'react-router';"
);

code = code.replace(
  "const [contactInfo, setContactInfo] = useState(null);",
  "const [searchParams] = useSearchParams();\n  const [contactInfo, setContactInfo] = useState(null);"
);

code = code.replace(
  "const [formData, setFormData] = useState({ name: '', phone: '', subject: '', message: '' });",
  "const [formData, setFormData] = useState({ name: '', phone: '', subject: searchParams.get('subject') || '', message: '' });"
);

fs.writeFileSync('src/pages/Public/Contact.jsx', code);
