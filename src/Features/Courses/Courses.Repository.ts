import { Injectable } from '@nestjs/common';
import { AppConfig, Config } from '@App/Config/App.Config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from '@App/Data/TypeOrmEntities/Course';
import { CoursesModels } from './Courses.Models';

@Injectable()
export class CoursesRepository {
	Config: Config;

	constructor(@InjectRepository(Course) private Course: Repository<Course>) { }

	async Getall(): Promise<Course[]> {
		return this.Course.find();
	}

	async GetById(id: number): Promise<Course> {
		return this.Course.findOne({
			where: {
				Id: id
			}
		});
	}

	async Create(Course: CoursesModels.ReqModel): Promise<Course> {
		const newCourse = this.Course.create({
			Name: Course.Name,
			Description: Course.Description,
			VideoPath: Course.VideoPath,
			FilePath: Course.FilePath,
			IsActive: true,
			IsDeleted: false
		});
		return await this.Course.save(newCourse);
	}

	async Update(id, course: CoursesModels.ReqModel): Promise<Course> {
		let updateCourse: Course = await this.Course.findOne({
			where: {
				Id: id
			}
		});

		updateCourse.Name = course.Name;
		updateCourse.Description = course.Description;
		updateCourse.VideoPath = course.VideoPath;
		updateCourse.FilePath = course.FilePath;
		updateCourse.IsActive = course.IsActive;
		updateCourse.IsDeleted = course.IsDeleted;

		return await this.Course.save(updateCourse);
	}

	async Delete(id): Promise<Course> {
		let updateCourse: Course = await this.Course.findOne({
			where: {
				Id: id
			}
		});

		updateCourse.IsActive = false;
		updateCourse.IsDeleted = true;

		return await this.Course.save(updateCourse);
	}
}
