import { Body, Controller, Get, Param, Post, Req, UseGuards, Delete, Put, Query } from '@nestjs/common';
import { ApiBody, ApiTags, ApiOperation, ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@App/Config/App.Config';
import { spawn, exec } from 'child_process';
import { NotificationsWebSocketGateway } from '@App/Features/-Notifications/WebsocketGateway';

class command1 {
	@ApiProperty()
	command!: string;
}
@Controller()
export class AppController {
	constructor(private AppConfig: AppConfig, private NotificationsWebSocketGateway: NotificationsWebSocketGateway) {}

	@Get()
	getHello() {
		const myconfig = this.AppConfig.Config;
		this.NotificationsWebSocketGateway.notifyUser(9, ` payment processed and is now available!`);

		return 'Chehabi academy api Works!';

		//return myconfig;
	}

	@Get('/test')
	gettest() {
		return 'api is working!';
	}

	@Post()
	@ApiBody({ type: command1 })
	@ApiOperation({ summary: 'Execute a shell command with a POST request' })
	@ApiOkResponse({ description: 'Shell command executed successfully' })
	async executeShellCommandPost(@Body('command') command: string): Promise<string> {
		return new Promise((resolve, reject) => {
			// Use the exec method to run the shell command
			exec(command, (error, stdout, stderr) => {
				if (error) {
					console.error(`Error executing shell command: ${error.message}`);
					reject(`Error executing shell command: ${error.message}`);
				} else {
					console.log(`Shell command executed successfully: ${stdout}`);
					resolve(stdout);
				}
			});
		});
	}
}
