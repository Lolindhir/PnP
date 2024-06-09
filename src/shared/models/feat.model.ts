import { StringUtilities } from "@utilities/string.utilities";

export interface RawFeat {
    name: string;
    category: string;
    subcategory: string;
    cost: number;
    prerequisite: string;
    multi: number;
    multiAppendix: string;
    starter: boolean;
    explanation: string;
}

export interface Feat {
    name: string;
    category: string;
    subcategory: string;
    categoryText: string;
    cost: number;
    prerequisite: string;
    multi: number;
    multiAppendix: string;
    starter: boolean;
    explanation: string;
}

export class Feat implements Feat {

    constructor(rawFeat: RawFeat){
        //take straight raw values
        this.name = rawFeat.name;
        this.category = rawFeat.category;
        this.subcategory = rawFeat.subcategory;
        this.cost = rawFeat.cost;
        this.prerequisite = rawFeat.prerequisite;
        this.multi = rawFeat.multi;
        this.multiAppendix = rawFeat.multiAppendix;
        this.starter = rawFeat.starter;
        this.explanation = rawFeat.explanation;

        //build category text
        this.categoryText = this.category;
        if(this.subcategory.length >  0){
            this.categoryText += " (" + this.subcategory + ")";
        }
    }

    public static compareBasic(a: Feat, b: Feat) {
        
        //category first, subcategory second, name last
        // if(a.orderNumber < b.orderNumber){
        //     return -1;
        // }
        // if(a.orderNumber > b.orderNumber){
        //     return 1;
        // }
        // if(a.rarityTier < b.rarityTier){
        //     return -1;
        // }
        // if(a.rarityTier > b.rarityTier){
        //     return 1;
        // }    
        return Feat.compareName(a, b);
    }

    public static compareName(a: Feat, b: Feat){
        if(a.name < b.name){
            return -1;
        }
        if(a.name > b.name){
            return 1;
        }    
        return 0;
    }

}