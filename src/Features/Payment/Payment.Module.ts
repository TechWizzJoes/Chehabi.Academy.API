import { Module } from '@nestjs/common';
import { DataModule } from '@App/Data/Data.Module';
import { CommonModule } from '@App/Common/Common.Module';
import { AppConfig } from '@App/Config/App.Config';
import { PaymentController } from './Payment.Controller';
import { PaymentService } from './Payment.Service';
import { PaymentRepository } from './Payment.Repository';
import { NotificationsModule } from '../-Notifications/Notifications.Module';
import { UserModule } from '../User/User.Module';
import { CartModule } from '../Cart/Cart.Module';
import { StripeService } from './stripe.service';
import { ClassModule } from '../Class/Class.Module';

@Module({
	imports: [DataModule, CommonModule, NotificationsModule, UserModule, CartModule, ClassModule],
	controllers: [PaymentController],
	providers: [AppConfig, PaymentService, PaymentRepository, StripeService]
})
export class PaymentModule {}
