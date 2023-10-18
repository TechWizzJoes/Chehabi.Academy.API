import { Injectable } from '@nestjs/common';
import { AppConfig, Config } from '@App/Config/App.Config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@App/Data/TypeOrmEntities/User';
@Injectable()
export class AccountRepository {
	Config: Config;

	constructor(
		@InjectRepository(User) private User: Repository<User>,
	) { }

	async GetUserById(id: number): Promise<User> {
		return this.User.findOne({
			where: {
				Id: id
			}
		});
	}

	async GetUserByEmail(email: string): Promise<User> {
		return this.User.findOne({
			where: {
				Email: email
			}
		});
	}
}
