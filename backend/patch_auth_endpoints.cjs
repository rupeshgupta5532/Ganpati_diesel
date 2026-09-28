const fs = require('fs');
const file = 'src/auth/auth.controller.ts';
let code = fs.readFileSync(file, 'utf8');

const forgotResetEndpoints = `
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset OTP' })
  forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using OTP' })
  resetPassword(@Body() body: { email: string; otp: string; newPassword: string }) {
    return this.authService.resetPassword(body.email, body.otp, body.newPassword);
  }
`;

if (!code.includes('forgot-password')) {
  code = code.replace(
    /@Get\('profile'\)/,
    `${forgotResetEndpoints}\n\n@Get('profile')`
  );
  fs.writeFileSync(file, code);
}
