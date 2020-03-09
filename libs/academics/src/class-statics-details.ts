import * as platformShared from '@dilta/platform-shared';
import { MicroServiceToken } from '@dilta/util';
import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';

@Controller()
export class ClassStaticsDetails {
  constructor(@Inject(MicroServiceToken) private net: ClientProxy) {}

  @MessagePattern(platformShared.AcademicActions.ClassStatDetails)
  async collateDetails([schoolId]: [string]) {
    const { data } = await this.net.send<platformShared.FindResponse<platformShared.Student>>(
      platformShared.modelActionFormat(platformShared.EntityNames.Student,
      platformShared.ModelOperations.Find),
    [{  school: schoolId } as Partial<platformShared.Student>]).toPromise();
    return this.remapClassToText(this.classTotal(data));
  }

  classTotal(students: platformShared.Student[]) {
    const map = new Map<number, platformShared.GenderDistrubution>();
    students.forEach(student => {
      if (map.has(student.class)) {
        map.set(
          student.class,
          this.operateStat(student, map.get(student.class)),
        );
      } else {
        const stats: platformShared.GenderDistrubution = { female: 0, male: 0, total: 0 };
        map.set(student.class, this.operateStat(student, stats));
      }
    });
    return map;
  }

  remapClassToText(studentMap: Map<number, platformShared.GenderDistrubution>) {
    const details: platformShared.ClassDetailedStat[] = [];
    studentMap.forEach((stat, key) => {
      details.push({ ...stat, value: key, name: platformShared.schoolClassValueToKey(key) });
    });
    return details;
  }

  operateStat(student: platformShared.Student, stat: platformShared.GenderDistrubution) {
    if (student.gender.toLowerCase() === 'male') {
      stat.male += 1;
    } else {
      stat.female += 1;
    }
    stat.total += 1;
    return stat;
  }
}
