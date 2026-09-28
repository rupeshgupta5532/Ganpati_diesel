const fs = require('fs');
const file = 'src/users/schemas/user.schema.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /@Prop\(\{ default: true \}\)\n  isActive: boolean;/,
  `@Prop({ default: true })\n  isActive: boolean;\n\n  @Prop()\n  resetPasswordOtp: string;\n\n  @Prop()\n  resetPasswordExpires: Date;`
);
fs.writeFileSync(file, code);

const adminFile = 'src/admins/schemas/admin.schema.ts';
let adminCode = fs.readFileSync(adminFile, 'utf8');
adminCode = adminCode.replace(
  /@Prop\(\{ default: true \}\)\n  isActive: boolean;/,
  `@Prop({ default: true })\n  isActive: boolean;\n\n  @Prop()\n  resetPasswordOtp: string;\n\n  @Prop()\n  resetPasswordExpires: Date;`
);
fs.writeFileSync(adminFile, adminCode);
