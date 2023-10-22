import { Module } from '@nestjs/common';
import { DataModule } from '@App/Data/Data.Module';
import { CommonModule } from '@App/Common/Common.Module';
import { AppConfig } from '@App/Config/App.Config';
import { ClassRepository } from './Class.Repository';
import { ClassController } from './Class.Controller';
import { ClassService } from './Class.Service';

@Module({
	imports: [DataModule, CommonModule],
	controllers: [ClassController],
	providers: [AppConfig, ClassService, ClassRepository]
})
export class ClassModule {}
