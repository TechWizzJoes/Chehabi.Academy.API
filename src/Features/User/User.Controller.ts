import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Req,
	UseGuards,
	Delete,
	Put,
	Res,
	UseInterceptors,
	UploadedFile
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {} from '@App/Features/Account/Account.Service';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { UserModels } from './User.Models';
import { RefreshTokenGuard } from '@App/Common/Auth/RefreshToken.Guard';
import { UserService } from './User.Service';
import { extname, join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiTags('User')
@Controller('user')
export class UserController {
	constructor(private UserService: UserService) {}

	@Get('')
	@UseGuards(AuthenticatedGuard)
	GetProfileInfo(): Promise<UserModels.UserResModel> {
		return this.UserService.GetProfileInfo();
	}

	@Put('')
	@UseGuards(AuthenticatedGuard)
	@ApiBody({ type: UserModels.UserReqModel })
	Update(@Body() user: UserModels.UserReqModel): Promise<UserModels.UserResModel> {
		return this.UserService.UpdateUser(user);
	}

	@Put('preference')
	@UseGuards(AuthenticatedGuard)
	@ApiBody({ type: UserModels.UserReqModel })
	UpdateUserPreference(@Body() userPrefrence: UserModels.UserPrefrenceReqModel): Promise<UserModels.UserResModel> {
		return this.UserService.UpdateUserPreference(userPrefrence);
	}

	@Post('/upload/image/:id')
	@UseGuards(AuthenticatedGuard)
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: `./uploads/images/profiles`,
				filename: (req, file, callback) => {
					const uniquName = req.params.id;
					const ext = extname(file.originalname);
					const fileName = uniquName + ext;
					callback(null, fileName);
				}
			})
		})
	)
	Upload(@UploadedFile() file: Express.Multer.File): Promise<{}> {
		return this.UserService.Upload(file.path);
	}

	@Get('uploads/images/profiles/:image')
	GetUserImage(@Param('image') imageName: any, @Res() res: any) {
		return res.sendFile(join(process.cwd(), 'uploads/images/profiles/' + imageName));
	}
}
