import { StringUtilities } from "@utilities/string.utilities";
import { FeatProperties } from "./feat-properties.model";
import { FeatCategory } from "./feat-category.model";

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

    public static globalProperties: FeatProperties;

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
        this.categoryText = Feat.getCategoryText(this.category, this.subcategory);
    }

    public static getCategoryTexts(): string[] {
        var categoryTexts: string[] = new Array();

        Feat.globalProperties.categories.forEach(category => {
            if(category.subcategories.length === 0){
                categoryTexts.push(category.name);
            }
            else {
                category.subcategories.forEach(subcategory => {
                    categoryTexts.push(Feat.getCategoryText(category.name, subcategory))
                });
            }
        });

        return categoryTexts;
    }

    public static compareBasic(a: Feat, b: Feat) {
        
        var catIndexA : number = FeatCategory.getCategoryIndex(Feat.globalProperties.categories, a.category);
        var catIndexB : number = FeatCategory.getCategoryIndex(Feat.globalProperties.categories, b.category);

        //category first
        if(catIndexA < catIndexB){
            return -1;
        }
        if(catIndexA > catIndexB){
            return 1;
        }
        //subcategory second
        if(catIndexA > -1){
            var cat : FeatCategory = Feat.globalProperties.categories[catIndexA];
            var subcatIndexA : number = cat.subcategories.indexOf(a.subcategory);
            var subcatIndexB : number = cat.subcategories.indexOf(b.subcategory);
            if(subcatIndexA < subcatIndexB){
                return -1;
            }
            if(subcatIndexA > subcatIndexB){
                return 1;
            }
        }
        //name last
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

    private static getCategoryText(category: string, subcategory: string): string {
        var categoryText: string = category;
        if(subcategory.length >  0){
            categoryText += " (" + subcategory + ")";
        }
        return categoryText;
    }

}