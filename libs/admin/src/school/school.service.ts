import { Injectable } from '@nestjs/common';
import { ModelServiceBase } from '@dilta/util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from './school.entity';

@Injectable()
export class SchoolService extends ModelServiceBase<School> {
    constructor(@InjectRepository(School) repo: Repository<School>) {
        super(repo);
    }
}
