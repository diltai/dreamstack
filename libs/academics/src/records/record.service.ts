import { ModelServiceBase } from '@dilta/util';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from './record.entity';

@Injectable()
export class RecordService extends ModelServiceBase<Record> {
    constructor(@InjectRepository(Record) repo: Repository<Record>) {
        super(repo);
    }
}
