export interface SpellTag{
    name: string;
    colorCode: string;
    fontColor: string;
    description: string;
} 

export class SpellTag implements SpellTag {

    constructor(name: string, colorCode: string, fontColor: string, description: string){
        this.name = name;
        this.colorCode = colorCode;
        this.fontColor = fontColor;
        this.description = description;
    }
    
}