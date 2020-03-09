import { Parent as IParent, ParentRelationship } from '@dilta/platform-shared';
import { EntityBaseModel } from '@dilta/util';
import { Entity, Column } from 'typeorm';
import { IsString, IsEnum, IsOptional } from 'class-validator';

/**
 * student parent biodata's record stored in the database's interface
 */
@Entity()
export class Parent extends EntityBaseModel implements IParent {
    @Column('varchar')
    @IsString()
    phoneNo: string;

    @Column('varchar')
    @IsString()
    name: string;

    @Column('varchar')
    @IsEnum(ParentRelationship)
    relationship: ParentRelationship;

    @Column('varchar')
    @IsString()
    homeAddress: string;

    @Column('varchar')
    @IsString()
    @IsOptional()
    workAddress?: string;

    @Column('varchar')
    @IsString()
    @IsOptional()
    email?: string;

    @Column('varchar')
    @IsString()
    profession: string;

    @Column('varchar')
    @IsString()
    workcategory: string;

    @Column('varchar')
    @IsString()
    town: string;

    @Column('varchar')
    @IsString()
    state: string;
}
