import { SpellClass } from "@models/spell-class.model";
import { SpellProperties } from "@models/spell-properties.model";
import { SpellFilter, SpellFilterType } from "@models/spell-filter.model";
import { SpellTag } from "@models/spell-tag.model";
import { Preset } from "@models/preset.model";
import { of } from "rxjs";
import { SpellRange, SpellRangeCategory } from "./spell-range.model";

export interface RawSpell {  
  level: number;  
  name: string;  
  school: string;  
  levelSchool: string;
  ritual: boolean;
  castingTime: string;
  range: string;
  area: string;
  components: string[];
  materials: string;
  duration: string;
  concentration: boolean;
  description: string;
  source: string;
  classes: string[];  
  subclasses: string[];  
  allowed: boolean;
  damageTypes: string[];
  conditions: string[];
  saves: string[];
  attackTypes: string[];
  targets: string[];
  castingAbility: string;
  translation: string;
  tags: string[];
  asset: boolean;
}

export interface Spell {
  level: number;  
  levelDisplay: string;  
  name: string;  
  school: string;  
  levelSchoolDisplay: string;
  ritual: boolean;
  ritualTooltip: string;
  castingTime: string;
  castingTimeDisplayList: string;
  range: SpellRange;
  components: string[];
  componentsValue: boolean;
  componentsConsumed: boolean;
  componentsDisplay: string;
  componentsDisplayList: string;
  materialTooltip: string;
  duration: string;
  durationDisplayList: string;
  concentration: boolean;
  concentrationTooltip: string;
  description: string;
  source: string;
  classes: SpellClass[];
  classesDisplay: string;
  subclasses: SpellClass[];
  subclassesDisplay: string;
  allowed: boolean;
  damageTypes: string[];
  conditions: string[];
  saves: string[];
  attackTypes: string[];
  attacksSavesDisplay: string;
  targets: string[];
  castingAbility: string;
  tags: SpellTag[];
  translation: string;
  translatable: boolean;
  translated: boolean;
  descriptionDisplay: string;
  upcastable: boolean;
  upcastableTooltip: string;
  smallDisplay: string;
  asset: boolean;
  assetPath: string;
}

export class Spell implements Spell {  

  constructor(rawSpell: RawSpell, spellProperties: SpellProperties){
      
    //take straight raw values
    this.level = rawSpell.level;
    this.school = rawSpell.school;
    this.ritual = rawSpell.ritual;
    this.ritualTooltip = 'Castable as a ritual';
    this.castingTime = rawSpell.castingTime;
    this.castingTimeDisplayList = rawSpell.castingTime.includes('reaction') ? '1 Reaction' : this.capitalizeWords(rawSpell.castingTime);
    this.range = new SpellRange(rawSpell.range, rawSpell.area);
    this.components = rawSpell.components;
    this.duration = rawSpell.duration;
    this.concentration = rawSpell.concentration;
    this.concentrationTooltip = 'Requires concentration';
    this.description = rawSpell.description;
    this.upcastable = this.description.toLowerCase().includes('at higher levels');
    this.upcastableTooltip = 'Upgrades when casted at a higher level';
    this.source = rawSpell.source;
    this.allowed = rawSpell.allowed;
    this.damageTypes = rawSpell.damageTypes;
    this.conditions = rawSpell.conditions;
    this.saves = rawSpell.saves;
    this.attackTypes = rawSpell.attackTypes;
    this.targets = rawSpell.targets;
    this.castingAbility = rawSpell.castingAbility;
    this.translation = rawSpell.translation;
    this.descriptionDisplay = this.description;
    this.translated = false;
    this.translatable = this.translation != null && this.translation.length > 0 ? true : false;

    //cut names from spells
    var name: string = rawSpell.name;
    // name = name.replace('Leomund\'s ', '')
    // name = name.replace('Mordenkainen\'s ', '')
    // name = name.replace('Melf\'s ', '')
    // name = name.replace('Tasha\'s ', '')
    // name = name.replace('Abi-Dalzim\'s ', '')
    // name = name.replace('Icingdeath\'s ', 'Icing ')
    this.name = name;

    //build level display
    if(this.level === 0){
      this.levelDisplay = 'Cantrip';
    }
    if(this.level === 1){
      this.levelDisplay = '1st';
    }
    if(this.level === 2){
      this.levelDisplay = '2nd';
    }
    if(this.level === 3){
      this.levelDisplay = '3rd';
    }
    if(this.level >= 4){
      this.levelDisplay = this.level + 'th';
    }

    //build level school display
    var levelSchoolDisplay: string = rawSpell.levelSchool;
    if(rawSpell.ritual){
        levelSchoolDisplay = levelSchoolDisplay + ' (ritual)';
    }
    this.levelSchoolDisplay = levelSchoolDisplay;

    //build components display
    var componentsDisplay : string = '';
    this.components.forEach(component => {
        componentsDisplay = componentsDisplay === '' ? component : componentsDisplay + ', ' + component;
    });
    this.componentsDisplayList = componentsDisplay;
    if(rawSpell.materials != ''){
        componentsDisplay += ' (' + rawSpell.materials + ')';
    }
    this.componentsDisplay = componentsDisplay;

    //get component material/consumed
    this.componentsValue = this.componentsDisplay.toLowerCase().includes(' gp') ? true : false;
    this.componentsConsumed = this.componentsDisplay.toLowerCase().includes('consume') ? true : false;
    var materialTooltip = '';
    if(this.componentsValue && this.componentsConsumed){
      materialTooltip = 'Requires materials with gold value, which are consumed'; 
    }
    else if(this.componentsValue){
      materialTooltip = 'Requires materials with gold value'; 
    }
    else{
      materialTooltip = 'Requires materials, which are consumed'; 
    }
    this.materialTooltip = materialTooltip;

    //build small display
    var levelText: string = this.level === 0 ? this.levelDisplay : this.levelDisplay + ' level';
    this.smallDisplay = levelText + ' ' + this.school + ' - ' + this.componentsDisplayList;

    //build duration display
    var splitDuration: string[] = rawSpell.duration.toLowerCase().split('concentration, up to ');
    this.durationDisplayList = splitDuration.length > 1 ? this.capitalizeWords(splitDuration[1]) : this.capitalizeWords(rawSpell.duration);

    //build classes and classes dispaly
    var classes : SpellClass[] = new Array();
    var classesDisplay : string = '';
    rawSpell.classes.forEach(spellClass => {
        
        if(spellProperties.allowedClasses.includes(spellClass)){
          
          classes.push(new SpellClass(spellClass, false, true))
          classesDisplay = classesDisplay === '' ? spellClass : classesDisplay + ', ' + spellClass;

        }
    });
    this.classes = classes;
    this.classesDisplay = classesDisplay ? classesDisplay : 'unknown';

    //build subclasses and subclasses display
    var subclasses : SpellClass[] = new Array();
    var subclassesDisplay : string = '';
    rawSpell.subclasses.forEach(spellClass => {
        
        if(spellProperties.allowedSubclasses.includes(spellClass)){
          
          subclasses.push(new SpellClass(spellClass, true, true))
          subclassesDisplay = subclassesDisplay === '' ? spellClass : subclassesDisplay + ', ' + spellClass;

        }
    });
    this.subclasses = subclasses;
    this.subclassesDisplay = subclassesDisplay ? subclassesDisplay : '-';

    //build display of saves and attack types
    var savesAttacksDisplay : string = '';
    this.attackTypes.forEach(attackType => {
      savesAttacksDisplay = savesAttacksDisplay === '' ? attackType : savesAttacksDisplay + ', ' + attackType;
    });
    this.saves.forEach(save => {
      var shortenedSave = save.substring(0, 3).toUpperCase() + ' Save';
      savesAttacksDisplay = savesAttacksDisplay === '' ? shortenedSave : savesAttacksDisplay + ', ' + shortenedSave;
    });
    this.attacksSavesDisplay = savesAttacksDisplay === '' ? ' — ' : savesAttacksDisplay;

    //build tags
    var tags : SpellTag[] = new Array();
    rawSpell.tags.forEach(rawTag => {
        
        //iterate all tags and add the tag if it equals the raw tag
        spellProperties.tags.forEach(tag => {

          if(tag.name === rawTag){
            tags.push(tag)
          }

        })

    });
    this.tags = tags;

    //set asset path
    this.asset = rawSpell.asset;
    this.assetPath = "assets/spellImages/" + this.name + ".PNG";

  }    




  public filter(nameFilter: string, filters: SpellFilter[]) : boolean{
  
    if(nameFilter != '' && this.name.toLowerCase().indexOf(nameFilter.toLowerCase()) < 0){
      return false;
    }

    var filtersMatch: boolean = true;

    Object.values(SpellFilterType).forEach(typeAsString => {
      var type: SpellFilterType = typeAsString as SpellFilterType;
      if(filtersMatch === true){
        filtersMatch = this.filterMatches(type, filters.filter(filter => filter.type === type));
      }
    })

    return filtersMatch;

  }




  private filterMatches(filterType: SpellFilterType, filters: SpellFilter[]): boolean{

    if(filterType === null){
      return true;
    }

    if(filters === null || filters.length === 0){
      return true;
    }

    for(var i = 0; i < filters.length; i++){

      var filter: SpellFilter | undefined = filters[i];

      if(filter === undefined){
        continue;
      }

      switch(filterType) { 
        case SpellFilterType.Level: { 
          var level: number = filter.value as number;
          if(this.level === level){
            return true;
          } 
          break; 
        }
        case SpellFilterType.School: { 
          var school: string = filter.value as string;
          if(this.school === school){
            return true;
          } 
          break; 
        }
        case SpellFilterType.Class: {             
          var spellClass: SpellClass = filter.value as SpellClass;
          if(!spellClass.subclass){
            if(spellClass === null || this.classes.some(cla => cla.name === spellClass.name)){
              return true;
            }          
            break;
          }
          else{
            if(spellClass === null || this.subclasses.some(sub => sub.name === spellClass.name)){
              return true;
            }          
            break;
          }           
        }
        case SpellFilterType.ClassSingle: {             
          var spellClass: SpellClass = filter.value as SpellClass;
          if(spellClass === null){
            return true;
          }
          if(!spellClass.subclass){
            if(this.classes.length === 1 && this.classes.some(cla => cla.name === spellClass.name)){
              return true;
            }          
            break;
          }
          else{
            if(this.subclasses.length === 1 && this.subclasses.some(sub => sub.name === spellClass.name)){
              return true;
            }          
            break;
          }           
        }
        case SpellFilterType.ClassMust: {             
          var spellClass: SpellClass = filter.value as SpellClass;
          if(spellClass === null){
            return true;
          }
          if(!spellClass.subclass){
            if(!this.classes.some(cla => cla.name === spellClass.name)){
              return false;
            }          
            break;
          }
          else{
            if(!this.subclasses.some(sub => sub.name === spellClass.name)){
              return false;
            }          
            break;
          }           
        }
        case SpellFilterType.ClassNot: {             
          var spellClass: SpellClass = filter.value as SpellClass;
          if(spellClass === null){
            return true;
          }
          if(!spellClass.subclass){
            if(this.classes.some(cla => cla.name === spellClass.name)){
              return false;
            }          
            break;
          }
          else{
            if(this.subclasses.some(sub => sub.name === spellClass.name)){
              return false;
            }          
            break;
          }           
        }
        case SpellFilterType.CastingTime: {             
          var castingTime: string = filter.value as string;
          if(castingTime === '' || this.castingTime.toLowerCase().includes(castingTime.toLowerCase())){
            return true;
          }          
          break; 
        }
        case SpellFilterType.Duration: {             
          var duration: string = filter.value as string;
          if(duration === '' || this.duration.toLowerCase().includes(duration.toLowerCase())){
            return true;
          }          
          break; 
        }
        case SpellFilterType.Range: {             
          var rangeCategory: SpellRangeCategory = filter.value as SpellRangeCategory;
          if(rangeCategory === null || this.range.rangeCategory === rangeCategory){
            return true;
          }          
          break; 
        }
        case SpellFilterType.Ritual: {             
          var ritual: boolean = filter.value as boolean;
          if(ritual === null || this.ritual === ritual){
            return true;
          }          
          break; 
        }
        case SpellFilterType.Concentration: {             
          var concentration: boolean = filter.value as boolean;
          if(concentration === null || this.concentration === concentration){
            return true;
          }          
          break; 
        }
        case SpellFilterType.Upcastable: {             
          var upcastable: boolean = filter.value as boolean;
          if(upcastable === null || this.upcastable === upcastable){
            return true;
          }          
          break; 
        }
        case SpellFilterType.MaterialValue: {             
          var matValue: boolean = filter.value as boolean;
          if(matValue === null || this.componentsValue === matValue){
            return true;
          }          
          break; 
        }
        case SpellFilterType.MaterialConsumed: {             
          var matConsumed: boolean = filter.value as boolean;
          if(matConsumed === null || this.componentsConsumed === matConsumed){
            return true;
          }          
          break; 
        }
        case SpellFilterType.ComponentVerbal: {             
          var verbal: boolean = filter.value as boolean;
          if(verbal === null || this.components.includes('V') === verbal){
            return true;
          }          
          break; 
        }
        case SpellFilterType.ComponentSomatic: {             
          var somatic: boolean = filter.value as boolean;
          if(somatic === null || this.components.includes('S') === somatic){
            return true;
          }          
          break; 
        }
        case SpellFilterType.ComponentMaterial: {             
          var material: boolean = filter.value as boolean;
          if(material === null || this.components.includes('M') === material){
            return true;
          }          
          break; 
        }
        case SpellFilterType.DamageType: {             
          var damageType: string = filter.value as string;
          if(damageType === '' || this.damageTypes.includes(damageType)){
            return true;
          }          
          break; 
        }
        case SpellFilterType.Condition: {             
          var condition: string = filter.value as string;
          if(condition === '' || this.conditions.includes(condition)){
            return true;
          }          
          break; 
        }
        case SpellFilterType.AttackSave: {             
          var attackSave: string = filter.value as string;
          if(attackSave === ''){
            return true;
          }        
          if(attackSave.toLowerCase() === 'save' && this.saves.length > 0){
            return true;
          }
          for(var attack of this.attackTypes){
            console.log(attack as string);
            if(attack.toLowerCase().includes(attackSave.toLowerCase())){
              return true;
            }
          }
          if(attackSave.toLowerCase() === 'none' && this.saves.length === 0 && this.attackTypes.length === 0){
            return true;
          }
          break; 
        }
        case SpellFilterType.Save: {             
          var save: string = filter.value as string;
          if(save === '' || this.saves.includes(save)){
            return true;
          }          
          break; 
        }
        case SpellFilterType.AttackType: {             
          var attackType: string = filter.value as string;
          if(attackType === '' || this.attackTypes.includes(attackType)){
            return true;
          }          
          break; 
        }
        case SpellFilterType.AffectedTargets: {             
          var affectedTarget: string = filter.value as string;
          if(affectedTarget === ''){
            return true;
          }
          for(var target of this.targets){
            if(target.toLowerCase().includes(affectedTarget.toLowerCase())){
              return true;
            }
          }
          break; 
        }
        case SpellFilterType.Tag: {             
          var tag: SpellTag = filter.value as SpellTag;
          if(tag === null || this.tags.includes(tag)){
            return true;
          }          
          break; 
        }
        case SpellFilterType.TagSingle: {             
          var tag: SpellTag = filter.value as SpellTag;
          if(tag === null || (this.tags.includes(tag) && this.tags.length === 1)){
            return true;
          }          
          break; 
        }
        case SpellFilterType.TagMust: {             
          var tag: SpellTag = filter.value as SpellTag;
          if(tag === null){
            return true;
          }   
          if(!this.tags.includes(tag)){
            return false;
          }
          break; 
        }
        case SpellFilterType.TagNot: {             
          var tag: SpellTag = filter.value as SpellTag;
          if(tag === null){
            return true;
          }
          if(this.tags.includes(tag)){
            return false;
          }
          break; 
        }
        case SpellFilterType.SpellMod: {             
          var spellMod: boolean = filter.value as boolean;
          if(spellMod === null || this.castingAbility.toLowerCase() === 'both'){
            return true;
          }
          //if yes, than true if spellMod true
          if(this.castingAbility.toLowerCase() === 'yes' && spellMod){
            return true;
          }
          //if no, than true if spellMod false
          if(this.castingAbility.toLowerCase() === 'no' && !spellMod){
            return true;
          } 
          break; 
        }
        case SpellFilterType.Preset: {             
          var preset: Preset = filter.value as Preset;
          if(preset === null){
            return true;
          }
          //check single name, which overrides every other condition
          if(preset.spells.includes(this.name)){
            return true;
          }
          //check classes and corresponding level
          if(preset.classes.length === 0 && preset.subclasses.length === 0 && preset.levels.includes(this.level)){
            return true;
          }
          for (var mainClass of preset.classes) {
            if(this.classes.filter(mainclass => mainclass.name === mainClass).length > 0 && preset.levels.includes(this.level)){
              return true;
            }
          }
          for (var subClass of preset.subclasses) {
            if(this.subclasses.filter(subclass => subclass.name === subClass).length > 0 && preset.levels.includes(this.level)){
              return true;
            }
          }                  
          break; 
        }  
        case SpellFilterType.Source: {             
          var source: string = filter.value as string;
          if(source === '' || this.source.toLowerCase().includes(source.toLowerCase())){
            return true;
          }          
          break; 
        }          
        default: { 
          console.log('Unknown filter type: ' + filter.type)
          return true;
        } 
      }

    }

    //not and must filter have to return true, if not triggered
    if(filterType === SpellFilterType.TagMust || filterType === SpellFilterType.TagNot || filterType === SpellFilterType.ClassMust || filterType === SpellFilterType.ClassNot){
      return true;
    }

    return false;
  }




  //capitalize all words of a string. 
  capitalizeWords(text: string) {
    return text.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
  };

}