import { EntityNames, FindQueryParam, Manager, ModelOperations, SearchFindRequest } from '@dilta/platform-shared';
import { ModelAction } from '@dilta/util';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DeepPartial } from 'typeorm';
import { ManagerService } from './manager.service';

const model = ModelAction(EntityNames.Manager);

@Controller('manager')
export class ManagerController {
    constructor(private svc: ManagerService) { }

    @MessagePattern(model(ModelOperations.Create))
    create([item]: [DeepPartial<Manager>]) {
        return this.svc.create$(item);
    }

    @MessagePattern(model(ModelOperations.Update))
    update([id, item]: [string, DeepPartial<Manager>]) {
        return this.svc.update$(id, item);
    }

    @MessagePattern(model(ModelOperations.Delete))
    delete([query]: [DeepPartial<Manager>]) {
        return this.svc.delete$(query);
    }

    @MessagePattern(model(ModelOperations.Find))
    find([query, custom]: [SearchFindRequest<Manager>, FindQueryParam]) {
        return this.svc.find$(query, custom);
    }

    @MessagePattern(model(ModelOperations.Retrieve))
    retrieve<T>([query]: [Partial<T>]) {
        return this.svc.retrieve$(query);
    }

}
