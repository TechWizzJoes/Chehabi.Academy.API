import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppConfig } from '@App/Config/App.Config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { UserModels } from '@App/Common/Models/User.Models';

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

	async validate(req: Request, user: UserModels.JwtModel) {
		console.log('<validate>');

		const requestedHost = req.headers.host;
		const env = this.AppConfig.Config.Env ?? 'local';

		console.log(user.AccountHost);
		console.log(requestedHost);
		// console.log(this.AppConfig.Config.NODE_ENV);
		// console.log(user.AccountHost != requestedHost);;
		// console.log(this.AppConfig.Config.NODE_ENV != 'local');

		if (!requestedHost.includes(user.AccountHost) && env != 'local') {
			throw new HttpException(
				`not allowed client\n user.AccountHost:${user.AccountHost}, requestedHost:${requestedHost}, env:${env}`,
				HttpStatus.AMBIGUOUS
			); // any custom error
			// return false; // throws unauthorized exception
		}

		// const role = payload.IsAdmin ? RoleEnum.Admin : RoleEnum.User;
		console.log('</validate>');
		return user;
	}
}
