import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy,'google'){

    constructor() {
        super({
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
        scope: ['email', 'profile'],
        });
    }


    async validate(
        accessToken:string,
        refreshToken:string,
        profile:Profile
    ){
        const email = profile?.emails?.[0]?.value;

        if(!email){
            throw new Error('Google Account Doesnt have an email')
        }

        return{
            name:profile.displayName,
            email,
            googleId:profile.id,
            image:profile?.photos?.[0]?.value
        }
    }


}