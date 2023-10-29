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
			from: 'techwizzjoes@gmail.com',
			to: directedto.Email,
			subject: 'Welcome to Our Website',
			html: `<h3>Hello ${directedto.FirstName}</h3>
			<h2>we are here to know your conceren</h2>
			 ${directedto.Descriabtion}`
		};

		try {
			const result = await this.EmailSenderService.SendWelcomeMail(mailOptions);
			return result;
		} catch (error) {
			throw new Error(error);
		}
	}
}
