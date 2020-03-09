import * as platformShared from '@dilta/platform-shared';
import { MicroServiceToken } from '@dilta/util';
import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { AuthDetailsNotFondError, InValidPasswordError } from './errors';
import { SecurityValidator } from './validator';

@Controller()
export class AuthorizerController {
  constructor(
    private sec: SecurityValidator,
    @Inject(MicroServiceToken) private net: ClientProxy,
  ) { }

  /**
   * signs in the user and response with jwt token
   *
   * @param {Partial<platformShared.Auth>} auth
   * @memberof AuthController
   */
  @MessagePattern(platformShared.USER_AUTH.Login)
  async login([auth]: [Partial<platformShared.Auth>]): Promise<platformShared.AuthTokenUser> {
    const details = await this.net.send<platformShared.Auth>(
      platformShared.modelActionFormat(platformShared.EntityNames.Auth,
        platformShared.ModelOperations.Retrieve), [{ username: auth.username }]).toPromise();
    if (!details) {
      throw new AuthDetailsNotFondError();
    }
    const isValid = await this.sec.checkPassword(
      auth.password,
      details.password,
    );
    if (!isValid) {
      throw new InValidPasswordError();
    }
    details.school = await this.net.send<platformShared.School>(
      platformShared.modelActionFormat(platformShared.EntityNames.School,
        platformShared.ModelOperations.Retrieve), [ { id: details.school as string }]).toPromise();
    const response = await this.sec.cleanAndGenerateToken(details);
    return response;
  }

  /**
   * signup the user and response with jwt token
   *
   * @param {Partial<platformShared.Auth>} auth
   * @memberof AuthController
   */
  @MessagePattern(platformShared.USER_AUTH.Signup)
  async signUp([auth]: [Partial<platformShared.Auth>]): Promise<platformShared.AuthTokenUser> {
    const saved = await this.sec.save(auth as any);
    return await this.sec.cleanAndGenerateToken(saved as any);
  }

  /**
   * verifies the jwt token and return the decrypted details
   *
   * @param {string} token
   * @memberof AuthController
   */
  @MessagePattern(platformShared.USER_AUTH.Verify)
  async verify([token]: [string]): Promise<platformShared.AuthTokenUser> {
    const details = await this.sec.decryptToken(token);
    const response = await this.sec.cleanAndGenerateToken(details as any);
    return response;
  }

  @MessagePattern(platformShared.USER_AUTH.Delete)
  async deleteAccount([currentUserToken, userIdtoDelete]: [string, string]) {
    const { details } = await this.verify([currentUserToken]);
    const currentUserBio = await this.net.send<platformShared.User>(
      platformShared.modelActionFormat(platformShared.EntityNames.User,
        platformShared.ModelOperations.Retrieve), [{
      authId: details.id,
    }]).toPromise();
    if (details.level === platformShared.AuthenticationLevels.Administrator) {
      if (currentUserBio.id !== userIdtoDelete) {
        return await this.sec.removeUser(userIdtoDelete);
      }
      throw deleteCurrentUserError;
    }
    throw authLevelError;
  }
}

export const authLevelError = new Error(
  `Current user lack adminstatrive level to execute operation`,
);

export const deleteCurrentUserError = new Error(
  `Current user cannot delete it's self while login`,
);
