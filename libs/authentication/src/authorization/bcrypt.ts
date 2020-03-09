import * as bcrypt from 'bcrypt';
import { Injectable, Logger } from '@nestjs/common';


@Injectable()
export class BcryptSecurity {
  /** salt used for the encryption and decryption */
  private salt = bcrypt.genSalt(10);

  constructor(private logger: Logger) {}
  /**
   * validates the password by comparing the store hash  to the password
   *
   * @param {string} hash
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  async validatePassword(hash: string, password: string): Promise<boolean> {
    this.logger.debug(`validating text password to hash`);
    if (typeof hash !== 'string' || typeof password !== 'string') {
      throw missingValidatePasswordParameters;
    }
    return await bcrypt.compare(password, hash);
  }

  /**
   * takes a password and returns it hashed encryption
   *
   * @param {any} password
   * @returns {Promise<string>}
   */
  async hashPassword(password): Promise<string> {
    this.logger.debug(`converting password text to hash`);
    if (typeof password !== 'string') {
      throw invalidPasswordParameter;
    }
    return await bcrypt.hash(password, await this.salt);
  }
}

/** error thrown when either hash or password is invalid */
export const missingValidatePasswordParameters = new Error(`missing
paramaters to validate the passowrd: expected hash and password to be of string type`);

/** error thrown for innvalid password */
export const invalidPasswordParameter = new Error(`invalid password passed, password should be a
type of string`);
