import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { StorageService } from '@shared/services/storage.service';
import { PrintSettings, SpellPrintDirect } from '@models/spell-print.model';
import { ColorPreset } from '@models/color-preset.model';
import * as imagePaths from '@shared/imagePaths';
import * as iconPaths from '@shared/iconPaths';

const defaultPageWidth: string = '210mm';
const defaultPageHeight: string = '297mm';
const defaultCardWidth: number = 2.5;
const defaultCardHeight: number = 3.5;
const defaultCaptionSize: number = 14.5;
const defaultDescriptionSize: number = 10;
const defaultDescriptionSizeLarge: number = 10.75;
const defaultDescriptionSizeBig: number = 11.5;
const defaultBackgroundColor: string = ColorPreset.GetDefaultBackground();
const defaultFontIsWhite: boolean = ColorPreset.GetDefaultFontIsWhite();

export interface CardSizePreset{
  name: string;
  width: number;
  height: number;
}

export interface DescriptionSize{
  name: string;
  size: number;
}

@Component({
  selector: 'app-spell-print',
  templateUrl: './spell-print.component.html',
  styleUrls: ['./spell-print.component.scss', '../app.component.scss']
})
export class SpellPrintComponent implements OnInit {

  //global stuff
  spellsToPrint: SpellPrintDirect[] = new Array();
  printSettings: PrintSettings;
  images = imagePaths;
  icons = iconPaths;
  colorPresets: ColorPreset[] = ColorPreset.GetDefaultPresets();
  //card settings
  cardWidth: number = defaultCardWidth;
  cardHeight: number = defaultCardHeight;
  descriptionSize: DescriptionSize = { name: 'Default', size: defaultDescriptionSize};
  characterCards: boolean = false;
  showIcons: boolean = false;
  ritualAsIcon: boolean = false;
  ritualAsParenthesis: boolean = false;
  backgroundColor: string = defaultBackgroundColor;
  iconColor: string = defaultBackgroundColor;
  fontIsWhite: boolean = defaultFontIsWhite;
  selectedCardSizePreset: CardSizePreset;
  cardSizePresets: CardSizePreset[] = new Array();
  selectedDescriptionSize: DescriptionSize;
  descriptionSizes: DescriptionSize[] = new Array();


  constructor(
    private storageService: StorageService,
    private cdRef: ChangeDetectorRef,
  ) { 

    //defaults
    this.setScssCardWidth(this.cardWidth);
    this.setScssCardHeight(this.cardHeight);
    this.setScssBackgroundColor(this.backgroundColor);
    this.setScssIconColor(this.iconColor);
    this.setScssFontColor(this.fontIsWhite ? 'white' : 'black');
    this.setScssDescriptionFontSize(this.descriptionSize);
    this.cardSizePresets = [
      {name: 'Default/MtG (2.5 x 3.5 inches)', width: 2.5, height: 3.5},
      {name: 'Large (2.75 x 3.9 inches)', width: 2.75, height: 3.9}, //old: 2.7x3.8
      {name: 'Big (3.25 x 3.9 inches)', width: 3.25, height: 3.9}, //old: 2.85x3.99
      {name: 'Small/Yu-Gi-Oh! (2.25 x 3.25 inches)', width: 2.25, height: 3.25},
      {name: 'Special/Skat (2.32 x 3.58 inches)', width: 2.32, height: 3.58},
    ];
    this.selectedCardSizePreset = this.cardSizePresets[0];
    this.descriptionSizes = [
      {name: 'normal', size: defaultDescriptionSize},
      {name: 'large', size: defaultDescriptionSizeLarge},
      {name: 'big', size: defaultDescriptionSizeBig},
    ];
    this.selectedDescriptionSize = this.descriptionSizes[0];

    //load print settings
    this.printSettings = JSON.parse(this.storageService.loadLocal('PrintSettings'));
    this.characterCards = this.printSettings.characterMode;
    //if character mode, get character settings
    if(this.characterCards){
      this.showIcons = this.characterCards;
      this.backgroundColor = this.printSettings.backgroundColor;
      this.iconColor = this.printSettings.backgroundColor;
      this.fontIsWhite = this.printSettings.whiteFont;
      this.changeColor();
    }
  }

  ngOnInit(): void {   
    this.onCardPropChange();
  }

  private reloadSpellList() {

    //clear spell list
    this.spellsToPrint = new Array();
    
    //load from storage
    var loadedSpellsToPrint: SpellPrintDirect[] = JSON.parse(this.storageService.loadLocal('PrintSpells'));

    for (var spell of loadedSpellsToPrint) {

      //the number of necessary cards to show all of this spell's description (will be increased until it fits)
      var necessaryCardNumber = 0;

      //the description text which shall be added as fit
      var addText = spell.description;

      //do as long until all fits
      while (addText.length > 0) {

        necessaryCardNumber++;

        //create new card with the current number and empty description
        var currentSpellCard: SpellPrintDirect = { ...spell };
        currentSpellCard.nameSize = defaultCaptionSize;
        currentSpellCard.id = spell.name + necessaryCardNumber;
        currentSpellCard.description = '';
        this.spellsToPrint.push(currentSpellCard);

        //add as much as possible to the description (signaled by full description or empty text to add)
        var descriptionFull = false;
        while (!descriptionFull && addText.length > 0) {
          //add first section of the remaining description text
          //append unsuccessful means description is full
          //set the remaining text as new add text
          var appendResult = this.appendFirstTextSectionToDescription(currentSpellCard, addText);
          descriptionFull = !appendResult.success;
          addText = appendResult.remainingText;
        }
      }

      //afterwards, set part numbers in spell names depending on necessaryCardNumber (if it is over 1)
      if (necessaryCardNumber > 1) {
        var partNumber = 1;
        for (var readySpell of this.spellsToPrint) {
          if (readySpell.name === spell.name) {
            readySpell.nameEnumeration = ' [' + partNumber++ + '/' + necessaryCardNumber + ']';
          }
        }
      }

    }

    //make names fit
    for (var spell of this.spellsToPrint) {
      this.reduceNameSize(spell);
    }
    //refresh list and trigger reload of cards
    this.cdRef.detectChanges();
  }

  reduceNameSize(spellCard: SpellPrintDirect): void {

    var nameDoesNotFit: boolean = true;
    //reset to original size
    spellCard.nameSize = defaultCaptionSize;
    while(nameDoesNotFit){
      //check if name fits the box
      this.cdRef.detectChanges();
      var nameBox = document.getElementById('name' + spellCard.id)?.getBoundingClientRect();
      var propertiesBox = document.getElementById('properties' + spellCard.id)?.getBoundingClientRect();

      if(nameBox != undefined && propertiesBox != undefined
        && (propertiesBox.top - nameBox.top) < nameBox.height
        ){
          //reduce size
          spellCard.nameSize = spellCard.nameSize - 0.1;
      }
      else{
        nameDoesNotFit = false;
      }
    }

  }

  appendFirstTextSectionToDescription(spellCard: SpellPrintDirect, textToAppend: string, newSection: boolean = true, sectionIsSentence: boolean = false): AppendTextResult {

    //prepare default return values
    var result: AppendTextResult = { success: true, remainingText: ''};

    //check if something has to be done (not necessary if input is empty)
    if(textToAppend.length === 0){
      return result;
    }

    //necessary variables
    const breakSeparator: string = '<br>';    
    var sectionToAppend: string = textToAppend.trim();
    var remainingText: string = '';
    var originalDescription: string = spellCard.description;
    var originalDescriptionIsEmpty: boolean = originalDescription.length === 0;
    var sectionFits: boolean = true;

    //get section if the append text includes line break    
    if(sectionIsSentence == false && sectionToAppend.toLowerCase().includes('<br>')){
      var firstSeparatorIndex: number = textToAppend.toLowerCase().indexOf(breakSeparator);
      sectionToAppend = textToAppend.substring(0, firstSeparatorIndex).trim();
      remainingText = textToAppend.substring(firstSeparatorIndex + 4).trim();
    }

    //get sentence if the append text includes a full stop
    if(sectionIsSentence == true && sectionToAppend.toLowerCase().includes('.')){
      var firstSeparatorIndex: number = textToAppend.toLowerCase().indexOf('.');
      sectionToAppend = textToAppend.substring(0, firstSeparatorIndex + 1).trim();
      remainingText = textToAppend.substring(firstSeparatorIndex + 1).trim();

      //check if section to append contains non-closed <b> or <i>
      //and point comes after single character (likely german enumeration, e.g. "2.")
      while(true){
        var nonClosedB: boolean = sectionToAppend.toLowerCase().includes('<b>') && !sectionToAppend.toLowerCase().includes('</b>');
        var nonClosedI: boolean = sectionToAppend.toLowerCase().includes('<i>') && !sectionToAppend.toLowerCase().includes('</i>');
        var singleCharacterBefore: boolean = remainingText.includes('.') && sectionToAppend.substring(sectionToAppend.lastIndexOf('.') - 2, sectionToAppend.lastIndexOf('.') - 1) === ' ';
        var twoCharactersBefore: boolean = remainingText.includes('.') && sectionToAppend.substring(sectionToAppend.lastIndexOf('.') - 3, sectionToAppend.lastIndexOf('.') - 2) === ' ';
  
        if(nonClosedB || nonClosedI || singleCharacterBefore || twoCharactersBefore){

          //then add the next sentence also to the list
          //only if the remainingText contains a full stop
          if(!remainingText.includes('.')){
            break;
          }
          var nextSeparatorIndex: number = remainingText.toLowerCase().indexOf('.');
          sectionToAppend += ' ' + remainingText.substring(0, nextSeparatorIndex + 1).trim();
          remainingText = remainingText.substring(nextSeparatorIndex + 1).trim();

        }
        else{
          break;
        }
      }      
    }

    //append section to description
    if(originalDescriptionIsEmpty){
      spellCard.description = sectionToAppend;
    }
    else{
      if(sectionIsSentence == false){
        spellCard.description += breakSeparator + sectionToAppend;
      }
      else{
        if(newSection){
          spellCard.description += breakSeparator + sectionToAppend;
        }
        else{
          spellCard.description += ' ' + sectionToAppend;
        }
      }      
    }

    //refresh list to deploy change in description
    this.cdRef.detectChanges();

    //check if new description fits the box
    var descriptionBox = document.getElementById('description' + spellCard.id)?.getBoundingClientRect();
    var footerBox = document.getElementById('footer' + spellCard.id)?.getBoundingClientRect();
    if(descriptionBox != undefined && footerBox != undefined
      && (footerBox.top - descriptionBox.top) < descriptionBox.height){
        sectionFits = false;
    }

    //prepare result depending on section fitting
    //yes: return true and the textToAppend without the added section as remaining
    if(sectionFits){
      result.success = true;
      result.remainingText = remainingText; 
    }
    //no
    else{      
      
      if(sectionIsSentence == false){
        
        //restore the original description
        spellCard.description = originalDescription;
        this.cdRef.detectChanges(); //necessary?
        
        //now try to fit as much sentences from the text as possible
        var addText = textToAppend;
        var descriptionFull = false;
        var firstSentence = true;
        while (!descriptionFull && addText.length > 0) {
          //add first sentence of the remaining description text
          //append unsuccessful means description is full
          //set the remaining text as new add text
          var appendResult: AppendTextResult = { success: false, remainingText: addText};
          if(firstSentence){
            appendResult = this.appendFirstTextSectionToDescription(spellCard, addText, true, true);
            firstSentence = false;
          }
          else{
            appendResult = this.appendFirstTextSectionToDescription(spellCard, addText, false, true);
          }
          descriptionFull = !appendResult.success;
          addText = appendResult.remainingText;
        }

        //we know that not all will fit, so return false and the remaining text that couldn't be added
        result.success = false;
        result.remainingText = addText;

      }
      else{
        if(originalDescriptionIsEmpty == false){
          //restore the original description (and push)
          spellCard.description = originalDescription;
          this.cdRef.detectChanges(); //necessary?
          //return false and the textToAppend as remaining
          result.success = false;
          result.remainingText = textToAppend;
        }
        else{
          //if original description was empty, the section will never fit
          console.log(spellCard.name + ': one section/sentence too big for a card!')
          //so just let it be and report success until a better logic is found
          result.success = true;
          result.remainingText = remainingText;
        } 
      }      
    }

    return result;
  }

  onPresetChosen(preset: ColorPreset): void{
    this.backgroundColor = preset.backgroundColor;
    this.iconColor = preset.backgroundColor;
    this.fontIsWhite = preset.whiteFont;
    this.changeColor();
  }

  changeColor(): void{
    this.setScssBackgroundColor(this.backgroundColor);
    this.setScssIconColor(this.iconColor);
    this.setScssFontColor(this.fontIsWhite ? 'white' : 'black');
  }

  onNameFieldChange(): void{
    for(var spell of this.spellsToPrint){      
      this.reduceNameSize(spell);
    }
  }

  onCardPropChange(): void{    
    //get props from card size preset
    this.setScssCardWidth(this.selectedCardSizePreset.width);
    this.setScssCardHeight(this.selectedCardSizePreset.height);
    
    //get description size
    this.setScssDescriptionFontSize(this.selectedDescriptionSize);
    
    //recreate cards
    this.reloadSpellList();
  }

  onPrint(): void {
    window.print();
  }

  setScssCardWidth(width: number): void {
    document.documentElement.style.setProperty('--cardWidth', width + 'in');
  }
  setScssCardHeight(height: number): void {
    document.documentElement.style.setProperty('--cardHeight', height + 'in');
  }
  setScssBackgroundColor(color: string): void {
    document.documentElement.style.setProperty('--backgroundColor', color);
  }
  setScssIconColor(color: string): void {
    document.documentElement.style.setProperty('--iconColor', color);
  }
  setScssFontColor(color: string): void {
    document.documentElement.style.setProperty('--fontColor', color);
  }
  setScssDescriptionFontSize(size: DescriptionSize): void {
      document.documentElement.style.setProperty('--descriptionSize', size.size + 'px');
  }

}

export interface AppendTextResult {
  success: boolean;
  remainingText: string;
}