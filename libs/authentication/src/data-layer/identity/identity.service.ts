import { Injectable } from '@nestjs/common';
import { Auth } from './identity.entity';
import { ModelServiceBase } from '@dilta/util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class IdentityService extends ModelServiceBase<Auth> {
    constructor(@InjectRepository(Auth) repo: Repository<Auth>) {
        super(repo);
    }
}
