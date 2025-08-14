import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GetUserIfAnyGuard extends AuthGuard('getuser') {
    handleRequest(err, user, info) {
        // If there's an actual JWT error (invalid token), you can choose to throw or ignore
        if (err || info) {
            // No token or invalid token → treat as public access
            return null;
        }
        return user;
    }
}
