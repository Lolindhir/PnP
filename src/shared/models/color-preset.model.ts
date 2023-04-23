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

        defaultPresets.push(new ColorPreset('Black', '#000000', true));
        defaultPresets.push(new ColorPreset('Maroon', '#800000', true));
        defaultPresets.push(new ColorPreset('Green', '#008000', false));
        defaultPresets.push(new ColorPreset('Purple', '#800080', true));
        defaultPresets.push(new ColorPreset('Orange', '#FF8000', false));

        return defaultPresets;
    }

    static GetDefaultBackground(): string{
        return '#3f3f3f';
    }

    static GetDefaultFontIsWhite(): boolean{
        return true;
    }
}  