import { Auth, EntityNames, modelActionFormat, ModelOperations, User } from '@dilta/platform-shared';
import { MicroServiceToken, santizeAuth } from '@dilta/util';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { sign, verify } from 'jsonwebtoken';
import { BcryptSecurity } from './bcrypt';

const JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'HS256';
const AUDIENCE = process.env.AUDIENCE || 'AUDIENCE';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'ENCRYPTION_KEY';

// TODO: implement expirey date
const JWT_OPTIONS = {
  audience: AUDIENCE,
  issuer: AUDIENCE,
};

@Injectable()
export class SecurityValidator {
  constructor(
    @Inject(MicroServiceToken) private net: ClientProxy,
    private crypt: BcryptSecurity,
  ) {}

  /**
   * clean the auth details and generate jwt token
   *
   * @param {Auth} details
   * @returns
   * @memberof ClientAuthService
   */
  async cleanAndGenerateToken(details: Auth) {
    details = (santizeAuth(details) as any) as Auth;
    const token = await this.createToken(details);
    return { token, details };
  }

  /** saves the user authentication */
  async save(auth: Auth) {
    const existingUser = await this.net.send<Auth>(
      modelActionFormat(EntityNames.Auth,
      ModelOperations.Retrieve), [{ username: auth.username }]).toPromise();
    if (existingUser) {
      throw new Error(
        `account with username ${existingUser.username} already exists`,
      );
    }
    const password = await this.crypt.hashPassword(auth.password);
    auth.password = password;
    auth = await this.net.send<Auth>(
      modelActionFormat(EntityNames.Auth,
      ModelOperations.Create), [auth]).toPromise();
    return auth;
  }

  /** create hash for the password */
  async createHash(password: string) {
    return await this.crypt.hashPassword(password);
  }

  /** validates the user password */
  async checkPassword(password: string, hashed: string) {
    return await this.crypt.validatePassword(hashed, password);
  }

  /** creates token for the user */
  async createToken(auth: Auth) {
    const config = {
      algorithm: JWT_ALGORITHM,
    };
    return new Promise<string>((resolve, reject) => {
      sign(auth, ENCRYPTION_KEY, config, (err, token) => {
        if (err) {
          return reject(err);
        }
        resolve(token);
      });
    });
  }

  /** decodes the token to vaild Auth Object */
  decryptToken(token: string) {
    const config = {
      algorithms: JWT_ALGORITHM,
    } as any;
    return new Promise((resolve, reject) => {
      verify(token, ENCRYPTION_KEY, config, (err, value) => {
        if (err) {
          return reject(err);
        }
        resolve((value as any) as Partial<Auth>);
      });
    });
  }

  async removeUser(userId: string) {
    const user = await this.net.send<User>(
      modelActionFormat(EntityNames.User,
      ModelOperations.Retrieve), [{ id: userId }]).toPromise();
    if (user) {
      const isAuthDelete = await this.net.send<boolean>(
        modelActionFormat(EntityNames.Auth,
        ModelOperations.Delete), [{
        id: user.authId as string,
      }]).toPromise();
      const isUserDelete = await this.net.send(
        modelActionFormat(EntityNames.User,
        ModelOperations.Delete), [{ id: user.id }]).toPromise();
      if (isAuthDelete && isUserDelete) {
        return `${
          user.name
        } Authentication and biodata details successfully deleted`;
      }
      throw userAccountDeleteError;
    }
    throw userDetailsNotFoundError;
  }
}

export const userDetailsNotFoundError = new Error(
  `User Details not Found while removing user`,
);
export const userAccountDeleteError = new Error(
  `User Biodata and Authentication Account details not successfully deleted`,
);
