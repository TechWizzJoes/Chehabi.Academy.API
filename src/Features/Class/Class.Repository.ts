import { Injectable } from '@nestjs/common';
import { AppConfig, Config } from '@App/Config/App.Config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from '@App/Data/TypeOrmEntities/Class';
import { ClassModels } from './Class.Models';

@Injectable()
export class ClassRepository {
	Config: Config;

	constructor(@InjectRepository(Class) private Class: Repository<Class>) {}

	async Getall(): Promise<Class[]> {
		return this.Class.find();
	}

	async GetById(id: number): Promise<Class> {
		return this.Class.findOne({
			where: {
				Id: id
			}
		});
	}

	async Create(Class: ClassModels.ReqModel): Promise<Class> {
		const newClass = this.Class.create({
			StartDate: Class.StartDate,
			EndDate: Class.EndDate,
			MaxCapacity: Class.MaxCapacity,
			Period: Class.Period,
			CurrentIndex: Class.CurrentIndex,
			IsActive: true,
			IsDeleted: false,
			Users: Class.Users
		});
		return await this.Class.save(newClass);
	}

	async Update(id, Class: ClassModels.ReqModel): Promise<Class> {
		let updateClass: Class = await this.Class.findOne({
			where: {
				Id: id
			}
		});

		updateClass.StartDate = Class.StartDate;
		updateClass.EndDate = Class.EndDate;
		updateClass.MaxCapacity = Class.MaxCapacity;
		updateClass.Period = Class.Period;
		updateClass.CurrentIndex = Class.CurrentIndex;
		updateClass.IsActive = Class.IsActive;
		updateClass.IsDeleted = Class.IsDeleted;
		updateClass.Users = Class.Users;

		return await this.Class.save(updateClass);
	}

	async Delete(id): Promise<Class> {
		let updateClass: Class = await this.Class.findOne({
			where: {
				Id: id
			}
		});

		updateClass.IsActive = false;
		updateClass.IsDeleted = true;

		return await this.Class.save(updateClass);
	}
}
