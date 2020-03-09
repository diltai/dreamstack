import { AcademicModulesModule } from '@dilta/academics';
import { AdminModule } from '@dilta/admin';
import { AuthorizationDBModule, AuthorizationModule, LiensceModule } from '@dilta/authentication';
import { PresetModule } from '@dilta/preset';
import { MicroServiceToken } from '@dilta/util';
import { Logger, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({}),
    ClientsModule.register([{ name: MicroServiceToken, transport: Transport.TCP }]),
    AdminModule,
    PresetModule,
    AuthorizationDBModule,
    AuthorizationModule,
    AcademicModulesModule,
    LiensceModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule { }
