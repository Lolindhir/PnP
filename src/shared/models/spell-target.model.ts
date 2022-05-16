export interface SpellTarget{
    name: string;
    displayText: string;
    upcastableAsset: boolean;
}

export class SpellTarget{
    public static getOrderNumberForAffectedTargets(valueString: string) :number{
        if(valueString === 'None'){
            return 0;
        }
        if(valueString === 'Self'){
            return 1;
        }
        if(valueString === 'Allies'){
            return 2;
        }
        if(valueString === 'Enemies'){
            return 3;
        }
        if(valueString === 'Objects'){
            return 4;
        }
        if(valueString === 'Spells'){
            return 5;
        }
        return 6;
    }

    public static getOrderNumberForNumberOfTargets(valueString: string) :number{
        if(valueString === 'None'){
            return 0;
        }
        if(valueString === 'Single'){
            return 1;
        }
        if(valueString === 'Multiple'){
            return 2;
        }
        if(valueString === 'MultipleUpcast'){
            return 3;
        }
        if(valueString === 'AoE'){
            return 4;
        }
        return 5;
    }
}