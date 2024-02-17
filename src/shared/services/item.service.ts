import { Injectable } from '@angular/core';
import { Item, RawItem } from "@models/item.model";
import { ArrayUtilities } from "@utilities/array.utilities";

//import data
import itemsData from 'D:/OneDrive/D&D/Karten - Items/items.json'; 


@Injectable({
  providedIn: 'root'
})
export class ItemService {  

    allItems: Item[] = new Array();
    publicItems: Item[] = new Array();

    constructor(){

        //get items from raw
        var rawItems: RawItem[] = itemsData;
        rawItems.forEach(rawItem => {      
            //push to all-List
            this.allItems.push(new Item(rawItem))
            //only public items to public list
            if(rawItem.public){
                this.publicItems.push(new Item(rawItem))
            }        
        });

        //sort items
        this.allItems.sort(Item.compareRarityFirst);
        this.publicItems.sort(Item.compareRarityFirst);

    }

}