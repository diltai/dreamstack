import { Injectable } from '@nestjs/common';
import { Manager } from './manager.entity';
import { ModelServiceBase } from '@dilta/util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ManagerService extends ModelServiceBase<Manager> {
    constructor(@InjectRepository(Manager) repo: Repository<Manager>) {
        super(repo);
    }
}
