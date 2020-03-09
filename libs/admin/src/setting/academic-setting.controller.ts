import { AcademicSetting, EntityNames, FindQueryParam, ModelOperations, SearchFindRequest } from '@dilta/platform-shared';
import { ModelAction } from '@dilta/util';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DeepPartial } from 'typeorm';
import { AcademicSettingService } from './academic-setting.service';

const model = ModelAction(EntityNames.academic_setting);

@Controller('academicsetting')
export class AcademicSettingController {
    constructor(private svc: AcademicSettingService) { }

    @MessagePattern(model(ModelOperations.Create))
    create([item]: [DeepPartial<AcademicSetting>]) {
        return this.svc.create$(item);
    }

    @MessagePattern(model(ModelOperations.Update))
    update([id, item]: [string, DeepPartial<AcademicSetting>]) {
        return this.svc.update$(id, item);
    }

    @MessagePattern(model(ModelOperations.Delete))
    delete([query]: [DeepPartial<AcademicSetting>]) {
        return this.svc.delete$(query);
    }

    @MessagePattern(model(ModelOperations.Find))
    find([query, custom]: [SearchFindRequest<AcademicSetting>, FindQueryParam]) {
        return this.svc.find$(query, custom);
    }

    @MessagePattern(model(ModelOperations.Retrieve))
    retrieve<T>([query]: [Partial<T>]) {
        return this.svc.retrieve$(query);
    }

}
