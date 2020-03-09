import { MicroServiceToken } from '@dilta/util';
import { Logger, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthorizerController } from './authorizer';
import { BcryptSecurity } from './bcrypt';
import { SecurityValidator } from './validator';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: MicroServiceToken,
                transport: Transport.TCP,
            },
        ]),
    ],
    controllers: [AuthorizerController],
    providers: [BcryptSecurity, SecurityValidator, Logger],
})
export class AuthorizationModule { }

