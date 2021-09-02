import { SpellClass } from "./spell-class.model";
import { SpellProperties } from "./spell-properties.model";

export interface SpellFilter{
    type: SpellFilterType;
    value: any;
    displayText: string;
    displayTextList: string;
    selected: boolean;
    orFilter: boolean;
    properties: SpellProperties;
    color: string;
    tooltip: string;
}

export enum SpellFilterType{
    Level = 1,
    School = 2,
    Class = 3,
    Ritual = 4,
    CastingTime = 5,
    Concentration = 6,
    Duration = 7,
    DamageType = 8,
    Source = 9,
    None = 10,
}

export class SpellFilter implements SpellFilter {

    
    constructor(type: SpellFilterType, value: any, properties: SpellProperties, orFilter: boolean){
        this.type = type;
        this.value = value;
        this.selected = false;
        this.orFilter = orFilter;
        this.properties = properties;
        this.color = orFilter ? 'lightblue' : 'orange';
        this.tooltip = orFilter ? 'And-Filter' : 'Or-Filter';

        var displayText: string = '';
        var displayTextList: string = '';

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

        else{
            displayText = value as string;
            displayTextList = value as string;
        }

        this.displayText = displayText;
        this.displayTextList = displayTextList;
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
        //for concentration and ritual, compare the boolean (true before false)
        else if(a.type === SpellFilterType.Ritual || a.type === SpellFilterType.Concentration){
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