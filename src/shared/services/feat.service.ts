import { Injectable } from '@angular/core';
import { Feat, RawFeat } from "@models/feat.model";

//import data
import featsData from 'D:/OneDrive/D&D/My Homebrew and -Rules/feats.json'; 


@Injectable({
  providedIn: 'root'
})
export class FeatService {  

    allFeats: Feat[] = new Array();

    constructor(){
        
        //get feats from raw
        var rawFeat: RawFeat[] = featsData;
        rawFeat.forEach(rawFeat => {      
            //push to all-List
            this.allFeats.push(new Feat(rawFeat))       
        });

        //sort feats
        this.allFeats.sort(Feat.compareBasic);

    }

}