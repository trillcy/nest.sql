import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { log } from 'console';
import { fstat } from 'fs';
import { JwtService } from '@nestjs/jwt';

const ACCESS_TOKEN_KEY = "i;shgf;risfghsi'gh";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    console.log('guard');
    const request: Request = context.switchToHttp().getRequest();
    // console.log('17--guard', request.rawHeaders[1].split(' ')[1]);
    const token = request.headers.authorization
      ? request.headers.authorization.split(' ')[1]
      : null;
    console.log('24--guard', token);

    if (token) {
      request.user = this.jwtService.decode(token);
      return true;
    }
    request.user = { userId: null };
    return true;
    // throw new UnauthorizedException();
    // return false;
  }
}
