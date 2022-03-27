import { SpellFilter, SpellFilterType } from "@models/spell-filter.model";
import { SpellProperties } from "@models/spell-properties.model";

export enum SpellRangeCategory{
    Self = 0,
    PointBlank = 1,  // <= 5ft
    Short = 2,  // <= 30ft
    Medium = 3, // <= 100ft
    Long = 4,   // <= 500ft
    Extra = 5,   
}

export class SpellRange{
    
    public static getName(category: SpellRangeCategory): string{

        if(category === SpellRangeCategory.Self){
            return 'Self';
        }
        if(category === SpellRangeCategory.PointBlank){
            return 'Point-Blank';
        }
        if(category === SpellRangeCategory.Short){
            return 'Short';
        }
        if(category === SpellRangeCategory.Medium){
            return 'Medium';
        }
        if(category === SpellRangeCategory.Long){
            return 'Long';
        }
        if(category === SpellRangeCategory.Extra){
            return 'Extra';
        }

        return 'Unknown';
    }

    public static getTooltip(category: SpellRangeCategory): string{

        if(category === SpellRangeCategory.Self){
            return 'nur auf Caster';
        }
        if(category === SpellRangeCategory.PointBlank){
            return 'bis zu 5 ft.';
        }
        if(category === SpellRangeCategory.Short){
            return 'bis zu 30 ft.';
        }
        if(category === SpellRangeCategory.Medium){
            return 'bis zu 100 ft.';
        }
        if(category === SpellRangeCategory.Long){
            return 'bis zu 500 ft.';
        }
        if(category === SpellRangeCategory.Extra){
            return 'sehr große Reichweite';
        }

        return 'Bis zu dieser Reichweite.';
    }

    public static hasSpellRangeTheCategory(spellRange: string, category: SpellRangeCategory): boolean{

        //get the range in feet
        var range: number = 0;
        if(spellRange.toLowerCase().includes('feet') || spellRange.toLowerCase().includes('foot')){      
            //get the array of all digits
            var digitArray = spellRange.replace(',', '').match(/\d+/);
            if(digitArray != null){
                var rangeString: string = '';
                for(var digit of digitArray){
                    rangeString += digit;
                }
                range = Number(rangeString);
            }        
        }

        if(range === 0 && spellRange.includes('Self')){
            return category === SpellRangeCategory.Self ? true : false;            
        }

        if(spellRange.includes('Touch')){
            return category === SpellRangeCategory.PointBlank ? true : false;
        }

        if(range > 0 && range <= 5){
            return category === SpellRangeCategory.PointBlank ? true : false;

        }

        if(range > 5 && range <= 30){
            return category === SpellRangeCategory.Short ? true : false;

        }

        if(range > 30 && range <= 100){
            return category === SpellRangeCategory.Medium ? true : false;

        }

        if(range > 100 && range <= 500){
            return category === SpellRangeCategory.Long ? true : false;
        }

        //if nothing flags as false, then its the extra range
        if(category === SpellRangeCategory.Extra){
            return true;
        }

        return false;
    }

    public static getFilterOptions(properties: SpellProperties): SpellFilter[] {
    
        var filterOptions: SpellFilter[] = new Array();
        Object.values(SpellRangeCategory).forEach(categoryAsString => {
            
            if (isNaN(Number(categoryAsString))) {
                return;
            }

            var category: SpellRangeCategory = categoryAsString as SpellRangeCategory;
            filterOptions.push(new SpellFilter(SpellFilterType.Range, category, properties));
        })
        return filterOptions.sort(SpellFilter.compare);
    }

}