export interface SpellClass{
    name: string;
    subclass: boolean;
    allowed: boolean;
}

export class SpellClass implements SpellClass {

    constructor(name: string, subclass: boolean, allowed: boolean){
        this.name = name;
        this.subclass = subclass;
        this.allowed = allowed;
    }
    
}  