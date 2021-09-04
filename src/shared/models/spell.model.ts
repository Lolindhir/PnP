import { SpellClass } from "@models/spell-class.model";
import { SpellProperties } from "@models/spell-properties.model";
import { SpellFilter, SpellFilterType } from "@models/spell-filter.model";

export interface RawSpell {  
  level: number;  
  name: string;  
  school: string;  
  levelSchool: string;
  ritual: boolean;
  castingTime: string;
  range: string;
  components: string[];
  materials: string;
  duration: string;
  concentration: boolean;
  description: string;
  source: string;
  classes: string[];  
  subclasses: string[];  
  allowed: boolean;
}

export interface Spell {
  level: number;  
  levelDisplay: string;  
  name: string;  
  school: string;  
  levelSchoolDisplay: string;
  ritual: boolean;
  castingTime: string;
  castingTimeDisplayList: string;
  range: string;
  components: string[];
  componentsValue: boolean;
  componentsConsumed: boolean;
  componentsDisplay: string;
  componentsDisplayList: string;
  duration: string;
  durationDisplayList: string;
  concentration: boolean;
  description: string;
  source: string;
  classes: SpellClass[];
  classesDisplay: string;
  subclasses: SpellClass[];
  subclassesDisplay: string;
  allowed: boolean;
  upcastable: boolean;
}

export class Spell implements Spell {  

  constructor(rawSpell: RawSpell, spellProperties: SpellProperties){
      
    //take straight raw values
    this.level = rawSpell.level;
    this.name = rawSpell.name;
    this.school = rawSpell.school;
    this.ritual = rawSpell.ritual;
    this.castingTime = rawSpell.castingTime;
    this.castingTimeDisplayList = rawSpell.castingTime.includes('reaction') ? '1 Reaction' : this.capitalizeWords(rawSpell.castingTime);
    this.range = rawSpell.range;
    this.components = rawSpell.components;
    this.duration = rawSpell.duration;
    this.concentration = rawSpell.concentration;
    this.description = rawSpell.description;
    this.upcastable = this.description.toLowerCase().includes('at higher levels');
    this.source = rawSpell.source;
    this.allowed = rawSpell.allowed;

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
    if(rawSpell.concentration){
        levelSchoolDisplay = levelSchoolDisplay + ' (concentration)'
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

    //build subclasses amd subclasses display
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

    if(filterType == null){
      return true;
    }

    if(filters == null || filters.length == 0){
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
        case SpellFilterType.DamageType: {             
          var damageType: string = filter.value as string;
          var damageText: string = damageType.toLowerCase();
          if(damageType === '' || this.description.toLowerCase().includes(damageText)){
            return true;
          }          
          break; 
        }  
        case SpellFilterType.Source: {             
          var source: string = filter.value as string;
          if(source === '' || this.source.toLowerCase() === source.toLowerCase()){
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

    return false;
  }

  //capitalize all words of a string. 
  capitalizeWords(text: string) {
    return text.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
  };

}