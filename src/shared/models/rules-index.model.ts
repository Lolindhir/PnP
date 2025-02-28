//import data
import rulesData from 'src/assets/rules/Index.json';

export interface RawRulesIndex {
    term: string;
    reference: string;
    link: string;
    category: string;
}

export interface RulesIndex {
    term: string;
    reference: string;
    route: string;
}


export class RulesIndex {

    private static allRules: RulesIndex[] | undefined = undefined;

    constructor(){}

    public static getAllRules(): RulesIndex[] {

        //if first time, transform raw rules content
        if(this.allRules === undefined){
            //get rules from raw
            var rawRules: RawRulesIndex[] = rulesData;
            //transform raw rules
            this.allRules = this.transformRaw(rawRules);
        }

        return this.allRules;
    }
    
    private static transformRaw(rawIndex: RawRulesIndex[]): RulesIndex[]{

        var freshRulesIndexArray: RulesIndex[] = new Array();

        rawIndex.forEach(rawRule => {

            var generatedRoute = rawRule.link.split('/rules');

            //create fresh rules index
            var freshRulesContent: RulesIndex = {
                term: rawRule.term,
                reference: rawRule.reference,
                route: '/rules' + generatedRoute[1]
            };

            //push fresh rules content
            freshRulesIndexArray.push(freshRulesContent);
        });

        return freshRulesIndexArray;
    }

}