//import data
import rulesData from 'D:/OneDrive/D&D/Website Content/rulesToC.json';

export interface RawRulesContent {
    id: string;
    name: string;
    filename: string;
    children: RawRulesContent[];
}

export interface RulesContent {
    id: string;
    name: string;
    filename: string;
    path: string;
    children: RulesContent[];
}

export interface RulesNavigationRoute {
    name: string,
    route: string,
    children: RulesNavigationRoute[]
}

export class RulesContent {

    private static allRules: RulesContent[] | undefined = undefined;
    private static allRoutesRouting: string[] = new Array();
    private static allRoutesNavigation: RulesNavigationRoute[] = new Array();

    constructor(){}

    public static getAllRules(): RulesContent[] {

        //if first time, transform raw rules content
        if(this.allRules === undefined){
            //get rules from raw
            var rawRules: RawRulesContent[] = rulesData;
            //transform raw rules
            this.allRules = this.transformRaw(rawRules, '/rules');
        }

        return this.allRules;
    }

    public static getById(id: string): RulesContent | undefined {
        return this.searchById(id, this.getAllRules());
    }

    public static getAllRoutes(): string[] {
        if(this.allRoutesRouting.length < 1){   
            this.allRoutesRouting = new Array();
            this.transformToRoutes(this.getAllRules());
        }
        return this.allRoutesRouting;
    }

    public static getAllNavigation(): RulesNavigationRoute[] {
        if(this.allRoutesNavigation.length < 1){
            this.allRoutesNavigation = this.transformToNavigation(this.getAllRules());
        }
        return this.allRoutesNavigation;
    }

    private static transformToRoutes(rulesContent: RulesContent[]): void {

        for(var ruleContent of rulesContent){

            //if it has children, create route and navigation
            if(ruleContent.children.length > 0){
                
                //if it has children, work them
                if(ruleContent.children.length > 0){
                    //push child route
                    this.allRoutesRouting.push(ruleContent.path.substring(1, ruleContent.path.length) + '/:article');
                    
                    //create child routing
                    this.transformToRoutes(ruleContent.children);
                }
            }
        }
    }

    private static transformToNavigation(rulesContent: RulesContent[]): RulesNavigationRoute[] {

        var returnArray: RulesNavigationRoute[] = new Array();

        for(var ruleContent of rulesContent){

            //create navigation element (maybe we don't need it)
            var ruleNavigation: RulesNavigationRoute = {
                name: ruleContent.name,
                route: ruleContent.path,
                children: new Array()
            }

            //if it has children or file entry, create route and navigation
            if(ruleContent.filename.length > 0 || ruleContent.children.length > 0){
                
                //if it has children, work them
                if(ruleContent.children.length > 0){
                    
                    //create child navigation
                    ruleNavigation.children = this.transformToNavigation(ruleContent.children);
                }

                //push complete navigation
                returnArray.push(ruleNavigation);
            }
        }

        return returnArray;
    }
    
    private static transformRaw(rawContent: RawRulesContent[], parentPath: string): RulesContent[]{

        var freshRulesContentArray: RulesContent[] = new Array();

        rawContent.forEach(rawRule => {

            //build new path
            var newPath: string = parentPath + '/' + rawRule.id

            //create fresh rules content
            var freshRulesContent: RulesContent = {
                id: rawRule.id,
                name: rawRule.name,
                filename: rawRule.filename,
                path: newPath,
                children: this.transformRaw(rawRule.children, newPath)
            };

            //push fresh rules content
            freshRulesContentArray.push(freshRulesContent);
        });

        return freshRulesContentArray;
    }

    private static searchById(id: string, searchObjects: RulesContent[]): RulesContent | undefined {

        var foundObject: RulesContent | undefined = undefined;

        for(var searchObject of searchObjects){
            //look for the object itself
            if(searchObject.id === id){
                foundObject = searchObject;
                break;
            }

            //search its children
            foundObject = this.searchById(id, searchObject.children);

            //stop, if searched object is one of the children
            if(foundObject != undefined) break;            
        }

        return foundObject;
    }
}