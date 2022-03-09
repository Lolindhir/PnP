import { SpellClass } from "@models/spell-class.model";
import { SpellProperties } from "@models/spell-properties.model";

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
    Level = 1,
    School = 2,
    Ritual = 3,
    Concentration = 4,
    Class = 5,
    CastingTime = 6,
    ComponentVerbal = 7,
    ComponentSomatic = 8,
    ComponentMaterial = 9,
    MaterialValue = 10,
    MaterialConsumed = 11,
    Duration = 12,
    Upcastable = 13,
    SpellMod = 14,
    DamageType = 15,
    Source = 16,
    None = 17,
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
        //for concentration and ritual, compare the boolean (true before false)
        else if(a.type === SpellFilterType.Ritual 
            || a.type === SpellFilterType.Concentration
            || a.type === SpellFilterType.ComponentVerbal
            || a.type === SpellFilterType.ComponentSomatic
            || a.type === SpellFilterType.ComponentMaterial
            || a.type === SpellFilterType.MaterialValue
            || a.type === SpellFilterType.MaterialConsumed
            || a.type === SpellFilterType.Upcastable){
            compareA = a.value as boolean ? 1 : 2;
            compareB = b.value as boolean ? 1 : 2;
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