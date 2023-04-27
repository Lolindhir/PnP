export interface ColorPreset {
    name: string;
    backgroundColor: string;
    whiteFont: boolean;
  }

export class ColorPreset implements ColorPreset {

    constructor(name: string, backgroundColor: string, whiteFont: boolean){
        this.name = name;
        this.backgroundColor = backgroundColor;
        this.whiteFont = whiteFont;
    }
    
    static GetDefaultPresets(): ColorPreset[]{

        var defaultPresets: ColorPreset[] = new Array();

        defaultPresets.push(new ColorPreset('Default', this.GetDefaultBackground(), this.GetDefaultFontIsWhite()));
        defaultPresets.push(new ColorPreset('Basic Black', '#000000', true));
        defaultPresets.push(new ColorPreset('Bard Purple', '#8c5385', true));
        defaultPresets.push(new ColorPreset('Cleric Gold', '#c4941d', false));
        defaultPresets.push(new ColorPreset('Druid Green', '#60b85d', false));
        defaultPresets.push(new ColorPreset('Paladin Blue', '#4986e7', true));
        defaultPresets.push(new ColorPreset('Ranger Brown', '#857056', true));
        defaultPresets.push(new ColorPreset('Sorcerer Orange', '#e67300', false));
        defaultPresets.push(new ColorPreset('Warlock Teal', '#008080', true));
        defaultPresets.push(new ColorPreset('Wizard Red', '#800000', true));

        return defaultPresets;
    }

    static GetDefaultBackground(): string{
        return '#3f3f3f';
    }

    static GetDefaultFontIsWhite(): boolean{
        return true;
    }
}  