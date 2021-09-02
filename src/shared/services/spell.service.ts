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
      levelFilterOptions.push(new SpellFilter(SpellFilterType.Level, i, properties, true));
    }
    return levelFilterOptions.sort(SpellFilter.compare);

  }

  public static getSchoolFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var schoolFilterOptions: SpellFilter[] = new Array();
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Abjuration', properties, true));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Conjuration', properties, true));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Divination', properties, true));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Enchantment', properties, true));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Evocation', properties, true));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Illusion', properties, true));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Necromancy', properties, true));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Transmutation', properties, true));
    return schoolFilterOptions.sort(SpellFilter.compare);
  }

  public static getClassFilterOptions(properties: SpellProperties): SpellFilter[] {  

    var classFilterOptions: SpellFilter[] = new Array();
    properties.allowedClasses.forEach( spellClass => {
      classFilterOptions.push(new SpellFilter(SpellFilterType.Class, new SpellClass(spellClass, false, true), properties, true));
    })
    return classFilterOptions.sort(SpellFilter.compare);

  }

  public static getSubclassFilterOptions(properties: SpellProperties): SpellFilter[] {  

    var subclassFilterOptions: SpellFilter[] = new Array();
    properties.allowedSubclasses.forEach( spellSubclass => {
      subclassFilterOptions.push(new SpellFilter(SpellFilterType.Class, new SpellClass(spellSubclass, true, true), properties, true));
    })
    return subclassFilterOptions.sort(SpellFilter.compare);

  }

  public static getDamageTypeFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var damageFilterOptions: SpellFilter[] = new Array();
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Bludgeoning', properties, true));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Slashing', properties, true));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Piercing', properties, true));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Acid', properties, true));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Cold', properties, true));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Fire', properties, true));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Force', properties, true));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Lightning', properties, true));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Necrotic', properties, true));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Poison', properties, true));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Psychic', properties, true));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Radiant', properties, true));
    damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, 'Thunder', properties, true));
    return damageFilterOptions.sort(SpellFilter.compare);
  }

  public static getCastingTimeFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var castingTimeFilterOptions: SpellFilter[] = new Array();
    properties.castingTimes.forEach( castingTime => {
      castingTimeFilterOptions.push(new SpellFilter(SpellFilterType.CastingTime, castingTime, properties, true));
    })
    return castingTimeFilterOptions.sort(SpellFilter.compare);

  }

  public static getDurationFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var durationFilterOptions: SpellFilter[] = new Array();
    properties.durations.forEach( duration => {
      durationFilterOptions.push(new SpellFilter(SpellFilterType.Duration, duration, properties, true));
    })
    return durationFilterOptions.sort(SpellFilter.compare);

  }

  public static getConcentrationFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var concentrationFilterOptions: SpellFilter[] = new Array();
    concentrationFilterOptions.push(new SpellFilter(SpellFilterType.Concentration, true, properties, false));
    concentrationFilterOptions.push(new SpellFilter(SpellFilterType.Concentration, false, properties, false));
    return concentrationFilterOptions.sort(SpellFilter.compare);

  }

  public static getRitualFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var ritualFiltersOptions: SpellFilter[] = new Array();
    ritualFiltersOptions.push(new SpellFilter(SpellFilterType.Ritual, true, properties, false));
    ritualFiltersOptions.push(new SpellFilter(SpellFilterType.Ritual, false, properties, false));
    return ritualFiltersOptions.sort(SpellFilter.compare);

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

      sourceFilterOptions.push(new SpellFilter(SpellFilterType.Source, source, properties, true));

    })

    return sourceFilterOptions.sort(SpellFilter.compare);
  }
}