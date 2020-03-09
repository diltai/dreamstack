import { Manager as IManager } from '@dilta/platform-shared';
import { EntityBaseModel } from '@dilta/util';
import { Entity, Column } from 'typeorm';
import { IsString } from 'class-validator';

/**
 * school managers biodata's record stored in the database's interface
 */
@Entity()
export class Manager extends EntityBaseModel implements IManager {
    @Column('varchar')
    @IsString()
    propName: string;

    @Column('varchar')
    @IsString()
    propPhone: string;

    @Column('varchar')
    @IsString()
    propEmail: string;

    @Column('varchar')
    @IsString()
    sMName: string;

    @Column('varchar')
    @IsString()
    sMPhone: string;

    @Column('varchar')
    @IsString()
    sMEmail: string;

    @Column('varchar')
    @IsString()
    motto: string;
}
