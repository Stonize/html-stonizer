import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlgorandService } from './algorand.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './passport/jwt.strategy';
import { UsersService } from './users.service';

const dotenv = require('dotenv');
dotenv.config();

@Module({
  providers: [AppService, AlgorandService, UsersService, JwtStrategy],
  controllers: [AppController],
  imports: [
    PassportModule,
    JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    })
  ],
})
export class AppModule {}
