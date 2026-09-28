const fs = require('fs');
const file = 'src/auth/auth.service.ts';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('RedisService')) {
  code = code.replace(
    /import \{ MailService \} from '\.\/mail\.service';/,
    "import { MailService } from './mail.service';\nimport { RedisService } from '../redis/redis.service';"
  );
  code = code.replace(
    /private mailService: MailService,/,
    "private mailService: MailService,\n    private redisService: RedisService,"
  );
}

const signupCode = `
  async userSignup(signupDto: SignupDto) {
    const existingUser = await this.userModel.findOne({
      email: signupDto.email,
    });
    if (existingUser) throw new ConflictException('Email already in use');

    if (!signupDto.otp) {
      // Step 1: Send OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await this.redisService.set(\`signup_otp:\${signupDto.email}\`, otp, 900); // 15 mins
      await this.mailService.sendSignupOtp(signupDto.email, otp);
      return { requiresOtp: true, message: 'OTP sent to email for verification' };
    }

    // Step 2: Verify OTP
    const storedOtp = await this.redisService.get(\`signup_otp:\${signupDto.email}\`);
    if (!storedOtp || storedOtp !== signupDto.otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Valid OTP, proceed with registration
    await this.redisService.del(\`signup_otp:\${signupDto.email}\`);

    const passwordHash = await bcrypt.hash(signupDto.password, 10);
    const newUser = new this.userModel({
      ...signupDto,
      passwordHash,
      role: Role.USER,
    });

    await newUser.save();
    return this.generateTokens(
      newUser._id.toString(),
      newUser.email,
      newUser.role,
    );
  }
`;

code = code.replace(
  /async userSignup\(signupDto: SignupDto\) \{[\s\S]*?newUser\.role,\n    \);\n  \}/,
  signupCode.trim()
);

fs.writeFileSync(file, code);
