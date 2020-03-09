import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicSettingController } from './academic-setting.controller';
import { AcademicSetting } from './academic-setting.entity';
import { AcademicSettingService } from './academic-setting.service';

@Module({
    imports: [TypeOrmModule.forFeature([AcademicSetting])],
    controllers: [AcademicSettingController],
    providers: [AcademicSettingService],
})
export class AcademicSettingModule {}
