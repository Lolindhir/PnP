import { Spell } from "@models/spell.model";
import { PreparedSpellsBlueprint } from "@models/prepared-spells-blueprint.model";
import { Preset } from "@models/preset.model";
import { ColorPreset } from "@models/color-preset.model";
import { ArrayUtilities } from "@shared/utilities/array.utilities";
import { StorageService } from "@shared/services/storage.service";

export interface CharacterData {
    characterList: Character[],
    selectedCharacter: Character | undefined,
    presets: Preset[],
    masterSpellList: Spell[]
}

export enum ModeOption {
    Overview = 'Overview',
    Prep = 'Preparation',
    AddRemove = 'Add/Remove',
    Session = 'Session',
}

export interface Character {
    id: number,
    name: string,
    knownSpells: string[],
    knownCantrips: string[],
    preparedSpells: string[],
    preparedCantrips: string[],
    alwaysSpells: string[],
    ritualSpells: string[],
    limitedSpells: string[],
    usedSpells: string[],
    removedSpells: string[],
    knownCasting: boolean,
    maxKnown: number,
    knownCantripCasting: boolean,
    maxCantripsKnown: number,
    ritualCaster: boolean,
    preparedCasting: boolean,
    maxPrepared: number,
    preparedCantripCasting: boolean,
    maxCantripsPrepared: number,
    ritualCastingUnprepared: boolean,
    usePreparedBlueprints: boolean,
    preparedBlueprints: PreparedSpellsBlueprint[],
    mode: ModeOption,
    preparedOnTop: boolean,
    knownOnTop: boolean,
    dontShowUsed: boolean,
    showRemoved: boolean,
    ritualsAtBottom: boolean,
    allSpellsInOverview: boolean,
    cardColor: string,
    cardFontWhite: boolean,
}

export class Character implements Character {  


    constructor(id: number | undefined, name: string, private characterList: Character[], private storageService: StorageService){

        if(id != undefined){
            this.id = id;
        }
        else{
            var prelimId = 1;
            while(this.characterList.some(char => char.id === prelimId)){
                prelimId++;
            }
            this.id = prelimId;
        }        

        this.name = name;
        this.knownSpells = new Array();
        this.knownCantrips = new Array();
        this.preparedSpells = new Array();
        this.preparedCantrips = new Array();
        this.alwaysSpells = new Array();
        this.ritualSpells = new Array();
        this.limitedSpells = new Array();
        this.usedSpells = new Array();
        this.removedSpells = new Array();
        this.knownCasting = false;
        this.maxKnown = 0;
        this.knownCantripCasting = false;
        this.maxCantripsKnown = 0;
        this.preparedCasting = false;
        this.maxPrepared = 0;
        this.preparedCantripCasting = false;
        this.maxCantripsPrepared = 0;
        this.ritualCastingUnprepared = false;
        this.ritualCaster = false;
        this.preparedBlueprints = new Array();
        this.usePreparedBlueprints = false;
        this.preparedOnTop = false;
        this.knownOnTop = false;
        this.mode = ModeOption.Overview;
        this.dontShowUsed = false;
        this.showRemoved = false;
        this.ritualsAtBottom = false;
        this.allSpellsInOverview = false;
        this.cardColor = ColorPreset.GetDefaultBackground();
        this.cardFontWhite = ColorPreset.GetDefaultFontIsWhite();

        characterList.push(this);
        characterList.sort(Character.compare);
    }

    private toObject() {
        return {
            name: this.name,
            knownSpells: this.knownSpells,
            knownCantrips: this.knownCantrips,
            preparedSpells: this.preparedSpells,
            preparedCantrips: this.preparedCantrips,
            alwaysSpells: this.alwaysSpells,
            ritualSpells: this.ritualSpells,
            limitedSpells: this.limitedSpells,
            usedSpells: this.usedSpells,
            removedSpells: this.removedSpells,
            knownCasting: this.knownCasting,
            maxKnown: this.maxKnown,
            knownCantripCasting: this.knownCantripCasting,
            maxCantripsKnown: this.maxCantripsKnown,
            preparedCasting: this.preparedCasting,
            maxPrepared: this.maxPrepared,
            preparedCantripCasting: this.preparedCantripCasting,
            maxCantripsPrepared: this.maxCantripsPrepared,
            ritualCastingUnprepared: this.ritualCastingUnprepared,
            ritualCaster: this.ritualCaster,
            preparedBlueprints: this.preparedBlueprints,
            usePreparedBlueprints: this.usePreparedBlueprints,
            preparedOnTop: this.preparedOnTop,
            knownOnTop: this.knownOnTop,
            dontShowUsed: this.dontShowUsed,
            showRemoved: this.showRemoved,
            ritualsAtBottom: this.ritualsAtBottom,
            allSpellsInOverview: this.allSpellsInOverview,
            cardColor: this.cardColor,
            cardFontWhite: this.cardFontWhite,
        };
    }

    public static fromSerialized(serialized: string, id: number | undefined, characterList: Character[], storageService: StorageService): Character | undefined {
        
        //deserialize
        var charRaw: ReturnType<Character["toObject"]>;
        try {
            charRaw = JSON.parse(serialized);
        }
        catch (exception_var){
            console.log(exception_var);
            return undefined;
        }
    
        //create stub
        var name: string = charRaw.name === undefined ? 'Unknown' : charRaw.name;
        var char = new Character(id, name, characterList, storageService);

        //set values (if not undefined in raw)
        //reminder: mode is not saved, so it is not set above
        if(charRaw.knownSpells != undefined){ char.knownSpells = charRaw.knownSpells; }
        if(charRaw.knownCantrips != undefined){ char.knownCantrips = charRaw.knownCantrips; }
        if(charRaw.preparedSpells != undefined){ char.preparedSpells = charRaw.preparedSpells; }
        if(charRaw.preparedCantrips != undefined){ char.preparedCantrips = charRaw.preparedCantrips; }
        if(charRaw.alwaysSpells != undefined){ char.alwaysSpells = charRaw.alwaysSpells; }
        if(charRaw.ritualSpells != undefined){ char.ritualSpells = charRaw.ritualSpells; }
        if(charRaw.limitedSpells != undefined){ char.limitedSpells = charRaw.limitedSpells; }
        if(charRaw.usedSpells != undefined){ char.usedSpells = charRaw.usedSpells; }
        if(charRaw.removedSpells != undefined){ char.removedSpells = charRaw.removedSpells; }
        if(charRaw.knownCasting != undefined){ char.knownCasting = charRaw.knownCasting; }
        if(charRaw.maxKnown != undefined){ char.maxKnown = charRaw.maxKnown; }
        if(charRaw.knownCantripCasting != undefined){ char.knownCantripCasting = charRaw.knownCantripCasting; }
        if(charRaw.maxCantripsKnown != undefined){ char.maxCantripsKnown = charRaw.maxCantripsKnown; }
        if(charRaw.preparedCasting != undefined){ char.preparedCasting = charRaw.preparedCasting; }
        if(charRaw.maxPrepared != undefined){ char.maxPrepared = charRaw.maxPrepared; }
        if(charRaw.preparedCantripCasting != undefined){ char.preparedCantripCasting = charRaw.preparedCantripCasting; }
        if(charRaw.maxCantripsPrepared != undefined){ char.maxCantripsPrepared = charRaw.maxCantripsPrepared; }
        if(charRaw.ritualCastingUnprepared != undefined){ char.ritualCastingUnprepared = charRaw.ritualCastingUnprepared; }
        if(charRaw.ritualCaster != undefined){ char.ritualCaster = charRaw.ritualCaster; }
        if(charRaw.usePreparedBlueprints != undefined){ char.usePreparedBlueprints = charRaw.usePreparedBlueprints; }
        if(charRaw.preparedBlueprints != undefined){ char.preparedBlueprints = charRaw.preparedBlueprints; }
        if(charRaw.preparedOnTop != undefined){ char.preparedOnTop = charRaw.preparedOnTop; }
        if(charRaw.knownOnTop != undefined){ char.knownOnTop = charRaw.knownOnTop; }
        if(charRaw.dontShowUsed != undefined){ char.dontShowUsed = charRaw.dontShowUsed; }
        if(charRaw.showRemoved != undefined){ char.showRemoved = charRaw.showRemoved; }
        if(charRaw.ritualsAtBottom != undefined){ char.ritualsAtBottom = charRaw.ritualsAtBottom; }
        if(charRaw.allSpellsInOverview != undefined){ char.allSpellsInOverview = charRaw.allSpellsInOverview; }
        if(charRaw.cardColor != undefined){ char.cardColor = charRaw.cardColor; }
        if(charRaw.cardFontWhite != undefined){ char.cardFontWhite = charRaw.cardFontWhite; }

        //return the build character
        return char;
    } 

    public serialize(): string{
        return JSON.stringify(this.toObject(), null, 2);
    }

    public applyPreset(preset: Preset, masterSpellList: Spell[]): void{

        //add spells to lists
        loop1: for(var spell of masterSpellList){
        
            //add always spell
            //check spell list
            if(preset.alwaysKnownSpells.includes(spell.name)){
                this.alwaysSpells.push(spell.name);
                continue loop1;
            }
            //check subclasses
            for (var subClass of preset.alwaysKnownSubclasses) {
                if(spell.subclasses.filter(subclass => subclass.name === subClass).length > 0 && preset.levels.includes(spell.level)){
                  this.alwaysSpells.push(spell.name);
                  continue loop1;
                }
            }
            
            //add limited spells (a spell can also be known, so don't return if pushed to array)
            if(preset.limitedKnownSpells.includes(spell.name)){
                this.limitedSpells.push(spell.name);
            }

            //add known spell
            //check spell list
            if(preset.spells.includes(spell.name)){
                
                if(spell.level === 0){
                    this.knownCantrips.push(spell.name);
                }
                else{
                    this.knownSpells.push(spell.name);
                }
                continue loop1;
            }
            //check classes
            for (var presetClass of preset.classes) {
                if(spell.classes.filter(mainClass => mainClass.name === presetClass).length > 0 && preset.levels.includes(spell.level)){
                  
                    if(spell.level === 0){
                        this.knownCantrips.push(spell.name);
                    }
                    else{
                        this.knownSpells.push(spell.name);
                    }
                    continue loop1;
                }
            }
            //check subclasses
            for (var subClass of preset.subclasses) {
                if(spell.subclasses.filter(subclass => subclass.name === subClass).length > 0 && preset.levels.includes(spell.level)){
                  
                    if(spell.level === 0){
                        this.knownCantrips.push(spell.name);
                    }
                    else{
                        this.knownSpells.push(spell.name);
                    }
                    continue loop1;
                }
            }

        }

    }

    public save(): void{

        //sort prepared spells blueprints
        this.preparedBlueprints.sort((a, b) => a.name.localeCompare(b.name));

        //write IDs of all chars
        this.writeIdList();
        
        //write char
        var ident: string = 'Char' + this.id;
        this.storageService.storeLocal(ident, this.serialize());

        //sort characters
        this.characterList.sort(Character.compare);
    }

    public delete(): void{

        //remove entry from cookies
        var ident: string = 'Char' + this.id;
        this.storageService.deleteLocal(ident);

        //remove from char list
        ArrayUtilities.removeFromArray(this.characterList, this);

        //write IDs
        this.writeIdList();
    }    

    private writeIdList(): void{
        //write IDs of all chars
        var charStrings: string[] = new Array();
        for(var char of this.characterList){
            charStrings.push(String(char.id));
        }
        this.storageService.storeLocal('CharIdList', ArrayUtilities.stringArrayToString(charStrings));
    }

    public static loadCharacters(storageService: StorageService): Character[]{
        
        var characterList = new Array();
        var idList = ArrayUtilities.stringToStringArray(storageService.loadLocal('CharIdList'));
        for(var id of idList){
            var ident: string = 'Char' + id;
            var serializedChar: string = storageService.loadLocal(ident);
            this.fromSerialized(serializedChar, Number(id), characterList, storageService);
        }
        characterList.sort(Character.compare);
        return characterList;
        
    }

    public addPreparedSpell(spell: Spell) : boolean{
        
        var preparedCantripsBefore: number = this.preparedCantrips.length;
        var preparedSpellsBefore: number = this.preparedSpells.length;

        if(spell.level === 0){
            this.preparedCantrips.push(spell.name);
            return preparedCantripsBefore != this.preparedCantrips.length;
        }
        else{
            this.preparedSpells.push(spell.name);
            return preparedSpellsBefore != this.preparedSpells.length;
        }

    }

    public removedPreparedSpell(spell: Spell) : boolean{

        var preparedCantripsBefore: number = this.preparedCantrips.length;
        var preparedSpellsBefore: number = this.preparedSpells.length;

        if(spell.level === 0){
            ArrayUtilities.removeFromArray(this.preparedCantrips, spell.name);
            return preparedCantripsBefore != this.preparedCantrips.length;
        }
        else{
            ArrayUtilities.removeFromArray(this.preparedSpells, spell.name);
            return preparedSpellsBefore != this.preparedSpells.length;
        } 
 
    }

    private static compare(a: Character, b: Character) {
        if ( a.name < b.name ){
          return -1;
        }
        if ( a.name > b.name ){
          return 1;
        }
        return 0;
    }      

}