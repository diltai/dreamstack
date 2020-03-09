import { AuthenticationLevels, Auth as IAuth } from '@dilta/platform-shared';
import { EntityBaseModel } from '@dilta/util';
import { Entity, Column } from 'typeorm';
import { IsDefined } from 'class-validator';

@Entity()
export class Auth extends EntityBaseModel implements IAuth {
    @Column('varchar', { unique: true })
    @IsDefined()
    username: string;

    @Column('varchar', { unique: true })
    @IsDefined()
    password: string;

    // @Column('enum', { enum: AuthenticationLevels})
    @Column('varchar')
    @IsDefined()
    level: AuthenticationLevels;
}
