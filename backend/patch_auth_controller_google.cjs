const fs = require('fs');
const file = 'src/auth/auth.controller.ts';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('import { Res }')) {
  code = code.replace(
    /import \{ Req \} from '@nestjs\/common';/,
    "import { Req, Res } from '@nestjs/common';"
  );
}

const newGoogleAuth = `
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({summary:'Login with Google'})
  googleLogin(){
    // Handled by passport
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({summary:'Google OAuth callback'})
  async googleCallback(@Req() req:any, @Res() res:any){
    try {
      const authData = await this.authService.googleLogin(req.user);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const redirectUrl = \`\${frontendUrl}/oauth-callback?accessToken=\${authData.accessToken}&user=\${encodeURIComponent(JSON.stringify(authData.user))}\`;
      res.redirect(redirectUrl);
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(\`\${frontendUrl}/login?error=Google_Auth_Failed\`);
    }
  }
`;

code = code.replace(
  /\/\/ @Get\('google'\)[\s\S]*?googleCallback\(@Req\(\) req:any\)\{\n    return this\.authService\.googleLogin\(req\.user\);\n  \}/,
  newGoogleAuth.trim()
);

fs.writeFileSync(file, code);
