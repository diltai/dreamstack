import { createCipher, createDecipher } from 'crypto';
import { SchoolEncryptedData, LiensceSubscription } from '@dilta/platform-shared';
import { format, addYears } from 'date-fns';

enum Liensce {
  Algorithm = 'aes192',
  Password = 'random+passkey'
}

const { Algorithm, Password } = Liensce;

export class LiensceGenerator {
  /**
   * algorithm used to generate keys
   *
   * @static
   * @memberof LiensceGenerator
   */
  static Algorithm = Algorithm;

  /**
   * Password to read and write keys
   *
   * @static
   * @memberof LiensceGenerator
   */
  static Password = Password;

  static encrypt(alog: string, password: string) {
    const cipher = createCipher(alog, password);
    return (item: string) => {
      const encrypted =
        cipher.update(item, 'utf8', 'hex') + cipher.final('hex');
      return encrypted;
    };
  }

  static decrypt(alog: string, password: string) {
    const dipher = createDecipher(alog, password);
    return (item: string) => {
      const decrypted =
        dipher.update(item, 'hex', 'utf8') + dipher.final('utf8');
      return decrypted;
    };
  }

  static encryptLiensce(org: any) {
    return LiensceGenerator.encrypt(Algorithm, Password)(JSON.stringify(org));
  }

  static decryptLiensce(key: string) {
    return JSON.parse(
      LiensceGenerator.decrypt(Algorithm, Password)(key)
    ) ;
  }

  static generateDemoKey() {
    const bio: SchoolEncryptedData = {
      apikey: 'apikey',
      expiretimestamp: Number(format(addYears(new Date(), 1), 'x')),
      school: {
        name: 'DreamStack Nusery and Primary School',
        category: 'primary',
        id: 'globalId'
      } as any,
      boque: {
        allowed: 100,
        paid: 50,
        subscription: LiensceSubscription.Basic
      }
    };
    return LiensceGenerator.encryptLiensce(bio);
  }
}

