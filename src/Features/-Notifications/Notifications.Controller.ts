import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from '@App/Features/-Notifications/Notifications.Service';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { NotificationsModels } from './Notifications.Models';
import { RefreshTokenGuard } from '@App/Common/Auth/RefreshToken.Guard';
import { NotificationTemplateKey } from './NotificationTemplateKey';

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

	@Post('send-notification-email')
	@ApiOperation({ summary: 'Send a notification email' })
	@ApiBody({
		description: 'Send a notification email',
		schema: {
			type: 'object',
			properties: {
				type: {
					type: 'string',
					description: 'Type of the email notification',
					example: 'welcome_email'
				},
				payload: {
					type: 'object',
					properties: {
						Email: {
							type: 'string',
							description: 'Recipient email address',
							example: 'john.doe@example.com'
						},
						Placeholders: {
							type: 'object',
							additionalProperties: {
								type: 'string'
							},
							description: 'Dynamic placeholders to replace in the email template',
							example: {
								FirstName: 'John',
								LastName: 'Doe',
								Description: 'Welcome to our platform!'
							}
						}
					}
				}
			}
		}
	})
	async sendNotificationEmail(
		@Body() { type, payload }: { type: string; payload: NotificationsModels.NotificationPayload }
	): Promise<any> {
		return this.NotificationsService.sendNotificationEmail(type, payload);
	}
}
