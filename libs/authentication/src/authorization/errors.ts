// tslint:disable: max-classes-per-file

/**
 * formats Error to string
 *
 * @returns
 */
function errFormater() {
  return `${this.name}::${this.message}`;
}

/**
 * Error thrown for Failure while decrypting a token
 *
 * @export
 * @class JwtDecryptingError
 * @extends {Error}
 */
export class JwtDecryptingError extends Error {
  public static message = 'Error Decrypting JsonWebToken';

  public name = 'JwtDecryptingError';

  constructor() {
    super(JwtDecryptingError.message);
  }

  toString() {
    return errFormater.call(this);
  }
}

/**
 * Error thrown for invalid password matches
 *
 * @export
 * @class InValidPasswordError
 * @extends {Error}
 */
export class InValidPasswordError extends Error {
  public static message = 'Invalid Password, try again with password';

  public name = 'InValidPasswordError';

  constructor() {
    super(InValidPasswordError.message);
  }

  toString() {
    return errFormater.call(this);
  }
}



/**
 * Error thrown when the Authentication details requested not found
 *
 * @class AuthDetailsNotFondError
 * @extends {Error}
 */
export class AuthDetailsNotFondError extends Error {
  public static message = 'Authentication details missing for the username | data';
  public name = 'AuthDetailsNotFondError';

  constructor() {
    super(AuthDetailsNotFondError.message);
  }

  toString() {
    return errFormater.call(this);
  }
}
