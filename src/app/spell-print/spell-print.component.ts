import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { StorageService } from '@shared/services/storage.service';
import { PrintSettings, SpellPrintDirect } from '@models/spell-print.model';
import { ColorPreset } from '@models/color-preset.model';
import * as imagePaths from '@shared/imagePaths';

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
  landscape: boolean;
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
  colorPresets: ColorPreset[] = ColorPreset.GetDefaultPresets();
  //card settings
  pageLandscape: boolean = false;
  cardWidth: number = defaultCardWidth;
  cardHeight: number = defaultCardHeight;
  descriptionSize: DescriptionSize = { name: 'Default', size: defaultDescriptionSize};
  characterCards: boolean = false;
  showIcons: boolean = false;
  ritualAsIcon: boolean = false;
  ritualAsParenthesis: boolean = false;
  backgroundColor: string = defaultBackgroundColor;
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
    this.setScssPageDimensions(this.pageLandscape);
    this.setScssCardWidth(this.cardWidth);
    this.setScssCardHeight(this.cardHeight);
    this.setScssBackgroundColor(this.backgroundColor);
    this.setScssFontColor(this.fontIsWhite ? 'white' : 'black');
    this.setScssDescriptionFontSize(this.descriptionSize);
    this.cardSizePresets = [
      {name: 'Default/MtG (2.5 x 3.5 inches)', width: 2.5, height: 3.5, landscape: false },
      {name: 'Large (2.7 x 3.8 inches)', width: 2.7, height: 3.8, landscape: false },
      {name: 'Big (2.85 x 3.99 inches)', width: 2.85, height: 3.99, landscape: true },
      {name: 'Small/Yu-Gi-Oh! (2.25 x 3.25 inches)', width: 2.25, height: 3.25, landscape: true },
      {name: 'Special/Skat (2.32 x 3.58 inches)', width: 2.32, height: 3.58, landscape: true },
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

  appendFirstTextSectionToDescription(spellCard: SpellPrintDirect, textToAppend: string): AppendTextResult {

    //prepare default return values
    var result: AppendTextResult = { success: true, remainingText: ''};

    //check if something has to be done (not necessary if input is empty)
    if(textToAppend.length === 0){
      return result;
    }

    //necessary variables
    const separator: string = '<br>';    
    var sectionToAppend: string = textToAppend.trim();
    var remainingText: string = '';
    var originalDescription: string = spellCard.description;
    var originalDescriptionIsEmpty: boolean = originalDescription.length === 0;
    var sectionFits: boolean = true;

    //get section if the append text includes line break    
    if(sectionToAppend.toLowerCase().includes('<br>')){
      var firstSeparatorIndex: number = textToAppend.toLowerCase().indexOf(separator);
      sectionToAppend = textToAppend.substring(0, firstSeparatorIndex).trim();
      remainingText = textToAppend.substring(firstSeparatorIndex + 4).trim();
    }

    //append section to description
    if(originalDescriptionIsEmpty){
      spellCard.description = sectionToAppend;
    }
    else{
      spellCard.description += separator + sectionToAppend;
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
        console.log(spellCard.name + ': one section too big for a card!')
        //so just let it be and report success until a better logic is found
        result.success = true;
        result.remainingText = remainingText;
      } 
    }

    return result;
  }

  onPresetChosen(preset: ColorPreset): void{
    this.backgroundColor = preset.backgroundColor;
    this.fontIsWhite = preset.whiteFont;
    this.changeColor();
  }

  changeColor(): void{
    this.setScssBackgroundColor(this.backgroundColor);
    this.setScssFontColor(this.fontIsWhite ? 'white' : 'black');
  }

  onPageOrientationChange(): void{
    this.setScssPageDimensions(this.pageLandscape);
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
    this.pageLandscape = this.selectedCardSizePreset.landscape;
    
    //get description size
    this.setScssDescriptionFontSize(this.selectedDescriptionSize);
    
    //recreate cards
    this.reloadSpellList();

    //set page orientation
    this.onPageOrientationChange();
  }

  onPrint(): void {
    window.print();
  }

  setScssPageDimensions(landscape: boolean): void {
    if(landscape){
      document.documentElement.style.setProperty('--pageWidth', defaultPageHeight);
      document.documentElement.style.setProperty('--pageHeight', defaultPageWidth);
    }
    else{
      document.documentElement.style.setProperty('--pageWidth', defaultPageWidth);
      document.documentElement.style.setProperty('--pageHeight', defaultPageHeight);
    }    
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