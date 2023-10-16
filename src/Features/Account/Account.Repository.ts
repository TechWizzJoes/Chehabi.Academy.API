import { Injectable } from '@nestjs/common';
import * as mssql from 'mssql';
import { AppConfig, Config } from '@App/Config/App.Config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './Entities/User.Entity';
@Injectable()
export class AccountRepository {
	dbConn: mssql.ConnectionPool;
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
