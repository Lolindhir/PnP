import { SpellClass } from "./spell-class.model";

export interface SpellFilter{
    type: SpellFilterType;
    value: any;
    displayText: string;
    displayTextList: string;
    selected: boolean;
}

export enum SpellFilterType{
    Level = 1,
    School = 2,
    Class = 3,
    Subclass = 4,
    Source = 5,
    None = 6,
}

export class SpellFilter implements SpellFilter {
 
    constructor(type: SpellFilterType, value: any){
        this.type = type;
        this.value = value;
        this.selected = false;

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

        else if(type === SpellFilterType.Class || type === SpellFilterType.Subclass){
            var spellClass = value as SpellClass;
            displayText = spellClass.name;
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
        //but for the level use the int value
        var compareA = a.displayText;
        var compareB = b.displayText;
        if (a.type === SpellFilterType.Level){
            compareA = a.value as string;
            compareB = b.value as string;
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