import * as platformShared from '@dilta/platform-shared';
import { MicroServiceToken } from '@dilta/util';
import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { sortBy } from 'lodash';

@Controller()
export class RecordOperations {
  constructor(@Inject(MicroServiceToken) private net: ClientProxy) { }

  /**
   * cleans and update the student record when it's done
   *
   * @param {platformShared.AcademicSubject} record
   * @returns
   * @memberof RecordOperations
   */
  @MessagePattern(platformShared.AcademicActions.UpdateSubjectRecord)
  async updateSubjectRecord([record]: [platformShared.AcademicSubject]) {
    const { name, ...details } = record;
    const resp = !record.id
      ? await this.net.send<platformShared.Subject>(
        platformShared.modelActionFormat(platformShared.EntityNames.Subject,
          platformShared.ModelOperations.Create),
        [details]).toPromise()
      : await this.net.send<platformShared.Subject>(
        platformShared.modelActionFormat(platformShared.EntityNames.Subject,
          platformShared.ModelOperations.Update),
        [record.id, details]).toPromise();
    return { name, ...resp };
  }

  /**
   * retrieves the subject and student academic records mapped
   *
   * @param {string} recordId
   * @returns {Promise<platformShared.SubjectRecords>}
   * @memberof RecordOperations
   */
  @MessagePattern(platformShared.AcademicActions.SubjectRecord)
  async subjectRecord([recordId]: [string]): Promise<platformShared.SubjectRecords> {
    const record = await this.net.send<platformShared.Record>(
      platformShared.modelActionFormat(platformShared.EntityNames.Record,
        platformShared.ModelOperations.Retrieve),
      [{ id: recordId }]).toPromise();
    if (record) {
      const records = await this.net.send<platformShared.FindResponse<platformShared.Subject>>(
        platformShared.modelActionFormat(platformShared.EntityNames.Subject,
          platformShared.ModelOperations.Find),
        [{ recordId }]).toPromise();
      const students = await this.net.send<platformShared.FindResponse<platformShared.Student>>(
        platformShared.modelActionFormat(platformShared.EntityNames.Student,
          platformShared.ModelOperations.Find),
        [{ class: record.class }]).toPromise();
      const setting = await this.net.send<platformShared.AcademicSetting>(
        platformShared.modelActionFormat(platformShared.EntityNames.academic_setting,
          platformShared.ModelOperations.Retrieve),
        [{ school: record.school }]).toPromise();
      if (!setting) {
        throw academicSettingNeverExist;
      }
      const data = this.mapAcademicSubject(
        recordId,
        this.recordIDMap(records.data),
        students.data,
      );
      return { record, data, config: setting.record };
    }
    throw recordNeverExist;
  }

  /**
   * maps the student name to their id
   *
   * @memberof RecordOperations
   */
  mapAcademicSubject(
    recordId: string,
    recordMap: Map<string, platformShared.Subject>,
    students: platformShared.Student[],
  ): platformShared.AcademicSubject[] {
    const mappedStudents = students.map(e => {
      const record: platformShared.Subject = recordMap.has(e.id)
        ? recordMap.get(e.id)
        : ({
          exam: 0,
          firstCa: 0,
          secondCa: 0,
          total: 0,
          studentId: e.id,
          recordId,
        } as any);
      return Object.assign({}, { name: e.name }, record);
    });
    return sortBy(mappedStudents, 'name');
  }

  /**
   * create student Id_maps
   *
   * @memberof RecordOperations
   */
  recordIDMap(records: platformShared.Subject[]) {
    const map = new Map<string, platformShared.Subject>();
    for (const record of records) {
      map.set(record.studentId, record);
    }
    return map;
  }

  /**
   * deletes both the records and the sub subjects
   *
   * @param {string} recordId
   * @returns
   * @memberof RecordOperations
   */
  @MessagePattern(platformShared.AcademicActions.DeleteSubjectRecord)
  async deleteSubjectRecordS(
    [recordId]: [string],
  ): Promise<platformShared.SubjectRecordDeletedStatus> {
    const isRecordDeleted = await this.deleteRecord(recordId);
    const allSubjectDeletedStatus = await this.deleteSubjects(recordId);
    return {
      isRecordDeleted,
      isAllSubjectDeleted: allSubjectDeletedStatus.every(
        deleteStatus => deleteStatus === true,
      ),
    };
  }

  /**
   * delete the subject record
   *
   * @param {string} recordId
   * @returns
   * @memberof RecordOperations
   */
  async deleteRecord(recordId: string) {
    return this.net.send<boolean>(
      platformShared.modelActionFormat(platformShared.EntityNames.Record,
        platformShared.ModelOperations.Delete),
      [{ id: recordId }]).toPromise();
  }

  /**
   * deletes the subject scores of the record
   *
   * @param {string} recordId
   * @returns
   * @memberof RecordOperations
   */
  async deleteSubjects(recordId: string) {
    const { data } = await this.net.send<platformShared.FindResponse<platformShared.Subject>>(
      platformShared.modelActionFormat(platformShared.EntityNames.Subject,
        platformShared.ModelOperations.Find),
      [{ recordId }]).toPromise();
    const results = await Promise.all(
      data.map(sub =>
        this.net.send<boolean>(
          platformShared.modelActionFormat(platformShared.EntityNames.Subject,
            platformShared.ModelOperations.Delete),
          [{ id: sub.id, recordId: sub.recordId }]).toPromise(),
      ),
    );
    return results;
  }
}

const recordNeverExist = new Error('Record Requested doesnt exist');
const academicSettingNeverExist = new Error(
  `School academic settting doesn't exist`,
);
