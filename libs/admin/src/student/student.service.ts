import { Injectable } from '@nestjs/common';
import { Student } from './student.entity';
import { ModelServiceBase } from '@dilta/util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StudentService extends ModelServiceBase<Student> {
    constructor(@InjectRepository(Student) repo: Repository<Student>) {
        super(repo);
    }
}
