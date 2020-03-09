import { Auth, EntityNames, modelActionFormat, ModelOperations } from '@dilta/platform-shared';
import { DeepPartial } from 'typeorm';
import * as uuid from 'uuid/v4';
import { EntityBaseModel } from './base-model';

/** redacts to protect user fields */
export function santizeAuth(authId: Auth) {
  if (!authId) {
    return authId;
  }
  const { hash, updatedAt, password, ...allowed } = authId;
  return allowed;
}

/**
 * converts a promise to destructurable array
 */
export async function awaitTo<T>(pending: Promise<T>): Promise<[T, Error]> {
  try {
    return [await pending, undefined];
  } catch (error) {
    return [undefined, error];
  }
}

/**
 * creates a curried method for mapping operations to models
 */
export const ModelAction = (model: EntityNames) => (operation: ModelOperations) => modelActionFormat(model, operation);

/**
 *
 * adds meta-data before inserting the data
 */
export function preInsert<T>(obj: DeepPartial<T>) {
  const prop: Partial<EntityBaseModel> = {
    hash: uuid(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  return {...obj, ...prop };
}

/**
 * updates meta-data before updating the fields
 */
export function preUpdate<T>(obj: DeepPartial<T>) {
  const prop: Partial<EntityBaseModel> = {
    hash: uuid(),
    updatedAt: Date.now(),
  };
  return {...obj, ...prop };
}
