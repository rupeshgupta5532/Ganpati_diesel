const fs = require('fs');
const file = 'src/auth/auth.controller.ts';
let code = fs.readFileSync(file, 'utf8');

const githubEndpoints = `
  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'Login with GitHub' })
  githubLogin() {
    // Handled by passport
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub OAuth callback' })
  async githubCallback(@Req() req: any, @Res() res: any) {
    try {
      const authData = await this.authService.githubLogin(req.user);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const redirectUrl = \`\${frontendUrl}/oauth-callback?accessToken=\${authData.accessToken}&user=\${encodeURIComponent(JSON.stringify(authData.user))}\`;
      res.redirect(redirectUrl);
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(\`\${frontendUrl}/login?error=GitHub_Auth_Failed\`);
    }
  }
`;

if (!code.includes('githubCallback')) {
  code = code.replace(
    /(@Get\('google'\)[\s\S]*?res\.redirect\(`\$\{frontendUrl\}\/login\?error=Google_Auth_Failed`\);\n\s*\}\n\s*\})/,
    "$1\n\n" + githubEndpoints.trim()
  );
  fs.writeFileSync(file, code);
}
