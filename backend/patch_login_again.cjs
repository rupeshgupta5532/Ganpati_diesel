const fs = require('fs');
const file = 'src/auth/auth.service.ts';
let code = fs.readFileSync(file, 'utf8');

const newLogin = `
  async login(loginDto: LoginDto) {
    // 1. Try to find the user
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (user) {
      if (!user.passwordHash) {
         throw new UnauthorizedException('This account was created via social login and has no password. Please use social login to sign in.');
      }
      const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
      if (isMatch) {
        if (!user.isActive) throw new UnauthorizedException('User is deactivated');
        return this.generateTokens(user._id.toString(), user.email, user.role);
      }
    }

    // 2. If no user found or password didn't match, try admin
    const admin = await this.adminModel.findOne({ email: loginDto.email });
    if (admin) {
      if (!admin.passwordHash) {
         throw new UnauthorizedException('Please use social login.');
      }
      const isMatch = await bcrypt.compare(loginDto.password, admin.passwordHash);
      if (isMatch) {
        if (!admin.isActive) throw new UnauthorizedException('Admin is deactivated');
        return this.generateTokens(admin._id.toString(), admin.email, admin.role);
      }
    }

    // 3. If neither worked
    throw new UnauthorizedException('Invalid credentials');
  }
`;

code = code.replace(/async login\(loginDto: LoginDto\) \{[\s\S]*?throw new UnauthorizedException\('Invalid credentials'\);\n  \}/, newLogin.trim());
fs.writeFileSync(file, code);
