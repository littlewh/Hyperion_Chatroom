/* eslint-disable */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
const rabbitmq= require('./RabbitMQ')

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return rabbitmq.sendCode();
  }
}
