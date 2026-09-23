const fs = require('fs');
let code = fs.readFileSync('src/enquiries/schemas/enquiry.schema.ts', 'utf8');
code = code.replace(
  "@Prop({ required: true })\n  email: string;",
  "@Prop({ required: false })\n  email?: string;"
);
fs.writeFileSync('src/enquiries/schemas/enquiry.schema.ts', code);
