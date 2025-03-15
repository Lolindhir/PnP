//import data
import rulesData from 'src/assets/rules/Index.json';
import starterData from 'src/assets/campaigns/Starter/Index.json';
import strahdData from 'src/assets/campaigns/Strahd/Index.json';

export interface RawMarkdownIndex {
    term: string;
    reference: string;
    link: string;
    category: string;
}

export interface MarkdownIndex {
    term: string;
    reference: string;
    termAndCategory: string;
    route: string;
}

export interface CampaignMarkdownIndex {
    campaignId: string;
    index: MarkdownIndex[];
}


export class MarkdownIndex {

    private static rulesIndex: MarkdownIndex[] | undefined = undefined;
    private static campaignsIndex: CampaignMarkdownIndex[] | undefined = undefined;

    constructor(){}

    public static getRulesIndex(): MarkdownIndex[] | undefined {

        //if first time, transform raw rules content
        if(this.rulesIndex === undefined){
            //get rules from raw
            var rawRules: RawMarkdownIndex[] = rulesData;
            //transform raw rules
            this.rulesIndex = this.transformRaw(rawRules, '/rules');
        }

        return this.rulesIndex;
    }
    
    public static getCampaignIndex(campaignId: string): MarkdownIndex[] | undefined {
        
        //if first time, transform raw campaigns content
        if(this.campaignsIndex === undefined){
            
            //create initial array
            this.campaignsIndex = new Array();

            //create campaign: starter
            this.campaignsIndex.push({
                campaignId: 'starter',
                index: this.transformRaw(starterData, '/campaigns/starter')
            });

            //create campaign: strahd
            this.campaignsIndex.push({
                campaignId: 'strahd',
                index: this.transformRaw(strahdData, '/campaigns/strahd')
            });
        }

        //return the campaign index
        for(let i = 0; i < this.campaignsIndex.length; i++){
            if(this.campaignsIndex[i].campaignId === campaignId){
                return this.campaignsIndex[i].index;
            }
        }

        return undefined;
    }

    private static transformRaw(rawIndex: RawMarkdownIndex[], routeSplit: string): MarkdownIndex[]{

        var freshRulesIndexArray: MarkdownIndex[] = new Array();

        rawIndex.forEach(rawRule => {

            var generatedRoute = rawRule.link.split(routeSplit);

            var generatedTermAndCategory: string = rawRule.category.length > 0 ? rawRule.term + ' [' + rawRule.category + ']' : rawRule.term;

            //create fresh rules index
            var freshRulesContent: MarkdownIndex = {
                term: rawRule.term,
                reference: rawRule.reference,
                termAndCategory: generatedTermAndCategory,
                route: routeSplit + generatedRoute[1]
            };

            //push fresh rules content
            freshRulesIndexArray.push(freshRulesContent);
        });

        return freshRulesIndexArray;
    }

}