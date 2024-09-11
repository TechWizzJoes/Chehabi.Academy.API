import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppConfig } from '@App/Config/App.Config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { AccountModels } from '@App/Features/Account/Account.Models';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly AppConfig: AppConfig) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: AppConfig.Config.Auth.Jwt.Key,
			passReqToCallback: true
		});
	}

	async validate(req: Request, user: AccountModels.JwtModel) {
		// console.log('<validate>');
		// const role = payload.IsAdmin ? RoleEnum.Admin : RoleEnum.User;
		// console.log('</validate>');
		return user;
	}
}
