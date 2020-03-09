import {
  BaseModel,
  Manager,
  Parent,
  Receipt,
  School,
  Student,
  User,
  NuseryPrimarySchoolClassPreset,
  Subject,
  cleanNumericEnums,
  ParentRelationship,
  Record,
  schoolTerms,
  TermPreset,
} from '@dilta/platform-shared';
import { getDate } from 'date-fns';
import * as faker from 'faker';
import { pick } from 'shuffle-array';

/**
 * creates an array with amount-count elements from
 * the function result passed
 *
 * @export
 * @template T
 * @param {Function} method
 * @param {number} [amount=5]
 * @returns {T[]}
 */
export function list<T>(method: Function, amount: number = 5): T[] {
  const _list = [];
  for (let i = 0; i < amount; i++) {
    _list.push(method());
  }
  return _list;
}

/**
 * returns an item from the array
 *
 * @export
 * @template T
 * @param {Array<T>} array
 * @returns {(T | T[])}
 */
export function select<T>(array: T[]): T {
  return pick(array) as any;
}

function baseModel(): BaseModel {
  return {
    id: faker.random.uuid(),
    updatedAt: getDate(faker.date.past()),
    createdAt: getDate(faker.date.past()),
    hash: faker.random.uuid(),
    school: faker.company.companyName(),
  };
}

export function school(): School {
  const skul = baseModel();
  delete skul.school;
  return {
    name: faker.company.companyName(),
    email: faker.internet.email(),
    description: faker.random.words(45),
    category: select(['primary', 'secondary']) as any,
    address: faker.address.streetAddress(),
    town: faker.address.city(),
    state: faker.address.state(),
    logo: faker.image.dataUri(100, 200),
    globalId: faker.random.uuid(),
    ...skul,
  };
}

export const schoolList = (amount?: number) => list<School>(school, amount);

export function manager(): Manager {
  return {
    school: faker.company.companyName(),
    motto: faker.lorem.lines(1),
    propEmail: faker.internet.email(),
    propName: `${faker.name.firstName()} ${faker.name.lastName()}`,
    propPhone: faker.phone.phoneNumber(),
    sMEmail: faker.internet.email(),
    sMName: `${faker.name.firstName()} ${faker.name.lastName()}`,
    sMPhone: faker.phone.phoneNumber(),
    ...baseModel(),
  };
}

export const managerList = (amount?: number) => list<Manager>(manager, amount);

export const classes = cleanNumericEnums(
  Object.keys(NuseryPrimarySchoolClassPreset),
);
export const genders = ['Male', 'Female'];
export const bloodgroups = ['A', 'B', 'AB', 'O'];

export function student(): Student {
  return {
    dob: getDate(faker.date.past(3)),
    school: faker.random.uuid(),
    class: NuseryPrimarySchoolClassPreset[select(classes)],
    bloodgroup: select(bloodgroups),
    gender: select(genders),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    parentPhone: faker.phone.phoneNumber(),
    prevschool: faker.company.companyName(),
    admissionNo: faker.phone.phoneNumber(),
    ...baseModel(),
  } as any;
}

export const studentList = (amount?: number) => list<Student>(student, amount);

export function parent(): Parent {
  return {
    school: faker.random.uuid(),
    email: faker.internet.email(),
    homeAddress: faker.address.streetAddress(),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    phoneNo: faker.phone.phoneNumber(),
    profession: faker.name.jobDescriptor(),
    relationship: ParentRelationship.Parent,
    state: faker.address.state(),
    town: faker.address.city(),
    workAddress: faker.address.secondaryAddress(),
    workcategory: faker.name.jobType(),
    ...baseModel(),
  };
}

export const parentList = (amount?: number) => list<Parent>(parent, amount);

export const terms = ['first term', 'second term', 'third term'];
export const sessions = ['2016/2017', '2018/2019', '2015/2016'];

export function receipt(): Receipt {
  return {
    school: faker.random.uuid(),
    name: faker.name.findName(),
    class: NuseryPrimarySchoolClassPreset[select(classes)] as any,
    createdAt: getDate(new Date()),
    date: getDate(new Date()),
    session: select(sessions) as any,
    studentId: faker.random.alphaNumeric(8),
    teacherId: faker.random.uuid(),
    term: select(terms) as any,
    updatedAt: Date(),
    items: [
      {
        name: 'school fee',
        value: faker.random.number({ max: 60000, min: 10000 }),
      },
      {
        name: 'transportation',
        value: faker.random.number({ max: 10000, min: 2000 }),
      },
    ],
    ...baseModel(),
  } as any;
}

export const receiptList = (amount = 5) => list<Receipt>(receipt, amount);

export const subjects = [
  'english',
  'chemistry',
  'biology',
  'mathematics',
  'physics',
  'economics',
  'geography',
  'chemistry',
  'yoruba',
  'agric science',
  'economics',
  'literature',
];
export const levels = ['owner', 'manager', 'busar', 'teacher'];

export function admin(): User {
  return {
    authId: faker.internet.userName(),
    school: faker.random.uuid(),
    address: faker.address.streetAddress(),
    class: NuseryPrimarySchoolClassPreset[select(classes)] as any,
    subject: select(subjects) as any,
    email: faker.internet.email(),
    gender: faker.helpers.randomize(genders)[0],
    image: faker.image.dataUri(100, 200),
    name: faker.name.findName(),
    phoneNo: faker.phone.phoneNumber(),
    phoneNos: faker.phone.phoneNumber(),
    ...baseModel(),
  } as any;
}

export const adminsList = (amount = 5) => list<User>(admin, amount);

export function scoreGen(studentId: string, recordId: string): Subject {
  const firstCa = faker.random.number({ min: 0, max: 15 });
  const secondCa = faker.random.number({ min: 0, max: 15 });
  const exam = faker.random.number({ min: 0, max: 70 });

  return {
    studentId,
    recordId,
    teacherId: faker.random.uuid(),
    firstCa,
    secondCa,
    exam,
    total: firstCa + secondCa + exam,
    ...baseModel(),
  };
}
// ...baseModel()

export const examList = (no = 5) => list<Subject>(scoreGen, no);
// accounts doesnt use erasers...ideology

export function genRecord(): Record {
  return {
    class: NuseryPrimarySchoolClassPreset[select(classes)],
    teacherId: faker.random.uuid(),
    session: sessions[0] || select(sessions),
    subject: select(subjects),
    term: TermPreset.First || TermPreset[select(schoolTerms)],
    ...baseModel(),
  } as any;
}

// export const managerList = (amount?: number) => list(manager, amount);
