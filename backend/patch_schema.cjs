const fs = require('fs');

const schemaFile = 'src/bookings/schemas/booking.schema.ts';
let schemaCode = fs.readFileSync(schemaFile, 'utf8');
schemaCode = schemaCode.replace(
  /@Prop\(\)\n  preferredDate: Date;/g,
  `@Prop()\n  preferredDate: Date;\n\n  @Prop()\n  preferredTime: string;`
);
fs.writeFileSync(schemaFile, schemaCode);

const dtoFile = 'src/bookings/dto/create-booking.dto.ts';
let dtoCode = fs.readFileSync(dtoFile, 'utf8');
dtoCode = dtoCode.replace(
  /@IsString\(\)\n  preferredDate: string;/g,
  `@IsString()\n  preferredDate: string;\n\n  @ApiPropertyOptional({ example: '14:30' })\n  @IsString()\n  @IsOptional()\n  preferredTime?: string;`
);
fs.writeFileSync(dtoFile, dtoCode);
