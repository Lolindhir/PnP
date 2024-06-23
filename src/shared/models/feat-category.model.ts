export interface FeatCategory{
    name: string;
    subcategories: string[];
    orderByPrerequisite: boolean;
} 

export class FeatCategory implements FeatCategory {

    constructor(name: string, subcategories: string[], orderByPrerequisite: boolean){
        this.name = name;
        this.subcategories = subcategories;
        this.orderByPrerequisite = orderByPrerequisite;
    }
    
    public static getCategoryIndex (categories: FeatCategory[], categoryName: string): number {
        for (let i = 0; i < categories.length; i++) {
          if (categories[i].name === categoryName) {
            return i;
          }
          if (categories[i].subcategories.includes(categoryName)) {
            return i;
          }
        }
        return -1; //if category can not be found
    };

}