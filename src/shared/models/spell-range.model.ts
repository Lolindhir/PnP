import { SpellFilter, SpellFilterType } from "@models/spell-filter.model";
import { SpellProperties } from "@models/spell-properties.model";
import * as imagePaths from '@shared/imagePaths';

export enum SpellRangeCategory{
    Caster = 0,
    PointBlank = 1,  // <= 5ft
    Short = 2,  // <= 30ft
    Medium = 3, // <= 100ft
    Long = 4,   // <= 500ft
    Extra = 5,   
}

export interface SpellRange{
    rangeCategory: SpellRangeCategory,
    displayTextComplete: string,
    containsAsset: boolean,
    assetPath: string,
    assetTooltip: string;
    displayTextPart1: string,
    displayTextPart2: string,
    displayRangeCategory: string,
}

export class SpellRange implements SpellRange{
    
    constructor(rawRange: string, rawArea: string){

        //defaults
        this.displayTextComplete = rawArea.length === 0 ? rawRange : rawRange + ' (' + rawArea + ')';
        var textLower = this.displayTextComplete.toLowerCase();
        this.containsAsset = false;
        this.displayTextPart1 = '';
        this.displayTextPart2 = '';


        //set and extract area asset
        var parts: string[] = new Array();

        if(textLower.includes('circle')){
            this.assetPath = imagePaths.spellCircle;
            this.assetTooltip = 'Circle';
            var parts = this.displayTextComplete.split('circle', 2);
        }
        else if(textLower.includes('cone')){
            this.assetPath = imagePaths.spellCone;
            this.assetTooltip = 'Cone';
            var parts = this.displayTextComplete.split('cone', 2);
        }
        else if(textLower.includes('cube')){
            this.assetPath = imagePaths.spellCube;
            this.assetTooltip = 'Cube';
            var parts = this.displayTextComplete.split('cube', 2);
        }
        else if(textLower.includes('cylinder')){
            this.assetPath = imagePaths.spellCylinder;
            this.assetTooltip = 'Cylinder';
            var parts = this.displayTextComplete.split('cylinder', 2);
        }
        else if(textLower.includes('line')){
            this.assetPath = imagePaths.spellLine;
            this.assetTooltip = 'Line';
            var parts = this.displayTextComplete.split('line', 2);
        }
        else if(textLower.includes('square')){
            this.assetPath = imagePaths.spellSquare;
            this.assetTooltip = 'Square';
            var parts = this.displayTextComplete.split('square', 2);
        }
        else if(textLower.includes('sphere')){
            this.assetPath = imagePaths.spellSphere;
            this.assetTooltip = 'Sphere';
            var parts = this.displayTextComplete.split('sphere', 2);
        }
        else if(textLower.includes('radius')){
            this.assetPath = imagePaths.spellSphere;
            this.assetTooltip = 'Sphere';
            var parts = this.displayTextComplete.split('radius', 2);
        }

        if(parts.length > 1){
            this.containsAsset = true;
            this.displayTextPart1 = parts[0];
            this.displayTextPart2 = parts[1].trim();
        }        


        //get the range in feet
        var range: number = 0;
        if(textLower.includes('feet') || textLower.includes('foot')){      
            //get the array of all digits
            var digitArray = textLower.replace(',', '').match(/\d+/);
            if(digitArray != null){
                var rangeString: string = '';
                for(var digit of digitArray){
                    rangeString += digit;
                }
                range = Number(rangeString);
            }        
        }


        //get category
        if(range === 0 && textLower.includes('self')){
            this.rangeCategory = SpellRangeCategory.Caster;          
        }
        else if(textLower.includes('touch')){
            this.rangeCategory = SpellRangeCategory.PointBlank; 
        }
        else if(range > 0 && range <= 5){
            this.rangeCategory = SpellRangeCategory.PointBlank;
        }
        else if(range > 5 && range <= 30){
            this.rangeCategory = SpellRangeCategory.Short;
        }
        else if(range > 30 && range <= 100){
            this.rangeCategory = SpellRangeCategory.Medium;
        }
        else if(range > 100 && range <= 500){
            this.rangeCategory = SpellRangeCategory.Long; 
        }
        else{
            this.rangeCategory = SpellRangeCategory.Extra; 
        }

        //set display as text only depending on range category
        this.displayRangeCategory = SpellRange.getCategoryDisplayText(this.rangeCategory);
    }

    public static getCategoryName(category: SpellRangeCategory): string{

        if(category === SpellRangeCategory.Caster){
            return 'Only Caster';
        }
        if(category === SpellRangeCategory.PointBlank){
            return 'Point-Blank (5ft)';
        }
        if(category === SpellRangeCategory.Short){
            return 'Short (30ft)';
        }
        if(category === SpellRangeCategory.Medium){
            return 'Medium (100ft)';
        }
        if(category === SpellRangeCategory.Long){
            return 'Long (500ft)';
        }
        if(category === SpellRangeCategory.Extra){
            return 'Extra';
        }

        return 'Unknown';
    }

    public static getCategoryDisplayText(category: SpellRangeCategory): string{

        if(category === SpellRangeCategory.Caster){
            return 'Only on Caster';
        }
        if(category === SpellRangeCategory.PointBlank){
            return 'Point-Blank';
        }
        if(category === SpellRangeCategory.Short){
            return 'Short Range';
        }
        if(category === SpellRangeCategory.Medium){
            return 'Medium Range';
        }
        if(category === SpellRangeCategory.Long){
            return 'Long Range';
        }
        if(category === SpellRangeCategory.Extra){
            return 'Extra Range';
        }

        return 'Unknown';
    }

    public static getCategoryTooltip(category: SpellRangeCategory): string{

        if(category === SpellRangeCategory.Caster){
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

    public static getCategoryFilterOptions(properties: SpellProperties): SpellFilter[] {
    
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