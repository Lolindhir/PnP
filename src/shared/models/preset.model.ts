export interface Preset{
    name: string;
    template: boolean;
    publishingDate: string;
    classes: string[];
    subclasses: string[];
    alwaysKnownSubclasses: string[];
    levels: number[];
    spells: string[];
    alwaysKnownSpells: string[];
    limitedKnownSpells: string[];
}