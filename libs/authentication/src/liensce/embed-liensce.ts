import * as platformShared from '@dilta/platform-shared';
import { MicroServiceToken } from '@dilta/util';
import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { isBefore } from 'date-fns';
import { Keytar } from './keys.program';
import { LiensceSecurity } from './liensce';

@Controller()
export class EmbededLiensceService {
  constructor(
    private keytar: Keytar,
    @Inject(MicroServiceToken) private net: ClientProxy,
    private lsc: LiensceSecurity,
  ) {}

  /**
   * Checks if Liensce is Valid;
   *
   * @param {platformShared.SchoolEncryptedData} secret
   * @memberof EmbededLiensceService
   */
  isLiensceVaild(secret: platformShared.SchoolEncryptedData) {
    if (isBefore(Date.now(), secret.expiretimestamp)) {
      throw liensceExpiredError;
    }
  }

  /**
   * Retrives the currently saved Liensce key
   *
   * @memberof EmbededLiensceService
   */
  @MessagePattern(platformShared.LIENSCE_KEY.Retrieve)
  async currentLiensce() {
    const schoolEncrypt = await this.keytar.liensceKey();
    this.isLiensceVaild(schoolEncrypt);
    return schoolEncrypt;
  }

  /**
   * saves and update the liensce key
   *
   * @memberof EmbededLiensceService
   */
  @MessagePattern(platformShared.LIENSCE_KEY.Update)
  async saveLiensce([token]: [string]) {
    const schoolDetails = await this.verifyLiensce([token]);
    const secret = await this.keytar.saveLiensceKey(schoolDetails);
    this.isLiensceVaild(secret);
    // save school details if platform is desktop
    if (process.env.PLATFORM === platformShared.Platform.Desktop) {
      await this.net.send<platformShared.School>(
        platformShared.modelActionFormat(platformShared.EntityNames.School,
        platformShared.ModelOperations.Create), [secret.school]).toPromise();
    }
    return secret;
  }

  /**
   * verifes the liense key
   *
   * @param {*} token
   * @returns
   * @memberof EmbededLiensceService
   */
  @MessagePattern(platformShared.LIENSCE_KEY.Decrypt)
  verifyLiensce([token]: [string]) {
    return new Promise<platformShared.SchoolEncryptedData>((resolve, reject) => {
      try {
        resolve(this.lsc.decryptLiensce([token]));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * checks for the limit of users that remains for a liensce extension
   *
   * @param {string} schoolId
   * @param {platformShared.Boque} boque
   * @returns
   * @memberof EmbededLiensceService
   */
  async validateLiensceUsage(schoolId: string, boque: platformShared.Boque) {
    const { Graduated, Left } = platformShared.SpecialCasesPreset;
    const { data } = await this.net.send<platformShared.FindResponse<platformShared.Student>>(
      platformShared.modelActionFormat(platformShared.EntityNames.Student,
      platformShared.ModelOperations.Find), [{ school: schoolId }]).toPromise();
    const students = data.filter(
      student => student.class !== Graduated && student.class !== Left,
    );
    const allowed = boque.allowed + 1;
    if (students.length > allowed + 1) {
      return {
        error: liensceExpiredError,
      };
    }
    return {
      warn: liensceLimitWarn(students.length, boque),
    };
  }

  @MessagePattern(platformShared.LIENSCE_KEY.Delete)
  deleteLiensceKey() {
    return this.keytar.deleteLiensceKey();
  }
}

export const liensceExpiredError = new Error(
  `Liensce has expired, Renew Liensce or Contact program Adminstartor for More Details`,
);

export const liensceLimitError = ({ paid, allowed }: platformShared.Boque) =>
  new Error(
    `Program Liensce was paid for ${paid} and has a max limit ${allowed} of students please upgrade liensce`,
  );

export const liensceLimitWarn = (count: number, { allowed, paid }: platformShared.Boque) =>
  count > allowed - 25
    ? `liensce allows a maximum of ${allowed} while ${paid} students was paid for.
    Your current usage while require an upgrade soon`
    : false;
