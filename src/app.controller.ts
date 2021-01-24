import { Body, Controller, Get, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RequestDto } from './request.dto';

@ApiBearerAuth()
@Controller()
@UseInterceptors(LoggingInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/health")
  health() {
    return "OK"
  }  

  @Post()
  @UseGuards(JwtAuthGuard)
  tokenize(@Body() request: RequestDto) {
    return this.appService.tokenize(request);
  }

  @Post("/verify")
  @UseGuards(JwtAuthGuard)
  verify(@Body() request: any) {
    return this.appService.verify(request);
  }

}
