import { Component, Inject, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit, EventEmitter } from '@angular/core';
import { Spell, RawSpell, SpellListCategory } from '@models/spell.model';
import { SpellService } from '@services/spell.service';
import { SpellClass } from '@models/spell-class.model';
import { SpellFilter, SpellFilterType, SpellFilterGroup } from '@models/spell-filter.model';
import { ArrayUtilities } from '@utilities/array.utilities';
import spellsData from 'D:/OneDrive/D&D/Public/Quellen und Infos/Zauber/spells.json'; 
import spellPropertiesData from 'D:/OneDrive/D&D/Public/Quellen und Infos/Zauber/spellProperties.json'; 
import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY } from '@angular/cdk/overlay/overlay-directives';
import * as imagePaths from '@shared/imagePaths';
import { CookieService } from 'ngx-cookie-service';
import { ViewportScroller } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Character, CharacterData, ModeOption } from '@shared/models/character.model';
import { Preset } from '@shared/models/preset.model';
import { SpellProperties } from '@shared/models/spell-properties.model';
import { SnackBarComponent } from '@components/snack-bar/snack-bar.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from "@angular/platform-browser";

export interface SettingsData {
  showRandomControls: boolean;
  translateAll: boolean;
  sortByName: boolean;
  characterMode: boolean;
}


@Component({
  selector: 'app-spell-list',
  templateUrl: './spell-list.component.html',
  styleUrls: ['./spell-list.component.scss']
})
export class SpellListComponent implements OnInit, AfterViewInit {

  //filter stuff
  advancedFiltersPanelOpen: boolean = false;
  filters: SpellFilter[] = new Array();
  filterName: string = '';
  selectedFiltersLevel: SpellFilter[] = new Array();
  selectedFiltersSchool: SpellFilter[] = new Array();
  selectedFiltersClass: SpellFilter[] = new Array();
  selectedFiltersSingleClass: SpellFilter[] = new Array();
  selectedFiltersMustClass: SpellFilter[] = new Array();
  selectedFiltersNotClass: SpellFilter[] = new Array();
  selectedFiltersSubclass: SpellFilter[] = new Array();
  selectedFiltersCastingTime: SpellFilter[] = new Array();
  selectedFiltersDuration: SpellFilter[] = new Array();
  selectedFiltersRange: SpellFilter[] = new Array();
  selectedFiltersDamageType: SpellFilter[] = new Array();
  selectedFiltersCondition: SpellFilter[] = new Array();
  selectedFiltersSave: SpellFilter[] = new Array();
  selectedFiltersAttackType: SpellFilter[] = new Array();
  selectedFiltersAttackSave: SpellFilter[] = new Array();
  selectedFiltersAffectedTargets: SpellFilter[] = new Array();
  selectedFiltersTag: SpellFilter[] = new Array();
  selectedFiltersSingleTag: SpellFilter[] = new Array();
  selectedFiltersMustTag: SpellFilter[] = new Array();
  selectedFiltersNotTag: SpellFilter[] = new Array();
  selectedFiltersPreset: SpellFilter[] = new Array();
  selectedFiltersSource: SpellFilter[] = new Array();
  selectedFiltersSourceGroups: SelectionModel<SpellFilter>;
  selectedFiltersConcentration: string[] = new Array();
  selectedFiltersRitual: string[] = new Array();
  selectedFiltersTargetCaster: string[] = new Array();
  selectedFiltersComponentV: string[] = new Array();
  selectedFiltersComponentS: string[] = new Array();
  selectedFiltersComponentM: string[] = new Array();
  selectedFiltersMaterialValue: string[] = new Array();
  selectedFiltersMaterialConsumed: string[] = new Array();
  selectedFiltersUpcastable: string[] = new Array();
  selectedFiltersSpellMod: string[] = new Array();

  //all filter options
  optionsLevel: SpellFilter[] = new Array();
  optionsSchool: SpellFilter[] = new Array();
  optionsSource: SpellFilter[] = new Array();
  optionsSourceGroups: SpellFilterGroup[] = new Array();
  optionsClass: SpellFilter[] = new Array();
  optionsSingleClass: SpellFilter[] = new Array();
  optionsMustClass: SpellFilter[] = new Array();
  optionsNotClass: SpellFilter[] = new Array();
  optionsSubclass: SpellFilter[] = new Array();
  optionsCastingTime: SpellFilter[] = new Array();
  optionsDuration: SpellFilter[] = new Array();
  optionsRange: SpellFilter[] = new Array();
  optionsDamageType: SpellFilter[] = new Array();
  optionsCondition: SpellFilter[] = new Array();
  optionsSave: SpellFilter[] = new Array();
  optionsAttackType: SpellFilter[] = new Array();
  optionsAttackSave: SpellFilter[] = new Array();
  optionsAffectedTargets: SpellFilter[] = new Array();
  optionsTag: SpellFilter[] = new Array();
  optionsSingleTag: SpellFilter[] = new Array();
  optionsMustTag: SpellFilter[] = new Array();
  optionsNotTag: SpellFilter[] = new Array();
  optionsPreset: SpellFilter[] = new Array();
  optionsConcentration: SpellFilter[] = new Array();
  optionsRitual: SpellFilter[] = new Array();
  optionsTargetCaster: SpellFilter[] = new Array();
  optionsComponentV: SpellFilter[] = new Array();
  optionsComponentS: SpellFilter[] = new Array();
  optionsComponentM: SpellFilter[] = new Array();
  optionsMaterialValue: SpellFilter[] = new Array();
  optionsMaterialConsumed: SpellFilter[] = new Array();
  optionsUpcastable: SpellFilter[] = new Array();
  optionsSpellMod: SpellFilter[] = new Array();

  //spell related stuff
  spellProperties: SpellProperties = spellPropertiesData;
  spells: Spell[] = new Array();
  spellsFiltered: Spell[] = new Array();
  spellsToShow: Spell[] = new Array();
  numberOfRandomSpells: number = 0;
  stringOfRandomSpells: string = 'Random spells';
  private spellReloadAmount: number = 30;

  //other global stuff
  images = imagePaths;
  settings: SettingsData = {
    showRandomControls: false,
    sortByName: false,
    translateAll: false,
    characterMode: false,
  };
  characterData: CharacterData = {
    characterList: new Array(),
    selectedCharacter: undefined,
    presets: new Array(),
    cookieService: undefined,
    masterSpellList: new Array(),
  };
  highlightColor: string = '#E0FFFF'; //'lightgrey';
  highlightFilter: boolean = false;
  loading: boolean = true;
  ModeOption = ModeOption;
  expandedPanelIndex: number = -1;
  assetNotLoadedIndex: number = -1;
  showAdvancedFilters: boolean = false;
  showTags: boolean = true;
  characterManagementActivated: boolean = true;
  tooltipDelay = 500;
  screenWidth: number = -1;
  screenSm: boolean = false;
  screenMd: boolean = false;
  screenLg: boolean = false;
  screenXl: boolean = false;
  showColumnTags: boolean = false;
  showColumnLevel: boolean = false;
  showColumnCastingTime: boolean = false;
  showColumnRange: boolean = false;
  showColumnFlex: boolean = false;

  @ViewChild('expansionAccordion')
  expansionAccordion: ElementRef;


  constructor(private httpClient: HttpClient, 
    private cookieService: CookieService, 
    private viewPortScroller: ViewportScroller,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {

    //create own icons
    this.matIconRegistry.addSvgIcon('ritual', this.domSanitizer.bypassSecurityTrustResourceUrl(this.images.spellRitual));
    this.matIconRegistry.addSvgIcon('ritual_grey', this.domSanitizer.bypassSecurityTrustResourceUrl(this.images.spellRitualGrey));

    //test for read of local file
    //this.httpClient.get<RawSpell[]>(this.spellPresetPath).pipe(retry(1), catchError(this.handleError)).subscribe(data => { this.test = data });

    //load settings from cookies
    this.loadSettingsFromCookies();    

    //get screen width
    this.screenWidth = window.innerWidth;
    this.setSize();

    //fill spells with raw spell data from json
    //and build sort options
    var rawSpells: RawSpell[] = spellsData;
    rawSpells.forEach(rawSpell => {
      
      //only allowed spells
      if(!rawSpell.allowed){
        return;
      }

      //create spell
      this.spells.push(new Spell(rawSpell, this.spellProperties))

    });

    //sort spells
    this.sortMasterSpells();

    //translate spells
    this.translateAllMasterSpells();

    //fill filtered spells with all spells, because nothing is yet filtered
    this.spellsFiltered = this.spells;

    //build options
    this.optionsLevel = SpellService.getLevelFilterOptions(this.spellProperties);
    this.optionsSchool = SpellService.getSchoolFilterOptions(this.spellProperties);
    this.optionsClass = SpellService.getClassFilterOptions(this.spellProperties);
    this.optionsSingleClass = SpellService.getSingleClassFilterOptions(this.spellProperties);
    this.optionsMustClass = SpellService.getMustClassFilterOptions(this.spellProperties);
    this.optionsNotClass = SpellService.getNotClassFilterOptions(this.spellProperties);
    this.optionsSubclass = SpellService.getSubclassFilterOptions(this.spellProperties);
    this.optionsSchool = SpellService.getSchoolFilterOptions(this.spellProperties);
    this.optionsSource = SpellService.getSourceFilterOptions(this.spells, this.spellProperties);
    this.optionsSourceGroups = SpellService.getSourceGroupFilterOptions(this.optionsSource, this.spellProperties);
    this.optionsCastingTime = SpellService.getCastingTimeFilterOptions(this.spellProperties);
    this.optionsDuration = SpellService.getDurationFilterOptions(this.spellProperties);
    this.optionsRange = SpellService.getRangeFilterOptions(this.spellProperties);
    this.optionsDamageType = SpellService.getDamageTypeFilterOptions(this.spellProperties);
    this.optionsCondition = SpellService.getConditionFilterOptions(this.spellProperties);
    this.optionsSave = SpellService.getSaveFilterOptions(this.spellProperties);
    this.optionsAttackType = SpellService.getAttackTypeFilterOptions(this.spellProperties);
    this.optionsAttackSave = SpellService.getAttackSaveFilterOptions(this.spellProperties);
    this.optionsAffectedTargets = SpellService.getAffectedTargetsFilterOptions(this.spellProperties);
    this.optionsTag = SpellService.getTagFilterOptions(this.spellProperties);
    this.optionsSingleTag = SpellService.getSingleTagFilterOptions(this.spellProperties);
    this.optionsMustTag = SpellService.getMustTagFilterOptions(this.spellProperties);
    this.optionsNotTag = SpellService.getNotTagFilterOptions(this.spellProperties);
    this.optionsPreset = SpellService.getPresetFilterOptions(this.spellProperties);
    this.optionsConcentration = SpellService.getConcentrationFilterOptions(this.spellProperties);
    this.optionsRitual = SpellService.getRitualFilterOptions(this.spellProperties);
    this.optionsTargetCaster = SpellService.getTargetCasterFilterOptions(this.spellProperties);
    this.optionsComponentV = SpellService.getComponentVerbalFilterOptions(this.spellProperties);
    this.optionsComponentS = SpellService.getComponentSomaticFilterOptions(this.spellProperties);
    this.optionsComponentM = SpellService.getComponentMaterialFilterOptions(this.spellProperties);
    this.optionsMaterialValue = SpellService.getMaterialValueFilterOptions(this.spellProperties);
    this.optionsMaterialConsumed = SpellService.getMaterialConsumedFilterOptions(this.spellProperties);
    this.optionsUpcastable = SpellService.getUpcastableFilterOptions(this.spellProperties);
    this.optionsSpellMod = SpellService.getSpellModFilterOptions(this.spellProperties);

    //load character list from cookies
    this.characterData.characterList = Character.loadCharactersFromCookies(cookieService);
    //set selected character depending on character mode
    this.applyCharacterMode();
    //add presets to character data
    var presets: Preset[] = new Array();
    for(var presetFilter of this.optionsPreset){
      presets.push(presetFilter.value);
    }
    this.characterData.presets = presets;
    //add cookie service to character data
    this.characterData.cookieService = this.cookieService;
    //add master spells to character data
    this.characterData.masterSpellList = this.spells;

    //sort spells
    this.sortMasterSpells();

    //trigger change of shown spells
    this.onChange();
  }

  ngOnInit(): void {

    console.log("ngOnInit called");    

    //add first spells to show list
    this.onChange();
    this.fetchMore();

  }

  ngAfterViewInit(): void {
    
    console.log("ngAfterViewInit called");

    this.setSize();

    //show content because everything is set up
    this.loading = false;
  }

  fetchMore(): boolean {
    
    var currentSpellsShownLength: number = this.spellsToShow.length;

    //check if there are and how many spells to add
    var potentialSpellsToAdd: number = this.spellsFiltered.length - currentSpellsShownLength;
    var spellsToAdd: number = this.spellReloadAmount < potentialSpellsToAdd ? this.spellReloadAmount : potentialSpellsToAdd;

    var didSomething: boolean = false;
    for(var i = 0; i < spellsToAdd; i++){
      
      var index: number = currentSpellsShownLength + i;
      this.spellsToShow.push(this.spellsFiltered[index]);
      didSomething = true;

    }

    return didSomething;
  }  
  
  sortMasterSpells() {
    
    if(this.settings.sortByName){
      if(this.characterData.selectedCharacter?.mode === ModeOption.AddRemove && this.characterData.selectedCharacter?.knownOnTop){
        this.spells.sort(Spell.compareKnownNameFirst);
      }
      else if(this.characterData.selectedCharacter?.mode === ModeOption.Prep && this.characterData.selectedCharacter?.preparedOnTop){
        this.spells.sort(Spell.comparePreparedNameFirst);
      }
      else if(this.characterData.selectedCharacter?.mode === ModeOption.Session && this.characterData.selectedCharacter?.ritualsAtBottom){
        this.spells.sort(Spell.compareRitualNameFirst);
      }
      else{
        this.spells.sort(Spell.compareNameFirst);
      }
    }
    else{
      if(this.characterData.selectedCharacter?.mode === ModeOption.AddRemove && this.characterData.selectedCharacter?.knownOnTop){
        this.spells.sort(Spell.compareKnownLevelFirst);
      }
      else if(this.characterData.selectedCharacter?.mode === ModeOption.Prep && this.characterData.selectedCharacter?.preparedOnTop){
        this.spells.sort(Spell.comparePreparedLevelFirst);
      }
      else if(this.characterData.selectedCharacter?.mode === ModeOption.Session && this.characterData.selectedCharacter?.ritualsAtBottom){
        this.spells.sort(Spell.compareRitualLevelFirst);
      }
      else{
        this.spells.sort(Spell.compareLevelFirst);
      }
    }
  }

  translateAllMasterSpells(){
    for(var spell of this.spells){
      if(this.settings.translateAll && spell.translatable && !spell.translated){
        spell.translated = true;
        spell.descriptionDisplay = spell.translation;
      }
      if(!this.settings.translateAll && spell.translated){
        spell.translated = false;
        spell.descriptionDisplay = spell.description;
      }
    } 
  }

  greyOutUsed(spell: Spell): boolean{

    var char: Character | undefined = this.characterData.selectedCharacter;
    if(char === undefined){ 
      return false;
    }

    if(char.mode === ModeOption.Session && spell.used){
      return true;
    }

    return false;
  } 

  showRedBorder(): boolean {
    
    var char: Character | undefined = this.characterData.selectedCharacter;
    if(char === undefined){ 
      return false;
    }

    if(char.mode === ModeOption.AddRemove && this.knownHasError()){
      return true;
    }

    if(char.mode === ModeOption.Prep && this.preparedHasError()){
      return true;
    }

    return false;
  }

  applyCharacterMode(){

    if(this.settings.characterMode){

      var selectedId: number = Number(this.cookieService.get('SelectedCharacter'));
      for(var char of this.characterData.characterList){
        if(char.id === selectedId){
          this.characterData.selectedCharacter = char;
          break;
        }
      }

    }
    else{
      this.characterData.selectedCharacter = undefined;
      this.cookieService.set('SelectedCharacter', '', -1);
    }

    this.applySelectedCharacterData();

  }

  applySelectedCharacterData(){

    for(var spell of this.spells){
      
      //no selected character: reset all settings from previous selected character
      if(this.characterData.selectedCharacter === undefined){
        spell.known = false;
        spell.prepared = false;
        spell.always = false;
        spell.ritualCast = false;
        spell.limited = false;
        spell.used = false;
      }
      //selected character: apply infos
      else{
        //in known list?
        spell.known = this.characterData.selectedCharacter.knownSpells.includes(spell.name) || this.characterData.selectedCharacter.knownCantrips.includes(spell.name);
        //in prepared list?
        spell.prepared = this.characterData.selectedCharacter.preparedSpells.includes(spell.name) || this.characterData.selectedCharacter.preparedCantrips.includes(spell.name);
        //in always list?
        spell.always = this.characterData.selectedCharacter.alwaysSpells.includes(spell.name);
        //in ritual list?
        spell.ritualCast = this.characterData.selectedCharacter.ritualSpells.includes(spell.name);
        //in limited list?
        spell.limited = this.characterData.selectedCharacter.limitedSpells.includes(spell.name);
        //in used list?
        spell.used = this.characterData.selectedCharacter.usedSpells.includes(spell.name);
      }
      
    }

    //trigger filtering
    this.onChange();
  }

  onChange() {

    this.expandedPanelIndex = -1;

    //build implicite filters
    var impliciteFilters: SpellFilter[] = new Array();
    var char = this.characterData.selectedCharacter;
    if(char != undefined){

      if(char.mode === ModeOption.Session){
        
        //check cantrips
        if(char.preparedCantripCasting){
          impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.preparedCantrips, this.spellProperties));
        }
        else{
          impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.knownCantrips, this.spellProperties));
        }

        //check spells
        if(char.preparedCasting){
          impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.preparedSpells, this.spellProperties));
        }
        else{
          impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.knownSpells, this.spellProperties));
        }

        //check rituals
        if(char.ritualCastingUnprepared){
          impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.knownRituals, this.spellProperties));
        }
        if(char.ritualCaster){
          impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.ritualCastingSpells, this.spellProperties));
        }

        //add always
        impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.always, this.spellProperties));

        //if dontShowUsed, add only limited, that are not used
        if(char.dontShowUsed){
          impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.limitedNotUsed, this.spellProperties));
        }
        //else add all limited spells (used will be disabled)
        else{
          impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.limitedNotUsed, this.spellProperties));
          impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.limitedUsed, this.spellProperties));
        }

      }

      if(char.mode === ModeOption.Prep){
        //only known spells can be/have to be prepared, except known spell that are also always known
        impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.knownNotAlways, this.spellProperties));
      }

      if(char.mode === ModeOption.Overview && !char.allSpellsInOverview){
        //only known, always, ritual caster and limited spells shown
        impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.known, this.spellProperties));
        impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.always, this.spellProperties));
        impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.limitedNotUsed, this.spellProperties));
        impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.limitedUsed, this.spellProperties));
        impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.ritualCastingSpells, this.spellProperties));
      }

      if(char.mode === ModeOption.AddRemove || (char.mode === ModeOption.Overview && char.allSpellsInOverview)){
        //no filter necessary
      }

    }

    //filter
    this.spellsFiltered = SpellService.filterSpells(this.spells, this.filterName, this.filters, impliciteFilters);

    //reduce to random spells if wished
    this.setNumberOfRandomFilteredSpells();

    this.spellsToShow = new Array();
    this.fetchMore();
    this.setSize();

  }

  onNameFilterCleared() {
    this.filterName = '';
    this.onChange();
  }

  onRandomNumberChanged(random: number) {
    this.numberOfRandomSpells = random;

    if(random === 0){
      this.stringOfRandomSpells = 'Random spells?';
    } else if(random === 1){
      this.stringOfRandomSpells = 'Only 1 spell';
    } else {
      this.stringOfRandomSpells = 'Only ' + random + ' spells';
    }

    this.onChange();
  }

  setNumberOfRandomFilteredSpells(){

    if(this.numberOfRandomSpells <= 0){
      return;
    }
    
    if(this.numberOfRandomSpells >= this.spellsFiltered.length){
      return;
    }

    var newFilteredSpells = new Array();
    var randomIndexes: number[] = new Array();

    for(var i = 1; i <= this.numberOfRandomSpells; i++){
      //get random number and check if random number is already used
      var randomIndexGenerated: boolean = false;
      while(!randomIndexGenerated){

        var randomIndex = Math.floor(Math.random() * this.spellsFiltered.length);

        if(!randomIndexes.includes(randomIndex)){
          randomIndexes.push(randomIndex);
          randomIndexGenerated = true;
        }
      }
    }
    randomIndexes.sort(ArrayUtilities.numberCompareAscending);

    //get the spells by the indexes
    for(var i = 0; i < randomIndexes.length; i++){
      newFilteredSpells.push(this.spellsFiltered[randomIndexes[i]]);
    }

    this.spellsFiltered = newFilteredSpells;

  }

  onAllFiltersRemoved(){

    var i = this.filters.length
    while (i--) {
      this.onFilterRemoved(this.filters[i]);
    }

  }

  onFilterRemoved(removedFilter: SpellFilter){

    removedFilter.selected = false;
    ArrayUtilities.removeFromArray(this.filters, removedFilter);
    this.filters.sort(SpellFilter.compare);
      
    var newSelectedFilters : SpellFilter[] = new Array();
    this.filters.forEach( filter => {
      if(filter.type === removedFilter.type){
        newSelectedFilters.push(filter);
      }
    })

    var newSelectedStrings : string[] = new Array();
    var containedFilter = this.filters.find(filter => filter.type === removedFilter.type);
    if(containedFilter === undefined){
      newSelectedStrings = [];
    }
    else if(containedFilter.value === true){
      newSelectedStrings = ['true'];
    }
    else if(containedFilter.value === false){
      newSelectedStrings = ['false'];
    }

    switch(removedFilter.type){
      case SpellFilterType.School: {
        this.selectedFiltersSchool = newSelectedFilters;
        break;
      }
      case SpellFilterType.Level: {
        this.selectedFiltersLevel = newSelectedFilters;
        break;
      }
      case SpellFilterType.Class: {
        var spellClass = removedFilter.value as SpellClass;
        if(!spellClass.subclass){
          this.selectedFiltersClass = newSelectedFilters;
          break;
        }
        else{
          this.selectedFiltersSubclass = newSelectedFilters;
          break;
        }  
      }
      case SpellFilterType.ClassSingle: {
        var spellClass = removedFilter.value as SpellClass;
        if(!spellClass.subclass){
          this.selectedFiltersSingleClass = newSelectedFilters;
          break;
        }
        // else{
        //   this.selectedFiltersSubclass = newSelectedFilters;
        //   break;
        // }
        break; 
      }
      case SpellFilterType.ClassMust: {
        var spellClass = removedFilter.value as SpellClass;
        if(!spellClass.subclass){
          this.selectedFiltersMustClass = newSelectedFilters;
          break;
        }
        break; 
      }
      case SpellFilterType.ClassNot: {
        var spellClass = removedFilter.value as SpellClass;
        if(!spellClass.subclass){
          this.selectedFiltersNotClass = newSelectedFilters;
          break;
        }
        break; 
      }
      case SpellFilterType.CastingTime: {
        this.selectedFiltersCastingTime = newSelectedFilters;
        break;
      }
      case SpellFilterType.Duration: {
        this.selectedFiltersDuration = newSelectedFilters;
        break;
      }
      case SpellFilterType.Range: {
        this.selectedFiltersRange = newSelectedFilters;
        break;
      }
      case SpellFilterType.DamageType: {
        this.selectedFiltersDamageType = newSelectedFilters;
        break;
      }
      case SpellFilterType.Condition: {
        this.selectedFiltersCondition = newSelectedFilters;
        break;
      }
      case SpellFilterType.Save: {
        this.selectedFiltersSave = newSelectedFilters;
        break;
      }
      case SpellFilterType.AttackType: {
        this.selectedFiltersAttackType = newSelectedFilters;
        break;
      }
      case SpellFilterType.AttackSave: {
        this.selectedFiltersAttackSave = newSelectedFilters;
        break;
      }
      case SpellFilterType.AffectedTargets: {
        this.selectedFiltersAffectedTargets = newSelectedFilters;
        break;
      }
      case SpellFilterType.Tag: {
        this.selectedFiltersTag = newSelectedFilters;
        break;
      }
      case SpellFilterType.TagSingle: {
        this.selectedFiltersSingleTag = newSelectedFilters;
        break;
      }
      case SpellFilterType.TagMust: {
        this.selectedFiltersMustTag = newSelectedFilters;
        break;
      }
      case SpellFilterType.TagNot: {
        this.selectedFiltersNotTag = newSelectedFilters;
        break;
      }
      case SpellFilterType.Preset: {
        this.selectedFiltersPreset = newSelectedFilters;
        break;
      }
      case SpellFilterType.Source: {
        this.selectedFiltersSource = newSelectedFilters;
        break;
      }
      case SpellFilterType.Concentration:{
        this.selectedFiltersConcentration = newSelectedStrings;
        break;
      }
      case SpellFilterType.Ritual:{
        this.selectedFiltersRitual = newSelectedStrings;
        break;
      }
      case SpellFilterType.TargetCaster:{
        this.selectedFiltersTargetCaster = newSelectedStrings;
        break;
      }
      case SpellFilterType.ComponentVerbal:{
        this.selectedFiltersComponentV = newSelectedStrings;
        break;
      }
      case SpellFilterType.ComponentSomatic:{
        this.selectedFiltersComponentS = newSelectedStrings;
        break;
      }
      case SpellFilterType.ComponentMaterial:{
        this.selectedFiltersComponentM = newSelectedStrings;
        break;
      }
      case SpellFilterType.MaterialValue:{
        this.selectedFiltersMaterialValue = newSelectedStrings;
        break;
      }
      case SpellFilterType.MaterialConsumed:{
        this.selectedFiltersMaterialConsumed = newSelectedStrings;
        break;
      }
      case SpellFilterType.Upcastable:{
        this.selectedFiltersUpcastable = newSelectedStrings;
        break;
      }
      case SpellFilterType.SpellMod:{
        this.selectedFiltersSpellMod = newSelectedStrings;
        break;
      }
    }
    
    this.onChange();

  }


  addFilterMulti(options: SpellFilter[], selectedFilters: SpellFilter[]) {

    options.forEach(optionFilter => {

      if(!selectedFilters.includes(optionFilter) && !this.filters.includes(optionFilter)){
        return;
      }

      if(selectedFilters.includes(optionFilter) && this.filters.includes(optionFilter)){
        return;
      }

      if(selectedFilters.includes(optionFilter) && !this.filters.includes(optionFilter)){
        optionFilter.selected = true;
        this.filters.push(optionFilter);
        this.filters.sort(SpellFilter.compare);
      }

      if(!selectedFilters.includes(optionFilter) && this.filters.includes(optionFilter)){
        optionFilter.selected = false;
        ArrayUtilities.removeFromArray(this.filters, optionFilter);
        this.filters.sort(SpellFilter.compare);
      }

    });

    this.onChange();
  }


  addFilterToggle(filterOptions: SpellFilter[], value: boolean){

    var selectedFilter = filterOptions.find(filter => filter.value === value);
    var oppositeFilter = filterOptions.find(filter => filter.value != value);

    if(selectedFilter === undefined || oppositeFilter === undefined){
      return;
    }

    //if selectedFilter is in filter list: remove it
    if(this.filters.includes(selectedFilter)){
      this.onFilterRemoved(selectedFilter);
    }
    //if selectedFilter is not in filter list
    else{

      //if no concentration filter is in filter list: add filter to list
      if(this.filters.includes(oppositeFilter) == false){
        this.filters.push(selectedFilter);
      this.filters.sort(SpellFilter.compare);
      }
      //if the other concentration filter is in filter list: remove the other filter, set the shownFilter to the selected and add selected filter
      else{
        this.filters.push(selectedFilter);
        this.onFilterRemoved(oppositeFilter);
      }

      this.onChange();
    }
    
  }


  // getRelevantFilterArray(type: SpellFilterType): SpellFilter[]{
  //   var relevantFilterArray: SpellFilter[] = new Array();
  //   switch(type){
  //     case SpellFilterType.School: {
  //       var relevantFilterArray = this.selectedFiltersSchool;
  //       break;
  //     }
  //     case SpellFilterType.Level: {
  //       var relevantFilterArray = this.selectedFiltersLevel;
  //       break;
  //     }
  //     case SpellFilterType.Source: {
  //       var relevantFilterArray = this.selectedFiltersSource;
  //       break;
  //     }
  //   }
  //   return relevantFilterArray;
  // }


  // addFilterSingle() {
    
  //   this.selectedFilter.selected = true;
  //   this.filters.push(this.selectedFilter);
  //   this.filters.sort(SpellFilter.compare);
    
  //   //remove filter
  //   this.onChange();
  //   this.selectedFilter = new SpellFilter(SpellFilterType.None, '');
  // }


  onSpellExpansionPanelOpened(index: number){

    this.expandedPanelIndex = index;

    // var element = document.getElementById("panel" + index);
    // element?.scrollIntoView({behavior: "smooth", block: "start"}); //{behavior: "smooth", block: "start"}
    
    // console.log('panel' + index);
    // this.viewPortScroller.scrollToAnchor('panel' + index);

  }

  onSpellExpansionPanelClosed(index: number){

    if(this.expandedPanelIndex == index){
      this.expandedPanelIndex = -1;
    }

  }

  getModeOptions(): ModeOption[]{
    
    var modeOptions: ModeOption[] = new Array();
    if(this.characterData.selectedCharacter === undefined){
      return modeOptions;
    }
    modeOptions.push(ModeOption.Overview);
    modeOptions.push(ModeOption.AddRemove);
    if(this.characterData.selectedCharacter.preparedCasting || this.characterData.selectedCharacter.preparedCantripCasting){
      modeOptions.push(ModeOption.Prep);
    }
    modeOptions.push(ModeOption.Session);

    return modeOptions;
  }

  onModeChanged(mode: ModeOption){

    if(this.characterData.selectedCharacter === undefined || this.characterData.selectedCharacter.mode === mode){
      return;
    }
    this.characterData.selectedCharacter.mode = mode;
    this.characterData.selectedCharacter.save();

    this.sortMasterSpells();
    this.onChange();

  }


  getEmptyListText(): string{

    if(this.filterName.length === 0 && this.filters.length === 0){
      
      if(this.spells.length === 0){
        return '- Empty spell database. Contact administrator. -'
      }
  
      var char = this.characterData.selectedCharacter;
      if(char != undefined){
        
        if(char.mode === ModeOption.Overview){
          return '- No known spells. -'
        }
        if(char.mode === ModeOption.Prep){
          return '- No known spells to prepare. -'
        }
        if(char.mode === ModeOption.Session){
          return '- No spells known or prepared. -'
        }
      }

    }   

    return '- No matching spells found. Check the filter settings. -'
    
  }

  showSpellListSnackBar(spellName: string, action: string, current: number, max: number){
    
    var text: string = '\'' + spellName + '\'' + ' ' + action;

    if(max > 0){
      text = text + ' (' + current + '/' + max + ')';
    }

    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 1500,
      data: {text: text}
    });
  }


  disableIconKnownLists(): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return true;
    }
    if(char.mode === ModeOption.AddRemove){
      return false;
    }
    return true;
  }

  showIconKnown(spell: Spell): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return false;
    }
    if(char.mode === ModeOption.Overview && spell.known){
      return true;
    }
    if(char.mode === ModeOption.AddRemove){
      return true;
    }
    return false;
  } 
  showIconAlways(spell: Spell): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return false;
    }
    if(char.mode === ModeOption.Overview && spell.always){
      return true;
    }
    if(char.mode === ModeOption.AddRemove){
      return true;
    }
    return false;
  }
  showIconLimited(spell: Spell): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return false;
    }
    if(char.mode === ModeOption.Overview && spell.limited){
      return true;
    }
    if(char.mode === ModeOption.AddRemove){
      return true;
    }
    return false;
  }
  showIconRitual(spell: Spell): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return false;
    }
    if(char.mode === ModeOption.Overview && spell.ritualCast && spell.ritual){
      return true;
    }
    if(char.mode === ModeOption.AddRemove && char.ritualCaster && spell.ritual){
      return true;
    }
    return false;
  }
  showIconUsed(spell: Spell): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return false;
    }
    if(char.mode === ModeOption.Session && spell.limited){
      return true;
    }
    return false;
  }

  disableIconPrepared(): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return true;
    }
    if(char.mode === ModeOption.Prep){
      return false;
    }
    return true;
  }
  showIconPrepared(spell: Spell): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return false;
    }
    if(char.mode === ModeOption.Overview && spell.prepared){
      return true;
    }
    if(char.mode === ModeOption.Prep){
      return true;
    }
    return false;
  }


  showTotalKnown(): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return false;
    }
    if((char.knownSpells.length > 0 || char.knownCantrips.length > 0)
    || (char.knownCasting && char.maxKnown > 0)
    || (char.knownCantripCasting && char.maxCantripsKnown > 0)
    || (!char.knownCasting && !char.knownCantripCasting)){
      return true;
    }
    return false;
  }
  knownCantripsHaveError(): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return false;
    }
    if(char.knownCantripCasting && char.knownCantrips.length > char.maxCantripsKnown){
      return true;
    }
    return false;
  }
  knownSpellsHaveError(): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return false;
    }
    if(char.knownCasting && char.knownSpells.length > char.maxKnown){
      return true;
    }
    return false;
  }
  knownHasError(): boolean{
    return this.knownCantripsHaveError() || this.knownSpellsHaveError();
  }

  showTotalPrepared(): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return false;
    }
    if((char.preparedCasting && char.preparedSpells.length > 0) 
    || (char.preparedCantripCasting && char.preparedCantrips.length > 0)){
      return true;
    }
    return false;
  }
  preparedCantripsHaveError(): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return false;
    }
    if(char.preparedCantripCasting && char.preparedCantrips.length > char.maxCantripsPrepared){
      return true;
    }
    return false;
  }
  preparedSpellsHaveError(): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return false;
    }
    if(char.preparedCasting && char.preparedSpells.length > char.maxPrepared){
      return true;
    }
    return false;
  }
  preparedHasError(): boolean{
    return this.preparedCantripsHaveError() || this.preparedSpellsHaveError();
  }

  onPreparation(spell: Spell){

    if(this.characterData.selectedCharacter == undefined){
      return;
    }
    spell.prepared = !spell.prepared;
    if(spell.prepared){
      if(spell.level === 0){
        this.characterData.selectedCharacter.preparedCantrips.push(spell.name);
        this.showSpellListSnackBar(spell.name, 'prepared', this.getPreparationCount(true, false), this.getPreparationCount(true, true));
      }
      else{
        this.characterData.selectedCharacter.preparedSpells.push(spell.name);
        this.showSpellListSnackBar(spell.name, 'prepared', this.getPreparationCount(false, false), this.getPreparationCount(false, true));
      }
    }
    else{
      if(spell.level === 0){
        ArrayUtilities.removeFromArray(this.characterData.selectedCharacter.preparedCantrips, spell.name);
        this.showSpellListSnackBar(spell.name, 'unprepared', this.getPreparationCount(true, false), this.getPreparationCount(true, true));
      }
      else{
        ArrayUtilities.removeFromArray(this.characterData.selectedCharacter.preparedSpells, spell.name);
        this.showSpellListSnackBar(spell.name, 'unprepared', this.getPreparationCount(false, false), this.getPreparationCount(false, true));
      }      
    }
    this.characterData.selectedCharacter.save();

    //if prepared on top, trigger sorting
    if(this.characterData.selectedCharacter.preparedOnTop){
      this.sortMasterSpells();
      this.onChange();
    }
  }

  getPreparationCount(cantrip: boolean, max: boolean): number{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return -1;
    }
    if(cantrip){
      if(max){
        return char.maxCantripsPrepared;
      }
      else{
        return char.preparedCantrips.length;
      }
    }
    else{
      if(max){
        return char.maxPrepared;
      }
      else{
        return char.preparedSpells.length;
      }
    }
  }

  onKnown(spell: Spell){
    
    if(this.characterData.selectedCharacter == undefined){
      return;
    }
    spell.known = !spell.known;
    if(spell.known){
      if(spell.level === 0){
        this.characterData.selectedCharacter.knownCantrips.push(spell.name);
        this.showSpellListSnackBar(spell.name, 'known', this.getKnownCount(true, false), this.getKnownCount(true, true));
      }
      else{
        this.characterData.selectedCharacter.knownSpells.push(spell.name);
        this.showSpellListSnackBar(spell.name, 'known', this.getKnownCount(false, false), this.getKnownCount(false, true));
      }
    }
    else{
      if(spell.level === 0){
        ArrayUtilities.removeFromArray(this.characterData.selectedCharacter.knownCantrips, spell.name);
        this.showSpellListSnackBar(spell.name, 'unknown', this.getKnownCount(true, false), this.getKnownCount(true, true));
      }
      else{
        ArrayUtilities.removeFromArray(this.characterData.selectedCharacter.knownSpells, spell.name);
        this.showSpellListSnackBar(spell.name, 'unknown', this.getKnownCount(false, false), this.getKnownCount(false, true));
      }    
    }
    this.characterData.selectedCharacter.save();

    if(this.characterData.selectedCharacter.knownOnTop){
      this.sortMasterSpells();
      this.onChange();
    }

  }

  getKnownCount(cantrip: boolean, max: boolean): number{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return -1;
    }
    if(cantrip){
      if(max){
        return char.maxCantripsKnown;
      }
      else{
        return char.knownCantrips.length;
      }
    }
    else{
      if(max){
        return char.maxKnown;
      }
      else{
        return char.knownSpells.length;
      }
    }
  }

  onAlways(spell: Spell){
    
    if(this.characterData.selectedCharacter == undefined){
      return;
    }
    spell.always = !spell.always;
    if(spell.always){
      this.characterData.selectedCharacter.alwaysSpells.push(spell.name);
      this.showSpellListSnackBar(spell.name, 'always known/prepared', 0, 0);
    }
    else{
      ArrayUtilities.removeFromArray(this.characterData.selectedCharacter.alwaysSpells, spell.name);
      this.showSpellListSnackBar(spell.name, 'removed from always known/prepared', 0, 0);
    }
    this.characterData.selectedCharacter.save();

    if(this.characterData.selectedCharacter.knownOnTop){
      this.sortMasterSpells();
      this.onChange();
    }

  }

  onLimited(spell: Spell){
    
    if(this.characterData.selectedCharacter == undefined){
      return;
    }
    spell.limited = !spell.limited;
    if(spell.limited){
      this.characterData.selectedCharacter.limitedSpells.push(spell.name);
      this.showSpellListSnackBar(spell.name, 'limited available', 0, 0);
    }
    else{
      ArrayUtilities.removeFromArray(this.characterData.selectedCharacter.limitedSpells, spell.name);
      this.showSpellListSnackBar(spell.name, 'not anymore limited available', 0, 0);
    }
    this.characterData.selectedCharacter.save();

    if(this.characterData.selectedCharacter.knownOnTop){
      this.sortMasterSpells();
      this.onChange();
    }

  }

  onRitual(spell: Spell){
    
    var char = this.characterData.selectedCharacter;
    if(char === undefined || !char.ritualCaster){
      return;
    }
    spell.ritualCast = !spell.ritualCast;
    if(spell.ritualCast){
      char.ritualSpells.push(spell.name);
      this.showSpellListSnackBar(spell.name, 'for ritual cast available', 0, 0);
    }
    else{
      ArrayUtilities.removeFromArray(char.ritualSpells, spell.name);
      this.showSpellListSnackBar(spell.name, 'no longer for ritual cast available', 0, 0);
    }
    char.save();

    if(char.knownOnTop){
      this.sortMasterSpells();
      this.onChange();
    }

  }

  onUsed(spell: Spell){
    
    if(this.characterData.selectedCharacter == undefined){
      return;
    }
    if(this.characterData.selectedCharacter.mode === ModeOption.Session && !spell.used){
      this.expandedPanelIndex = -1;
    }
    spell.used = !spell.used;
    if(spell.used){
      this.characterData.selectedCharacter.usedSpells.push(spell.name);
      this.showSpellListSnackBar(spell.name, 'used till next reset', 0, 0);
    }
    else{
      ArrayUtilities.removeFromArray(this.characterData.selectedCharacter.usedSpells, spell.name);
      this.showSpellListSnackBar(spell.name, 'no longer used', 0, 0);
    }
    this.characterData.selectedCharacter.save();

    if(this.characterData.selectedCharacter.dontShowUsed && this.characterData.selectedCharacter.mode === ModeOption.Session){
      this.onChange();
    }

  }


  onTranslation(spell: Spell){

    if(spell.translated){
      spell.translated = false;
      spell.descriptionDisplay = spell.description;
    }
    else{
      if(spell.translatable){
        spell.translated = true;
        spell.descriptionDisplay = spell.translation;
      }      
    }

  }

  onAdventureMode(){
    if(this.characterData.selectedCharacter === undefined){
      return;
    }
    this.characterData.selectedCharacter.save();
    this.onChange();
  }

  onAddAll(){
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return;
    }

    //ToDo: SnackBar mit Sicherheitsabfrage

    for(var spell of this.spellsFiltered){
      var spellAlreadyKnown: boolean = spell.known;
      spell.known = true;
      if(!spellAlreadyKnown){
        if(spell.level === 0){
          char.knownCantrips.push(spell.name);
        }
        else{
          char.knownSpells.push(spell.name);
        }
      }
    }
    char.save();

    if(char.knownOnTop){
      this.sortMasterSpells();
      this.onChange();
    }
  }

  onRemoveAll(){
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return;
    }

    //ToDo: SnackBar mit Sicherheitsabfrage

    for(var spell of this.spellsFiltered){
      var spellKnown: boolean = spell.known;
      spell.known = false;
      if(spellKnown){
        if(spell.level === 0){
          ArrayUtilities.removeFromArray(char.knownCantrips, spell.name);
        }
        else{
          ArrayUtilities.removeFromArray(char.knownSpells, spell.name);
        }
      }
    }
    char.save();

    if(char.knownOnTop){
      this.sortMasterSpells();
      this.onChange();
    }
  }

  onRefreshUsed(){
    if(this.characterData.selectedCharacter === undefined){
      return;
    }
    this.characterData.selectedCharacter.usedSpells = new Array();
    this.characterData.selectedCharacter.save();
    this.applyCharacterMode();
  }

  onlyCastAsRitual(spell: Spell): boolean{
    
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return false;
    }

    if(char.mode === ModeOption.Session){
      if(spell.ritualCast && !spell.prepared && !(!char.preparedCasting && spell.known)){
        return true;
      }
      if(spell.ritual && spell.known && !spell.prepared && char.ritualCastingUnprepared){
        return true;
      }
    }

    return false;
  }

  highlightSpell(spell: Spell):string{

    var char = this.characterData.selectedCharacter;
    if(char != undefined){

      //highlight known spells
      if(char.mode === ModeOption.AddRemove || (char.mode === ModeOption.Overview && char.allSpellsInOverview)){
        if(spell.known || spell.limited || spell.ritualCast || spell.always){
          return this.highlightColor;
        }
      }

      //highlight prepared spells
      if(char.mode === ModeOption.Prep && spell.prepared){
        return this.highlightColor;
      }

      //highlight only ritual cast in session
      if(char.mode === ModeOption.Session && this.onlyCastAsRitual(spell)){
        return '#FFFAF0'; //floral white
      }

    }

    return 'white';
  }

  onHighlightFilter(){

    //change global variable
    this.highlightFilter = !this.highlightFilter;

    // for(var spell of this.spells){

    //   if(this.translateAll && spell.translatable && !spell.translated){
    //     spell.translated = true;
    //     spell.descriptionDisplay = spell.translation;
    //   }

    //   if(!this.translateAll && spell.translated){
    //     spell.translated = false;
    //     spell.descriptionDisplay = spell.description;
    //   }

    // }    

  }

  spellAssetNotLoaded(index: number, assetPath: string){

    console.log(assetPath + " not found")

    this.assetNotLoadedIndex = index;

  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    
    //In chrome and some browser scroll is given to body tag
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;

    var percentReached = pos / max;

    // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
    if((pos > max - 300) && (percentReached > 0.8)) {
      this.fetchMore();
    }

    this.setSize();
  }

  @HostListener('window:resize', ['$event']) onResize(event: any) {

    this.setSize();
  }

  setSize(){  
        
    this.screenWidth = window.innerWidth;
    this.screenSm = this.screenWidth >= 600 ? true : false;
    this.screenMd = this.screenWidth >= 730 ? true : false;
    this.screenLg = this.screenWidth >= 900 ? true : false;
    this.screenXl = this.screenWidth >= 1280 ? true : false;

    this.showColumnTags = this.screenWidth > 515;
    this.showColumnLevel = this.screenWidth > 600;
    this.showColumnCastingTime = this.screenWidth > 730;
    this.showColumnRange = this.screenWidth > 910;
    this.showColumnFlex = this.screenWidth > 1060;

    // if(this.expansionAccordion === undefined){
    //   this.showColumnTags = false;
    //   this.showColumnLevel = false;
    //   this.showColumnCastingTime = false;
    //   this.showColumnRange = false;
    // }
    // else {
    //   var width = this.expansionAccordion.nativeElement.offsetWidth;
    //   this.showColumnTags = this.screenWidth > 455;
    //   this.showColumnLevel = width > 540;
    //   this.showColumnCastingTime = width;
    //   this.showColumnRange = width > 850;
    //   this.showColumnFlex = width > 1000;
    // }

    this.loading = false;
  }

  private delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  file:any;
  fileChanged(e: any) {
    if(e != null){
      this.file = e.target.files[0];
    }
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
    }
    console.log(fileReader.readAsText(this.file));
  }

  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }

  loadSettingsFromCookies(){

    this.settings.showRandomControls = this.cookieService.get('RandomControls') === 'true' ? true : false;
    this.settings.sortByName = this.cookieService.get('SortByName') === 'true' ? true : false;
    this.settings.translateAll = this.cookieService.get('TranslateAll') === 'true' ? true : false;
    this.settings.characterMode = this.cookieService.get('CharacterMode') === 'true' ? true : false;

  }

  saveSettings(): void{ 

    this.cookieService.set('RandomControls', String(this.settings.showRandomControls), 365);
    this.cookieService.set('SortByName', String(this.settings.sortByName), 365);
    this.cookieService.set('TranslateAll', String(this.settings.translateAll), 365); 
    this.cookieService.set('CharacterMode', String(this.settings.characterMode), 365); 

  }

  openSettingsDialog(): void {
    
    if(this.filterName === 'char'){
      this.characterManagementActivated = !this.characterManagementActivated;
    }

    const dialogRef = this.dialog.open(SpellListSettingsDialog, {
      //width: '250px',
      //height: '300px',
      //disableClose: true,
      data: this.settings,
    });

    dialogRef.componentInstance.onTranslate.subscribe(() => {
      this.translateAllMasterSpells();
    });

    dialogRef.componentInstance.onSort.subscribe(() => {
      this.sortMasterSpells();
      this.onChange();  
    });

    dialogRef.componentInstance.onRandom.subscribe(() => {
      this.onRandomNumberChanged(0);
    });

    dialogRef.componentInstance.onCharacter.subscribe(() => {
      this.applyCharacterMode();
    });

    dialogRef.beforeClosed().subscribe(() => {
      this.saveSettings();
    });
  }

  openCharacterDialog(): void {

    const dialogRef = this.dialog.open(SpellListCharacterDialog, {
      //width: '250px',
      //height: '300px',
      //disableClose: true,
      data: this.characterData,
    });

    dialogRef.componentInstance.onCharacterChanged.subscribe(() => {
      
      //save selected char to cookies
      if(this.characterData.selectedCharacter === undefined){
        this.cookieService.set('SelectedCharacter', '', -1);
      }
      else{
        this.cookieService.set('SelectedCharacter', String(this.characterData.selectedCharacter.id), 365);
      }
      
      //trigger
      this.applySelectedCharacterData();

    });

    dialogRef.componentInstance.onSortChanged.subscribe(() => {
      this.sortMasterSpells();
      this.onChange();  
    });
  }

}

@Component({
  selector: 'spell-list-settings-dialog',
  templateUrl: 'spell-list-settings-dialog.html',
  styleUrls: ['./spell-list.component.scss']
})
export class SpellListSettingsDialog {
  
  onRandom = new EventEmitter();
  onTranslate = new EventEmitter();
  onSort = new EventEmitter();
  onCharacter = new EventEmitter();
  
  constructor(
    public dialogRef: MatDialogRef<SpellListSettingsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: SettingsData,
  ) {}

  onRandomClick() {
    this.onRandom.emit();
  }

  onTranslateClick() {
    this.onTranslate.emit();
  }

  onSortClick() {
    this.onSort.emit();
  }

  onCharacterClick() {
    this.onCharacter.emit();
  }

}

@Component({
  selector: 'spell-list-character-dialog',
  templateUrl: 'spell-list-character-dialog.html',
  styleUrls: ['./spell-list.component.scss']
})
export class SpellListCharacterDialog {
  
  addMode: boolean = false;
  selectedPreset: Preset | undefined;
  newName: string | undefined;
  nameChangeMode: boolean = false;
  changedName: string = "";
  onCharacterChanged = new EventEmitter();
  onSortChanged = new EventEmitter();
  disabled: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SpellListCharacterDialog>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: CharacterData,
  ) {}

  onCharacterCreated() {

    if(this.newName != undefined && this.newName != '' && this.data.cookieService != undefined){
      
      //create char
      var newChar = new Character(undefined, this.newName, this.data.characterList, this.data.cookieService);

      //add preset
      if(this.selectedPreset != undefined){
        newChar.applyPreset(this.selectedPreset, this.data.masterSpellList);
      }

      //save
      newChar.save();

      //select
      this.data.selectedCharacter = newChar;
      this.changedName = this.data.selectedCharacter.name;

      //reset options
      this.newName = undefined;
      this.selectedPreset = undefined;
      this.addMode = false;

      //trigger
      this.onCharacterChange();
    }

  }

  onCharacterDelete() {
    
    if(this.data.selectedCharacter === undefined){
      return;
    }

    //stop the user from clicking outside the dialog and disable clicks inside the dialog (until snackbar is interacted with)
    this.dialogRef.disableClose = true;
    this.disabled = true;

    var snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      duration: -1,
      data: {
        text: 'Delete permanently?',
        action: true,
        actionText: 'Yes',
        dismiss: true,
        dismissText: 'No',
      }
    });

    snackBarRef.instance.onAction.subscribe(() => {
      
      if(this.data.selectedCharacter === undefined){
        return;
      }

      this.data.selectedCharacter.delete();
      this.data.selectedCharacter = undefined;

      //trigger
      this.onCharacterChange();

      //close snackbar
      snackBarRef.dismiss();

      //re-enable dialog
      this.dialogRef.disableClose = false;
      this.disabled = false;
    });

    snackBarRef.instance.onDismiss.subscribe(() => {
      //close snackbar
      snackBarRef.dismiss();
      //re-enable dialog
      this.dialogRef.disableClose = false;
      this.disabled = false;
    });

  }

  onDetailChange() {
    //save character
    this.data.selectedCharacter?.save();
  }

  onSortChange(){
    //save character
    this.data.selectedCharacter?.save();
    //send event
    this.onSortChanged.emit();
  }

  onCharacterChange() {

    //save character
    this.data.selectedCharacter?.save();

    //To-Do: do stuff like clearing known/prepared spells etc. -> really necessary?

    this.onCharacterChanged.emit();
  }

  onNameChangeCalled() {

    if(this.data.selectedCharacter === undefined){
      return;
    }
    this.nameChangeMode = true;
    this.changedName = this.data.selectedCharacter.name;

  }

  onNameChangeCanceled() {

    this.nameChangeMode = false;
    this.changedName = '';

  }

  onNameChangeDone() {

    if(this.data.selectedCharacter === undefined || this.changedName === ''){
      return;
    }

    this.data.selectedCharacter.name = this.changedName;
    this.data.selectedCharacter.save();
    this.onNameChangeCanceled();

  }

}