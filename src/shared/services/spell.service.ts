import { Spell } from "@models/spell.model";
import { SpellFilter, SpellFilterType, SpellFilterGroup } from "@models/spell-filter.model";
import { SpellProperties } from "@models/spell-properties.model";
import { SpellRange } from "@models/spell-range.model";
import { ArrayUtilities } from "@utilities/array.utilities";
import { SpellClass } from "@models/spell-class.model";

export class SpellService {  

  public static filterSpells(list: Spell[], nameFilter: string, filters: SpellFilter[], impliciteFilters: SpellFilter[]) : Spell[] {
    
    //console.log('Filter called with \nname: %s \nsource: %s', nameFilter, sourceFilter );

    var returnList: Spell[] = new Array();
    list.forEach(spell => {

      //console.log('Current spell: ' + spell.name);          

      if(spell.filter(nameFilter, filters.concat(impliciteFilters))){
        returnList.push(spell);
      }

    });      
    return returnList;
  }

  public static getLevelFilterOptions(properties: SpellProperties): SpellFilter[] {  

    var levelFilterOptions: SpellFilter[] = new Array();
    for(var i = -1; i <= 9; i++){
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

  public static getSingleClassFilterOptions(properties: SpellProperties): SpellFilter[] {  

    var classFilterOptions: SpellFilter[] = new Array();
    properties.allowedClasses.forEach( spellClass => {
      classFilterOptions.push(new SpellFilter(SpellFilterType.ClassSingle, new SpellClass(spellClass, false, true), properties));
    })
    return classFilterOptions.sort(SpellFilter.compare);

  }

  public static getMustClassFilterOptions(properties: SpellProperties): SpellFilter[] {  

    var classFilterOptions: SpellFilter[] = new Array();
    properties.allowedClasses.forEach( spellClass => {
      classFilterOptions.push(new SpellFilter(SpellFilterType.ClassMust, new SpellClass(spellClass, false, true), properties));
    })
    return classFilterOptions.sort(SpellFilter.compare);

  }

  public static getNotClassFilterOptions(properties: SpellProperties): SpellFilter[] {  

    var classFilterOptions: SpellFilter[] = new Array();
    properties.allowedClasses.forEach( spellClass => {
      classFilterOptions.push(new SpellFilter(SpellFilterType.ClassNot, new SpellClass(spellClass, false, true), properties));
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

  public static getConditionFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var conditionFilterOptions: SpellFilter[] = new Array();
    properties.conditions.forEach( condition => {
      conditionFilterOptions.push(new SpellFilter(SpellFilterType.Condition, condition, properties))
    })
    return conditionFilterOptions.sort(SpellFilter.compare);
  }

  public static getSaveFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var saveFilterOptions: SpellFilter[] = new Array();
    properties.saves.forEach( save => {
      saveFilterOptions.push(new SpellFilter(SpellFilterType.Save, save, properties))
    })
    return saveFilterOptions.sort(SpellFilter.compare);
  }

  public static getAttackTypeFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var attackTypeFilterOptions: SpellFilter[] = new Array();
    properties.attackTypes.forEach( attackType => {
      if(attackType != 'Ability Check'){
        attackTypeFilterOptions.push(new SpellFilter(SpellFilterType.AttackType, attackType, properties))
      }
    })
    return attackTypeFilterOptions.sort(SpellFilter.compare);
  }

  public static getAffectedTargetsFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var targetFilterOptions: SpellFilter[] = new Array();
    properties.targets.forEach( target => {
      if(!target.toLowerCase().includes('upcast')){
        targetFilterOptions.push(new SpellFilter(SpellFilterType.AffectedTargets, target, properties))
      }
    })
    return targetFilterOptions.sort(SpellFilter.compare);
  }

  public static getAttackSaveFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var attackSaveFilterOptions: SpellFilter[] = new Array();
    attackSaveFilterOptions.push(new SpellFilter(SpellFilterType.AttackSave, 'Attack', properties));
    attackSaveFilterOptions.push(new SpellFilter(SpellFilterType.AttackSave, 'Save', properties));
    attackSaveFilterOptions.push(new SpellFilter(SpellFilterType.AttackSave, 'Ability Check', properties));
    attackSaveFilterOptions.push(new SpellFilter(SpellFilterType.AttackSave, 'None', properties));
    return attackSaveFilterOptions.sort(SpellFilter.compare);
  }

  public static getRangeFilterOptions(properties: SpellProperties): SpellFilter[] {    
    return SpellRange.getCategoryFilterOptions(properties);
  }

  public static getTagFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var tagFilterOptions: SpellFilter[] = new Array();
    properties.tags.forEach( tag => {
      tagFilterOptions.push(new SpellFilter(SpellFilterType.Tag, tag, properties))
    })
    return tagFilterOptions.sort(SpellFilter.compare);
  }

  public static getSingleTagFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var tagFilterOptions: SpellFilter[] = new Array();
    properties.tags.forEach( tag => {
      tagFilterOptions.push(new SpellFilter(SpellFilterType.TagSingle, tag, properties))
    })
    return tagFilterOptions.sort(SpellFilter.compare);
  }

  public static getMustTagFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var tagFilterOptions: SpellFilter[] = new Array();
    properties.tags.forEach( tag => {
      tagFilterOptions.push(new SpellFilter(SpellFilterType.TagMust, tag, properties))
    })
    return tagFilterOptions.sort(SpellFilter.compare);
  }

  public static getNotTagFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var tagFilterOptions: SpellFilter[] = new Array();
    properties.tags.forEach( tag => {
      tagFilterOptions.push(new SpellFilter(SpellFilterType.TagNot, tag, properties))
    })
    return tagFilterOptions.sort(SpellFilter.compare);
  }

  public static getPresetFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var presetFilterOptions: SpellFilter[] = new Array();
    properties.presets.forEach( preset => {
      presetFilterOptions.push(new SpellFilter(SpellFilterType.Preset, preset, properties))
    })
    return presetFilterOptions.sort(SpellFilter.compare);
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

  public static getTargetCasterFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var targetCasterFiltersOptions: SpellFilter[] = new Array();
    targetCasterFiltersOptions.push(new SpellFilter(SpellFilterType.TargetCaster, true, properties));
    targetCasterFiltersOptions.push(new SpellFilter(SpellFilterType.TargetCaster, false, properties));
    return targetCasterFiltersOptions.sort(SpellFilter.compare);

  }

  public static getCategoryKnownFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var knownFiltersOptions: SpellFilter[] = new Array();
    knownFiltersOptions.push(new SpellFilter(SpellFilterType.CategoryKnown, true, properties));
    knownFiltersOptions.push(new SpellFilter(SpellFilterType.CategoryKnown, false, properties));
    return knownFiltersOptions.sort(SpellFilter.compare);

  }

  public static getCategoryAlwaysFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var alwaysFiltersOptions: SpellFilter[] = new Array();
    alwaysFiltersOptions.push(new SpellFilter(SpellFilterType.CategoryAlways, true, properties));
    alwaysFiltersOptions.push(new SpellFilter(SpellFilterType.CategoryAlways, false, properties));
    return alwaysFiltersOptions.sort(SpellFilter.compare);

  }

  public static getCategoryLimitedFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var limitedFiltersOptions: SpellFilter[] = new Array();
    limitedFiltersOptions.push(new SpellFilter(SpellFilterType.CategoryLimited, true, properties));
    limitedFiltersOptions.push(new SpellFilter(SpellFilterType.CategoryLimited, false, properties));
    return limitedFiltersOptions.sort(SpellFilter.compare);

  }

  public static getCategoryRitualCastFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var ritualCastFiltersOptions: SpellFilter[] = new Array();
    ritualCastFiltersOptions.push(new SpellFilter(SpellFilterType.CategoryRitualCast, true, properties));
    ritualCastFiltersOptions.push(new SpellFilter(SpellFilterType.CategoryRitualCast, false, properties));
    return ritualCastFiltersOptions.sort(SpellFilter.compare);

  }

  public static getCategoryPreparedFilterOptions(properties: SpellProperties): SpellFilter[] {
    
    var preparedFiltersOptions: SpellFilter[] = new Array();
    preparedFiltersOptions.push(new SpellFilter(SpellFilterType.CategoryPrepared, true, properties));
    preparedFiltersOptions.push(new SpellFilter(SpellFilterType.CategoryPrepared, false, properties));
    return preparedFiltersOptions.sort(SpellFilter.compare);

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