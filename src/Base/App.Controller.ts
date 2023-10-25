import { Body, Controller, Get, Param, Post, Req, UseGuards, Delete, Put, Query } from '@nestjs/common';
import { ApiBody, ApiTags, ApiOperation, ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@App/Config/App.Config';
import { spawn, exec } from 'child_process';

class command1 {
	@ApiProperty()
	command!: string;
}
@Controller('api')
export class AppController {
	constructor(private AppConfig: AppConfig) {}

	@Get()
	getHello() {
		const myconfig = this.AppConfig.Config;

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
