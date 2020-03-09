import { Student as IStudent, SchoolClass } from '@dilta/platform-shared';
import { EntityBaseModel } from '@dilta/util';
import { Entity, Column } from 'typeorm';
import { IsString, IsOptional } from 'class-validator';

/**
 * student biodata information recored stored in the database's interface
 *
 */
@Entity()
export class Student extends EntityBaseModel implements IStudent {

    @Column('varchar')
    @IsString()
    name: string;

    @Column('varchar')
    @IsString()
    class: SchoolClass;

    @Column('varchar')
    @IsString()
    gender: string;

    @Column('varchar')
    @IsString()
    dob: number;

    @Column('varchar')
    @IsString()
    @IsOptional()
    bloodgroup?: string;

    @Column('varchar')
    @IsString()
    @IsOptional()
    prevschool?: string;

    @Column('varchar')
    @IsString()
    parentPhone: number | string;

    @Column('varchar')
    @IsString()
    admissionNo: string;
}