export interface SpellClass{
    name: String;
    subclass: Boolean;
    allowed: Boolean;
}

export class SpellClass implements SpellClass {

    constructor(name: String, subclass: Boolean, allowed: Boolean){
        this.name = name;
        this.subclass = subclass;
        this.allowed = allowed;
    }
    
}  