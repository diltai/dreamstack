import * as platformShared from '@dilta/platform-shared';
import { MicroServiceToken } from '@dilta/util';
import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';

@Controller()
export class AcademicPromotion {
  constructor(@Inject(MicroServiceToken) private net: ClientProxy) { }

  @MessagePattern(platformShared.AcademicActions.PromoteClass)
  async promoteClass([sheet]: [platformShared.ClassPromotion]) {
    const { data } = await this.net.send<platformShared.FindResponse<platformShared.Student>>(
      platformShared.modelActionFormat(platformShared.EntityNames.Student,
        platformShared.ModelOperations.Find), [{ class: sheet.level }]).toPromise();
    const histroys = await Promise.all(
      data.map(
        async student =>
          await this.promoteStudent([{ ...sheet, studentId: student.id }]),
      ),
    );
    return histroys;
  }

  @MessagePattern(platformShared.AcademicActions.PromoteStudent)
  async promoteStudent([sheet]: [platformShared.PromotionSheet]) {
    const newLevel = sheet.newLevel || platformShared.levelPromotion(sheet.level).nextLevel;
    let history = await this.retrieveSessionPromotion([sheet]);
    if (history.newLevel !== newLevel) {
      // might fail because of  rpc -> []
      history = await this.net.send<platformShared.Promotion>(
        platformShared.modelActionFormat(platformShared.EntityNames.Promotion,
          platformShared.ModelOperations.Update)
        , [history.id, {
          ...history,
          newLevel,
        }]).toPromise();
    }
    return history;
  }

  @MessagePattern(platformShared.AcademicActions.StudentPromotion)
  async retrieveSessionPromotion([{
    level,
    session,
    studentId,
  }]: [platformShared.PromotionSheet]) {
    let history: platformShared.Promotion = await this.net.send<platformShared.Promotion>(
      platformShared.modelActionFormat(platformShared.EntityNames.Promotion,
        platformShared.ModelOperations.Retrieve),
      [{
        level,
        session,
        studentId,
      }]).toPromise();
    if (!history) {
      history = await this.net.send<platformShared.Promotion>(
        platformShared.modelActionFormat(platformShared.EntityNames.Promotion,
          platformShared.ModelOperations.Create),
        [{
          level,
          session,
          studentId,
          newLevel: level,
        }]).toPromise();
    }
    return history;
  }
}
