import { Spell } from "@models/spell.model";
import { Preset } from "@models/preset.model";
import { CookieService } from 'ngx-cookie-service';
import { ArrayUtilities } from "@shared/utilities/array.utilities";

export interface CharacterData {
    characterList: Character[],
    selectedCharacter: Character | undefined,
    presets: Preset[],
    cookieService: CookieService | undefined,
    masterSpellList: Spell[]
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
    knownCasting: boolean,
    maxKnown: number,
    knownCantripCasting: boolean,
    maxCantripsKnown: number,
    preparedCasting: boolean,
    maxPrepared: number,
    preparedCantripCasting: boolean,
    maxCantripsPrepared: number,
    ritualCastingUnprepared: boolean,
    ritualCaster: boolean,
    adventureMode: boolean,
    preparedOnTop: boolean,
    dontShowUsed: boolean,
    allSpellsInOverview: boolean,
}

export class Character implements Character {  


    constructor(id: number | undefined, name: string, private characterList: Character[], private cookieService: CookieService){

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
        this.knownCasting = true;
        this.maxKnown = 0;
        this.knownCantripCasting = true;
        this.maxCantripsKnown = 0;
        this.preparedCasting = false;
        this.maxPrepared = 0;
        this.preparedCantripCasting = false;
        this.maxCantripsPrepared = 0;
        this.ritualCastingUnprepared = false;
        this.ritualCaster = false;
        this.preparedOnTop = false;
        this.adventureMode = false;
        this.dontShowUsed = false;
        this.allSpellsInOverview = false;

        characterList.push(this);
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

        //write IDs of all chars
        this.writeIdList();

        //write char
        var ident: string = 'Char' + this.id;
        this.cookieService.set(ident + CharacterCookies.Name, this.name, 365);
        this.cookieService.set(ident + CharacterCookies.KnownSpells, ArrayUtilities.stringArrayToString(this.knownSpells), 365);
        this.cookieService.set(ident + CharacterCookies.KnownCantrips, ArrayUtilities.stringArrayToString(this.knownCantrips), 365);
        this.cookieService.set(ident + CharacterCookies.PreparedSpells, ArrayUtilities.stringArrayToString(this.preparedSpells), 365);
        this.cookieService.set(ident + CharacterCookies.PreparedCantrips, ArrayUtilities.stringArrayToString(this.preparedCantrips), 365);
        this.cookieService.set(ident + CharacterCookies.AlwaysSpells, ArrayUtilities.stringArrayToString(this.alwaysSpells), 365);
        this.cookieService.set(ident + CharacterCookies.RitualSpells, ArrayUtilities.stringArrayToString(this.ritualSpells), 365);
        this.cookieService.set(ident + CharacterCookies.LimitedSpells, ArrayUtilities.stringArrayToString(this.limitedSpells), 365);
        this.cookieService.set(ident + CharacterCookies.UsedSpells, ArrayUtilities.stringArrayToString(this.usedSpells), 365);
        this.cookieService.set(ident + CharacterCookies.KnownCasting, String(this.knownCasting), 365);
        this.cookieService.set(ident + CharacterCookies.MaxKnown, String(this.maxKnown), 365);
        this.cookieService.set(ident + CharacterCookies.KnownCantripCasting, String(this.knownCantripCasting), 365);
        this.cookieService.set(ident + CharacterCookies.MaxCantripsKnown, String(this.maxCantripsKnown), 365);
        this.cookieService.set(ident + CharacterCookies.PreparedCasting, String(this.preparedCasting), 365);
        this.cookieService.set(ident + CharacterCookies.MaxPrepared, String(this.maxPrepared), 365);
        this.cookieService.set(ident + CharacterCookies.PreparedCantripCasting, String(this.preparedCantripCasting), 365);
        this.cookieService.set(ident + CharacterCookies.MaxCantripsPrepared, String(this.maxCantripsPrepared), 365);
        this.cookieService.set(ident + CharacterCookies.RitualCastingUnprepared, String(this.ritualCastingUnprepared), 365);
        this.cookieService.set(ident + CharacterCookies.RitualCaster, String(this.ritualCaster), 365);
        this.cookieService.set(ident + CharacterCookies.PreparedOnTop, String(this.preparedOnTop), 365);
        this.cookieService.set(ident + CharacterCookies.AdventureMode, String(this.adventureMode), 365);
        this.cookieService.set(ident + CharacterCookies.DontShowUsed, String(this.dontShowUsed), 365);
        this.cookieService.set(ident + CharacterCookies.AllSpellsInOverview, String(this.allSpellsInOverview), 365);

    }


    public delete(): void{

        //remove entries from cookies
        var ident: string = 'Char' + this.id;
        for(var entry in CharacterCookies){
            this.cookieService.set(ident + entry, '', -1);
        }

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
        this.cookieService.set('CharIdList', ArrayUtilities.stringArrayToString(charStrings), 365);
    }


    public static loadCharactersFromCookies(cookieService: CookieService): Character[]{
        
        var characterList = new Array();
        var idList = ArrayUtilities.stringToStringArray(cookieService.get('CharIdList'));
        for(var id of idList){
            this.loadFromCookies(Number(id), characterList, cookieService);
        }
        return characterList;
        
    }


    private static loadFromCookies(id: number, characterList: Character[], cookieService: CookieService): Character{

        var ident: string = 'Char' + id;
        var name: string = cookieService.get(ident + CharacterCookies.Name);
        var char = new Character(id, name, characterList, cookieService);

        char.knownSpells = ArrayUtilities.stringToStringArray(cookieService.get(ident + CharacterCookies.KnownSpells));
        char.knownCantrips = ArrayUtilities.stringToStringArray(cookieService.get(ident + CharacterCookies.KnownCantrips));
        char.preparedSpells = ArrayUtilities.stringToStringArray(cookieService.get(ident + CharacterCookies.PreparedSpells));
        char.preparedCantrips = ArrayUtilities.stringToStringArray(cookieService.get(ident + CharacterCookies.PreparedCantrips));
        char.alwaysSpells = ArrayUtilities.stringToStringArray(cookieService.get(ident + CharacterCookies.AlwaysSpells));
        char.ritualSpells = ArrayUtilities.stringToStringArray(cookieService.get(ident + CharacterCookies.RitualSpells));
        char.limitedSpells = ArrayUtilities.stringToStringArray(cookieService.get(ident + CharacterCookies.LimitedSpells));
        char.usedSpells = ArrayUtilities.stringToStringArray(cookieService.get(ident + CharacterCookies.UsedSpells));
        char.knownCasting = cookieService.get(ident + CharacterCookies.KnownCasting) === 'true' ? true : false;
        char.maxKnown = Number(cookieService.get(ident + CharacterCookies.MaxKnown));
        char.knownCantripCasting = cookieService.get(ident + CharacterCookies.KnownCantripCasting) === 'true' ? true : false;
        char.maxCantripsKnown = Number(cookieService.get(ident + CharacterCookies.MaxCantripsKnown));
        char.preparedCasting = cookieService.get(ident + CharacterCookies.PreparedCasting) === 'true' ? true : false;
        char.maxPrepared = Number(cookieService.get(ident + CharacterCookies.MaxPrepared));
        char.preparedCantripCasting = cookieService.get(ident + CharacterCookies.PreparedCantripCasting) === 'true' ? true : false;
        char.maxCantripsPrepared = Number(cookieService.get(ident + CharacterCookies.MaxCantripsPrepared));
        char.ritualCastingUnprepared = cookieService.get(ident + CharacterCookies.RitualCastingUnprepared) === 'true' ? true : false;
        char.ritualCaster = cookieService.get(ident + CharacterCookies.RitualCaster) === 'true' ? true : false;
        char.preparedOnTop = cookieService.get(ident + CharacterCookies.PreparedOnTop) === 'true' ? true : false;
        char.adventureMode = cookieService.get(ident + CharacterCookies.AdventureMode) === 'true' ? true : false;
        char.dontShowUsed = cookieService.get(ident + CharacterCookies.DontShowUsed) === 'true' ? true : false;
        char.allSpellsInOverview = cookieService.get(ident + CharacterCookies.AllSpellsInOverview) === 'true' ? true : false;

        return char;
    }

}

export enum CharacterCookies{
    Name = 'Name',
    KnownSpells = 'KnownSpells',
    KnownCantrips = 'KnownCantrips',
    PreparedSpells = 'PreparedSpells',
    PreparedCantrips = 'PreparedCantrips',
    AlwaysSpells = 'AlwaysSpells',
    RitualSpells = 'RitualSpells',
    LimitedSpells = 'LimitedSpells',
    UsedSpells = 'UsedSpells',
    KnownCasting = 'KnownCasting',
    MaxKnown = 'MaxKnown',
    KnownCantripCasting = 'KnownCantripCasting',
    MaxCantripsKnown = 'MaxCantripsKnown',
    PreparedCasting = 'PreparedCasting',
    MaxPrepared = 'MaxPrepared',
    PreparedCantripCasting = 'PreparedCantripCasting',
    MaxCantripsPrepared = 'MaxCantripsPrepared',
    RitualCastingUnprepared = 'RitualCastingUnprepared',
    RitualCaster = 'RitualCaster',
    PreparedOnTop = 'PreparedOnTop',
    AdventureMode = 'AdventureMode',
    DontShowUsed = 'DontShowUsed',
    AllSpellsInOverview = 'AllSpellsInOverview',
}