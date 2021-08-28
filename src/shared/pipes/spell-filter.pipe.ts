import { Pipe, PipeTransform } from '@angular/core';
import { Spell } from '@models/spell.model';
import { SpellFilter } from '@models/spell-filter.model';
import { SpellService } from '@services/spell.service';


@Pipe({
  name: 'spellFilter'
})
export class SpellFilterPipe implements PipeTransform {

    transform(list: Spell[], nameFilter: string, filter: SpellFilter[]) : Spell[] {
      
      return SpellService.filterSpells(list, nameFilter, filter);
    }
}