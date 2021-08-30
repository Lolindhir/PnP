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

  public static getLevelFilterOptions(properties: SpellProperties): SpellFilter[] {  

    var levelFilterOptions: SpellFilter[] = new Array();
    for(var i = 0; i <= 9; i++){
      levelFilterOptions.push(new SpellFilter(SpellFilterType.Level, i, properties));
    }
    return levelFilterOptions.sort(SpellFilter.compare);

  }

  public static getSchoolFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var schoolFilterOptions: SpellFilter[] = new Array();
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Abjuration', properties));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Conjuration', properties));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Divination', properties));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Enchantment', properties));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Evocation', properties));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Illusion', properties));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Necromancy', properties));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Transmutation', properties));
    return schoolFilterOptions.sort(SpellFilter.compare);
  }

  public static getClassFilterOptions(properties: SpellProperties): SpellFilter[] {  

    var classFilterOptions: SpellFilter[] = new Array();
    properties.allowedClasses.forEach( spellClass => {
      classFilterOptions.push(new SpellFilter(SpellFilterType.Class, new SpellClass(spellClass, false, true), properties));
    })
    return classFilterOptions.sort(SpellFilter.compare);

  }

  public static getSubclassFilterOptions(properties: SpellProperties): SpellFilter[] {  

    var subclassFilterOptions: SpellFilter[] = new Array();
    properties.allowedSubclasses.forEach( spellSubclass => {
      subclassFilterOptions.push(new SpellFilter(SpellFilterType.Class, new SpellClass(spellSubclass, true, true), properties));
    })
    return subclassFilterOptions.sort(SpellFilter.compare);

  }

  public static getDamageTypeFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var damageFilterOptions: SpellFilter[] = new Array();
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Bludgeoning', properties));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Slashing', properties));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Piercing', properties));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Acid', properties));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Cold', properties));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Fire', properties));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Force', properties));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Lightning', properties));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Necrotic', properties));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Poison', properties));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Psychic', properties));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Radiant', properties));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Thunder', properties));
    return damageFilterOptions.sort(SpellFilter.compare);
  }

  public static getCastingTimeFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var castingTimeFilterOptions: SpellFilter[] = new Array();
    properties.castingTimes.forEach( castingTime => {
      castingTimeFilterOptions.push(new SpellFilter(SpellFilterType.CastingTime, castingTime, properties));
    })
    return castingTimeFilterOptions.sort(SpellFilter.compare);

  }

  public static getDurationFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var durationFilterOptions: SpellFilter[] = new Array();
    properties.durations.forEach( duration => {
      durationFilterOptions.push(new SpellFilter(SpellFilterType.Duration, duration, properties));
    })
    return durationFilterOptions.sort(SpellFilter.compare);

  }

  public static getSourceFilterOptions(spells: Spell[], properties: SpellProperties): SpellFilter[] {
    
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

      sourceFilterOptions.push(new SpellFilter(SpellFilterType.Source, source, properties));

    })

    return sourceFilterOptions.sort(SpellFilter.compare);
  }
}