import { PlatformShared, SchoolEncryptedData } from '@dilta/platform-shared';
import { awaitTo } from '@dilta/util';
import { Injectable, Logger } from '@nestjs/common';
import { deletePassword, getPassword, setPassword } from 'keytar';

/** the appicaton name on the platform */
export const APPLICATION_NAME = PlatformShared.ApplicationName;

/** the school liensce  key account */
export const APPLICATION_SCHOOL_KEY = `${APPLICATION_NAME}:SCHOOL:LIENSCEKEY`;

@Injectable()
export class Keytar {
  constructor(private logger: Logger) {}

  /**
   * saves the liensce key to open the application and to
   * confirm it's validity
   *
   * @param {SchoolEncryptedData} key encrypted liensce key for the application
   * @returns
   */
  async saveLiensceKey(key: SchoolEncryptedData): Promise<SchoolEncryptedData> {
    this.logger.debug(`saveLiensceKey(key): saving program liensce key to os keystore`);
    await awaitTo(
      setPassword(APPLICATION_NAME, APPLICATION_SCHOOL_KEY, JSON.stringify(key)),
    );
    return key;
  }

  /**
   * retrieves the application liensce key for the application
   *
   * @returns
   */
  async liensceKey(): Promise<SchoolEncryptedData> {
    this.logger.debug(`retriving the program liensce key`);
    return JSON.parse(await getPassword(APPLICATION_NAME, APPLICATION_SCHOOL_KEY));
  }

  /**
   * deletes the save liensce key for the application
   *
   * @returns
   */
  deleteLiensceKey() {
    this.logger.debug(`deleting the liensceKey from the keystore`);
    return deletePassword(APPLICATION_NAME, APPLICATION_SCHOOL_KEY);
  }
}

export const SavingLiensceKeyError = new Error(
  ' Error while Setting liensce Key ',
);

// TODO: better error validation for expected operations
/** error displayed if the liensce is not found in the database */
export const keyNotFoundError = new Error(
  `liensce key for the application not found`,
);
