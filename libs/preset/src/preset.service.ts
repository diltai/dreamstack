import { PresetAction } from '@dilta/platform-shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { dictSchool, schoolCategories } from './schools.preset';
import { localGovts, states } from './states.presets';

@Controller()
export class PresetService {

  /**
   * local goverments
   *
   * @returns {string[]}
   * @memberof PresetService
   */
  @MessagePattern(PresetAction.Lga)
  lga(): string[] {
    return localGovts();
  }

  /**
   * states
   *
   * @returns {string[]}
   * @memberof PresetService
   */
  @MessagePattern(PresetAction.State)
  state(): string[] {
    return states();
  }

  /**
   * school categories
   *
   * @returns
   * @memberof PresetService
   */
  @MessagePattern(PresetAction.SchoolCategories)
  schoolCategories() {
    return schoolCategories;
  }

  /**
   * school categories
   *
   * @param {string} preset
   * @returns
   * @memberof PresetService
   */
  @MessagePattern(PresetAction.SchoolPreset)
  schoolPreset([preset]: [string]) {
    return dictSchool(preset);
  }

}
