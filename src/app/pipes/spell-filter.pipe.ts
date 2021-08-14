import { Pipe, PipeTransform } from '@angular/core';
import { Spell } from '@models/spell.model';


@Pipe({
  name: 'spellFilter'
})
export class SpellFilterPipe implements PipeTransform {

    transform(list: Spell[], nameFilter: String, sourceFilter: String) : Spell[] {
      
      console.log('Filter called with \nname: %s \nsource: %s', nameFilter, sourceFilter );
          
      //check if no filters are provided and if so return complete list
      if(nameFilter === '' && sourceFilter === ''){
        return list;
      }

      var returnList: Spell[] = new Array();   
    

      list.forEach(spell => {

        //console.log('Current spell: ' + spell.name);

        var addSpell: boolean = true;

        if(nameFilter != '' && spell.name.toLowerCase().indexOf(nameFilter.toLowerCase()) < 0 ){
          addSpell = false;
        }

        if(sourceFilter != '' && spell.source.toLowerCase() != sourceFilter.toLowerCase()){
          addSpell = false;
        }

        if(addSpell){
          returnList.push(spell);
        }

      });      

      //console.log('Return-List: ' + returnList);      

      return returnList;
    }
}