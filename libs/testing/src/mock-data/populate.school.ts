import * as gen from './school.data';
import { Parent, Student, User, Subject, Record } from '@dilta/platform-shared';
import * as faker from 'faker';

export async function generateDBdata(schoolId: string, db: any) {
  // await uploadData(db.school, data.school, 'school');
  // await uploadData(db.manager_model, manager, 'manager');
  const admins = generateAdminStaffs(schoolId);
  const savedTeachers = (await uploadData(
    db.user_model,
    admins.teachers
  )) as User[];

  const studentsAndParents = generateStudentsAndParents(schoolId);
  const savedParents = (await uploadData(
    db.parent_model,
    studentsAndParents.parents
  )) as Parent[];
  const savedStudnets = (await uploadData(
    db.student_model,
    studentsAndParents.students
  )) as Student[];

  const recSub = generateRecordAndSubjects(
    schoolId,
    savedStudnets,
    savedTeachers
  );
  const savedRecords = (await uploadData(
    db.record_model,
    recSub.records
  )) as Record[];
  const savedSubjects = (await uploadData(
    db.subject_model,
    recSub.subjects
  )) as Subject[];
  return `database random data generation done
    :: Teachers ${savedTeachers.length}
    :: Parents ${savedParents.length}
    :: Students ${savedStudnets.length}
    :: Records ${savedRecords.length}
    :: Subjects ${savedSubjects.length}`;
}

async function uploadData<T>(
  kol: any,
  data: T[] | T
): Promise<T[] | T> {
  return (data as T[]).length
    ? Promise.all((data as T[]).map(d => kol.upsert(d)))
    : kol.upsert(data as T);
}


function generateAdminStaffs(schoolId: string) {
  const manager = gen.manager();
  manager.school = schoolId;

  const teachers = gen
    .list<User>(gen.admin, 40)
    .map(t => Object.assign({}, t, { school: schoolId }));
  return { manager, teachers };
}

function generateStudentsAndParents(schoolId: string) {
  const parents: Parent[] = [];
  const students = gen.list<Student>(gen.student, 800).map(stud => {
    const parent = gen.parent();
    parent.school = schoolId;
    stud.school = schoolId;
    stud.parentPhone = parent.phoneNo;
    parents.push(parent);
    return stud;
  });
  return { parents, students };
}

function generateRecordAndSubjects(
  schoolId: string,
  students: Student[],
  teachers: User[]
) {
  const subjects: Subject[] = [];
  const records: Record[] = gen.list(gen.genRecord, 100);
  records.forEach(rec => {
    const classStudents = students.filter((std) => std.class === rec.class);
    classStudents.forEach(student => {
      const subject = gen.scoreGen(student.id, rec.id);
      subject.school = schoolId;
      subject.teacherId = gen.select(teachers).id;
      subjects.push(subject);
    });
  });
  return { subjects, records };
}
