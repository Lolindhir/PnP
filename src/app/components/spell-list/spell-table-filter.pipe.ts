import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spellTableFilter'
})
export class SpellTableFilterPipe implements PipeTransform {

  transform(list: any[], value: string) {
  

    return value ? list.filter(item => item.gender === value) : list;
  }

}