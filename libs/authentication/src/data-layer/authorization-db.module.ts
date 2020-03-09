import { Module } from '@nestjs/common';
import { IdentityController } from './identity/identity.controller';
import { IdentityService } from './identity/identity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './identity/identity.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Auth])],
    controllers: [IdentityController],
    providers: [IdentityService],
})
export class AuthorizationDBModule { }
