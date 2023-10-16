import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../Enums/Role.Enum';
import { ROLES_KEY } from './Roles.Decorator';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		]);
		if (!requiredRoles) {
			return true;
		}
		const { user } = context.switchToHttp().getRequest();
		// console.log('user', user);

		// return requiredRoles.some((role) => user.role?.includes(role));
		return user.IsAdmin;
	}
}
