import { EntityNames, FindQueryParam, ModelOperations, SearchFindRequest } from '@dilta/platform-shared';
import { ModelAction } from '@dilta/util';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DeepPartial } from 'typeorm';
import { Parent } from './parent.entity';
import { ParentService } from './parent.service';

const model = ModelAction(EntityNames.Parent);

@Controller('parent')
export class ParentController {
    constructor(private svc: ParentService) { }

    @MessagePattern(model(ModelOperations.Create))
    create([item]: [DeepPartial<Parent>]) {
        return this.svc.create$(item);
    }

    @MessagePattern(model(ModelOperations.Update))
    update([id, item]: [string, DeepPartial<Parent>]) {
        return this.svc.update$(id, item);
    }

    @MessagePattern(model(ModelOperations.Delete))
    delete([query]: [DeepPartial<Parent>]) {
        return this.svc.delete$(query);
    }

    @MessagePattern(model(ModelOperations.Find))
    find([query, custom]: [SearchFindRequest<Parent>, FindQueryParam]) {
        return this.svc.find$(query, custom);
    }

    @MessagePattern(model(ModelOperations.Retrieve))
    retrieve<T>([query]: [Partial<T>]) {
        return this.svc.retrieve$(query);
    }
}
