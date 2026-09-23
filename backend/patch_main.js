const fs = require('fs');
let code = fs.readFileSync('src/main.ts', 'utf8');

code = code.replace(
  "import { NestFactory } from '@nestjs/core';",
  "import { NestFactory } from '@nestjs/core';\nimport { NestExpressApplication } from '@nestjs/platform-express';\nimport { join } from 'path';"
);

code = code.replace(
  "const app = await NestFactory.create(AppModule);",
  "const app = await NestFactory.create<NestExpressApplication>(AppModule);\n\n  app.useStaticAssets(join(__dirname, '..', 'public'), {\n    prefix: '/',\n  });"
);

fs.writeFileSync('src/main.ts', code);
