import { Module } from '@nestjs/common';
import { DataModule } from '@App/Data/Data.Module';
import { CommonModule } from '@App/Common/Common.Module';
import { AppConfig } from '@App/Config/App.Config';
import { WhatsNewRepository } from './WhatsNew.Repository';
import { WhatsNewController } from './WhatsNew.Controller';
import { WhatsNewService } from './WhatsNew.Service';

@Module({
	imports: [DataModule, CommonModule],
	controllers: [WhatsNewController],
	providers: [AppConfig, WhatsNewService, WhatsNewRepository],
	exports: [WhatsNewService, WhatsNewRepository]
})
export class WhatsNewModule {}
