export interface Preset{
    name: string;
    classes: string[];
    subclasses: string[];
    alwaysKnownSubclasses: string[];
    levels: number[];
    spells: string[];
    alwaysKnownSpells: string[];
    limitedKnownSpells: string[];
}