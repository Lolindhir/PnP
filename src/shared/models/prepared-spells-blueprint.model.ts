export interface PreparedSpellBlueprint{
    name: string;
    level: number;
}

export interface PreparedSpellsBlueprint{
    name: string;
    preparedSpells: PreparedSpellBlueprint[];
}

export class PreparedSpellsBlueprint implements PreparedSpellsBlueprint {

    public constructor(name: string, preparedSpells: PreparedSpellBlueprint[]){
        this.name = name;
        this.preparedSpells = preparedSpells;
    }
    
}