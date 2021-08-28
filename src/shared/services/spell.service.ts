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
    return levelFilterOptions;
    
  }

  public static getSourceFilterOptions(spells: Spell[]): SpellFilter[] {
    
    var differentSources: string[] = new Array();
    spells.forEach(spell => {

      if(!differentSources.includes(spell.source)){
        differentSources.push(spell.source);
        //sort array descending
        ArrayUtilities.sortStringArrayAscending(differentSources);
      }

    });   

    var sourceFilterOptions: SpellFilter[] = new Array();
    differentSources.forEach(source => {

      sourceFilterOptions.push(new SpellFilter(SpellFilterType.Source, source));

    })

    return sourceFilterOptions;
  }
}