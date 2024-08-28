import { Module } from '@nestjs/common';
import { DataModule } from '@App/Data/Data.Module';
import { CommonModule } from '@App/Common/Common.Module';
import { AppConfig } from '@App/Config/App.Config';
import { CartRepository } from './Cart.Repository';
import { CartController } from './Cart.Controller';
import { CartService } from './Cart.Service';

@Module({
	imports: [DataModule, CommonModule],
	controllers: [CartController],
	providers: [AppConfig, CartService, CartRepository]
})
export class CartModule {}
