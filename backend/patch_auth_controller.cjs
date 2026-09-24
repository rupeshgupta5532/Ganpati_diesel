const fs = require('fs');

const file = 'src/auth/auth.controller.ts';
let code = fs.readFileSync(file, 'utf8');

const profileEndpoints = `
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user or admin profile' })
  getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.userId, user.role);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user or admin profile' })
  updateProfile(@CurrentUser() user: any, @Body() updateData: any) {
    return this.authService.updateProfile(user.userId, user.role, updateData);
  }
`;

code = code.replace(
  /  @Get\('profile'\)[\s\S]*?getProfile\(@CurrentUser\(\) user: any\) \{\n    return user;\n  \}/,
  profileEndpoints.trim()
);

if (!code.includes('@Patch')) {
  code = code.replace(/Get,/, 'Get, Patch,');
}

fs.writeFileSync(file, code);
