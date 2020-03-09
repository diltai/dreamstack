import { ModelServiceBase } from '@dilta/util';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicSetting } from './academic-setting.entity';

@Injectable()
export class AcademicSettingService extends ModelServiceBase<AcademicSetting> {
    constructor(@InjectRepository(AcademicSetting) repo: Repository<AcademicSetting>) {
        super(repo);
    }
}
