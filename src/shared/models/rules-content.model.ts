import { MarkdownContent } from '@models/markdown-content.model';

//import data
import rulesData from 'src/assets/rules/rulesToC.json';


export class RulesContent {

    private static rulesContent: MarkdownContent[] | undefined = undefined;

    constructor(){}

    public static getRulesContent(): MarkdownContent[]{

        //if first time, transform raw rules content
        if(this.rulesContent === undefined){
            //transform raw rules
            this.rulesContent = MarkdownContent.transformRaw(rulesData, '/rules', null);
        }

        return this.rulesContent;
    }

}