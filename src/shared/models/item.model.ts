import { StringUtilities } from "@utilities/string.utilities";

export interface RawItem {
    name: string;
    rarity: string;
    rarityFull: string;
    rarityTier: number;
    rarityAddendum: string;
    orderNumber: number;
    type: string;
    subtype: string;
    slot: string;
    properties: string[];
    consumable: boolean;
    major: boolean;
    itemTable: string;
    attunement: boolean;
    attunementSpecial: string;
    magicalTenacious: boolean;
    cursed: boolean;
    value: number;
    homebrew: boolean;
    source: string;
    public: boolean;
    themes: string[];
    description: string;
    translation: string;
    asset: boolean;
}

export interface Item {
    orderNumber: number;
    name: string;
    rarity: string;
    rarityFull: string;
    rarityTier: number;
    type: string;
    subtype: string;
    slot: string;
    properties: string[];
    consumable: boolean;
    major: boolean;
    itemTable: string;
    attunement: boolean;
    attunementSpecial: string;
    magicalTenacious: boolean;
    cursed: boolean;
    value: number;
    valueDisplay: string;
    homebrew: boolean;
    source: string;
    public: boolean;
    themes: string[];
    description: string;
    translation: string;
    asset: boolean;
    assetPath: string;
    subline: string;
}

export class Item implements Item {

    constructor(rawItem: RawItem){
        
        //take straight raw values
        this.orderNumber = rawItem.orderNumber;
        this.name = rawItem.name;
        this.rarity = rawItem.rarity;
        this.rarityFull = rawItem.rarityFull;
        this.rarityTier = rawItem.rarityTier;
        this.type = rawItem.type;
        this.subtype = rawItem.subtype;
        this.slot = rawItem.slot;
        this.properties = rawItem.properties;
        this.consumable = rawItem.consumable;
        this.major = rawItem.major;
        this.itemTable = rawItem.itemTable;
        this.attunement = rawItem.attunement;
        this.attunementSpecial = rawItem.attunementSpecial;
        this.magicalTenacious = rawItem.magicalTenacious;
        this.cursed = rawItem.cursed;
        this.value = rawItem.value;
        this.homebrew = rawItem.homebrew;
        this.source = rawItem.source;
        this.public = rawItem.public;
        this.themes = rawItem.themes;
        this.description = rawItem.description;
        this.translation = rawItem.translation;

        //set asset path
        this.asset = rawItem.asset;
        this.assetPath = "assets/itemImages/" + this.name + ".png";

        //set value display
        switch (Math.sign(this.value)) {
            case -1:
                this.valueDisplay = "-";
                break;
            case 0:
                this.valueDisplay = "?";
                break;
            case 1:
                this.valueDisplay = this.value.toLocaleString('de-DE');
                break;
            default:
                this.valueDisplay = "?";
                break;
          }

        //build subline
        //build base from type
        var builtSubline: string = this.type;
        //build subtype and properties in brackets
        var typeAndProps: string = this.subtype.toLowerCase();
        this.properties.forEach(property => {
            typeAndProps = StringUtilities.appendWithComma(typeAndProps, property.toLowerCase());
        });
        if(this.magicalTenacious){
            //typeAndProps = StringUtilities.appendWithComma(typeAndProps, "magical");
        }
        if(typeAndProps.length > 0){
            builtSubline += " (" + typeAndProps + ")";
        }
        //build rarity and attunement
        var rarityRequirement: string = this.rarityFull.toLowerCase();
        if(this.attunement){
            rarityRequirement += " (requires attunement";
            if(this.attunementSpecial.length > 0){
                rarityRequirement += " by " + this.attunementSpecial;
            }
            rarityRequirement += ")";
        }
        builtSubline = StringUtilities.appendWithComma(builtSubline, rarityRequirement);
        //build slot
        if(this.slot.length > 0){
            builtSubline = StringUtilities.appendWithComma(builtSubline, "Slot: " + this.slot);
        }
        //build value
        builtSubline = StringUtilities.appendWithComma(builtSubline, "Value: " + this.valueDisplay);
        //set subline
        this.subline = builtSubline;
    }


    public static compareRarityFirst(a: Item, b: Item) {
        
        //order number first, tier second, name third
        if(a.orderNumber < b.orderNumber){
            return -1;
        }
        if(a.orderNumber > b.orderNumber){
            return 1;
        }
        if(a.rarityTier < b.rarityTier){
            return -1;
        }
        if(a.rarityTier > b.rarityTier){
            return 1;
        }
        if(a.name < b.name){
            return -1;
        }
        if(a.name > b.name){
            return 1;
        }
    
        return 0;
      }
}