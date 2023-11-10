import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { EmailSenderService } from '@App/Features/EmailSender/EmailSender.Service';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { EmailSenderModels } from './EmailSender.Models';
import { RefreshTokenGuard } from '@App/Common/Auth/RefreshToken.Guard';

@ApiTags('EmailSender')
@Controller('EmailSender')
export class EmailSenderController {
	constructor(private EmailSenderService: EmailSenderService) {}

	@Post('send-welcome')
	@ApiBody({ type: EmailSenderModels.DirectedTo })
	async sendWelcomeEmail(@Body() directedto: EmailSenderModels.DirectedTo): Promise<string> {
		const mailOptions = {
			from: 'support@chehabi-academy.com',
			to: directedto.Email,
			subject: 'Welcome to Our Website',
			html: `<h1>Welcome to Our Website</h1>
			<h2>Hello ${directedto.FirstName} ${directedto.LastName}</h2>
			<h3>we are here to know your conceren about:</h3>
			<h3> ${directedto.Descriabtion} </h3>`
		};
		// console.log(mailOptions);
		try {
			const result = await this.EmailSenderService.SendWelcomeMail(mailOptions);
			return result;
		} catch (error) {
			throw new Error(error);
		}
	}
}
