import { EntityNames, FindQueryParam, ModelOperations, SearchFindRequest, Student } from '@dilta/platform-shared';
import { ModelAction } from '@dilta/util';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DeepPartial } from 'typeorm';
import { StudentService } from './student.service';

const model = ModelAction(EntityNames.Student);

@Controller('student')
export class StudentController {
    constructor(private svc: StudentService) { }

    @MessagePattern(model(ModelOperations.Create))
    create([item]: [DeepPartial<Student>]) {
        return this.svc.create$(item);
    }

    @MessagePattern(model(ModelOperations.Update))
    update([id, item]: [string, DeepPartial<Student>]) {
        return this.svc.update$(id, item);
    }

    @MessagePattern(model(ModelOperations.Delete))
    delete([query]: [DeepPartial<Student>]) {
        return this.svc.delete$(query);
    }

    @MessagePattern(model(ModelOperations.Find))
    find([query, custom]: [SearchFindRequest<Student>, FindQueryParam]) {
        return this.svc.find$(query, custom);
    }

    @MessagePattern(model(ModelOperations.Retrieve))
    retrieve<T>([query]: [Partial<T>]) {
        return this.svc.retrieve$(query);
    }

}
