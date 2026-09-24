const fs = require('fs');

const file = 'src/main.ts';
let code = fs.readFileSync(file, 'utf8');

const corsCode = `
  app.enableCors({
    origin: [
      'https://ganpatidiesel.netlify.app',
      'http://localhost:5173',
      'http://localhost:5174',
      true
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
`;

code = code.replace(
  /app\.enableCors\(\{\n    origin: true,\n    credentials: true,\n  \}\);/,
  corsCode.trim()
);

fs.writeFileSync(file, code);
