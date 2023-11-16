import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from '@App/Features/-Notifications/Notifications.Service';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { NotificationsModels } from './Notifications.Models';
import { RefreshTokenGuard } from '@App/Common/Auth/RefreshToken.Guard';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
	constructor(private NotificationsService: NotificationsService) {}

	@Post('subscribe')
	SubscribeClient(@Body() subObject: any): Promise<any> {
		return this.NotificationsService.SubscribeClient(subObject);
	}

	@Get('publish')
	Publish(): Promise<any> {
		return this.NotificationsService.Publish();
	}
}
