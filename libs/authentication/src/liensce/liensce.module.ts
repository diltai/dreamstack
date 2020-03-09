import { MicroServiceToken } from '@dilta/util';
import { Logger, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LiensceCrypto } from './crypto';
import { EmbededLiensceService } from './embed-liensce';
import { Keytar } from './keys.program';
import { LiensceSecurity } from './liensce';

@Module({
  imports: [
    ClientsModule.register([{
      name: MicroServiceToken,
      transport: Transport.TCP,
    }]),
  ],
  controllers: [EmbededLiensceService],
  providers: [LiensceCrypto, Keytar, LiensceSecurity, Logger],
})
export class LiensceModule { }
