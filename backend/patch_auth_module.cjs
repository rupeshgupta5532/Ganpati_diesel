const fs = require('fs');
const file = 'src/auth/auth.module.ts';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('RedisModule')) {
  code = code.replace(
    /import \{ JwtStrategy \} from '\.\/strategies\/jwt\.strategy';/,
    "import { JwtStrategy } from './strategies/jwt.strategy';\nimport { RedisModule } from '../redis/redis.module';"
  );
  code = code.replace(
    /PassportModule,/,
    "PassportModule,\n    RedisModule,"
  );
  fs.writeFileSync(file, code);
}
