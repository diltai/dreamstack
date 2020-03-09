import {
  Grades,
  GradesComment,
  GradeSheet,
  Level,
  Permission,
  SchoolDict,
  SchoolPreset,
  SchoolPresetBio,
  Setting,
  SettingTypes,
  GradingConfig,
  GradingRange,
} from '@dilta/platform-shared';
import { format, getYear } from 'date-fns';
import { uniq } from 'lodash';
import * as uuidRandom from 'uuid/v4';

export const permision: Permission[] = [
  // { name: 'Guest',  value: 1 },
  { name: 'Teacher', value: 2 },
  { name: 'Busar', value: 3 },
  { name: 'Manager', value: 4 },
  { name: 'Propietor', value: 5 },
  { name: 'Administrator', value: 6 },
];

/** generic cousrses taking by the primary school */
export const _primarySyllabus = [
  'English',
  'Mathematics',
  'Civic Studies',
  'Agric Science',
  'Quantive Reasoning',
  'Verbal Reasoning',
  'c.R.S',
  'I.R.S',
];

/** primary course's mapped to the  classes */
export const _primarySchoolLevel: Level[] = [
  { name: 'Pry One', courses: _primarySyllabus },
  { name: 'Pry Two', courses: _primarySyllabus },
  { name: 'Pry Three', courses: _primarySyllabus },
  { name: 'Pry Four', courses: _primarySyllabus },
  { name: 'Pry Five', courses: _primarySyllabus },
  { name: 'Pry Six', courses: _primarySyllabus },
];

/** primary school preset */
export const primarySchool: SchoolPresetBio = {
  name: 'Primary',
  levels: _primarySchoolLevel,
  permision: permision,
};

/** generic cousrses taking by the nusery school */
export const _nurserySyllabus = [];

/** nusery course's mapped to the  classes */
export const _nuserySchoolLevel: Level[] = [
  { name: 'Crech', courses: ['none'] },
  { name: 'Nusery One', courses: _nurserySyllabus },
  { name: 'Nusery Two', courses: _nurserySyllabus },
  { name: 'Nusery Three', courses: _nurserySyllabus },
];

/** nusery school presets */
export const nuserySchool: SchoolPresetBio = {
  name: 'Nusery',
  levels: _nuserySchoolLevel,
  permision: permision,
};

/** nusery and primary school presets */
export const nuseryPrimarySchool: SchoolPresetBio = {
  name: 'Nusery && Primary',
  levels: [..._nuserySchoolLevel, ..._primarySchoolLevel],
  permision: permision,
};

/** full export of all the presets */
export const schoolPresetBios: SchoolPreset = {
  nusery: nuserySchool,
  primary: primarySchool,
  nusery_primary: nuseryPrimarySchool,
};

/** school categories supported */
export const schoolCategories = Object.keys(schoolPresetBios);

/**
 * cleans the school presets information to a nice
 * json dictionary
 *
 * @export
 * @param {keyof SchoolPreset} preset
 * @returns {SchoolDict}
 */
export function dictSchool(
  preset: keyof SchoolPreset,
  customDict?: typeof schoolPresetBios,
): SchoolDict {
  const _schoolPresetBios = customDict || schoolPresetBios;
  // tslint:disable-next-line:no-shadowed-variable
  const { levels, permision } = _schoolPresetBios[preset];
  const schoolClasses: string[] = levels.map(level => level.name);
  const schoolSubjects = uniq(
    levels
      .map(level => level.courses)
      .reduce((p, c) => {
        return [...p, ...c];
      }, []),
  );
  return {
    classes: schoolClasses,
    subjects: schoolSubjects,
    permisions: dictPermision(permision),
  };
}

/**
 * converts the array of perimsions to
 * a nice json dictionary
 *
 * @export
 * @param {Permission[]} [permsions=[]]
 * @returns
 */
export function dictPermision(permsions: Permission[] = []) {
  const _dict = {};
  permsions.forEach(p => (_dict[p.name] = p.value));
  return _dict;
}

/**
 * Creates an inital presets dynamically for the school
 *
 * @export
 * @param {keyof SchoolPreset} category
 * @param {string} owner
 * @returns {Setting}
 */
export function InitalBusaryPreset(
  category: keyof SchoolPreset,
  owner: string,
): Setting {
  const memberclassesInputs = dictSchool(category).classes.map(e => {
    const _obj = {};
    _obj[e] = '';
    return _obj;
  });
  return {
    owner,
    school: owner,
    type: SettingTypes.school,
    settings: busarySetting({ memberclassesInputs }),
    id: uuidRandom(),
    defaultView: 'revenue:schoolFee',
    hash: `${Date.now()}:{uuidRandom()}`,
    createdAt: Number(format(Date.now(), 'x')),
  };
}

/**
 * Function to return Busary Preference
 *
 * @param {*} inputs
 * @returns
 */
function busarySetting({ memberclassesInputs }) {
  const today = Date.now();
  const currentYear = getYear(today);
  return {
    revenue: {
      name: 'Revenue',
      link: 'revenue',
      enabled: true,
      submenus: {
        schoolFee: {
          enabled: true,
          name: 'schoolFee',
          link: 'revenue:schoolFee',
          inputs: memberclassesInputs,
        },
        uniform: {
          enabled: true,
          name: 'uniform',
          link: 'revenue:uniform',
          inputs: memberclassesInputs,
        },
        transportation: {
          enabled: true,
          name: 'transportation',
          link: 'revenue:transportation',
          inputs: memberclassesInputs,
        },
      },
    },
    expenses: {
      name: 'Expenses',
      link: 'expenses',
      enabled: true,
      inputs: [
        { name: 'Stationaries' },
        { name: 'Transportation' },
        { name: 'Miscelious' },
      ],
    },
    others: {
      name: 'Others',
      link: 'others',
      submenus: {
        termList: {
          enabled: true,
          name: 'TermList',
          link: 'others:termList',
          inputs: [
            { name: 'First Term' },
            { name: 'Second Term' },
            { name: 'Third Term' },
          ],
        },
        sessionList: {
          enabled: true,
          name: 'SessionList',
          link: 'others:sessionList',
          inputs: [
            { name: `${currentYear}\\${currentYear + 1}` },
            { name: `${currentYear - 1}\\${currentYear}` },
            {
              name: `${currentYear - 2}\\${currentYear - 1}`,
            },
            {
              name: `${currentYear - 3}\\${currentYear - 2}`,
            },
          ],
        },
      },
    },
  };
}

/**
 * grade preset returns the comment on the student score.
 *
 * @export
 * @param {number} score
 * @returns {string}
 */
export function gradePreset(grading: GradingConfig, score: number): GradeSheet {
  let gradeKey: string;
  Object.entries(grading).forEach(([key, value]: [string, GradingRange]) => {
    if (!gradeKey) {
      if (score >= value.min && score <= value.max) {
        gradeKey = key;
      }
    }
  });

  return {
    comment: GradesComment[gradeKey],
    grade: Grades[gradeKey],
  };
}

/**
 * maps student poistion in the class to comment
 *
 * @export
 * @param {number} index
 * @returns
 */
export function classPositionPreset(index: number) {
  index += 1;
  if (index === 0) {
    return 'Not available';
  }
  if (index === 1) {
    return '1st';
  }
  if (index === 2) {
    return '2nd';
  }
  if (index === 3) {
    return '3rd';
  }
  return `${index}th`;
}
