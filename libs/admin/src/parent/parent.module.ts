import { Module } from '@nestjs/common';
import { ParentController } from './parent.controller';
import { ParentService } from './parent.service';
import { Parent } from './parent.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Parent])],
    controllers: [ParentController],
    providers: [ParentService],
})
export class ParentManagementModule { }
