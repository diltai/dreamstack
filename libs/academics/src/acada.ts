import { MicroServiceToken } from '@dilta/util';
import { Logger, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ClassStaticsDetails } from './class-statics-details';
import { AcademicPromotion } from './promotion';
import { RecordModule } from './records/record.module';
import { ScoreSheet } from './score-sheet';
import { RecordOperations } from './subject-records';

@Module({
  imports: [
    ClientsModule.register([{
      name: MicroServiceToken,
      transport: Transport.TCP,
    }]),
    RecordModule,
  ],
  controllers: [
    ClassStaticsDetails,
    AcademicPromotion,
    ScoreSheet,
    RecordOperations,
  ],
  providers: [Logger],
})
export class AcademicModulesModule { }
