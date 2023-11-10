import { ApiProperty } from '@nestjs/swagger';

export namespace EmailSenderModels {
	export class EmailSender {
		Service: 'gmail';
		Email: 'techwizzjoes@gmail.com';
		Password: 'rbyo phlw yjaj bwro';
		Subject: 'Hello New User';
	}

	export class DirectedTo {
		@ApiProperty()
		Email!: string;
		@ApiProperty()
		FirstName!: string;
		@ApiProperty()
		LastName!: string;
		@ApiProperty()
		Descriabtion!: string;
	}
}
