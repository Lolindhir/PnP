import { SpellClass } from "@models/spell-class.model";
import { SpellProperties } from "@models/spell-properties.model";
import { SpellRange, SpellRangeCategory } from "@models/spell-range.model";

export interface SpellFilter{
    type: SpellFilterType;
    value: any;
    displayText: string;
    displayTextList: string;
    selected: boolean;
    properties: SpellProperties;
    tooltip: string;
}

export enum SpellFilterType{
    Preset = 0,
    Level = 1,
    School = 2,
    Ritual = 3,
    Concentration = 4,
    Class = 5,
    ClassSingle = 6,
    ClassMust = 7,
    ClassNot = 8,
    Tag = 9,
    TagSingle = 10,
    TagMust = 11,
    TagNot = 12,
    CastingTime = 13,
    AttackSave = 14,
    Save = 15,
    AttackType = 16,
    AffectedTargets = 17,
    TargetCaster = 18,
    Range = 19,
    ComponentVerbal = 20,
    ComponentSomatic = 21,
    ComponentMaterial = 22,
    MaterialValue = 23,
    MaterialConsumed = 24,
    Duration = 25,
    Upcastable = 26,
    SpellMod = 27,
    DamageType = 28,
    Condition = 29,
    Source = 30,
    SpellListCategory = 31,
    CategoryKnown = 32,
    CategoryAlways = 33,
    CategoryLimited = 34,
    CategoryRitualCast = 35,
    CategoryPrepared = 36,
    None = 37,
}

export interface SpellFilterGroup{
    name: string;
    filters: SpellFilter[];
}

export class SpellFilter implements SpellFilter {

    
    constructor(type: SpellFilterType, value: any, properties: SpellProperties){

        this.type = type;
        this.value = value;
        this.selected = false;
        this.properties = properties;

        var displayText: string = '';
        var displayTextList: string = '';
        var tooltip = 'All spells that match this filter or one of the other filters are shown.';

        if(type === SpellFilterType.Level){
            if(value as number === -1){
                displayText = 'No Cantrip';
                displayTextList = displayText;
                tooltip = 'No cantrips and the other selected levels are shown.';
            }
            else{
                if(value as number === 0){
                    displayText = 'Cantrip';
                }
                if(value as number === 1){
                    displayText = '1st';
                }
                if(value as number === 2){
                    displayText = '2nd';
                }
                if(value as number === 3){
                    displayText = '3rd';
                }
                if(value as number >= 4){
                    displayText = value as string + 'th';
                }
                displayTextList = displayText;
                
                var levelText = value as number === 0 ? 'Cantrip' : displayText + ' level';
                tooltip = `All ${levelText} spells and the other selected levels are shown.`
            }            
        }

        else if(type === SpellFilterType.Source){
            displayText = 'Source: '  + value as string;
            displayTextList = value as string;
        }

        else if(type === SpellFilterType.CastingTime){
            displayText = 'Casting Time: '  + value as string;
            displayTextList = value as string;
        }

        else if(type === SpellFilterType.Duration){
            displayText = 'Duration: '  + value as string;
            displayTextList = value as string;
        }

        else if(type === SpellFilterType.Class){
            var spellClass = value as SpellClass;
            displayText = spellClass.name;
            displayTextList = displayText;
        }

        else if(type === SpellFilterType.ClassSingle){
            var spellClass = value as SpellClass;
            displayText = 'Only ' + spellClass.name;
            displayTextList = spellClass.name;
        }

        else if(type === SpellFilterType.ClassMust){
            var spellClass = value as SpellClass;
            displayText = 'Must belong to ' + spellClass.name;
            displayTextList = spellClass.name;
        }

        else if(type === SpellFilterType.ClassNot){
            var spellClass = value as SpellClass;
            displayText = 'No ' + spellClass.name;
            displayTextList = spellClass.name;
        }

        else if(type === SpellFilterType.Ritual){
            if(value === true){
                displayText = 'Ritual';
            }
            else{
                displayText = 'No Ritual';
            }
            displayTextList = displayText;
        }

        else if(type === SpellFilterType.Concentration){
            if(value === true){
                displayText = 'Concentration';
            }
            else{
                displayText = 'No Concentration';
            }
            displayTextList = displayText;
        }

        else if(type === SpellFilterType.TargetCaster){
            if(value === true){
                displayText = 'Can only affect Caster';
            }
            else{
                displayText = 'Cannot only affect Caster';
            }
            displayTextList = displayText;
        }

        else if(type === SpellFilterType.ComponentVerbal){
            if(value === true){
                displayText = 'V';
            }
            else{
                displayText = 'No V';
            }
            displayTextList = displayText;
        }

        else if(type === SpellFilterType.ComponentSomatic){
            if(value === true){
                displayText = 'S';
            }
            else{
                displayText = 'No S';
            }
            displayTextList = displayText;
        }

        else if(type === SpellFilterType.ComponentMaterial){
            if(value === true){
                displayText = 'M';
            }
            else{
                displayText = 'No M';
            }
            displayTextList = displayText;
        }

        else if(type === SpellFilterType.MaterialValue){
            if(value === true){
                displayText = 'Material has value';
            }
            else{
                displayText = 'Material has no value';
            }
            displayTextList = displayText;
        }

        else if(type === SpellFilterType.MaterialConsumed){
            if(value === true){
                displayText = 'Material is consumed';
            }
            else{
                displayText = 'Material not consumed';
            }
            displayTextList = displayText;
        }

        else if(type === SpellFilterType.CategoryKnown){
            if(value === true){
                displayText = 'Known';
            }
            else{
                displayText = 'Not known';
            }
            displayTextList = displayText;
        }

        else if(type === SpellFilterType.CategoryAlways){
            if(value === true){
                displayText = 'Always known';
            }
            else{
                displayText = 'Not always known';
            }
            displayTextList = displayText;
        }

        else if(type === SpellFilterType.CategoryLimited){
            if(value === true){
                displayText = 'Limited usable';
            }
            else{
                displayText = 'Not limited usable';
            }
            displayTextList = displayText;
        }

        else if(type === SpellFilterType.CategoryRitualCast){
            if(value === true){
                displayText = 'Ritual castable';
            }
            else{
                displayText = 'Not ritual castable';
            }
            displayTextList = displayText;
        }

        else if(type === SpellFilterType.CategoryPrepared){
            if(value === true){
                displayText = 'Prepared';
            }
            else{
                displayText = 'Not prepared';
            }
            displayTextList = displayText;
        }

        else if(type === SpellFilterType.Upcastable){
            if(value === true){
                displayText = 'Upcastable';
            }
            else{
                displayText = 'Not upcastable';
            }
            displayTextList = displayText;
        }

        else if(type === SpellFilterType.SpellMod){
            if(value === true){
                displayText = 'Casting  Ability required';
            }
            else{
                displayText = 'No Casting Ability required';
            }
            displayTextList = displayText;
        }

        else if(type === SpellFilterType.Tag){
            if(value.name === 'Illusion'){
                displayText = 'Illusion (Category)';
                displayTextList = value.name;
            }
            else {
                displayText = value.name;
                displayTextList = displayText;
            }
            tooltip = value.description;
        }

        else if(type === SpellFilterType.TagSingle){
            if(value.name === 'Illusion'){
                displayText = 'Only Illusion (Category)';
                displayTextList = value.name;
            }
            else {
                displayText = 'Only ' + value.name;
                displayTextList = value.name;
            }
            tooltip = value.description;
        }

        else if(type === SpellFilterType.TagMust){
            if(value.name === 'Illusion'){
                displayText = 'Must be Illusion (Category)';
                displayTextList = value.name;
            }
            else {
                displayText = 'Must be ' + value.name;
                displayTextList = value.name;
            }
            tooltip = value.description;
        }

        else if(type === SpellFilterType.TagNot){
            if(value.name === 'Illusion'){
                displayText = 'No Illusion (Category)';
                displayTextList = value.name;
            }
            else {
                displayText = 'No ' + value.name;
                displayTextList = value.name;
            }
            tooltip = value.description;
        }

        else if(type === SpellFilterType.Preset){
            displayText = 'Preset: ' + value.name;
            displayTextList = value.name;
        }
        
        else if(type === SpellFilterType.AttackSave){
            displayText = 'Requires ' + value as string;
            displayTextList = value as string;
        }

        else if(type === SpellFilterType.Range){
            displayText = SpellRange.getCategoryDisplayText(value);
            displayTextList = SpellRange.getCategoryName(value);
            tooltip = SpellRange.getCategoryTooltip(value);
        }

        else if(type === SpellFilterType.AffectedTargets){
            var valueString: string = value as string;
            if(valueString === 'None'){
                displayText = 'No Targets';
                displayTextList = 'No Targets';
            }
            if(valueString === 'Self'){
                displayText = 'Caster-targetable';
                displayTextList = 'Caster-targetable';
            }
            if(valueString === 'Single'){
                displayText = 'Single other Target';
                displayTextList = 'Single Other';
            }
            if(valueString === 'Multiple'){
                displayText = 'Multiple other Targets';
                displayTextList = 'Multiple Others (choosable)';
            }
            if(valueString === 'AoE'){
                displayText = 'Area of Effect';
                displayTextList = 'AoE (not choosable)';
            }
        }

        else{
            displayText = value as string;
            displayTextList = value as string;
        }

        this.displayText = displayText;
        this.displayTextList = displayTextList;
        this.tooltip = tooltip;
    }


    public static compare(a: SpellFilter, b: SpellFilter) {
        
        //compare different types (value in enum)
        if ( a.type < b.type){
            return -1;
        }
        if ( a.type > b.type){
            return 1;
        }

        //use the displayText for string compare
        var compareA: any;
        var compareB: any;
        //for the level use the int value
        if (a.type === SpellFilterType.Level){
            compareA = a.value as string;
            compareB = b.value as string;
        }
        //for the range use the enum value
        else if (a.type === SpellFilterType.Range){
            compareA = a.value as SpellRangeCategory;
            compareB = b.value as SpellRangeCategory;
        }
        //for the casting time use the order from the properties
        else if(a.type === SpellFilterType.CastingTime){
            compareA = '' + a.properties.castingTimes.indexOf(a.value);
            compareB = '' + b.properties.castingTimes.indexOf(b.value);
        }
        //for the duration use the order from the properties
        else if(a.type === SpellFilterType.Duration){
            compareA = a.properties.durations.indexOf(a.value);
            compareB = b.properties.durations.indexOf(b.value);
        }
        //for the damage type use the order from the properties
        else if(a.type === SpellFilterType.DamageType){
            compareA = a.properties.damageTypes.indexOf(a.value);
            compareB = b.properties.damageTypes.indexOf(b.value);
        }
        //for the condition use the order from the properties
        else if(a.type === SpellFilterType.Condition){
            compareA = a.properties.conditions.indexOf(a.value);
            compareB = b.properties.conditions.indexOf(b.value);
        }
        //for the save use the order from the properties
        else if(a.type === SpellFilterType.Save){
            compareA = a.properties.saves.indexOf(a.value);
            compareB = b.properties.saves.indexOf(b.value);
        }
        //for the attack type use the order from the properties
        else if(a.type === SpellFilterType.AttackType){
            compareA = a.properties.attackTypes.indexOf(a.value);
            compareB = b.properties.attackTypes.indexOf(b.value);
        }
        //for the attack type use the order from the properties
        else if(a.type === SpellFilterType.AffectedTargets){
            compareA = a.properties.targets.indexOf(a.value);
            compareB = b.properties.targets.indexOf(b.value);
        }
        //for the tag use the order from the properties
        else if(a.type === SpellFilterType.Tag || a.type === SpellFilterType.TagSingle || a.type === SpellFilterType.TagMust || a.type === SpellFilterType.TagNot){
            compareA = a.properties.tags.indexOf(a.value);
            compareB = b.properties.tags.indexOf(b.value);
        }
        //for concentration and ritual, compare the boolean (true before false)
        else if(a.type === SpellFilterType.Ritual 
            || a.type === SpellFilterType.Concentration
            || a.type === SpellFilterType.TargetCaster
            || a.type === SpellFilterType.ComponentVerbal
            || a.type === SpellFilterType.ComponentSomatic
            || a.type === SpellFilterType.ComponentMaterial
            || a.type === SpellFilterType.MaterialValue
            || a.type === SpellFilterType.MaterialConsumed
            || a.type === SpellFilterType.CategoryKnown
            || a.type === SpellFilterType.CategoryAlways
            || a.type === SpellFilterType.CategoryLimited
            || a.type === SpellFilterType.CategoryRitualCast
            || a.type === SpellFilterType.CategoryPrepared
            || a.type === SpellFilterType.Upcastable){
            compareA = a.value as boolean ? 1 : 2;
            compareB = b.value as boolean ? 1 : 2;
        }
        else if(a.type === SpellFilterType.AttackSave){
            switch(a.value as string){
                case 'Attack':{
                    compareA = 1;
                    break;
                }
                case 'Save':{
                    compareA = 2;
                    break
                }
                case 'Ability Check':{
                    compareA = 3;
                    break
                }
                case 'None':{
                    compareA = 4;
                    break
                }
                default: {
                    compareA = 5;
                    break
                }
            }                      
            switch(b.value as string){
                case 'Attack':{
                    compareB = 1;
                    break;
                }
                case 'Save':{
                    compareB = 2;
                    break
                }
                case 'Ability Check':{
                    compareB = 3;
                    break
                }
                case 'None':{
                    compareB = 4;
                    break
                }
                default: {
                    compareB = 5;
                    break
                }
            }  
        }
        else {
            compareA = a.displayText;
            compareB = b.displayText;
        }

        //compare the same type
        if ( compareA < compareB ){
          return -1;
        }
        if ( compareA > compareB ){
          return 1;
        }

        return 0;
    }
}