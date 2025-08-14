import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppConfig } from '@App/Config/App.Config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { AccountModels } from '@App/Features/Account/Account.Models';

@Injectable()
export class GetUserIfAnyStrategy extends PassportStrategy(Strategy, 'getuser') {
	constructor(private readonly AppConfig: AppConfig) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: AppConfig.Config.Auth.Jwt.Key,
			passReqToCallback: true
		});
	}

	async validate(req: Request, user: AccountModels.JwtModel) {
		return user;
	}
}
