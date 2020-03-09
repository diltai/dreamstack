import { BaseModel, School } from '@dilta/platform-shared';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class EntityBaseModel implements BaseModel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar')
    hash: string;

    @Column('double')
    createdAt: number;

    @Column('double')
    updatedAt: number;

    @Column('varchar', { nullable: true })
    school?: string | Partial<School>;
}
