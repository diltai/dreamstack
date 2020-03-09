import { Module } from '@nestjs/common';
import { ManagerModule } from './manager/manager.module';
import { ParentManagementModule } from './parent/parent.module';
import { SchoolManagmentModule } from './school/school.module';
import { AcademicSettingModule } from './setting/academic-setting.module';
import { StaffManagementModule } from './staff/staff.module';
import { StudentManagementModule } from './student/student.module';

@Module({
  imports: [
    SchoolManagmentModule,
    ManagerModule,
    StaffManagementModule,
    StudentManagementModule,
    ParentManagementModule,
    AcademicSettingModule,
  ],
  exports: [],
})
export class AdminModule {}
