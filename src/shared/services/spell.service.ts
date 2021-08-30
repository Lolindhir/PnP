import { Spell } from "@models/spell.model";
import { SpellFilter, SpellFilterType } from "@models/spell-filter.model";
import { SpellProperties } from "@models/spell-properties.model";
import { ArrayUtilities } from "@utilities/array.utilities";
import { SpellClass } from "@models/spell-class.model";

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

  public static getClassFilterOptions(properties: SpellProperties): SpellFilter[] {  

    var classFilterOptions: SpellFilter[] = new Array();
    properties.allowedClasses.forEach( spellClass => {
      classFilterOptions.push(new SpellFilter(SpellFilterType.Class, new SpellClass(spellClass, false, true)));
    })
    return classFilterOptions.sort(SpellFilter.compare);

  }

  public static getSubclassFilterOptions(properties: SpellProperties): SpellFilter[] {  

    var subclassFilterOptions: SpellFilter[] = new Array();
    properties.allowedSubclasses.forEach( spellSubclass => {
      subclassFilterOptions.push(new SpellFilter(SpellFilterType.Class, new SpellClass(spellSubclass, true, true)));
    })
    return subclassFilterOptions.sort(SpellFilter.compare);

  }

  public static getDamageTypeFilterOptions(): SpellFilter[] {
    
    var damageFilterOptions: SpellFilter[] = new Array();
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Bludgeoning'));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Slashing'));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Piercing'));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Acid'));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Cold'));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Fire'));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Force'));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Lightning'));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Necrotic'));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Poison'));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Psychic'));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Radiant'));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Thunder'));
    return damageFilterOptions.sort(SpellFilter.compare);
  }

  public static getCastingTimeFilterOptions(spells: Spell[]): SpellFilter[] {
    
    var differentTimes: string[] = new Array();
    spells.forEach(spell => {

      var spellTime = spell.castingTime;
      if(spellTime.includes('reaction')){
        spellTime = '1 reaction';
      }

      if(!differentTimes.includes(spellTime)){
        differentTimes.push(spellTime);
        //sort array descending
        differentTimes.sort(ArrayUtilities.stringCompareAscending);
      }

    });   

    var castingTimeFilterOptions: SpellFilter[] = new Array();
    differentTimes.forEach(castingTime => {

      castingTimeFilterOptions.push(new SpellFilter(SpellFilterType.CastingTime, castingTime));

    })

    return castingTimeFilterOptions.sort(SpellFilter.compare);
  }

  public static getDurationFilterOptions(spells: Spell[]): SpellFilter[] {
    
    var differentDurations: string[] = new Array();
    spells.forEach(spell => {

      if(!differentDurations.includes(spell.duration)){
        differentDurations.push(spell.duration);
        //sort array descending
        differentDurations.sort(ArrayUtilities.stringCompareAscending);
      }

    });   

    var durationFilterOptions: SpellFilter[] = new Array();
    differentDurations.forEach(duration => {

      durationFilterOptions.push(new SpellFilter(SpellFilterType.Duration, duration));

    })

    return durationFilterOptions.sort(SpellFilter.compare);
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