import { EntityNames, FindQueryParam, ModelOperations, School, SearchFindRequest } from '@dilta/platform-shared';
import { ModelAction } from '@dilta/util';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DeepPartial } from 'typeorm';
import * as uuid from 'uuid/v4';
import { SchoolService } from './school.service';

const model = ModelAction(EntityNames.School);

@Controller('school')
export class SchoolController {
    constructor(private svc: SchoolService) { }

    @MessagePattern(model(ModelOperations.Create))
    create([item]: [DeepPartial<School>]) {
        item.globalId = uuid();
        return this.svc.create$(item);
    }

    @MessagePattern(model(ModelOperations.Update))
    update([id, item]: [string, DeepPartial<School>]) {
        return this.svc.update$(id, item);
    }

    @MessagePattern(model(ModelOperations.Delete))
    delete([query]: [DeepPartial<School>]) {
        return this.svc.delete$(query);
    }

    @MessagePattern(model(ModelOperations.Find))
    find([query, custom]: [SearchFindRequest<School>, FindQueryParam]) {
        return this.svc.find$(query, custom);
    }

    @MessagePattern(model(ModelOperations.Retrieve))
    retrieve<T>([query]: [Partial<T>]) {
        return this.svc.retrieve$(query);
    }

}
