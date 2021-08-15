import { Pipe, PipeTransform } from '@angular/core';
import { Spell } from '@models/spell.model';


@Pipe({
  name: 'spellFilter'
})
export class SpellFilterPipe implements PipeTransform {

    transform(list: Spell[], nameFilter: String, sourceFilter: String) : Spell[] {
      
      return Spell.filterSpells(list, nameFilter, sourceFilter);
    }
}