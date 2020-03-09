import { Injectable } from '@nestjs/common';
import { Parent } from './parent.entity';
import { ModelServiceBase } from '@dilta/util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ParentService extends ModelServiceBase<Parent> {
    constructor(@InjectRepository(Parent) repo: Repository<Parent>) {
        super(repo);
    }
}
