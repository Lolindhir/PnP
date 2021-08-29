import { Spell } from "@models/spell.model";
import { SpellFilter, SpellFilterType } from "@models/spell-filter.model";
import { ArrayUtilities } from "@utilities/array.utilities";

export class SpellService {  

  public static filterSpells(list: Spell[], nameFilter: string, filters: SpellFilter[]) : Spell[] {
    
    //console.log('Filter called with \nname: %s \nsource: %s', nameFilter, sourceFilter );

    var returnList: Spell[] = new Array();
    list.forEach(spell => {

      //console.log('Current spell: ' + spell.name);          

      if(spell.filter(nameFilter, filters)){
        returnList.push(spell);
      }

    });      
    return returnList;
  }

  public static getLevelFilterOptions(): SpellFilter[] {  

    var levelFilterOptions: SpellFilter[] = new Array();
    for(var i = 0; i <= 9; i++){
      levelFilterOptions.push(new SpellFilter(SpellFilterType.Level, i));
    }
    return levelFilterOptions.sort(SpellFilter.compare);

  }

  public static getSchoolFilterOptions(): SpellFilter[] {
    
    var schoolFilterOptions: SpellFilter[] = new Array();
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Abjuration'));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Conjuration'));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Divination'));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Enchantment'));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Evocation'));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Illusion'));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Necromancy'));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Transmutation'));
    return schoolFilterOptions.sort(SpellFilter.compare);
  }

  public static getSourceFilterOptions(spells: Spell[]): SpellFilter[] {
    
    var differentSources: string[] = new Array();
    spells.forEach(spell => {

      if(!differentSources.includes(spell.source)){
        differentSources.push(spell.source);
        //sort array descending
        differentSources.sort(ArrayUtilities.stringCompareAscending);
      }

    });   

    var sourceFilterOptions: SpellFilter[] = new Array();
    differentSources.forEach(source => {

      sourceFilterOptions.push(new SpellFilter(SpellFilterType.Source, source));

    })

    return sourceFilterOptions.sort(SpellFilter.compare);
  }
}