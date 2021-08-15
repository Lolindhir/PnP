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
}

export class Spell {  
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
    classes: String[];
    classesDisplay: String;

    constructor(rawSpell: RawSpell){
        
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
        this.classes = rawSpell.classes;

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

        //build classes display
        var classesDisplay : String = '';
        this.classes.forEach(spellClass => {
            classesDisplay = classesDisplay === '' ? spellClass : classesDisplay + ', ' + spellClass;
        });
        this.classesDisplay = classesDisplay ? classesDisplay : 'unknown';

    }
}