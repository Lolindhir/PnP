import { Injectable } from '@angular/core';
import { Feat, RawFeat } from "@models/feat.model";
import { FeatProperties } from "@models/feat-properties.model";

//import data
import featsData from 'D:/OneDrive/D&D/My Homebrew and -Rules/feats.json';
import featPropertiesData from 'D:/OneDrive/D&D/My Homebrew and -Rules/featProperties.json';


@Injectable({
  providedIn: 'root'
})
export class FeatService {  

    allFeats: Feat[] = new Array();
    featProperties: FeatProperties = featPropertiesData;

    constructor(){
        
        //get feats from raw
        var rawFeat: RawFeat[] = featsData;
        rawFeat.forEach(rawFeat => {      
            //push to all-List
            this.allFeats.push(new Feat(rawFeat))       
        });

        //set feat properties
        Feat.globalProperties = this.featProperties;

        //sort feats
        this.allFeats.sort(Feat.compareBasic);

    }

}