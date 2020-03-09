import { ApiFormat, failureResponse, successResponse } from '@dilta/platform-shared';
import { MicroServiceToken } from '@dilta/util';
import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(MicroServiceToken) private readonly client: ClientProxy,
    private log: Logger,
  ) {

  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/api/actions')
  async action(@Body() body: ApiFormat) {
    try {
      console.log(body);
      const res = await this.client.send(body.action, body.data).toPromise();
      return successResponse(body.id, res);
    } catch (error) {
      return failureResponse(body.id, error);
    }
  }
}
