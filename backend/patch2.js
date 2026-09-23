const fs = require('fs');
const file = 'src/bookings/bookings.controller.ts';
let code = fs.readFileSync(file, 'utf8');

const newRoute = `
  @Patch(':id/notes')
  @ApiOperation({ summary: 'Update admin notes' })
  updateNotes(
    @Param('id') id: string,
    @Body('adminNotes') adminNotes: string,
  ) {
    return this.bookingsService.updateStatusAdmin(id, { status: undefined, adminNotes } as any);
  }
`;

code = code.replace(
  "    return this.bookingsService.updateStatusAdmin(id, updateDto);\n  }",
  "    return this.bookingsService.updateStatusAdmin(id, updateDto);\n  }\n" + newRoute
);

fs.writeFileSync(file, code);
