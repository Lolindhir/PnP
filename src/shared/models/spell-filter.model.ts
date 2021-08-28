import { SpellClass } from "./spell-class.model";

export interface SpellFilter{
    type: SpellFilterType;
    value: any;
    displayText: string;
    displayTextList: string;
}

export enum SpellFilterType{
    Class = 'Class',
    Level = 'Level',
    Source = 'Source',
    Subclass = 'Subclass',
}

export class SpellFilter implements SpellFilter {
 
    constructor(type: SpellFilterType, value: any){
        this.type = type;
        this.value = value;

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
}