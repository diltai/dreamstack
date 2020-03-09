import { Auth, EntityNames, FindQueryParam, ModelOperations, SearchFindRequest } from '@dilta/platform-shared';
import { ModelAction } from '@dilta/util';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DeepPartial } from 'typeorm';
import { IdentityService } from './identity.service';

const model = ModelAction(EntityNames.Auth);

@Controller('auth')
export class IdentityController {
    constructor(private svc: IdentityService) { }

    @MessagePattern(model(ModelOperations.Create))
    create([item]: [DeepPartial<Auth>]) {
        return this.svc.create$(item);
    }

    @MessagePattern(model(ModelOperations.Update))
    update([id, item]: [ string, DeepPartial<Auth>]) {
        return this.svc.update$(id, item);
    }

    @MessagePattern(model(ModelOperations.Delete))
    delete([query]: [DeepPartial<Auth>]) {
        return this.svc.delete$(query);
    }

    @MessagePattern(model(ModelOperations.Find))
    find([query, custom]: [ SearchFindRequest<Auth>, FindQueryParam]) {
        return this.svc.find$(query, custom);
    }

    @MessagePattern(model(ModelOperations.Retrieve))
    retrieve<T>([query]: [Partial<T>]) {
        return this.svc.retrieve$(query);
    }
}
