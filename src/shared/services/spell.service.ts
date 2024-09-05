import { Injectable } from '@angular/core';
import { Spell, RawSpell } from "@models/spell.model";
import { SpellSource } from "@models/spell-source.model";
import { SpellFilter, SpellFilterType, SpellFilterGroup } from "@models/spell-filter.model";
import { SpellProperties } from "@models/spell-properties.model";
import { SpellRange } from "@models/spell-range.model";
import { ArrayUtilities } from "@utilities/array.utilities";
import { SpellClass } from "@models/spell-class.model";

//import data
import spellsData from 'D:/OneDrive/D&D/Website Content/Zauber/spells.json'; 
import spellPropertiesData from 'D:/OneDrive/D&D/Website Content/Zauber/spellProperties.json';


@Injectable({
  providedIn: 'root'
})
export class SpellService {  

  allSpells: Spell[] = new Array();
  spellProperties: SpellProperties = spellPropertiesData;

  constructor(){
    
    var rawSpells: RawSpell[] = spellsData;
    rawSpells.forEach(rawSpell => {      
      //only allowed spells
      if(!rawSpell.allowed){
        return;
      }
      //create spell
      this.allSpells.push(new Spell(rawSpell, this.spellProperties))
    });

  }

  public getSpellById(id: string): Spell | undefined {    

    return this.allSpells.find(spell => spell.id === id);

  }

  public static filterSpells(list: Spell[], nameFilter: string, filters: SpellFilter[], impliciteFilters: SpellFilter[]) : Spell[] {

    var returnList: Spell[] = new Array();
    list.forEach(spell => {

      //console.log('Current spell: ' + spell.name);          

      if(spell.filter(nameFilter, filters.concat(impliciteFilters))){
        returnList.push(spell);
      }

    });      
    return returnList;
  }

  public getLevelFilterOptions(): SpellFilter[] {  

    var levelFilterOptions: SpellFilter[] = new Array();
    for(var i = -1; i <= 9; i++){
      levelFilterOptions.push(new SpellFilter(SpellFilterType.Level, i, this.spellProperties));
    }
    return levelFilterOptions.sort(SpellFilter.compare);

  }

  public getSchoolFilterOptions(): SpellFilter[] {
    
    var schoolFilterOptions: SpellFilter[] = new Array();
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Abjuration',this.spellProperties));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Conjuration',this.spellProperties));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Divination',this.spellProperties));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Enchantment',this.spellProperties));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Evocation',this.spellProperties));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Illusion',this.spellProperties));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Necromancy',this.spellProperties));
    schoolFilterOptions.push(new SpellFilter(SpellFilterType.School, 'Transmutation',this.spellProperties));
    return schoolFilterOptions.sort(SpellFilter.compare);
  }

  public getClassFilterOptions(): SpellFilter[] {  

    var classFilterOptions: SpellFilter[] = new Array();
   this.spellProperties.allowedClasses.forEach( spellClass => {
      classFilterOptions.push(new SpellFilter(SpellFilterType.Class, new SpellClass(spellClass, false, true),this.spellProperties));
    })
    return classFilterOptions.sort(SpellFilter.compare);

  }

  public getSingleClassFilterOptions(): SpellFilter[] {  

    var classFilterOptions: SpellFilter[] = new Array();
   this.spellProperties.allowedClasses.forEach( spellClass => {
      classFilterOptions.push(new SpellFilter(SpellFilterType.ClassSingle, new SpellClass(spellClass, false, true),this.spellProperties));
    })
    return classFilterOptions.sort(SpellFilter.compare);

  }

  public getMustClassFilterOptions(): SpellFilter[] {  

    var classFilterOptions: SpellFilter[] = new Array();
   this.spellProperties.allowedClasses.forEach( spellClass => {
      classFilterOptions.push(new SpellFilter(SpellFilterType.ClassMust, new SpellClass(spellClass, false, true),this.spellProperties));
    })
    return classFilterOptions.sort(SpellFilter.compare);

  }

  public getNotClassFilterOptions(): SpellFilter[] {  

    var classFilterOptions: SpellFilter[] = new Array();
   this.spellProperties.allowedClasses.forEach( spellClass => {
      classFilterOptions.push(new SpellFilter(SpellFilterType.ClassNot, new SpellClass(spellClass, false, true),this.spellProperties));
    })
    return classFilterOptions.sort(SpellFilter.compare);

  }

  public getSubclassFilterOptions(): SpellFilter[] {  

    var subclassFilterOptions: SpellFilter[] = new Array();
   this.spellProperties.allowedSubclasses.forEach( spellSubclass => {
      subclassFilterOptions.push(new SpellFilter(SpellFilterType.Class, new SpellClass(spellSubclass, true, true),this.spellProperties));
    })
    return subclassFilterOptions.sort(SpellFilter.compare);

  }

  public getDamageTypeFilterOptions(): SpellFilter[] {
    
    var damageFilterOptions: SpellFilter[] = new Array();
   this.spellProperties.damageTypes.forEach( damageType => {
      damageFilterOptions.push(new SpellFilter(SpellFilterType.DamageType, damageType,this.spellProperties))
    })
    return damageFilterOptions.sort(SpellFilter.compare);
  }

  public getConditionFilterOptions(): SpellFilter[] {
    
    var conditionFilterOptions: SpellFilter[] = new Array();
   this.spellProperties.conditions.forEach( condition => {
      conditionFilterOptions.push(new SpellFilter(SpellFilterType.Condition, condition,this.spellProperties))
    })
    return conditionFilterOptions.sort(SpellFilter.compare);
  }

  public getSaveFilterOptions(): SpellFilter[] {
    
    var saveFilterOptions: SpellFilter[] = new Array();
   this.spellProperties.saves.forEach( save => {
      saveFilterOptions.push(new SpellFilter(SpellFilterType.Save, save,this.spellProperties))
    })
    return saveFilterOptions.sort(SpellFilter.compare);
  }

  public getAttackTypeFilterOptions(): SpellFilter[] {
    
    var attackTypeFilterOptions: SpellFilter[] = new Array();
   this.spellProperties.attackTypes.forEach( attackType => {
      if(attackType != 'Ability Check'){
        attackTypeFilterOptions.push(new SpellFilter(SpellFilterType.AttackType, attackType,this.spellProperties))
      }
    })
    return attackTypeFilterOptions.sort(SpellFilter.compare);
  }

  public getAffectedTargetsFilterOptions(): SpellFilter[] {
    
    var targetFilterOptions: SpellFilter[] = new Array();
    targetFilterOptions.push(new SpellFilter(SpellFilterType.AffectedTargets, 'None',this.spellProperties))
    targetFilterOptions.push(new SpellFilter(SpellFilterType.AffectedTargets, 'Self',this.spellProperties))
    targetFilterOptions.push(new SpellFilter(SpellFilterType.AffectedTargets, 'Allies',this.spellProperties))
    targetFilterOptions.push(new SpellFilter(SpellFilterType.AffectedTargets, 'Enemies',this.spellProperties))
    targetFilterOptions.push(new SpellFilter(SpellFilterType.AffectedTargets, 'Objects',this.spellProperties))
    targetFilterOptions.push(new SpellFilter(SpellFilterType.AffectedTargets, 'Spells',this.spellProperties))
    return targetFilterOptions.sort(SpellFilter.compare);
  }

  public getNumberOfTargetsFilterOptions(): SpellFilter[] {
    
    var numberOfTargetsFilterOptions: SpellFilter[] = new Array();
    numberOfTargetsFilterOptions.push(new SpellFilter(SpellFilterType.NumberOfTargets, 'None',this.spellProperties))
    numberOfTargetsFilterOptions.push(new SpellFilter(SpellFilterType.NumberOfTargets, 'Single',this.spellProperties))
    numberOfTargetsFilterOptions.push(new SpellFilter(SpellFilterType.NumberOfTargets, 'Multiple',this.spellProperties))
    numberOfTargetsFilterOptions.push(new SpellFilter(SpellFilterType.NumberOfTargets, 'MultipleUpcast',this.spellProperties))
    numberOfTargetsFilterOptions.push(new SpellFilter(SpellFilterType.NumberOfTargets, 'AoE',this.spellProperties))
    return numberOfTargetsFilterOptions.sort(SpellFilter.compare);
  }

  public getAttackSaveFilterOptions(): SpellFilter[] {
    
    var attackSaveFilterOptions: SpellFilter[] = new Array();
    attackSaveFilterOptions.push(new SpellFilter(SpellFilterType.AttackSave, 'Attack',this.spellProperties));
    attackSaveFilterOptions.push(new SpellFilter(SpellFilterType.AttackSave, 'Save',this.spellProperties));
    attackSaveFilterOptions.push(new SpellFilter(SpellFilterType.AttackSave, 'Ability Check',this.spellProperties));
    attackSaveFilterOptions.push(new SpellFilter(SpellFilterType.AttackSave, 'None',this.spellProperties));
    return attackSaveFilterOptions.sort(SpellFilter.compare);
  }

  public getRangeFilterOptions(): SpellFilter[] {    
    return SpellRange.getCategoryFilterOptions(this.spellProperties);
  }

  public getThemeFilterOptions(): SpellFilter[] {
    
    var themeFilterOptions: SpellFilter[] = new Array();
   this.spellProperties.themes.forEach( theme => {
      themeFilterOptions.push(new SpellFilter(SpellFilterType.Theme, theme,this.spellProperties))
    })
    return themeFilterOptions.sort(SpellFilter.compare);
  }

  public getTagFilterOptions(): SpellFilter[] {
    
    var tagFilterOptions: SpellFilter[] = new Array();
   this.spellProperties.tags.forEach( tag => {
      tagFilterOptions.push(new SpellFilter(SpellFilterType.Tag, tag,this.spellProperties))
    })
    return tagFilterOptions.sort(SpellFilter.compare);
  }

  public getSingleTagFilterOptions(): SpellFilter[] {
    
    var tagFilterOptions: SpellFilter[] = new Array();
   this.spellProperties.tags.forEach( tag => {
      tagFilterOptions.push(new SpellFilter(SpellFilterType.TagSingle, tag,this.spellProperties))
    })
    return tagFilterOptions.sort(SpellFilter.compare);
  }

  public getMustTagFilterOptions(): SpellFilter[] {
    
    var tagFilterOptions: SpellFilter[] = new Array();
   this.spellProperties.tags.forEach( tag => {
      tagFilterOptions.push(new SpellFilter(SpellFilterType.TagMust, tag,this.spellProperties))
    })
    return tagFilterOptions.sort(SpellFilter.compare);
  }

  public getNotTagFilterOptions(): SpellFilter[] {
    
    var tagFilterOptions: SpellFilter[] = new Array();
   this.spellProperties.tags.forEach( tag => {
      tagFilterOptions.push(new SpellFilter(SpellFilterType.TagNot, tag,this.spellProperties))
    })
    return tagFilterOptions.sort(SpellFilter.compare);
  }

  public getPresetFilterOptions(ignoreDate: boolean): SpellFilter[] {
    
    //template options first (mostly PCs)
    var templateOptions: SpellFilter[] = new Array();
   this.spellProperties.presets.forEach( preset => {
      if(preset.template === true && (ignoreDate || Date.parse(preset.publishingDate) < Date.now())){
        templateOptions.push(new SpellFilter(SpellFilterType.Preset, preset,this.spellProperties))
      }
    })

    //non-template second
    var nonTemplateOptions: SpellFilter[] = new Array();
   this.spellProperties.presets.forEach( preset => {
      if(preset.template === false && (ignoreDate || Date.parse(preset.publishingDate) < Date.now())){
        nonTemplateOptions.push(new SpellFilter(SpellFilterType.Preset, preset,this.spellProperties))
      }
    })

    return templateOptions.sort(SpellFilter.compare).concat(nonTemplateOptions.sort(SpellFilter.compare));
  }

  public getCastingTimeFilterOptions(): SpellFilter[] {
    
    var castingTimeFilterOptions: SpellFilter[] = new Array();
   this.spellProperties.castingTimes.forEach( castingTime => {
      castingTimeFilterOptions.push(new SpellFilter(SpellFilterType.CastingTime, castingTime,this.spellProperties));
    })
    return castingTimeFilterOptions.sort(SpellFilter.compare);

  }

  public getDurationFilterOptions(): SpellFilter[] {
    
    var durationFilterOptions: SpellFilter[] = new Array();
   this.spellProperties.durations.forEach( duration => {
      durationFilterOptions.push(new SpellFilter(SpellFilterType.Duration, duration,this.spellProperties));
    })
    return durationFilterOptions.sort(SpellFilter.compare);

  }

  public getConcentrationFilterOptions(): SpellFilter[] {
    
    var concentrationFilterOptions: SpellFilter[] = new Array();
    concentrationFilterOptions.push(new SpellFilter(SpellFilterType.Concentration, true,this.spellProperties));
    concentrationFilterOptions.push(new SpellFilter(SpellFilterType.Concentration, false,this.spellProperties));
    return concentrationFilterOptions.sort(SpellFilter.compare);

  }

  public getRitualFilterOptions(): SpellFilter[] {
    
    var ritualFiltersOptions: SpellFilter[] = new Array();
    ritualFiltersOptions.push(new SpellFilter(SpellFilterType.Ritual, true,this.spellProperties));
    ritualFiltersOptions.push(new SpellFilter(SpellFilterType.Ritual, false,this.spellProperties));
    return ritualFiltersOptions.sort(SpellFilter.compare);

  }

  public getTargetCasterFilterOptions(): SpellFilter[] {
    
    var targetCasterFiltersOptions: SpellFilter[] = new Array();
    targetCasterFiltersOptions.push(new SpellFilter(SpellFilterType.TargetCaster, true,this.spellProperties));
    targetCasterFiltersOptions.push(new SpellFilter(SpellFilterType.TargetCaster, false,this.spellProperties));
    return targetCasterFiltersOptions.sort(SpellFilter.compare);

  }

  public getCategoryKnownFilterOptions(): SpellFilter[] {
    
    var knownFiltersOptions: SpellFilter[] = new Array();
    knownFiltersOptions.push(new SpellFilter(SpellFilterType.CategoryKnown, true,this.spellProperties));
    knownFiltersOptions.push(new SpellFilter(SpellFilterType.CategoryKnown, false,this.spellProperties));
    return knownFiltersOptions.sort(SpellFilter.compare);

  }

  public getCategoryAlwaysFilterOptions(): SpellFilter[] {
    
    var alwaysFiltersOptions: SpellFilter[] = new Array();
    alwaysFiltersOptions.push(new SpellFilter(SpellFilterType.CategoryAlways, true,this.spellProperties));
    alwaysFiltersOptions.push(new SpellFilter(SpellFilterType.CategoryAlways, false,this.spellProperties));
    return alwaysFiltersOptions.sort(SpellFilter.compare);

  }

  public getCategoryLimitedFilterOptions(): SpellFilter[] {
    
    var limitedFiltersOptions: SpellFilter[] = new Array();
    limitedFiltersOptions.push(new SpellFilter(SpellFilterType.CategoryLimited, true,this.spellProperties));
    limitedFiltersOptions.push(new SpellFilter(SpellFilterType.CategoryLimited, false,this.spellProperties));
    return limitedFiltersOptions.sort(SpellFilter.compare);

  }

  public getCategoryRitualCastFilterOptions(): SpellFilter[] {
    
    var ritualCastFiltersOptions: SpellFilter[] = new Array();
    ritualCastFiltersOptions.push(new SpellFilter(SpellFilterType.CategoryRitualCast, true,this.spellProperties));
    ritualCastFiltersOptions.push(new SpellFilter(SpellFilterType.CategoryRitualCast, false,this.spellProperties));
    return ritualCastFiltersOptions.sort(SpellFilter.compare);

  }

  public getCategoryPreparedFilterOptions(): SpellFilter[] {
    
    var preparedFiltersOptions: SpellFilter[] = new Array();
    preparedFiltersOptions.push(new SpellFilter(SpellFilterType.CategoryPrepared, true,this.spellProperties));
    preparedFiltersOptions.push(new SpellFilter(SpellFilterType.CategoryPrepared, false,this.spellProperties));
    return preparedFiltersOptions.sort(SpellFilter.compare);

  }

  public getCategoryRemovedFilterOptions(): SpellFilter[] {
    
    var removedFiltersOptions: SpellFilter[] = new Array();
    removedFiltersOptions.push(new SpellFilter(SpellFilterType.CategoryRemoved, true,this.spellProperties));
    removedFiltersOptions.push(new SpellFilter(SpellFilterType.CategoryRemoved, false,this.spellProperties));
    return removedFiltersOptions.sort(SpellFilter.compare);

  }

  public getComponentVerbalFilterOptions(): SpellFilter[] {
    
    var verbalFiltersOptions: SpellFilter[] = new Array();
    verbalFiltersOptions.push(new SpellFilter(SpellFilterType.ComponentVerbal, true,this.spellProperties));
    verbalFiltersOptions.push(new SpellFilter(SpellFilterType.ComponentVerbal, false,this.spellProperties));
    return verbalFiltersOptions.sort(SpellFilter.compare);

  }

  public getComponentSomaticFilterOptions(): SpellFilter[] {
    
    var somaticFiltersOptions: SpellFilter[] = new Array();
    somaticFiltersOptions.push(new SpellFilter(SpellFilterType.ComponentSomatic, true,this.spellProperties));
    somaticFiltersOptions.push(new SpellFilter(SpellFilterType.ComponentSomatic, false,this.spellProperties));
    return somaticFiltersOptions.sort(SpellFilter.compare);

  }

  public getComponentMaterialFilterOptions(): SpellFilter[] {
    
    var materialFiltersOptions: SpellFilter[] = new Array();
    materialFiltersOptions.push(new SpellFilter(SpellFilterType.ComponentMaterial, true,this.spellProperties));
    materialFiltersOptions.push(new SpellFilter(SpellFilterType.ComponentMaterial, false,this.spellProperties));
    return materialFiltersOptions.sort(SpellFilter.compare);

  }

  public getMaterialValueFilterOptions(): SpellFilter[] {
    
    var valueFiltersOptions: SpellFilter[] = new Array();
    valueFiltersOptions.push(new SpellFilter(SpellFilterType.MaterialValue, true,this.spellProperties));
    valueFiltersOptions.push(new SpellFilter(SpellFilterType.MaterialValue, false,this.spellProperties));
    return valueFiltersOptions.sort(SpellFilter.compare);

  }

  public getMaterialConsumedFilterOptions(): SpellFilter[] {
    
    var consumedFiltersOptions: SpellFilter[] = new Array();
    consumedFiltersOptions.push(new SpellFilter(SpellFilterType.MaterialConsumed, true,this.spellProperties));
    consumedFiltersOptions.push(new SpellFilter(SpellFilterType.MaterialConsumed, false,this.spellProperties));
    return consumedFiltersOptions.sort(SpellFilter.compare);

  }

  public getUpcastableFilterOptions(): SpellFilter[] {
    
    var upcastableFiltersOptions: SpellFilter[] = new Array();
    upcastableFiltersOptions.push(new SpellFilter(SpellFilterType.Upcastable, true,this.spellProperties));
    upcastableFiltersOptions.push(new SpellFilter(SpellFilterType.Upcastable, false,this.spellProperties));
    return upcastableFiltersOptions.sort(SpellFilter.compare);

  }

  public getUpdatedFilterOptions(): SpellFilter[] {
    
    var updatedFiltersOptions: SpellFilter[] = new Array();
    updatedFiltersOptions.push(new SpellFilter(SpellFilterType.Updated, true,this.spellProperties));
    updatedFiltersOptions.push(new SpellFilter(SpellFilterType.Updated, false,this.spellProperties));
    return updatedFiltersOptions.sort(SpellFilter.compare);

  }

  public getSpellModFilterOptions(): SpellFilter[] {
    
    var spellModFiltersOptions: SpellFilter[] = new Array();
    spellModFiltersOptions.push(new SpellFilter(SpellFilterType.SpellMod, true,this.spellProperties));
    spellModFiltersOptions.push(new SpellFilter(SpellFilterType.SpellMod, false,this.spellProperties));
    return spellModFiltersOptions.sort(SpellFilter.compare);

  }

  public getSourceFilterOptions(spells: Spell[]): SpellFilter[] {
    
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

      sourceFilterOptions.push(new SpellFilter(SpellFilterType.Source, source, this.spellProperties));

    })

    return sourceFilterOptions.sort(SpellFilter.compare);
  }

  public getSourceGroupFilterOptions(sourceFilterOptions: SpellFilter[]): SpellFilterGroup[] {

    var sourceFilterGroupOptions: SpellFilterGroup[] = new Array();

    //core sources
    var coreFilters: SpellFilter[] = this.addFiltersByStringValue(SpellSource.CategoryOfficialCore, sourceFilterOptions);
    sourceFilterGroupOptions.push({name: 'Official Core Books', filters: coreFilters});

    //official others
    var officialFilters: SpellFilter[] = this.addFiltersByStringValue(SpellSource.CategoryOfficialOther, sourceFilterOptions);
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

  private addFiltersByStringValue(relevantNames: string[], possibleFilters: SpellFilter[]): SpellFilter[]{

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