import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AppConfig } from '@App/Config/App.Config';
import { Request } from 'express';
import { AccountModels } from '@App/Features/Account/Account.Models';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(private readonly AppConfig: AppConfig) {
		super({
			jwtFromRequest: ExtractJwt.fromBodyField('RefreshToken'),
			ignoreExpiration: false,
			secretOrKey: AppConfig.Config.Auth.Jwt.Key,
			passReqToCallback: true
		});
	}

	async validate(req: Request, user: AccountModels.JwtModel) {
		return user;
	}
}
