const fs = require('fs');

const file = 'src/auth/auth.service.ts';
let code = fs.readFileSync(file, 'utf8');

const profileMethods = `
  async getProfile(userId: string, role: string) {
    if (role === Role.USER) {
      const user = await this.userModel.findById(userId).select('-passwordHash -refreshTokenHash').exec();
      if (!user) throw new UnauthorizedException('User not found');
      return user;
    } else {
      const admin = await this.adminModel.findById(userId).select('-passwordHash -refreshTokenHash').exec();
      if (!admin) throw new UnauthorizedException('Admin not found');
      return admin;
    }
  }

  async updateProfile(userId: string, role: string, updateData: any) {
    const data = { ...updateData };
    delete data.passwordHash;
    delete data.role;
    delete data.isActive;

    if (role === Role.USER) {
      const updatedUser = await this.userModel.findByIdAndUpdate(userId, data, { new: true }).select('-passwordHash -refreshTokenHash').exec();
      return { success: true, data: updatedUser };
    } else {
      const updatedAdmin = await this.adminModel.findByIdAndUpdate(userId, data, { new: true }).select('-passwordHash -refreshTokenHash').exec();
      return { success: true, data: updatedAdmin };
    }
  }
`;

code = code.replace(
  /private async generateTokens/,
  `${profileMethods}\n  private async generateTokens`
);

fs.writeFileSync(file, code);
