import { Spell } from "@models/spell.model";
import { SpellFilter, SpellFilterType, SpellFilterGroup } from "@models/spell-filter.model";
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
    properties.damageTypes.forEach( damageType => {
      damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, damageType, properties))
    })
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

  public static getConcentrationFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var concentrationFilterOptions: SpellFilter[] = new Array();
    concentrationFilterOptions.push(new SpellFilter(SpellFilterType.Concentration, true, properties));
    concentrationFilterOptions.push(new SpellFilter(SpellFilterType.Concentration, false, properties));
    return concentrationFilterOptions.sort(SpellFilter.compare);

  }

  public static getRitualFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var ritualFiltersOptions: SpellFilter[] = new Array();
    ritualFiltersOptions.push(new SpellFilter(SpellFilterType.Ritual, true, properties));
    ritualFiltersOptions.push(new SpellFilter(SpellFilterType.Ritual, false, properties));
    return ritualFiltersOptions.sort(SpellFilter.compare);

  }

  public static getComponentVerbalFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var verbalFiltersOptions: SpellFilter[] = new Array();
    verbalFiltersOptions.push(new SpellFilter(SpellFilterType.ComponentVerbal, true, properties));
    verbalFiltersOptions.push(new SpellFilter(SpellFilterType.ComponentVerbal, false, properties));
    return verbalFiltersOptions.sort(SpellFilter.compare);

  }

  public static getComponentSomaticFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var somaticFiltersOptions: SpellFilter[] = new Array();
    somaticFiltersOptions.push(new SpellFilter(SpellFilterType.ComponentSomatic, true, properties));
    somaticFiltersOptions.push(new SpellFilter(SpellFilterType.ComponentSomatic, false, properties));
    return somaticFiltersOptions.sort(SpellFilter.compare);

  }

  public static getComponentMaterialFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var materialFiltersOptions: SpellFilter[] = new Array();
    materialFiltersOptions.push(new SpellFilter(SpellFilterType.ComponentMaterial, true, properties));
    materialFiltersOptions.push(new SpellFilter(SpellFilterType.ComponentMaterial, false, properties));
    return materialFiltersOptions.sort(SpellFilter.compare);

  }

  public static getMaterialValueFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var valueFiltersOptions: SpellFilter[] = new Array();
    valueFiltersOptions.push(new SpellFilter(SpellFilterType.MaterialValue, true, properties));
    valueFiltersOptions.push(new SpellFilter(SpellFilterType.MaterialValue, false, properties));
    return valueFiltersOptions.sort(SpellFilter.compare);

  }

  public static getMaterialConsumedFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var consumedFiltersOptions: SpellFilter[] = new Array();
    consumedFiltersOptions.push(new SpellFilter(SpellFilterType.MaterialConsumed, true, properties));
    consumedFiltersOptions.push(new SpellFilter(SpellFilterType.MaterialConsumed, false, properties));
    return consumedFiltersOptions.sort(SpellFilter.compare);

  }

  public static getUpcastableFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var upcastableFiltersOptions: SpellFilter[] = new Array();
    upcastableFiltersOptions.push(new SpellFilter(SpellFilterType.Upcastable, true, properties));
    upcastableFiltersOptions.push(new SpellFilter(SpellFilterType.Upcastable, false, properties));
    return upcastableFiltersOptions.sort(SpellFilter.compare);

  }

  public static getSpellModFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var spellModFiltersOptions: SpellFilter[] = new Array();
    spellModFiltersOptions.push(new SpellFilter(SpellFilterType.SpellMod, true, properties));
    spellModFiltersOptions.push(new SpellFilter(SpellFilterType.SpellMod, false, properties));
    return spellModFiltersOptions.sort(SpellFilter.compare);

  }

  public static getSourceFilterOptions(spells: Spell[], properties: SpellProperties): SpellFilter[] {
    
    var differentSources: string[] = new Array();
    spells.forEach(spell => {

      //get spell source without addition in brackets
      var spellSource = spell.source.split('(')[0].trim();

      if(!differentSources.includes(spellSource)){
        differentSources.push(spellSource);
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

  public static getSourceGroupFilterOptions(sourceFilterOptions: SpellFilter[], properties: SpellProperties): SpellFilterGroup[] {

    var sourceFilterGroupOptions: SpellFilterGroup[] = new Array();

    //core sources
    var coreFilters: SpellFilter[] = this.addFiltersByStringValue(['Player', 'Xanathar', 'Tasha'], sourceFilterOptions);
    sourceFilterGroupOptions.push({name: 'Official Core Books', filters: coreFilters});

    //official others
    var officialFilters: SpellFilter[] = this.addFiltersByStringValue(['Official', 'Unearthed', 'Wildemount', 'Fizban', 'Strixhaven'], sourceFilterOptions);
    sourceFilterGroupOptions.push({name: 'Official Other Content', filters: officialFilters});

    //third-party (all others)
    var thirdPartyFilters: SpellFilter[] = new Array();
    sourceFilterOptions.forEach( filter => {
      if(!coreFilters.includes(filter) && !officialFilters.includes(filter)){
        thirdPartyFilters.push(filter);
      }
    })
    sourceFilterGroupOptions.push({name: 'Third-Party Content', filters: thirdPartyFilters});

    return sourceFilterGroupOptions;
  }

  private static addFiltersByStringValue(relevantNames: string[], possibleFilters: SpellFilter[]): SpellFilter[]{

    var returnList: SpellFilter[] = new Array();

    possibleFilters.forEach( filter => {

      var valueName = filter.value as string;

      relevantNames.forEach( relevantName => {

        if(valueName.includes(relevantName)){
          returnList.push(filter);
        }

      })

    })

    return returnList;
  } 

}