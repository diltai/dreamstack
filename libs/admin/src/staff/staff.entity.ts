import { User, Auth, SchoolClass } from '@dilta/platform-shared';
import { EntityBaseModel } from '@dilta/util';
import { Entity, Column } from 'typeorm';
import { IsString, IsOptional } from 'class-validator';

/**
 * teachers biodata information recored stored in the database's interface
 *
 */
@Entity()
export class Staff extends EntityBaseModel implements User {
    @Column('varchar')
    @IsString()
    gender: string;

    @Column('varchar')
    @IsString()
    name: string;

    @Column('varchar')
    @IsString()
    phoneNo: string;

    @Column('varchar')
    @IsString()
    address: string;

    @Column('varchar')
    @IsString()
    image: string;

    @Column('varchar')
    @IsString()
    authId: string | Auth;

    @Column('varchar')
    @IsString()
    @IsOptional()
    class?: SchoolClass;

    @Column('varchar')
    @IsString()
    @IsOptional()
    subject?: string;

    @Column('varchar')
    @IsString()
    @IsOptional()
    phoneNos?: string;

    @Column('varchar')
    @IsString()
    @IsOptional()
    email?: string;

}
