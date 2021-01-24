import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from 'src/users.service';

const dotenv = require('dotenv');
dotenv.config()

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    private readonly usersService: UsersService
  ) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        passReqToCallback: true,
        secretOrKey: process.env.JWT_SECRET,
      }
    );
  }

  public async validate(req: any, payload: any, done: Function) {
    const user = this.usersService.findUser(payload.email);
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    req.body.user = user
    done(null, user);
  }

}
