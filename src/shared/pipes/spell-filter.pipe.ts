import { Pipe, PipeTransform } from '@angular/core';
import { Spell } from '@models/spell.model';
import { SpellService } from '@services/spell.service';


@Pipe({
  name: 'spellFilter'
})
export class SpellFilterPipe implements PipeTransform {

    transform(list: Spell[], nameFilter: String, sourceFilter: String) : Spell[] {
      
      return SpellService.filterSpells(list, nameFilter, sourceFilter);
    }
}