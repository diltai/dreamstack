import { LiensceGenerator } from './script/script_liensce';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LiensceCrypto {
  /**
   * encrypts the liensce key for a liensce key
   *
   * @export
   * @returns
   */
  encrypt(target: any): string {
    if (typeof target !== 'string') {
      target = JSON.stringify(target);
    }
    return LiensceGenerator.encryptLiensce(target);
  }

  /**
   * decrypts the liensce key back to the original payload
   * note that it returns undefined for failed operation
   *
   * @export
   * @template T
   * @returns
   */
  decrypt<T>(token: string) {
    const decrypted = LiensceGenerator.decryptLiensce(token);
    try {
      return JSON.parse(decrypted) as T;
    } catch (e) {
      return decrypted as string;
    }
  }
}
