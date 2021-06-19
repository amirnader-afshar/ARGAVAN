import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../services/TranslateService';


@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {

    constructor(private translate: TranslateService)
    {
    }

    transform(value: string, args: string[]): any {
        if (!value) return value;
        return this.translate.instant(value) || value;
    }

}

