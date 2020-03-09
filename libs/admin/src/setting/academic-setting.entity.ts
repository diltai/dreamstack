import { AcademicSetting as IAcademic, GradingConfig, RecordSheetConfig } from '@dilta/platform-shared';
import { EntityBaseModel } from '@dilta/util';
import { IsDefined } from 'class-validator';
import { Column, Entity } from 'typeorm';

/**
 * School biodata record stored in the database's interface
 *
 */
@Entity()
export class AcademicSetting extends EntityBaseModel implements IAcademic {
    @Column('simple-json')
    @IsDefined()
    record: RecordSheetConfig;

    @Column('simple-json')
    @IsDefined()
    grade: GradingConfig;
}
