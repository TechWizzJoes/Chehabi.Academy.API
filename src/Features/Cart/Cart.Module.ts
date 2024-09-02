import { Module } from '@nestjs/common';
import { DataModule } from '@App/Data/Data.Module';
import { CommonModule } from '@App/Common/Common.Module';
import { AppConfig } from '@App/Config/App.Config';
import { CartRepository } from './Cart.Repository';
import { CartController } from './Cart.Controller';
import { CartService } from './Cart.Service';
import { ClassModule } from '../Class/Class.Module';
import { CoursesModule } from '../Courses/Courses.Module';
import { StripeService } from './stripe.service';

@Module({
	imports: [DataModule, CommonModule, ClassModule, CoursesModule],
	controllers: [CartController],
	providers: [AppConfig, CartService, CartRepository, StripeService]
})
export class CartModule {}
