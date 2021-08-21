import { SpellClass } from "@models/spell-class.model";
import { SpellProperties } from "@models/spell-properties.model";

export interface RawSpell {  
  level: Number;  
  name: String;  
  school: String;  
  levelSchool: String;
  ritual: Boolean;
  castingTime: String;
  range: String;
  components: String[];
  materials: String;
  duration: String;
  concentration: Boolean;
  description: String;
  source: String;
  classes: String[];  
  subclasses: String[];  
  allowed: Boolean;  
}

export interface Spell {
  level: Number;  
  name: String;  
  school: String;  
  levelSchoolDisplay: String;
  ritual: Boolean;
  castingTime: String;
  range: String;
  components: String[];
  componentsDisplay: String;
  duration: String;
  concentration: Boolean;
  description: String;
  source: String;
  classes: SpellClass[];
  classesDisplay: String;
  subclasses: SpellClass[];
  subclassesDisplay: String;
  allowed: Boolean;
}

export class Spell implements Spell {  

  constructor(rawSpell: RawSpell, spellProperties: SpellProperties){
      
    //take straight raw values
    this.level = rawSpell.level;
    this.name = rawSpell.name;
    this.school = rawSpell.school;
    this.ritual = rawSpell.ritual;
    this.castingTime = rawSpell.castingTime;
    this.range = rawSpell.range;
    this.components = rawSpell.components;
    this.duration = rawSpell.duration;
    this.concentration = rawSpell.concentration;
    this.description = rawSpell.description;
    this.source = rawSpell.source;
    this.allowed = rawSpell.allowed;

    //build level school display
    var levelSchoolDisplay: String = rawSpell.levelSchool;
    if(rawSpell.ritual){
        levelSchoolDisplay = levelSchoolDisplay + ' (ritual)';
    }
    if(rawSpell.concentration){
        levelSchoolDisplay = levelSchoolDisplay + ' (concentration)'
    }
    this.levelSchoolDisplay = levelSchoolDisplay;
    
    //build components display
    var componentsDisplay : String = '';
    this.components.forEach(component => {
        componentsDisplay = componentsDisplay === '' ? component : componentsDisplay + ', ' + component;
    });
    if(rawSpell.materials != ''){
        componentsDisplay += ' (' + rawSpell.materials + ')';
    }
    this.componentsDisplay = componentsDisplay;

    //build classes and classes dispaly
    var classes : SpellClass[] = new Array();
    var classesDisplay : String = '';
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
    var subclassesDisplay : String = '';
    rawSpell.subclasses.forEach(spellClass => {
        
        if(spellProperties.allowedSubclasses.includes(spellClass)){
          
          subclasses.push(new SpellClass(spellClass, true, true))
          subclassesDisplay = subclassesDisplay === '' ? spellClass : subclassesDisplay + ', ' + spellClass;

        }
    });
    this.subclasses = subclasses;
    this.subclassesDisplay = subclassesDisplay ? subclassesDisplay : '-';

  }    
}