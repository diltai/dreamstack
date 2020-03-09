import { Module } from '@nestjs/common';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manager } from './manager.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Manager])],
    controllers: [ManagerController],
    providers: [ManagerService],
})
export class ManagerModule {}
