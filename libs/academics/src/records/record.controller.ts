import { EntityNames, FindQueryParam, ModelOperations, Record, SearchFindRequest } from '@dilta/platform-shared';
import { ModelAction } from '@dilta/util';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DeepPartial } from 'typeorm';
import { RecordService } from './record.service';

const model = ModelAction(EntityNames.Record);

@Controller('record')
export class RecordController {
    constructor(private svc: RecordService) { }

    @MessagePattern(model(ModelOperations.Create))
    create([item]: [DeepPartial<Record>]) {
        return this.svc.create$(item);
    }

    @MessagePattern(model(ModelOperations.Update))
    update([id, item]: [string, DeepPartial<Record>]) {
        return this.svc.update$(id, item);
    }

    @MessagePattern(model(ModelOperations.Delete))
    delete([query]: [DeepPartial<Record>]) {
        return this.svc.delete$(query);
    }

    @MessagePattern(model(ModelOperations.Find))
    find([query, custom]: [SearchFindRequest<Record>, FindQueryParam]) {
        return this.svc.find$(query, custom);
    }

    @MessagePattern(model(ModelOperations.Retrieve))
    retrieve<T>([query]: [Partial<T>]) {
        return this.svc.retrieve$(query);
    }

}
