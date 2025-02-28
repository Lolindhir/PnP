//import data
import rulesData from 'D:/OneDrive/D&D/Website Content/rulesToC.json';

export interface RawRulesContent {
    id: string;
    name: string;
    breadcrumb: string;
    indexing: string;
    indexname: string;
    indexCategory: string;
    indexSubCategory: string;
    filename: string;
    children: RawRulesContent[];
}

export interface RulesContent {
    id: string;
    name: string;
    breadcrumb: string;
    indexing: string;
    indexname: string;
    indexCategory: string;
    indexSubCategory: string;
    filename: string;
    path: string;
    children: RulesContent[];
    parent: RulesContent | null;
}

export interface RulesNavigationRoute {
    name: string,
    route: string,
    children: RulesNavigationRoute[]
}

export interface RulesNavigationRouteSimple {
    name: string,
    route: string
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
            this.allRules = this.transformRaw(rawRules, '/rules', null);
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
            this.allRoutesNavigation = this.transformToNavigationMass(this.getAllRules());
        }
        return this.allRoutesNavigation;
    }

    public static getSingleNavigation(targetRulesContent: RulesContent): RulesNavigationRoute {
        return this.transformToNavigationSingle(targetRulesContent);
    }

    public static getBreadcrumb(targetRulesContent: RulesContent): RulesNavigationRouteSimple[] {
        var chainArray: RulesNavigationRouteSimple[] = new Array();
        this.getParentBreadcrumbNav(targetRulesContent, chainArray);
        return chainArray;
    }




    private static getParentBreadcrumbNav(rulesContent: RulesContent, chainArray: RulesNavigationRouteSimple[]): void {

        //first check for parent and call recursion to order array top down
        if(rulesContent.parent != null){
            this.getParentBreadcrumbNav(rulesContent.parent, chainArray);
        }

        //then add current rules content
        chainArray.push({
            name: rulesContent.breadcrumb,
            route: rulesContent.path
        });
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

    private static transformToNavigationMass(rulesContent: RulesContent[]): RulesNavigationRoute[] {

        var returnArray: RulesNavigationRoute[] = new Array();

        for(var ruleContent of rulesContent){

            var ruleNavigation: RulesNavigationRoute = this.transformToNavigationSingle(ruleContent);

            //push complete navigation
            returnArray.push(ruleNavigation);
            
        }

        return returnArray;
    }

    private static transformToNavigationSingle(rulesContent: RulesContent): RulesNavigationRoute {

        //create navigation element (maybe we don't need it)
        var ruleNavigation: RulesNavigationRoute = {
            name: rulesContent.name,
            route: rulesContent.path,
            children: new Array()
        }

        //if it has children or file entry, create route and navigation
        if(rulesContent.filename.length > 0 || rulesContent.children.length > 0){
            
            //if it has children, work them
            if(rulesContent.children.length > 0){
                
                //create child navigation
                ruleNavigation.children = this.transformToNavigationMass(rulesContent.children);
            }

            //push complete navigation
            return ruleNavigation;
        }

        return ruleNavigation;
    }
    
    private static transformRaw(rawContent: RawRulesContent[], parentPath: string, parent: RulesContent | null): RulesContent[]{

        var freshRulesContentArray: RulesContent[] = new Array();

        rawContent.forEach(rawRule => {

            //build new path
            var newPath: string = parentPath + '/' + rawRule.id

            //create fresh rules content
            var freshRulesContent: RulesContent = {
                id: rawRule.id,
                name: rawRule.name,
                breadcrumb: rawRule.breadcrumb,
                indexing: rawRule.indexing,
                indexname: rawRule.indexname,
                indexCategory: rawRule.indexCategory,
                indexSubCategory: rawRule.indexSubCategory,
                filename: rawRule.filename,
                path: newPath,
                children: new Array(),
                parent: parent
            };

            //transform children and add
            freshRulesContent.children = this.transformRaw(rawRule.children, newPath, freshRulesContent);

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