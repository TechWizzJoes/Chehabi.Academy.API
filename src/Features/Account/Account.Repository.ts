import { Injectable } from '@nestjs/common';
import { AppConfig, Config } from '@App/Config/App.Config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@App/Data/TypeOrmEntities/User';
import { AccountModels } from './Account.Models';
import { UserModels } from '../User/User.Models';
@Injectable()
export class AccountRepository {
	Config: Config;

	constructor(@InjectRepository(User) private User: Repository<User>) {}

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

	async CreateUser(user: UserModels.MasterModel): Promise<User> {
		const newUser = this.User.create({
			FirstName: user.FirstName,
			LastName: user.LastName,
			Birthdate: user.Birthdate,
			IsActive: true,
			IsDeleted: false,
			Email: user.Email,
			Password: user.Password,
			IsAdmin: false,
			ProfilePicturePath: user.ProfilePicturePath
		});
		return await this.User.save(newUser);
	}

	async SaveUser(user: UserModels.MasterModel): Promise<User> {
		return await this.User.save(user);
	}
}
