import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spellTableFilter'
})
export class SpellTableFilterPipe implements PipeTransform {

    transform(list: any[], filters: any) {
        
        const keys = Object.keys(filters).filter(key => filters[key]);

        const filterUser = (user: { [x: string]: any; }) => keys.every(key => user[key] === filters[key]);

        return keys.length ? list.filter(filterUser) : list;
    }
}