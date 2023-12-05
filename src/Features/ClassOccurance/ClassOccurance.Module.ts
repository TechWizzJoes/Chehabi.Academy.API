import { Module } from '@nestjs/common';
import { DataModule } from '@App/Data/Data.Module';
import { CommonModule } from '@App/Common/Common.Module';
import { AppConfig } from '@App/Config/App.Config';
import { ClassOccuranceRepository } from './ClassOccurance.Repository';
import { ClassOccuranceController } from './ClassOccurance.Controller';
import { ClassOccuranceService } from './ClassOccurance.Service';

@Module({
	imports: [DataModule, CommonModule],
	controllers: [ClassOccuranceController],
	providers: [AppConfig, ClassOccuranceService, ClassOccuranceRepository]
})
export class ClassOccuranceModule {}
