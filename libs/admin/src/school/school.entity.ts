import { School as ISchool, SchoolPreset } from '@dilta/platform-shared';
import { EntityBaseModel } from '@dilta/util';
import { Column, Entity } from 'typeorm';
import { IsString, IsEmail, IsOptional } from 'class-validator';

/**
 * School biodata record stored in the database's interface
 *
 */
@Entity()
export class School extends EntityBaseModel implements ISchool {
    @Column('varchar')
    @IsOptional()
    logo?: string;

    @Column('varchar')
    @IsString()
    name: string;

    @Column('varchar')
    @IsEmail()
    @IsOptional()
    email?: string;

    @Column('varchar')
    @IsString()
    description: string;

    @Column('varchar')
    @IsString()
    category: keyof SchoolPreset;

    @Column('varchar')
    @IsString()
    address: string;

    @Column('varchar')
    @IsString()
    town: string;

    @Column('varchar')
    @IsString()
    state: string;

    @Column('varchar')
    @IsString()
    globalId: string;
}
