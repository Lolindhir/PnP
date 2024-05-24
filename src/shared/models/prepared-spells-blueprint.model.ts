export interface PreparedSpellsBlueprint{
    name: string;
    preparedSpells: string[];
}

export class PreparedSpellsBlueprint implements PreparedSpellsBlueprint {

    public constructor(name: string, preparedSpells: string[]){
        this.name = name;
        this.preparedSpells = preparedSpells;
    }
    
}