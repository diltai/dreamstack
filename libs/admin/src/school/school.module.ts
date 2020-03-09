import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { School } from './school.entity';

@Module({
    imports: [TypeOrmModule.forFeature([School])],
    controllers: [SchoolController],
    providers: [SchoolService],
})
export class SchoolManagmentModule {};
