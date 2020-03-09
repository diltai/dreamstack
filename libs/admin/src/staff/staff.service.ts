import { Injectable } from '@nestjs/common';
import { Staff } from './staff.entity';
import { ModelServiceBase } from '@dilta/util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StaffService extends ModelServiceBase<Staff> {
    constructor(@InjectRepository(Staff) repo: Repository<Staff>) {
        super(repo);
    }
}
