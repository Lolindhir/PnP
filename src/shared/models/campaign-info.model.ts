import { MarkdownContent, CampaignMarkdownContent } from '@models/markdown-content.model';

//import data
import starterData from 'src/assets/campaigns/campaignStarterToC.json';
import strahdData from 'src/assets/campaigns/campaignStrahdToC.json';


export interface CampaignInfo {
    id: string;
    name: string;
    breadcrumb: string;
    alternateName: string;
    abbreviation: string;
    directory: string;
    toc: string;
    color: string;
    textColor: string;
}

export class CampaignInfo {

    private static campaigns: CampaignInfo[] | undefined = undefined;
    private static campaignsContent: CampaignMarkdownContent[] | undefined = undefined;

    constructor(){}

    public static getCampaignInfo(): CampaignInfo[] {

        //if first time
        if(this.campaigns === undefined){
            this.campaigns = [];
            for(var campaign of this.getCampaignsContent()){
                this.campaigns.push(campaign.info);
            }
        }

        return this.campaigns;

    }

    public static getCampaignsContent(): CampaignMarkdownContent[] {
       
        //if first time, transform raw campaigns content
        if(this.campaignsContent === undefined){
            
            //create initial array
            this.campaignsContent = new Array();

            //create campaign: starter
            this.campaignsContent.push({
                info: {
                    id: 'starter',
                    name: "Sturmkönigs Donner",
                    breadcrumb: "Sturmkönig",
                    alternateName: "Starter Set",
                    abbreviation: "SKT",
                    directory: "Starter",
                    toc: "campaignStarterToC.json",
                    color: "forestgreen",
                    textColor: "white"
                },                
                content: MarkdownContent.transformRaw(starterData, '/campaigns/starter', null)
            });

            //create campaign: starter
            this.campaignsContent.push({
                info: {
                    id: 'strahd',
                    name: "Curse of Strahd",
                    breadcrumb: "Strahd",
                    alternateName: "Fluch des Strahd",
                    abbreviation: "CoS",
                    directory: "Strahd",
                    toc: "campaignStrahdToC.json",
                    color: "darkred",
                    textColor: "white"
                },
                content: MarkdownContent.transformRaw(strahdData, '/campaigns/strahd', null)
            });
        }

        return this.campaignsContent;
    }

    public static getCampaignContent(campaignId: string): CampaignMarkdownContent | undefined {
        return this.getCampaignsContent().find(campaign => campaign.info.id === campaignId);
    }

}