import * as platformShared from '@dilta/platform-shared';
import { classPositionPreset, gradePreset } from '@dilta/preset';
import { MicroServiceToken } from '@dilta/util';
import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';

/***
 * 1. Collates all records that matches the class and session
 * 2. do a search for student records that match collated record.
 * 3. Seperate the student that match student_Id and collate class max,
 * min, average and grade for each subject
 * 4. return student_details + academic_records_mapped.
 */

@Controller()
export class ScoreSheet {
  constructor(@Inject(MicroServiceToken) private net: ClientProxy) { }

  /**
   * collates student data and all student records for the session
   *
   * @param {platformShared.StudentSheet} sheet
   * @returns {Promise<platformShared.StudentReportSheet>}
   * @memberof ScoreSheet
   */
  @MessagePattern(platformShared.AcademicActions.StudentReportSheet)
  async studentSheet([sheet]: [platformShared.StudentSheet]): Promise<platformShared.StudentReportSheet> {
    const records = await this.classRecords(sheet);
    const student = await this.net.send<platformShared.Student>(
      platformShared.modelActionFormat(platformShared.EntityNames.Student,
        platformShared.ModelOperations.Retrieve), [{ id: sheet.studentId }]).toPromise();
    const settings = await this.net.send<platformShared.AcademicSetting>(
      platformShared.modelActionFormat(platformShared.EntityNames.academic_setting,
        platformShared.ModelOperations.Retrieve),
      [{ school: student.school }]).toPromise();
    const recordScoreSheets: platformShared.StudentRecordMergeSheet[] = await Promise.all(
      records.map(async rec =>
        this.mergeRecordScores(sheet, rec, settings.grade),
      ),
    );
    const scoreSheet = this.differentTermScores(
      sheet,
      recordScoreSheets,
      settings.grade,
    );
    const cumulative = this.studentCumulativeRecord(scoreSheet, settings.grade);
    const allTerms = this.studentCumulativeRecord(
      recordScoreSheets,
      settings.grade,
      'cumAvg',
    );
    const totalStudents = await this.studentCounts(sheet.level);
    return {
      scoreSheet,
      cumulative,
      biodata: student,
      ...sheet,
      totalStudents,
      allTerms,
      settings,
    };
  }

  async classRecords({ term, session, level }: platformShared.AcadmicRecordSheet) {
    const { data } = await this.net.send<platformShared.FindResponse<platformShared.Record>>(
      platformShared.modelActionFormat(platformShared.EntityNames.Record,
        platformShared.ModelOperations.Find),
      [{ class: level, session }]).toPromise();
    return data;
  }

  async studentCounts(level: platformShared.SchoolClass) {
    const { total } = await this.net.send<platformShared.FindResponse<platformShared.Student>>(
      platformShared.modelActionFormat(platformShared.EntityNames.Student,
        platformShared.ModelOperations.Find),
      [{ class: level }]).toPromise();
    return total;
  }

  /**
   * merges both the record and their corresponding scores to a single object
   *
   * @param {platformShared.Record} rec
   * @param {platformShared.StudentSheet} sheet
   * @returns
   * @memberof ScoreSheet
   */
  async mergeRecordScores(
    sheet: platformShared.StudentSheet,
    rec: platformShared.Record,
    grading: platformShared.GradingConfig,
  ): Promise<platformShared.StudentRecordMergeSheet> {
    const recordScore = await this.RecordScores(
      rec.id,
      sheet.studentId,
      grading,
    );
    return { ...rec, ...recordScore };
  }

  /**
   * collates the student record scores and class records
   *
   * @param {string} id
   * @param {string} studentId
   * @returns {Promise<platformShared.RecordSheet>}
   * @memberof ScoreSheet
   */
  async RecordScores(
    recordId: string,
    studentId: string,
    grading: platformShared.GradingConfig,
  ): Promise<platformShared.RecordSheet> {
    const student = await this.studentRecordSheet(recordId, studentId, grading);
    const classSheet = await this.classSheets(recordId, studentId);
    return { ...student, ...classSheet };
  }

  /**
   * subject_ record class sheet
   *
   * @param {string} recordId
   * @returns {Promise<platformShared.ClassSheet>}
   * @memberof ScoreSheet
   */
  async classSheets(recordId: string, studentId?: string): Promise<platformShared.ClassSheet> {
    const { data } = await this.net.send<platformShared.FindResponse<platformShared.Subject>>(
      platformShared.modelActionFormat(platformShared.EntityNames.Student,
        platformShared.ModelOperations.Find),
      [{ recordId }]).toPromise();
    // this sort from highest to lowest
    const sorted = data.sort((a, b) => b.total - a.total);
    // retrieves the student position
    const classPosition = classPositionPreset(
      data.findIndex(score => score.studentId === studentId),
    );
    const max = sorted[0] ? sorted[0].total : 0;
    const min = sorted[sorted.length - 1] ? sorted[sorted.length - 1].total : 0;
    const sum = (sorted as any[]).reduce(
      (prev, curr) => {
        return {
          total: prev.total + curr.total,
        };
      },
      { total: 0 },
    );
    const avg = sorted.length > 0 ? Math.round(sum.total / sorted.length) : 0;
    return { max, min, avg, classPosition };
  }

  /**
   * indiviual Student record sheet
   *
   * @param {string} recordId
   * @param {string} studentId
   * @returns {Promise<platformShared.StudentRecordSheet>}
   * @memberof ScoreSheet
   */
  async studentRecordSheet(
    recordId: string,
    studentId: string,
    grading: platformShared.GradingConfig,
  ): Promise<platformShared.StudentRecordSheet> {
    let score: platformShared.Subject = await this.net.send<platformShared.Subject>(
      platformShared.modelActionFormat(platformShared.EntityNames.Student,
        platformShared.ModelOperations.Retrieve),
      [{
        recordId,
        studentId,
      }]).toPromise();
    score = score
      ? score
      : {
        total: 0,
        firstCa: 0,
        exam: 0,
        secondCa: 0,
        recordId,
        studentId,
        teacherId: '',
      };
    const grade = gradePreset(grading, score.total);
    return { ...grade, ...score };
  }

  /**
   * collates the different term scores
   *
   * @param {platformShared.StudentSheet} studentSheet
   * @param {platformShared.StudentRecordMergeSheet[]} scoreSheet
   * @returns {platformShared.StudentRecordMergeSheet[]}
   * @memberof ScoreSheet
   */
  differentTermScores(
    studentSheet: platformShared.StudentSheet,
    scoreSheet: platformShared.StudentRecordMergeSheet[],
    grading: platformShared.GradingConfig,
  ): platformShared.StudentRecordMergeSheet[] {
    const map = this.mapSheetSubject(studentSheet, scoreSheet, grading);
    return scoreSheet
      .filter(sheet => sheet.term === studentSheet.term)
      .map(sheet => Object.assign({}, sheet, map.get(sheet.subject) || {}));
  }

  /**
   * map each subject and term to indiviual scores required
   *
   * @param {platformShared.StudentSheet} { term }
   * @param {platformShared.StudentRecordMergeSheet[]} scoreSheet
   * @returns
   * @memberof ScoreSheet
   */
  mapSheetSubject(
    { term }: platformShared.StudentSheet,
    scoreSheet: platformShared.StudentRecordMergeSheet[],
    grading: platformShared.GradingConfig,
  ) {
    const map = new Map<string, platformShared.StudentRecordMergeTermSheet>();
    scoreSheet.forEach(sheet => {
      // tslint:disable-next-line: no-console
      console.log(
        `term ${sheet.term} subject: ${sheet.subject} total: ${sheet.total}`,
      );
      if (map.has(sheet.subject)) {
        const report = map.get(sheet.subject);
        map.set(
          sheet.subject,
          this.mapSheetToTermScores(report, sheet, term, grading),
        );
      } else {
        map.set(
          sheet.subject,
          this.mapSheetToTermScores({ ...sheet }, sheet, term, grading),
        );
      }
    });
    return map;
  }

  /**
   * collates the total student records across all subjects
   *
   * @param {platformShared.RecordSheet[]} sheets
   * @returns {platformShared.CumulativeRecordData}
   * @memberof ScoreSheet
   */
  studentCumulativeRecord(
    sheets: platformShared.StudentRecordMergeTermSheet[],
    grading: platformShared.GradingConfig,
    key: keyof platformShared.StudentRecordMergeTermSheet = 'total',
  ): platformShared.CumulativeRecordData {
    let total = 0;
    for (const sheet of sheets) {
      total += sheet[key] as number;
    }
    const average =
      total !== 0
        ? Math.round(sheets.length > 1 ? total / sheets.length : total)
        : total;
    const grade = gradePreset(grading, average).grade;
    return { average, grade, total };
  }

  /**
   * set the various terms total score for each subject.
   *
   * @param {platformShared.StudentRecordMergeTermSheet} report
   * @param {platformShared.StudentRecordMergeSheet} sheet
   * @param {platformShared.TermPreset} currentTerm
   * @returns
   * @memberof ScoreSheet
   */
  mapSheetToTermScores(
    report: platformShared.StudentRecordMergeTermSheet,
    sheet: platformShared.StudentRecordMergeSheet,
    currentTerm: platformShared.TermPreset,
    grading: platformShared.GradingConfig,
  ) {
    const { Lesson, First, Second, Third } = platformShared.TermPreset;
    if (sheet.term === currentTerm) {
      report = { ...report, ...sheet };
    }
    const calcumAvgs = platformShared.cummulativeAverage(currentTerm);
    if (sheet.term === First) {
      report.firstTerm = sheet.total;
    }
    if (sheet.term === Second) {
      report.secondTerm = sheet.total;
    }
    if (sheet.term === Third) {
      report.thirdTerm = sheet.total;
    }
    report.cumAvg = calcumAvgs(report);
    report.cumGrade = gradePreset(grading, report.cumAvg).grade;
    return report;
  }
}
