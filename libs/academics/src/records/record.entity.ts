import { Record as IRecord, SchoolClass, TermPreset } from '@dilta/platform-shared';
import { EntityBaseModel } from '@dilta/util';
import { IsDefined } from 'class-validator';
import { Column, Entity } from 'typeorm';

/**
 * school Records biodata's record stored in the database's interface
 */
@Entity()
export class Record extends EntityBaseModel implements IRecord {
    @Column('varchar')
    @IsDefined()
    subject: string;

    @Column('varchar')
    @IsDefined()
    teacherId: string;

    @Column('varchar')
    @IsDefined()
    class: SchoolClass;

    @Column('varchar')
    @IsDefined()
    session: string;

    @Column('varchar')
    @IsDefined()
    term: TermPreset;
}
