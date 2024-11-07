import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from '@App/Features/-Notifications/Notifications.Service';
import { NotificationModels } from './Notifications.Models';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
	constructor(private NotificationsService: NotificationsService) {}

	// @Post('subscribe')
	// SubscribeClient(@Body() subObject: any): Promise<any> {
	// 	return this.NotificationsService.SubscribeClient(subObject);
	// }

	// @Get('publish')
	// Publish(): Promise<any> {
	// 	return this.NotificationsService.Publish();
	// }

	@Get('in-app')
	GetInApp(@Query('isRead') isRead: boolean, @Query('page') page: number): Promise<any> {
		return this.NotificationsService.GetInApp(isRead, page);
	}

	@Post('in-app/read')
	ReadItems(@Body() ids: number[]): Promise<any> {
		return this.NotificationsService.ReadItems(ids);
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
	async NotifyUser(
		@Body() { type, payload }: { type: string; payload: NotificationModels.NotificationPayload }
	): Promise<any> {
		return 'this.NotificationsService.NotifyUser(type, payload)';
	}
}
