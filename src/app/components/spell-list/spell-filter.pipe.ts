import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spellFilter'
})
export class SpellFilterPipe implements PipeTransform {

    transform(list: any[], value: string) {
      
      console.log('Filter called with value: ' + value);

      var returnList: any[] = new Array();

      list.forEach(spell => {
        console.log('Current spell: ' + spell.name);

        if(spell.name.toUpperCase().indexOf(value.toUpperCase()) >= 0 ){
          returnList.push(spell);
        }
      });

      console.log('Return-List: ' + returnList);      

      return value? returnList : list;

      //return value ? list.filter(spell => spell.name === value) : list;
    }
}