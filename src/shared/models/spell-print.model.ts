export interface SpellPrintCsv {
    level: number;
    name: string;
    levelSchool: string;
    castingTime: string;
    range: string;
    components: string;
    duration: string;
    materialsAndDescription: string;
    forWho: string;
}

export interface SpellPrintDirect {
    id: string;
    level: number;
    name: string;
    nameSize: number;
    levelSchool: string;
    ritual: boolean;
    castingTime: string;
    range: string;
    components: string;
    duration: string;
    hasMaterials: boolean;
    materials: string;
    description: string;
    forWho: string;
    always: boolean;
    limited: boolean;
    ritualCast: boolean;
}

export interface PrintSettings {
    characterMode: boolean,
    name: string;
    backgroundColor: string; 
    whiteFont: boolean;
}