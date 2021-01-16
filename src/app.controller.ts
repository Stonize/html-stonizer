import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestDto } from './request.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  tokenize(@Body() request: RequestDto) {
    return this.appService.tokenize(request);
  }

  @Post("/verify")
  verify(@Body() request: RequestDto) {
    return this.appService.verify(request);
  }

}
