import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-github2";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID || 'dummy',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy',
      callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/api/v1/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    // GitHub profile emails might be in an array
    let email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

    if (!email) {
      throw new Error('GitHub Account does not have an associated email');
    }

    return {
      name: profile.displayName || profile.username,
      email,
      githubId: profile.id,
      image: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
    };
  }
}
