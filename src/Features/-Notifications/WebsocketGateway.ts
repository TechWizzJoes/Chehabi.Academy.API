import { Server, Socket } from 'socket.io';

export class NotificationsWebSocketGateway {
	server: Server;
	private connectedUsers: Map<string, string> = new Map(); // Maps userId to socketId

	Init() {
		this.server.on('connection', (socket: Socket) => {
			this.handleConnection(socket);

			socket.on('disconnect', (reason) => {
				this.handleDisconnect(socket, reason);
			});
		});
	}

	handleConnection(socket: Socket) {
		console.log('on connection');
		const userId = socket.handshake.query.userId as string;
		const token = socket.handshake.auth.token;
		console.log(token);

		if (!token) {
			socket.disconnect();
		}
		if (userId) {
			this.connectedUsers.set(userId, socket.id);
			// console.log(this.connectedUsers);
		}
	}

	handleDisconnect(socket: Socket, reason: string) {
		console.log('on disconnection');
		console.log('reason', reason);
		const userId = Array.from(this.connectedUsers.entries()).find(([, socketId]) => socketId === socket.id)?.[0];
		if (userId) {
			this.connectedUsers.delete(userId);
		}
		console.log(this.connectedUsers);
	}

	notifyUser(userId: number, message: string) {
		const socketId = this.connectedUsers.get(userId.toString());
		if (socketId) {
			this.server.to(socketId).emit('notification', { message });
		}
	}
}
