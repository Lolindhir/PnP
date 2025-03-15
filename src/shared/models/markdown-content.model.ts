import { CampaignInfo } from '@models/campaign-info.model';

export interface RawMarkdownContent {
    id: string;
    name: string;
    breadcrumb: string;
    indexing: string;
    indexname: string;
    indexCategory: string;
    indexSubCategory: string;
    filename: string;
    children: RawMarkdownContent[];
}

export interface MarkdownContent {
    id: string;
    name: string;
    breadcrumb: string;
    indexing: string;
    indexname: string;
    indexCategory: string;
    indexSubCategory: string;
    filename: string;
    path: string;
    children: MarkdownContent[];
    parent: MarkdownContent | null;
}

export interface CampaignMarkdownContent {
    info: CampaignInfo;
    content: MarkdownContent[];
}

export interface MarkdownNavigationRoute {
    name: string,
    route: string,
    children: MarkdownNavigationRoute[]
}

export interface MarkdownNavigationRouteSimple {
    name: string,
    route: string
}


export class MarkdownContent {

    constructor(){}

    public static searchById(id: string, searchObjects: MarkdownContent[]): MarkdownContent | undefined {
      
        var foundObject: MarkdownContent | undefined = undefined;

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

    public static getAllRoutes(content: MarkdownContent[]): string[] {
        var routes: string[] = new Array();
        this.transformToRoutes(content, routes);
        return routes;
    }

    private static transformToRoutes(content: MarkdownContent[], routes: string[]): void {
        content.forEach(item => {
            //if it has children, create route and navigation
            if (item.children.length > 0) {
            //push child route
            routes.push(item.path.substring(1, item.path.length) + '/:article');

            //create child routing
            this.transformToRoutes(item.children, routes);
            }
        });
    }

    public static getBreadcrumb(targetContent: MarkdownContent): MarkdownNavigationRouteSimple[] {
        var chainArray: MarkdownNavigationRouteSimple[] = new Array();
        this.getParentBreadcrumbNav(targetContent, chainArray);
        return chainArray;
    }

    private static getParentBreadcrumbNav(markdownContent: MarkdownContent, chainArray: MarkdownNavigationRouteSimple[]): void {

        //first check for parent and call recursion to order array top down
        if(markdownContent.parent != null){
            this.getParentBreadcrumbNav(markdownContent.parent, chainArray);
        }

        //then add current rules content
        chainArray.push({
            name: markdownContent.breadcrumb,
            route: markdownContent.path
        });
    }   

    public static getAllNavigation(content: MarkdownContent[]): MarkdownNavigationRoute[] {
        return this.transformToNavigationMass(content);
    }

    public static getSingleNavigation(targetRulesContent: MarkdownContent): MarkdownNavigationRoute {
        return this.transformToNavigationSingle(targetRulesContent);
    }

    private static transformToNavigationSingle(markdownContent: MarkdownContent): MarkdownNavigationRoute {

        //create navigation element (maybe we don't need it)
        var ruleNavigation: MarkdownNavigationRoute = {
            name: markdownContent.name,
            route: markdownContent.path,
            children: new Array()
        }

        //if it has children or file entry, create route and navigation
        if(markdownContent.filename.length > 0 || markdownContent.children.length > 0){
            
            //if it has children, work them
            if(markdownContent.children.length > 0){
                
                //create child navigation
                ruleNavigation.children = this.transformToNavigationMass(markdownContent.children);
            }

            //push complete navigation
            return ruleNavigation;
        }

        return ruleNavigation;
    }

    private static transformToNavigationMass(markdownContent: MarkdownContent[]): MarkdownNavigationRoute[] {

        var returnArray: MarkdownNavigationRoute[] = new Array();

        for(var ruleContent of markdownContent){

            var ruleNavigation: MarkdownNavigationRoute = this.transformToNavigationSingle(ruleContent);

            //push complete navigation
            returnArray.push(ruleNavigation);
            
        }

        return returnArray;
    }

    
    public static transformRaw(rawContent: RawMarkdownContent[], parentPath: string, parent: MarkdownContent | null): MarkdownContent[]{

        var freshContentArray: MarkdownContent[] = new Array();

        rawContent.forEach(rawContent => {

            //build new path
            var newPath: string = parentPath + '/' + rawContent.id

            //create fresh rules content
            var freshContent: MarkdownContent = {
                id: rawContent.id,
                name: rawContent.name,
                breadcrumb: rawContent.breadcrumb,
                indexing: rawContent.indexing,
                indexname: rawContent.indexname,
                indexCategory: rawContent.indexCategory,
                indexSubCategory: rawContent.indexSubCategory,
                filename: rawContent.filename,
                path: newPath,
                children: new Array(),
                parent: parent
            };

            //transform children and add
            freshContent.children = this.transformRaw(rawContent.children, newPath, freshContent);

            //push fresh rules content
            freshContentArray.push(freshContent);
        });

        return freshContentArray;
    }

}