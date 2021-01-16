import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlgorandService } from './algorand.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AlgorandService],
})
export class AppModule {}
