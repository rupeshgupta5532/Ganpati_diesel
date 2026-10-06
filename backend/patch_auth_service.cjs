const fs = require('fs');
const file = 'src/auth/auth.service.ts';
let code = fs.readFileSync(file, 'utf8');

const githubLoginMethod = `
  async githubLogin(profile: {
    githubId: string;
    email: string;
    name: string;
    profileImage?: string;
  }) {
    let user = await this.userModel.findOne({ githubId: profile.githubId });
    if (user) {
      if (!user.isActive) throw new UnauthorizedException('User is deactivated');
      return this.generateTokens(user._id.toString(), user.email, user.role);
    }

    user = await this.userModel.findOne({ email: profile.email });
    if (user) {
      if (!user.isActive) throw new UnauthorizedException('User is deactivated');
      user.githubId = profile.githubId;
      user.authProvider = 'github';
      await user.save();
      return this.generateTokens(user._id.toString(), user.email, user.role);
    }

    user = new this.userModel({
      name: profile.name,
      email: profile.email,
      githubId: profile.githubId,
      role: Role.USER,
      authProvider: 'github',
      profileImage: profile.profileImage,
      isActive: true,
    });
    await user.save();

    return this.generateTokens(user._id.toString(), user.email, user.role);
  }

`;

if (!code.includes('githubLogin(')) {
  code = code.replace(
    /async googleLogin\(profile:\{/,
    githubLoginMethod + "  async googleLogin(profile:{"
  );
  fs.writeFileSync(file, code);
}
