const fs = require('fs');
const file = 'src/auth/dto/signup.dto.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /phone\?: string;/,
  "phone?: string;\n\n  @ApiProperty({ required: false })\n  @IsString()\n  @IsOptional()\n  otp?: string;"
);
fs.writeFileSync(file, code);
