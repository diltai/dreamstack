import { NigeriaPreset } from './nigeria.states';
import { flatMap } from 'lodash';
/**
 * osun state details for the nigerian states json
 *
 * @export
 * @interface Nigeria
 */
export interface Nigeria {
  Abia: State;
  Adamawa: State;
  'Akwa Ibom': State;
  Anambra: State;
  Bauchi: State;
  Benue: State;
  'Cross River': State;
  Enugu: State;
  Edo: State;
  Delta: State;
  Borno: State;
  Ekiti: State;
  Lagos: State;
  Kebbi: State;
  'Federal Capital Territory': Cities;
  Niger: State;
  Katsina: State;
  Oyo: State;
  Jigawa: State;
  Ebonyi: State;
  Nasarawa: State;
  Plateau: State;
  Gombe: State;
  Kaduna: State;
  Kano: State;
  Ondo: State;
  Osun: State;
  Taraba: State;
  Bayelsa: State;
  Yobe: State;
  Sokoto: State;
  Kogi: State;
  Ogun: State;
  Kwara: State;
  Imo: State;
  Zamfara: State;
}

/**
 * a nigerian state interface
 *
 * @export
 * @interface State
 */
export interface State {
  minLat: number;
  name: string;
  capital: string;
  latitude: number;
  minLong: number;
  maxLat: number;
  longitude: number;
  maxLong: number;
  alias: string;
  cities: Cities | string[];
  lgas: string[];
}

/**
 * interface for a nigeria cities
 *
 * @export
 * @interface Cities
 */
export interface Cities {
  message: string;
  status: number;
}

/** importing the nigerian state */
export { NigeriaPreset } from './nigeria.states';

/**
 * returns the list of states in nigeria
 *
 * @export
 * @returns
 */
export function states() {
  return Object.keys(NigeriaPreset).sort();
}

/**
 * retrieves the list of local govts
 *
 * @export
 * @returns
 */
export function localGovts() {
  const names = Object.values(NigeriaPreset as any).map(
    ({ lgas }: State) => lgas || []
  );
  return [...flatMap(names), 'Federal Capital Territory'].sort();
}
