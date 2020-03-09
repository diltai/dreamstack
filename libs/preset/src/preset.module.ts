import { MicroServiceToken } from '@dilta/util';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PresetService } from './preset.service';

@Module({
  controllers: [PresetService],
  imports: [
    ClientsModule.register([{ name: MicroServiceToken, transport: Transport.TCP }]),
  ],
})
export class PresetModule {

}
