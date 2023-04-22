import { SpellClass } from "@models/spell-class.model";
import { SpellProperties } from "@models/spell-properties.model";
import { SpellFilter, SpellFilterType } from "@models/spell-filter.model";
import { SpellTag } from "@models/spell-tag.model";
import { SpellTarget } from "@models/spell-target.model";
import { SpellSource } from "@models/spell-source.model";
import { Preset } from "@models/preset.model";
import { SpellRange, SpellRangeCategory } from "./spell-range.model";


export enum SpellListCategory{
  known,
  knownNotAlways,
  knownCantrips,
  knownCantripsNotAlways,
  knownSpells,
  knownSpellsNotAlways,
  knownRituals,
  prepared,
  preparedCantrips,
  preparedSpells,
  always,
  removed,
  allButRemoved,
  limitedUsed,
  limitedNotUsed,
  ritualCastingSpells,
}

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
  themes: string[];
  asset: boolean;
}

export interface Spell {
  level: number;  
  levelDisplay: string;  
  name: string;  
  school: string;
  levelSchool: string;  
  levelSchoolDisplay: string;
  ritual: boolean;
  ritualTooltip: string;
  smiteSpell: boolean;
  smiteSpellTooltip: string;
  castingTime: string;
  castingTimeDisplayList: string;
  range: SpellRange;
  components: string[];
  componentsValue: boolean;
  componentsConsumed: boolean;
  componentsDisplay: string;
  componentsDisplayList: string;
  hasMaterials: boolean;
  materials: string;
  materialTooltip: string;
  duration: string;
  durationDisplayList: string;
  concentration: boolean;
  concentrationTooltip: string;
  description: string;
  source: string;
  sourceShortened: string;
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
  targetsDisplay: SpellTarget[];
  aoeIgnoresCaster: boolean;
  castingAbility: string;
  tags: SpellTag[];
  themes: string[];
  translation: string;
  translatable: boolean;
  translated: boolean;
  descriptionDisplay: string;
  upcastable: boolean;
  upcastableTooltip: string;
  smallDisplay: string;
  asset: boolean;
  assetPath: string;
  known: boolean;
  prepared: boolean;
  always: boolean;
  limited: boolean;
  ritualCast: boolean;
  used: boolean;
  removed: boolean;
  highlightColor: string;
}

export interface SpellPrintCsv {
  level: number;
  name: string;
  levelSchool: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  materialsAndDescription: string;
  forWho: string;
}

export interface SpellPrintDirect {
  id: string;
  level: number;
  name: string;
  nameSize: number;
  levelSchool: string;
  ritual: boolean;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  hasMaterials: boolean;
  materials: string;
  description: string;
  forWho: string;
  always: boolean;
  limited: boolean;
  ritualCast: boolean;
}

export class Spell implements Spell {  

  constructor(rawSpell: RawSpell, spellProperties: SpellProperties){
      
    //take straight raw values
    this.level = rawSpell.level;
    this.school = rawSpell.school;
    this.levelSchool = rawSpell.levelSchool;
    this.ritual = rawSpell.ritual;
    this.ritualTooltip = 'Castable as a ritual';
    this.castingTime = rawSpell.castingTime;
    this.range = new SpellRange(rawSpell.range, rawSpell.area);
    this.components = rawSpell.components;
    this.materials = rawSpell.materials;
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
    this.themes = rawSpell.themes;
    this.translation = rawSpell.translation;
    this.descriptionDisplay = this.description;
    this.translated = false;
    this.translatable = this.translation != null && this.translation.length > 0 ? true : false;
    this.known = false;
    this.prepared = false;
    this.always = false;
    this.limited = false;
    this.ritualCast = false;
    this.used = false;
    this.removed = false;
    this.highlightColor = 'white';

    //cut names from spells
    var name: string = rawSpell.name;
    name = name.replace('Leomund\'s ', '')
    name = name.replace('Mordenkainen\'s F', 'F')
    name = name.replace('Mordenkainen\'s M', 'M')
    name = name.replace('Mordenkainen\'s P', 'P')
    name = name.replace('Mordenkainen\'s S', 'Arcane S')
    name = name.replace('Maximilian\'s ', '')
    name = name.replace('Melf\'s ', '')
    name = name.replace('Tasha\'s ', '')
    name = name.replace('Rary\'s ', '')
    name = name.replace('Drawmij\'s ', '')
    name = name.replace('Abi-Dalzim\'s ', '')
    name = name.replace('Bigby\'s ', 'Arcane ')
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

    //build casting time display
    var castingTimeDisplay = this.capitalizeWords(rawSpell.castingTime);
    if(rawSpell.castingTime.includes('reaction')){
      castingTimeDisplay = '1 Reaction';
    }
    else if(rawSpell.castingTime.includes('bonus')){
      castingTimeDisplay = '1 Bonus Action';
    }
    this.castingTimeDisplayList = castingTimeDisplay;


    //build shortened source
    this.sourceShortened = SpellSource.GetAbbreviation(this.source);

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

    //get component contains material
    this.hasMaterials = this.componentsDisplay.toLowerCase().includes('m');
    
    //get component material/consumed
    this.componentsValue = this.componentsDisplay.toLowerCase().includes(' gp') || this.componentsDisplay.toLowerCase().includes(' sp') || this.componentsDisplay.toLowerCase().includes(' cp');
    this.componentsConsumed = this.componentsDisplay.toLowerCase().includes('consume');
    var materialTooltip = '';
    if(this.componentsValue && this.componentsConsumed){
      materialTooltip = 'Requires materials with value, which are consumed'; 
    }
    else if(this.componentsValue){
      materialTooltip = 'Requires materials with value'; 
    }
    else{
      materialTooltip = 'Requires materials, which are consumed'; 
    }
    this.materialTooltip = materialTooltip;

    //get smite spell information
    this.smiteSpell = rawSpell.castingTime.toLowerCase().includes('immediately after hitting');
    this.smiteSpellTooltip = 'This is a smite spell';


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

    //build display targets
    this.aoeIgnoresCaster = false;
    this.targetsDisplay = new Array();

    if(this.targets.some(target => target.toLowerCase().includes('none'))){
      //this.targetsDisplay.push({name: 'none', displayText: 'Untargeted', upcastableAsset: false});
    }
    if(this.targets.includes('Self')){
      if(this.targets.length > 2 || (this.targets.length === 2 && !this.targets.includes('None'))){
        //this.canAlsoTargetCaster = true;
      }
      else{
        this.targetsDisplay.push({name: 'self', displayText: 'Caster', upcastableAsset: false});
      }
    }
    if(this.targets.some(target => target.toLowerCase() === 'aoe')){
      if(this.range.displayTextComplete.toLowerCase().includes('self') && !this.targets.some(target => target.toLowerCase() === 'aoecaster')){
        this.aoeIgnoresCaster = true;
      }
      if(this.targets.some(target => target.toLowerCase() === 'aoeobject') && this.targets.some(target => target.toLowerCase() === 'aoespell')){
        this.targetsDisplay.push({name: 'aoe', displayText: 'AoE (incl. Spells & Objects)', upcastableAsset: false});
      }
      else if(this.targets.some(target => target.toLowerCase() === 'aoeobject')){
        this.targetsDisplay.push({name: 'aoe', displayText: 'AoE (incl. Objects)', upcastableAsset: false});
      }
      else if(this.targets.some(target => target.toLowerCase() === 'aoespell')){
        this.targetsDisplay.push({name: 'aoe', displayText: 'AoE (incl. Spells)', upcastableAsset: false});
      }
      else{
        this.targetsDisplay.push({name: 'aoe', displayText: 'AoE', upcastableAsset: false});
      }      
    }
    if(this.targets.some(target => target.toLowerCase().includes('ally'))){
      if(this.targets.some(target => target.toLowerCase() === 'aoeally') || this.targets.some(target => target.toLowerCase() === 'allymultiple')){
        this.targetsDisplay.push({name: 'friends', displayText: 'Friends', upcastableAsset: false});
      }
      else if(this.targets.some(target => target.toLowerCase() === 'allymultiple (upcast)')){
        this.targetsDisplay.push({name: 'friends', displayText: '1 Friend', upcastableAsset: true});
      }
      else{
        this.targetsDisplay.push({name: 'friends', displayText: '1 Friend', upcastableAsset: false});
      } 
    }
    if(this.targets.some(target => target.toLowerCase().includes('enemy'))){
      if(this.targets.some(target => target.toLowerCase() === 'aoeenemy')){
        this.targetsDisplay.push({name: 'enemies', displayText: 'Enemies', upcastableAsset: false});
      }
      else if(this.targets.some(target => target.toLowerCase() === 'enemymultiple')){
        if(this.targets.some(target => target.toLowerCase() === 'enemysingle')){
          this.targetsDisplay.push({name: 'enemies', displayText: 'Enemy(s)', upcastableAsset: false});
        }
        else {
          this.targetsDisplay.push({name: 'enemies', displayText: 'Enemies', upcastableAsset: false});
        }
      }
      else if(this.targets.some(target => target.toLowerCase() === 'enemymultiple (upcast)')){
        this.targetsDisplay.push({name: 'enemies', displayText: '1 Enemy', upcastableAsset: true});
      }
      else{
        this.targetsDisplay.push({name: 'enemies', displayText: '1 Enemy', upcastableAsset: false});
      }
    }    
    if(this.targets.some(target => target.toLowerCase().includes('spell')) && !(this.targets.some(target => target.toLowerCase() === 'aoespell') && this.targets.some(target => target.toLowerCase() === 'aoe'))){
      if(this.targets.some(target => target.toLowerCase() === 'aoespell') || this.targets.some(target => target.toLowerCase() === 'spellmultiple')){
        this.targetsDisplay.push({name: 'spells', displayText: 'Spells', upcastableAsset: false});
      }
      else if(this.targets.some(target => target.toLowerCase() === 'spellmultiple (upcast)')){
        this.targetsDisplay.push({name: 'spells', displayText: '1 Spell', upcastableAsset: true});
      }
      else{
        this.targetsDisplay.push({name: 'spells', displayText: '1 Spell', upcastableAsset: false});
      }
    }
    if(this.targets.some(target => target.toLowerCase().includes('object')) && !(this.targets.some(target => target.toLowerCase() === 'aoeobject') && this.targets.some(target => target.toLowerCase() === 'aoe'))){
      if(this.targets.some(target => target.toLowerCase() === 'aoeobject') || this.targets.some(target => target.toLowerCase() === 'objectmultiple')){
        this.targetsDisplay.push({name: 'objects', displayText: 'Objects', upcastableAsset: false});
      }
      else if(this.targets.some(target => target.toLowerCase() === 'objectmultiple (upcast)')){
        this.targetsDisplay.push({name: 'objects', displayText: '1 Object', upcastableAsset: true});
      }
      else{
        this.targetsDisplay.push({name: 'objects', displayText: '1 Object', upcastableAsset: false});
      }
    }

    // for(var target of this.targets){
    //   if(target === 'None'){
    //     //don't show, because it has no value in the view
    //     //this.targetsDisplay.push({name: target, displayText: 'No Targets', upcastableAsset: false});
    //   }
    //   if(target === 'Self'){ 
    //     if(this.targets.length > 2 || (this.targets.length === 2 && !this.targets.includes('None'))){
    //       this.canAlsoTargetCaster = true;
    //     }
    //     else{
    //       this.targetsDisplay.push({name: target, displayText: 'Only Caster', upcastableAsset: false});
    //     }
    //   }
    //   if(target === 'Single'){
    //     var upcastExists: boolean = this.targets.includes('Multiple (Upcast)');
    //     this.targetsDisplay.push({name: target, displayText: 'Single', upcastableAsset: upcastExists});
    //   }
    //   if(target === 'Multiple'){
    //     this.targetsDisplay.push({name: target, displayText: 'Multiple', upcastableAsset: false});
    //   }
    //   if(target === 'AoE'){
    //     this.targetsDisplay.push({name: target, displayText: 'AoE', upcastableAsset: false});
    //   }
    // }

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
    if(this.ritual){
      this.assetPath = "assets/spellImages/" + this.name + " (Ritual).PNG";
    }

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
          if(level === -1 && this.level > 0){
            return true;
          }
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
        case SpellFilterType.TargetCaster: {             
          var onlyCasterTargetable: boolean = filter.value as boolean;
          if(onlyCasterTargetable === null){
            return true;
          }
          //check spell if only self targetable
          var spellOnlyCaster: boolean = false;
          // if(this.range.displayTextComplete.toLowerCase().includes('self') && this.targets.includes('Self')){
          //   return true;
          // }
          if(this.targets.length === 1 && this.targets.includes('Self')){
            spellOnlyCaster = true;
          }
          if(this.targets.length === 2 && this.targets.includes('Self') && this.targets.includes('None')){
            spellOnlyCaster = true;
          }
          //check with input
          if(onlyCasterTargetable === spellOnlyCaster){
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
          if(affectedTarget === 'None' && this.targets.some(target => target.toLowerCase().includes('none'))){
            return true;
          }
          if(affectedTarget === 'Self' && this.targets.some(target => target.toLowerCase().includes('self'))){
            return true;
          }
          if(affectedTarget === 'Objects' && this.targets.some(target => target.toLowerCase().includes('object'))){
            return true;
          }
          if(affectedTarget === 'Spells' && this.targets.some(target => target.toLowerCase().includes('spell'))){
            return true;
          }
          if(affectedTarget === 'Allies' && this.targets.some(target => target.toLowerCase().includes('ally'))){
            return true;
          }
          if(affectedTarget === 'Enemies' && this.targets.some(target => target.toLowerCase().includes('enemy'))){
            return true;
          }
          //if target is AoE, it counts as 'against enemies' even if it could hit allies
          if(this.targets.some(target => target.toLowerCase() === 'aoe') && affectedTarget === 'Enemies'){
            return true;
          }
          break; 
        }
        case SpellFilterType.NumberOfTargets: {             
          var numberOfTargets: string = filter.value as string;
          if(numberOfTargets === ''){
            return true;
          }
          if(numberOfTargets === 'None' && this.targets.some(target => target.toLowerCase().includes('none'))){
            return true;
          }
          if(numberOfTargets === 'Single' && this.targets.some(target => target.toLowerCase().includes('single'))){
            return true;
          }
          if(numberOfTargets === 'Multiple' && this.targets.some(target => target.toLowerCase().includes('multiple') && !target.toLowerCase().includes('upcast'))){
            return true;
          }
          if(numberOfTargets === 'MultipleUpcast' && this.targets.some(target => target.toLowerCase().includes('multiple') && target.toLowerCase().includes('upcast'))){
            return true;
          }
          if(numberOfTargets === 'AoE' && this.targets.some(target => target.toLowerCase().includes('aoe'))){
            return true;
          }
          break; 
        }
        case SpellFilterType.Theme: {             
          var theme: string = filter.value as string;
          if(theme === null || this.themes.includes(theme)){
            return true;
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
          if(preset.spells.includes(this.name) || preset.alwaysKnownSpells.includes(this.name)){
            return true;
          }
          //check classes and corresponding level
          if(preset.classes.length === 0 && preset.subclasses.length === 0 && preset.alwaysKnownSubclasses.length === 0 && preset.levels.includes(this.level)){
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
          for (var subClass of preset.alwaysKnownSubclasses) {
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
        case SpellFilterType.SpellListCategory: {             
          var listCategory: SpellListCategory = filter.value as SpellListCategory;
          if(listCategory === null){
            return true;
          }
          if(listCategory === SpellListCategory.known && this.known){
            return true;
          }
          if(listCategory === SpellListCategory.knownNotAlways && this.known && !this.always){
            return true;
          }
          if(listCategory === SpellListCategory.knownCantrips && this.known && this.level === 0){
            return true;
          }
          if(listCategory === SpellListCategory.knownCantripsNotAlways && this.known && !this.always && this.level === 0){
            return true;
          }
          if(listCategory === SpellListCategory.knownSpells && this.known && this.level > 0){
            return true;
          }
          if(listCategory === SpellListCategory.knownSpellsNotAlways && this.known && !this.always && this.level > 0){
            return true;
          }
          if(listCategory === SpellListCategory.knownRituals && this.known && this.ritual){
            return true;
          }
          if(listCategory === SpellListCategory.prepared && this.prepared){
            return true;
          }
          if(listCategory === SpellListCategory.preparedCantrips && this.prepared && this.level === 0){
            return true;
          }
          if(listCategory === SpellListCategory.preparedSpells && this.prepared && this.level > 0){
            return true;
          }
          if(listCategory === SpellListCategory.always && this.always){
            return true;
          }
          if(listCategory === SpellListCategory.removed && this.removed){
            return true;
          }
          if(listCategory === SpellListCategory.allButRemoved && !this.removed){
            return true;
          }
          if(listCategory === SpellListCategory.limitedNotUsed && this.limited && !this.used){
            return true;
          }
          if(listCategory === SpellListCategory.limitedUsed && this.limited && this.used){
            return true;
          }
          if(listCategory === SpellListCategory.ritualCastingSpells && this.ritualCast){
            return true;
          }
          break; 
        }
        case SpellFilterType.CategoryKnown: {             
          var known: boolean = filter.value as boolean;
          if(known === null || this.known === known){
            return true;
          }          
          break; 
        }
        case SpellFilterType.CategoryAlways: {             
          var always: boolean = filter.value as boolean;
          if(always === null || this.always === always){
            return true;
          }          
          break; 
        }
        case SpellFilterType.CategoryLimited: {             
          var limited: boolean = filter.value as boolean;
          if(limited === null || this.limited === limited){
            return true;
          }          
          break; 
        }
        case SpellFilterType.CategoryRitualCast: {             
          var ritual: boolean = filter.value as boolean;
          if(ritual === null || this.ritualCast === ritual){
            return true;
          }          
          break; 
        }
        case SpellFilterType.CategoryPrepared: {             
          var prepared: boolean = filter.value as boolean;
          if(prepared === null || this.prepared === prepared){
            return true;
          }          
          break; 
        } 
        case SpellFilterType.CategoryRemoved: {             
          var removed: boolean = filter.value as boolean;
          if(removed === null || this.removed === removed){
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

  public static compareKnownLevelFirst(a: Spell, b: Spell) {        
    
    var knownA: boolean = a.known || a.limited || a.always || a.ritualCast;
    var knownB: boolean = b.known || b.limited || b.always || b.ritualCast;

    if(knownA && !knownB){
      return -1;
    }
    if(!knownA && knownB){
      return 1;
    }
    return Spell.compareLevelFirst(a, b);
  }

  public static comparePreparedLevelFirst(a: Spell, b: Spell) {        
    //level first, name second
    if(a.prepared && !b.prepared){
      return -1;
    }
    if(!a.prepared && b.prepared){
      return 1;
    }
    return Spell.compareLevelFirst(a, b);
  }

  public static compareRitualLevelFirst(a: Spell, b: Spell) {        
    //level first, name second
    if(a.ritual && !b.ritual){
      return 1;
    }
    if(!a.ritual && b.ritual){
      return -1;
    }
    return Spell.compareLevelFirst(a, b);
  }

  public static compareLevelFirst(a: Spell, b: Spell) {
        
    //level first, name second
    if(a.level < b.level){
      return -1;
    }
    if(a.level > b.level){
      return 1;
    }
    if(a.name < b.name){
      return -1;
    }
    if(a.name > b.name){
      return 1;
    }

    return 0;
  }

  public static compareKnownNameFirst(a: Spell, b: Spell) {        
    
    var knownA: boolean = a.known || a.limited || a.always || a.ritualCast;
    var knownB: boolean = b.known || b.limited || b.always || b.ritualCast;

    if(knownA && !knownB){
      return -1;
    }
    if(!knownA && knownB){
      return 1;
    }
    return Spell.compareNameFirst(a, b);
  }

  public static comparePreparedNameFirst(a: Spell, b: Spell) {        
    if(a.prepared && !b.prepared){
      return -1;
    }
    if(!a.prepared && b.prepared){
      return 1;
    }
    return Spell.compareNameFirst(a, b);
  }

  public static compareRitualNameFirst(a: Spell, b: Spell) {        
    //level first, name second
    if(a.ritual && !b.ritual){
      return 1;
    }
    if(!a.ritual && b.ritual){
      return -1;
    }
    return Spell.compareNameFirst(a, b);
  }

  public static compareNameFirst(a: Spell, b: Spell) {
        
    //name first, level second
    if(a.name < b.name){
      return -1;
    }
    if(a.name > b.name){
      return 1;
    }
    if(a.level < b.level){
      return -1;
    }
    if(a.level > b.level){
      return 1;
    }    

    return 0;
  }


  //capitalize all words of a string. 
  capitalizeWords(text: string) {
    return text.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
  };

}