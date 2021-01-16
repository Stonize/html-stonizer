import * as _ from 'lodash';

export class ObjectDto {
    public getField(object: any = {}, field: string) {
        if (field in object) {
            _.set(this, field, _.get(object, field));
        }
    }
}
