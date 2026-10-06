const fs = require('fs');
const file = 'src/users/schemas/user.schema.ts';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('githubId')) {
  code = code.replace(
    /@Prop\(\{ unique: true, sparse: true \}\)\n  googleId\?: string;/,
    "@Prop({ unique: true, sparse: true })\n  googleId?: string;\n\n  @Prop({ unique: true, sparse: true })\n  githubId?: string;"
  );
  
  code = code.replace(
    /enum: \['local', 'google'\],/,
    "enum: ['local', 'google', 'github'],"
  );
  
  fs.writeFileSync(file, code);
}
