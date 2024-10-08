import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { EmailSenderService } from '@App/Features/EmailSender/EmailSender.Service';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { EmailSenderModels } from './EmailSender.Models';
import { RefreshTokenGuard } from '@App/Common/Auth/RefreshToken.Guard';

@ApiTags('EmailSender')
@Controller('emailsender')
export class EmailSenderController {
	constructor(private EmailSenderService: EmailSenderService) {}

	@Post('send-welcome')
	@ApiBody({ type: EmailSenderModels.DirectedTo })
	async sendWelcomeEmail(@Body() directedto: EmailSenderModels.DirectedTo): Promise<any> {
		const mailOptions = {
			from: 'info@chehabi-academy.com',
			to: directedto.Email,
			subject: 'Welcome to Our Website',
			html: `<div style="display: flex; flex-direction: column; align-items: center; text-align: center;"> 
			<img src="path/to/your/logo.png" alt="Logo" style="width: 100px; height: 100px;">
			<h1>Welcome to Our Website</h1>
			<h2>Hello ${directedto.FirstName} ${directedto.LastName}</h2>
			<h3>We are here to know your concern about:</h3>
			<h3>${directedto.Description}</h3>	</div>`
		};
		// console.log(mailOptions);
		// try {
		const result = await this.EmailSenderService.SendWelcomeMail(mailOptions);
		return { result: result };
		// } catch (error) {
		// 	throw new Error(error);
		// }
	}
}
