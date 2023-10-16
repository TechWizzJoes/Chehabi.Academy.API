import { Module } from '@nestjs/common';

import { CommonModule } from '@App/Common/Common.Module';
import { AppConfig } from '@App/Config/App.Config';
// import { DbConnections } from '@App/Data/DbConnections';

@Module({
	imports: [CommonModule],
	providers: [AppConfig],
	exports: []
})
export class DataModule {}
