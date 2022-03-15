import { SpellTag } from "@models/spell-tag.model";
import { Preset } from "@models/preset.model";

export interface SpellProperties{
    classes: string[];
    subclasses: string[];
    allowedClasses: string[];
    allowedSubclasses: string[];
    castingTimes: string[];
    durations: string[];
    damageTypes: string[];
    conditions: string[];
    saves: string[];
    attackTypes: string[];
    tags: SpellTag[];
    presets: Preset[];
}