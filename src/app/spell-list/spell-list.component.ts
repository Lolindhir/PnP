import { Component, Inject, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { Spell, SpellListCategory } from '@models/spell.model';
import { PrintSettings } from '@models/spell-print.model';
import { SpellService } from '@services/spell.service';
import { SpellClass } from '@models/spell-class.model';
import { SpellFilter, SpellFilterStorage, SpellFilterType } from '@models/spell-filter.model';
import { ArrayUtilities } from '@utilities/array.utilities';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { ViewportScroller } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Character, CharacterData, ModeOption } from '@shared/models/character.model';
import { Preset } from '@shared/models/preset.model';
import { SpellProperties } from '@shared/models/spell-properties.model';
import { SnackBarComponent } from '@components/snack-bar/snack-bar.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from "@angular/platform-browser";
import { StorageService } from '@shared/services/storage.service';
import { FileSaverService } from 'ngx-filesaver';
import { Clipboard } from '@angular/cdk/clipboard';
import { ColorPreset } from '@shared/models/color-preset.model';

import * as imagePaths from '@shared/imagePaths';
import * as globals from '@shared/globals';
import { PreparedSpellBlueprint, PreparedSpellsBlueprint } from '@shared/models/prepared-spells-blueprint.model';


export interface SettingsData {
  showRandomControls: boolean;
  translateAll: boolean;
  useGrittyRealism: boolean;
  sortByName: boolean;
  characterMode: boolean;
  onlyValueMaterials: boolean;
  showDuration: boolean;
  dmMode: boolean;
  showPrint: boolean;
}


@Component({
  selector: 'app-spell-list',
  templateUrl: './spell-list.component.html',
  styleUrls: ['../app.component.scss', './spell-list.component.scss']
})
export class SpellListComponent implements OnInit, AfterViewInit {

  //settings
  settings: SettingsData = {
    showRandomControls: false,
    sortByName: false,
    translateAll: false,
    useGrittyRealism: false,
    characterMode: false,
    onlyValueMaterials: false,
    showDuration: false,
    dmMode: false,
    showPrint: true
  };
  characterData: CharacterData = {
    characterList: new Array(),
    selectedCharacter: undefined,
    presets: new Array(),
    masterSpellList: new Array(),
  };

  //spell related stuff
  spellProperties: SpellProperties = this.spellService.spellProperties;
  spells: Spell[] = this.spellService.allSpells;
  spellsFiltered: Spell[] = new Array();
  spellsToShow: Spell[] = new Array();
  numberOfRandomSpells: number = 0;
  stringOfRandomSpells: string = 'Random spells';
  private spellReloadAmount: number = 30;

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
  selectedFiltersNumberOfTargets: SpellFilter[] = new Array();
  selectedFiltersTheme: SpellFilter[] = new Array();
  selectedFiltersTag: SpellFilter[] = new Array();
  selectedFiltersSingleTag: SpellFilter[] = new Array();
  selectedFiltersMustTag: SpellFilter[] = new Array();
  selectedFiltersNotTag: SpellFilter[] = new Array();
  selectedFiltersPreset: SpellFilter[] = new Array();
  selectedFiltersSource: SpellFilter[] = new Array();
  // selectedFiltersSourceGroups: SelectionModel<SpellFilter>;
  selectedFiltersConcentration: string[] = new Array();
  selectedFiltersRitual: string[] = new Array();
  selectedFiltersTargetCaster: string[] = new Array();
  selectedFiltersComponentV: string[] = new Array();
  selectedFiltersComponentS: string[] = new Array();
  selectedFiltersComponentM: string[] = new Array();
  selectedFiltersMaterialValue: string[] = new Array();
  selectedFiltersMaterialConsumed: string[] = new Array();
  selectedFiltersUpcastable: string[] = new Array();
  selectedFiltersCategoryKnown: string[] = new Array();
  selectedFiltersCategoryAlways: string[] = new Array();
  selectedFiltersCategoryLimited: string[] = new Array();
  selectedFiltersCategoryRitualCast: string[] = new Array();
  selectedFiltersCategoryPrepared: string[] = new Array();
  selectedFiltersSpellMod: string[] = new Array();

  //all filter options
  optionsLevel: SpellFilter[] = this.spellService.getLevelFilterOptions();
  optionsSchool = this.spellService.getSchoolFilterOptions();
  optionsClass = this.spellService.getClassFilterOptions();
  optionsSingleClass = this.spellService.getSingleClassFilterOptions();
  optionsMustClass = this.spellService.getMustClassFilterOptions();
  optionsNotClass = this.spellService.getNotClassFilterOptions();
  optionsSubclass = this.spellService.getSubclassFilterOptions();
  optionsSource = this.spellService.getSourceFilterOptions(this.spells);
  optionsSourceGroups = this.spellService.getSourceGroupFilterOptions(this.optionsSource);
  optionsCastingTime = this.spellService.getCastingTimeFilterOptions();
  optionsDuration = this.spellService.getDurationFilterOptions();
  optionsRange = this.spellService.getRangeFilterOptions();
  optionsDamageType = this.spellService.getDamageTypeFilterOptions();
  optionsCondition = this.spellService.getConditionFilterOptions();
  optionsSave = this.spellService.getSaveFilterOptions();
  optionsAttackType = this.spellService.getAttackTypeFilterOptions();
  optionsAttackSave = this.spellService.getAttackSaveFilterOptions();
  optionsAffectedTargets = this.spellService.getAffectedTargetsFilterOptions();
  optionsNumberOfTargets = this.spellService.getNumberOfTargetsFilterOptions();
  optionsTheme = this.spellService.getThemeFilterOptions();
  optionsTag = this.spellService.getTagFilterOptions();
  optionsSingleTag = this.spellService.getSingleTagFilterOptions();
  optionsMustTag = this.spellService.getMustTagFilterOptions();
  optionsNotTag = this.spellService.getNotTagFilterOptions();
  optionsPreset = this.spellService.getPresetFilterOptions(this.settings.dmMode);
  optionsConcentration = this.spellService.getConcentrationFilterOptions();
  optionsRitual = this.spellService.getRitualFilterOptions();
  optionsTargetCaster = this.spellService.getTargetCasterFilterOptions();
  optionsComponentV = this.spellService.getComponentVerbalFilterOptions();
  optionsComponentS = this.spellService.getComponentSomaticFilterOptions();
  optionsComponentM = this.spellService.getComponentMaterialFilterOptions();
  optionsMaterialValue = this.spellService.getMaterialValueFilterOptions();
  optionsMaterialConsumed = this.spellService.getMaterialConsumedFilterOptions();
  optionsUpcastable = this.spellService.getUpcastableFilterOptions();
  optionsSpellMod = this.spellService.getSpellModFilterOptions();
  optionsCategoryKnown = this.spellService.getCategoryKnownFilterOptions();
  optionsCategoryAlways = this.spellService.getCategoryAlwaysFilterOptions();
  optionsCategoryLimited = this.spellService.getCategoryLimitedFilterOptions();
  optionsCategoryRitualCast = this.spellService.getCategoryRitualCastFilterOptions();
  optionsCategoryPrepared = this.spellService.getCategoryPreparedFilterOptions();
  optionsCategoryRemoved = this.spellService.getCategoryRemovedFilterOptions();

  //other global stuff
  images = imagePaths;
  disabled: boolean = false;
  highlightColor: string = '#E0FFFF'; //'lightgrey';
  highlightFilter: boolean = false;
  loading: boolean = true;
  ModeOption = ModeOption;
  SpellFilterType = SpellFilterType;
  expandedPanelIndex: number = -1;
  assetNotLoadedIndex: number = -1;
  showAdvancedFilters: boolean = false;
  showTags: boolean = true;
  removedInsteadOfKnown: boolean = false;
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


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private storageService: StorageService,
    private spellService: SpellService,
    private clipboard: Clipboard,
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

    //fill filtered spells with all spells, because nothing is yet filtered
    this.spellsFiltered = this.spells;   

    //load filters
    this.loadFilters();

    //load settings
    this.loadSettings();    

    //get screen width
    this.screenWidth = window.innerWidth;
    this.setSize();

    //sort spells
    this.sortMasterSpells();

    //translate spells
    this.translateAllMasterSpells();

    //set correct duration
    this.setDurationAllMasterSpells();

    //load character list
    this.characterData.characterList = Character.loadCharacters(storageService);
    //set selected character depending on character mode
    this.applyCharacterMode();
    //add presets to character data
    var presets: Preset[] = new Array();
    for(var presetFilter of this.optionsPreset){
      presets.push(presetFilter.value);
    }
    this.characterData.presets = presets;
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

  setDurationAllMasterSpells(){
    for(var spell of this.spells){
      spell.duration = this.settings.useGrittyRealism ? spell.durationGrittyRealism : spell.durationStandard;
    } 
  }

  greyOutUsed(spell: Spell): boolean{

    var char: Character | undefined = this.characterData.selectedCharacter;
    if(char === undefined){ 
      return false;
    }

    if(char.mode === ModeOption.Session && spell.used && !this.onlyCastAsRitual(spell)){
      return true;
    }

    return false;
  } 

  greyOutRemoved(spell: Spell): boolean{

    var char: Character | undefined = this.characterData.selectedCharacter;
    if(char === undefined){ 
      return false;
    }

    if(char.mode === ModeOption.Overview && spell.removed){
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

      var selectedId: number = Number(this.storageService.loadLocal('SelectedCharacter'));
      for(var char of this.characterData.characterList){
        if(char.id === selectedId){
          this.characterData.selectedCharacter = char;
          break;
        }
      }

    }
    else{
      this.characterData.selectedCharacter = undefined;
      //this.storageService.deleteLocal('SelectedCharacter');
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
        spell.removed = false;
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
        //in removed list?
        spell.removed = this.characterData.selectedCharacter.removedSpells.includes(spell.name);
      }
      
    }

    //trigger filtering
    this.onChange();
  }

  onChange() {


    //save filters
    this.saveFilters();

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
        if(char.preparedCantripCasting){
          impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.knownCantripsNotAlways, this.spellProperties));
        }
        if(char.preparedCasting){
          impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.knownSpellsNotAlways, this.spellProperties));
        }
      }

      if(char.mode === ModeOption.Overview && !char.allSpellsInOverview){
        //only known, always, ritual caster and limited spells shown
        impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.known, this.spellProperties));
        impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.always, this.spellProperties));
        impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.limitedNotUsed, this.spellProperties));
        impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.limitedUsed, this.spellProperties));
        impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.ritualCastingSpells, this.spellProperties));
      }

      if((char.mode === ModeOption.Overview && char.allSpellsInOverview)
          ||(char.mode === ModeOption.AddRemove && !char.showRemoved)){
        //show all but removed
        impliciteFilters.push(new SpellFilter(SpellFilterType.SpellListCategory, SpellListCategory.allButRemoved, this.spellProperties));
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

  onDmModeChange(){
    this.saveSettings();
    this.optionsPreset = this.spellService.getPresetFilterOptions(this.settings.dmMode);
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
      case SpellFilterType.NumberOfTargets: {
        this.selectedFiltersNumberOfTargets = newSelectedFilters;
        break;
      }
      case SpellFilterType.Theme: {
        this.selectedFiltersTheme = newSelectedFilters;
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
      case SpellFilterType.CategoryKnown:{
        this.selectedFiltersCategoryKnown = newSelectedStrings;
        break;
      }
      case SpellFilterType.CategoryAlways:{
        this.selectedFiltersCategoryAlways = newSelectedStrings;
        break;
      }
      case SpellFilterType.CategoryLimited:{
        this.selectedFiltersCategoryLimited = newSelectedStrings;
        break;
      }
      case SpellFilterType.CategoryRitualCast:{
        this.selectedFiltersCategoryRitualCast = newSelectedStrings;
        break;
      }
      case SpellFilterType.CategoryPrepared:{
        this.selectedFiltersCategoryPrepared = newSelectedStrings;
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

  saveFilters(): void{ 

    this.storageService.storeLocal('NameFilter', String(this.filterName));

    var filterStorage: SpellFilterStorage[] = new Array();
    for(var filter of this.filters){
      filterStorage.push({type: filter.type, displayTextList: filter.displayTextList});
    }
    this.storageService.storeLocal('Filters', JSON.stringify(filterStorage, null, 2));

  }

  loadFilters(){

    //get name filter first
    this.filterName = this.storageService.loadLocal('NameFilter');


    //array to bundle all multi filter options for loading
    var allMultiOptions: {filters: SpellFilter[], selected: SpellFilter[]}[] = new Array();
    //fill multi filter options bundle
    allMultiOptions.push({ filters: this.optionsLevel, selected: this.selectedFiltersLevel });
    allMultiOptions.push({ filters: this.optionsSchool, selected: this.selectedFiltersSchool });
    allMultiOptions.push({ filters: this.optionsClass, selected: this.selectedFiltersClass });
    allMultiOptions.push({ filters: this.optionsSingleClass, selected: this.selectedFiltersSingleClass });
    allMultiOptions.push({ filters: this.optionsMustClass, selected: this.selectedFiltersMustClass });
    allMultiOptions.push({ filters: this.optionsNotClass, selected: this.selectedFiltersNotClass });
    allMultiOptions.push({ filters: this.optionsSubclass, selected: this.selectedFiltersSubclass });
    allMultiOptions.push({ filters: this.optionsSource, selected: this.selectedFiltersSource });
    allMultiOptions.push({ filters: this.optionsCastingTime, selected: this.selectedFiltersCastingTime });
    allMultiOptions.push({ filters: this.optionsDuration, selected: this.selectedFiltersDuration });
    allMultiOptions.push({ filters: this.optionsRange, selected: this.selectedFiltersRange });
    allMultiOptions.push({ filters: this.optionsDamageType, selected: this.selectedFiltersDamageType });
    allMultiOptions.push({ filters: this.optionsCondition, selected: this.selectedFiltersCondition });
    allMultiOptions.push({ filters: this.optionsSave, selected: this.selectedFiltersSave });
    allMultiOptions.push({ filters: this.optionsAttackType, selected: this.selectedFiltersAttackType });
    allMultiOptions.push({ filters: this.optionsAttackSave, selected: this.selectedFiltersAttackSave });
    allMultiOptions.push({ filters: this.optionsAffectedTargets, selected: this.selectedFiltersAffectedTargets });
    allMultiOptions.push({ filters: this.optionsNumberOfTargets, selected: this.selectedFiltersNumberOfTargets });
    allMultiOptions.push({ filters: this.optionsTheme, selected: this.selectedFiltersTheme });
    allMultiOptions.push({ filters: this.optionsTag, selected: this.selectedFiltersTag });
    allMultiOptions.push({ filters: this.optionsSingleTag, selected: this.selectedFiltersSingleTag });
    allMultiOptions.push({ filters: this.optionsMustTag, selected: this.selectedFiltersMustTag });
    allMultiOptions.push({ filters: this.optionsNotTag, selected: this.selectedFiltersNotTag });
    allMultiOptions.push({ filters: this.optionsPreset, selected: this.selectedFiltersPreset });
    
    //array to bundle all single filter options for loading
    var allSingleOptions: {filters: SpellFilter[], selected: string[] | undefined}[] = new Array();
    //fill single filter options bundle
    allSingleOptions.push({ filters: this.optionsConcentration, selected: this.selectedFiltersConcentration });
    allSingleOptions.push({ filters: this.optionsRitual, selected: this.selectedFiltersRitual });
    allSingleOptions.push({ filters: this.optionsTargetCaster, selected: this.selectedFiltersTargetCaster });
    allSingleOptions.push({ filters: this.optionsComponentV, selected: this.selectedFiltersComponentV });
    allSingleOptions.push({ filters: this.optionsComponentS, selected: this.selectedFiltersComponentS });
    allSingleOptions.push({ filters: this.optionsComponentM, selected: this.selectedFiltersComponentM });
    allSingleOptions.push({ filters: this.optionsMaterialValue, selected: this.selectedFiltersMaterialValue });
    allSingleOptions.push({ filters: this.optionsMaterialConsumed, selected: this.selectedFiltersMaterialConsumed });
    allSingleOptions.push({ filters: this.optionsUpcastable, selected: this.selectedFiltersUpcastable });
    allSingleOptions.push({ filters: this.optionsCategoryKnown, selected: this.selectedFiltersCategoryKnown });
    allSingleOptions.push({ filters: this.optionsCategoryAlways, selected: this.selectedFiltersCategoryAlways });
    allSingleOptions.push({ filters: this.optionsCategoryLimited, selected: this.selectedFiltersCategoryLimited });
    allSingleOptions.push({ filters: this.optionsCategoryRitualCast, selected: this.selectedFiltersCategoryRitualCast });
    allSingleOptions.push({ filters: this.optionsCategoryPrepared, selected: this.selectedFiltersCategoryPrepared });
    allSingleOptions.push({ filters: this.optionsCategoryRemoved, selected: undefined });
    allSingleOptions.push({ filters: this.optionsSpellMod, selected: this.selectedFiltersSpellMod });
        
    
    //get saved filter storage
    var filterStorages: SpellFilterStorage[] = new Array();
    try {
      filterStorages = JSON.parse(this.storageService.loadLocal('Filters'));
    }
    catch (exception_var){
      return;
    }
    
    //iterate all multi filter options and pick the one who are saved
    for(var optionMulti of allMultiOptions){
      for(var optionMultiFilter of optionMulti.filters){
        if(filterStorages.some(filterStorage => filterStorage.type === optionMultiFilter.type && filterStorage.displayTextList === optionMultiFilter.displayTextList)){
          optionMultiFilter.selected = true;
          optionMulti.selected.push(optionMultiFilter);
          this.filters.push(optionMultiFilter); 
        }               
      }
    }

    //iterate all multi filter options and pick the one who are saved
    for(var optionSingle of allSingleOptions){
      for(var optionSingleFilter of optionSingle.filters){
        if(filterStorages.some(filterStorage => filterStorage.type === optionSingleFilter.type && filterStorage.displayTextList === optionSingleFilter.displayTextList)){
          optionSingleFilter.selected = true;
          if(optionSingle.selected != undefined){
            if(optionSingleFilter.value === true){
              optionSingle.selected.push('true');
            }
            if(optionSingleFilter.value === false){
              optionSingle.selected.push('false');
            }
          }
          this.filters.push(optionSingleFilter); 
        }               
      }
    }

    //sort filters at the end
    this.filters.sort(SpellFilter.compare);

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

  characterSelected(): boolean{
    return this.characterData.selectedCharacter != undefined && this.settings.characterMode;
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

  spellsAllKnown(spellsToCheck: Spell[]): boolean{
    for(var spell of spellsToCheck){
      if(!spell.known){        
        return false;
      }
    }
    return true;
  }
  spellsAllRemoved(spellsToCheck: Spell[]): boolean{
    for(var spell of spellsToCheck){
      if(!spell.removed){        
        return false;
      }
    }
    return true;
  }
  spellsContainRemoved(spellsToCheck: Spell[]): boolean{
    for(var spell of spellsToCheck){
      if(spell.removed){        
        return true;
      }
    }
    return false;
  }

  disableButtonAddFiltered(): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return true;
    }

    if(this.removedInsteadOfKnown){
      if(!this.spellsContainRemoved(this.spellsFiltered)){
        return true;
      }
    }
    else{
      if(this.spellsContainRemoved(this.spellsFiltered) || this.spellsAllKnown(this.spellsFiltered)){
        return true;
      }
    }

    return false;
  }
  disableButtonRemoveFiltered(): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return true;
    }

    if(this.removedInsteadOfKnown){
      if(this.spellsAllRemoved(this.spellsFiltered)){
        return true;
      }
      for(var spell of this.spellsFiltered){
        if(spell.known || spell.always || spell.ritualCast || spell.limited){
          return true;
        }
      }
    }
    else{
      for(var spell of this.spellsFiltered){
        if(spell.known){
          return false;
        }
      }
      return true;
    }

    return false;
  }


  showSpellListSnackBar(spellName: string, action: string, current: number, max: number){
    
    var text: string = '\'' + spellName + '\'' + ' ' + action;

    if(max > 0){
      text = text + ' (' + current + '/' + max + ')';
    }

    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: globals.snackBarDuration,
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
    if(spell.removed){
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
    if(spell.removed){
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
  showIconRemoved(spell: Spell): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return false;
    }
    if(char.mode === ModeOption.Overview && spell.removed){
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
    if(spell.removed){
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
    if(spell.removed){
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
    if(spell.removed){
      return false;
    }
    if(char.mode === ModeOption.Session && !spell.used && spell.limited && !(!char.preparedCasting && spell.known) && !spell.always && !spell.prepared){
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
    if(spell.removed){
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

  showNameIcon(spell: Spell, property: string): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return false;
    }
    if(spell.removed){
      return false;
    }
    switch (property) {
      case "known":
        return char.mode === ModeOption.AddRemove && spell.known;
      case "limited":
        if((char.mode === ModeOption.Overview || char.mode === ModeOption.AddRemove) && spell.limited){
          return true;
        }
        if(char.mode === ModeOption.Session && this.showIconUsed(spell)){
          return true;
        }
        return false;
      case "ritualCasting":
        return (char.mode === ModeOption.Overview || char.mode === ModeOption.AddRemove) && spell.ritualCast;
      case "always":
        return (char.mode === ModeOption.Overview || char.mode === ModeOption.AddRemove) && spell.always;
      case "prepared":
        return char.mode === ModeOption.Overview && spell.prepared;
      default:
        return false;
    }
  }

  showFilterKnown(): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return false;
    }
    return true;
  }
  showFilterAlways(): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return false;
    }
    return char.alwaysSpells.length > 0;
  } 
  showFilterLimited(): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return false;
    }
    return char.limitedSpells.length > 0;
  } 
  showFilterRitualCast(): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return false;
    }
    return char.ritualCaster || char.ritualSpells.length > 0;
  } 
  showFilterPrepared(): boolean{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return false;
    }
    return char.preparedCantripCasting || char.preparedCantrips.length > 0 || char.preparedCasting || char.preparedSpells.length > 0;
  }

  onTotalClick(type: SpellFilterType){
    
    if(type === SpellFilterType.CategoryKnown){
      if(!this.filters.some( filter => filter.type === type)){
        this.addFilterToggle(this.optionsCategoryKnown, true);
      }
      else if(this.filters.some( filter => filter.type === type)){
        this.addFilterToggle(this.optionsCategoryKnown, false);
      }
    }

    if(type === SpellFilterType.CategoryAlways){
      if(!this.filters.some( filter => filter.type === type)){
        this.addFilterToggle(this.optionsCategoryAlways, true);
      }
      else if(this.filters.some( filter => filter.type === type)){
        this.addFilterToggle(this.optionsCategoryAlways, false);
      }
    }

    if(type === SpellFilterType.CategoryLimited){
      if(!this.filters.some( filter => filter.type === type)){
        this.addFilterToggle(this.optionsCategoryLimited, true);
      }
      else if(this.filters.some( filter => filter.type === type)){
        this.addFilterToggle(this.optionsCategoryLimited, false);
      }
    }

    if(type === SpellFilterType.CategoryRitualCast){
      if(!this.filters.some( filter => filter.type === type)){
        this.addFilterToggle(this.optionsCategoryRitualCast, true);
      }
      else if(this.filters.some( filter => filter.type === type)){
        this.addFilterToggle(this.optionsCategoryRitualCast, false);
      }
    }

    if(type === SpellFilterType.CategoryPrepared){
      if(!this.filters.some( filter => filter.type === type)){
        this.addFilterToggle(this.optionsCategoryPrepared, true);
      }
      else if(this.filters.some( filter => filter.type === type)){
        this.addFilterToggle(this.optionsCategoryPrepared, false);
      }
    }

    if(type === SpellFilterType.CategoryRemoved){
      if(!this.filters.some( filter => filter.type === type)){
        this.addFilterToggle(this.optionsCategoryRemoved, true);
      }
      else if(this.filters.some( filter => filter.type === type)){
        this.addFilterToggle(this.optionsCategoryRemoved, false);
      }
    }
    
  }

  //wird nicht mehr benötigt, da jetzt über mat-button abgebildet mit width: max-content
  // totalWidth(text: string): number{
    
  //   if(text.length === 0){
  //     return 35;
  //   }
  //   if(text.length === 1){
  //     return 40;
  //   }
  //   if(text.length === 2){
  //     return 43;
  //   }
  //   if(text.length === 3){
  //     return 50;
  //   }
  //   if(text.length <= 12){
  //     return 40 + (text.length * 5);
  //   }
  //   return 35 + (text.length * 6);
  // }

  totalStyle(type: SpellFilterType): Object{
    if(this.filters.some( filter => filter.type === type && filter.value === true)){
      return {background: '#CCE5FF'};
    }
    if(this.filters.some( filter => filter.type === type && filter.value === false)){
      return {background: '#FFCCCC'};
    }
    return {background: 'white'};
  }

  totalStyleText(type: SpellFilterType, colorRed: boolean): Object{
    if(this.filters.some( filter => filter.type === type && filter.value === false)){
      if(colorRed){ return {textDecoration: 'line-through',color: 'red'}}
      else{ return {textDecoration: 'line-through',color: ''}}
    }
    else{
      if(colorRed){return {textDecoration: '', color: 'red'}}
    }
    return {textDecoration: '', color: ''};
  } 

  getTotalKnown(): string{
    return (this.getKnownCount(true, false) + this.getKnownCount(false, false)).toString();
  }
  getCantripsKnown(): string{
    var returnString: string = 'Cantrips: ' + this.getKnownCount(true, false).toString();
    if(this.characterData.selectedCharacter != undefined && this.characterData.selectedCharacter.knownCantripCasting){
      returnString = returnString + '/' + this.getKnownCount(true, true).toString();
    }
    return returnString;
  }
  getSpellsKnown(): string{
    var returnString: string = 'Spells: ' + this.getKnownCount(false, false).toString();
    if(this.characterData.selectedCharacter != undefined && this.characterData.selectedCharacter.knownCasting){
      returnString = returnString + '/' + this.getKnownCount(false, true).toString();
    }
    return returnString;
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

  getTotalPrepared(): string{
    return (this.getPreparationCount(true, false) + this.getPreparationCount(false, false)).toString();
  }
  getCantripsPrepared(): string{
    var returnString: string = 'Cantrips: ' + this.getPreparationCount(true, false).toString();
    if(this.characterData.selectedCharacter != undefined && this.characterData.selectedCharacter.preparedCantripCasting){
      returnString = returnString + '/' + this.getPreparationCount(true, true).toString();
    }
    return returnString;
  }
  getSpellsPrepared(): string{
    var returnString: string = 'Spells: ' + this.getPreparationCount(false, false).toString();
    if(this.characterData.selectedCharacter != undefined && this.characterData.selectedCharacter.preparedCasting){
      returnString = returnString + '/' + this.getPreparationCount(false, true).toString();
    }
    return returnString;
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
      this.characterData.selectedCharacter.addPreparedSpell(spell);
      if(spell.level === 0){
        this.showSpellListSnackBar(spell.name, 'prepared', this.getPreparationCount(true, false), this.getPreparationCount(true, true));
      }
      else{
        this.showSpellListSnackBar(spell.name, 'prepared', this.getPreparationCount(false, false), this.getPreparationCount(false, true));
      }
    }
    else{
      this.characterData.selectedCharacter.removedPreparedSpell(spell);
      if(spell.level === 0){
        this.showSpellListSnackBar(spell.name, 'unprepared', this.getPreparationCount(true, false), this.getPreparationCount(true, true));
      }
      else{
        this.showSpellListSnackBar(spell.name, 'unprepared', this.getPreparationCount(false, false), this.getPreparationCount(false, true));
      }      
    }
    this.characterData.selectedCharacter.save();

    //if prepared on top, trigger sorting
    if(this.characterData.selectedCharacter.preparedOnTop){
      this.sortMasterSpells();
    }
    this.onChange();
  }

  onApplyPreparationBlueprint(blueprint: PreparedSpellsBlueprint){

    if(this.getCurrentPreparationCount() === 0){
      //apply blueprint without asking the user (not necessary because zero spells are prepared)
      this.doApplyPreparationBlueprint(blueprint);
      return;
    }

    //ask user
    this.disabled = true;

    var snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      duration: -1,
      data: {
        text: 'Unprepare existing spells before applying template?',
        action: true,
        actionText: 'Yes',
        dismiss: true,
        dismissText: 'No',
      }
    });    

    snackBarRef.instance.onAction.subscribe(() => {      
      this.unprepareAll();
      //close snackbar
      snackBarRef.dismiss();      
    });

    snackBarRef.instance.onDismiss.subscribe(() => {
      //close snackbar
      snackBarRef.dismiss();
    });

    snackBarRef.afterDismissed().subscribe(() => {
      
      //re-enable clicking
      this.disabled = false;

      //apply blueprint
      this.doApplyPreparationBlueprint(blueprint);

    });    

  }

  doApplyPreparationBlueprint(blueprint: PreparedSpellsBlueprint){

    var preparedCounter: number = this.applyPreparationBlueprint(blueprint, false);    

    var spellText: string = preparedCounter === 1 ? ' spell' : ' spells';
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: globals.snackBarDuration,
      data: {text: preparedCounter + spellText  + ' prepared'}
    });

  }

  applyPreparationBlueprint(blueprint: PreparedSpellsBlueprint, dryRun: boolean): number {

    var char = this.characterData.selectedCharacter;
    if(char === undefined || blueprint === undefined){
      return 0;
    }

    var preparedCounter : number = 0;

    for(var blueprintSpell of blueprint.preparedSpells){      
      var spellToPrepare: Spell | undefined = this.spells.find(spell => spell.name === blueprintSpell.name);

      //also check if not always and so on?, see list creation for prepared modus
      if(spellToPrepare != undefined && spellToPrepare.known && !spellToPrepare.always && !spellToPrepare.prepared){
        
        //dry run: only add to counter
        if(dryRun){
          preparedCounter++;
        }
        //real run
        else{
          spellToPrepare.prepared = true;
          if(this.characterData.selectedCharacter?.addPreparedSpell(spellToPrepare)){
            preparedCounter++;
          }
        }        
      }            
    }

    if(!dryRun && preparedCounter > 0){
      char.save();

      //if prepared on top, trigger sorting
      if(char.preparedOnTop){
        this.sortMasterSpells();
      }
      this.onChange();
    }

    return preparedCounter;

  }

  getCurrentPreparationCount(): number{
    return this.getPreparationCount(true, false) + this.getPreparationCount(false, false);
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
        ArrayUtilities.removeFromArray(this.characterData.selectedCharacter.preparedCantrips, spell.name);
        spell.prepared = false;
        this.showSpellListSnackBar(spell.name, 'unknown', this.getKnownCount(true, false), this.getKnownCount(true, true));
      }
      else{
        ArrayUtilities.removeFromArray(this.characterData.selectedCharacter.knownSpells, spell.name);
        ArrayUtilities.removeFromArray(this.characterData.selectedCharacter.preparedSpells, spell.name);
        spell.prepared = false;
        this.showSpellListSnackBar(spell.name, 'unknown', this.getKnownCount(false, false), this.getKnownCount(false, true));
      }
    }
    this.characterData.selectedCharacter.save();

    if(this.characterData.selectedCharacter.knownOnTop){
      this.sortMasterSpells();
    }
    this.onChange();

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

  private removeSpellWithoutSavingChar(spell: Spell){

    if(this.characterData.selectedCharacter == undefined){
      return;
    }

    spell.removed = true;
    this.characterData.selectedCharacter.removedSpells.push(spell.name);
      
    //remove all other attributes
    spell.known = false;
    ArrayUtilities.removeFromArray(this.characterData.selectedCharacter.knownCantrips, spell.name);
    ArrayUtilities.removeFromArray(this.characterData.selectedCharacter.knownSpells, spell.name);

    spell.always = false;
    ArrayUtilities.removeFromArray(this.characterData.selectedCharacter.alwaysSpells, spell.name);

    spell.limited = false;
    ArrayUtilities.removeFromArray(this.characterData.selectedCharacter.limitedSpells, spell.name);
         
    spell.ritualCast = false;
    ArrayUtilities.removeFromArray(this.characterData.selectedCharacter.ritualSpells, spell.name);
    
    spell.used = false;
    ArrayUtilities.removeFromArray(this.characterData.selectedCharacter.usedSpells, spell.name);
    
    spell.prepared = false;
    ArrayUtilities.removeFromArray(this.characterData.selectedCharacter.preparedCantrips, spell.name);
    ArrayUtilities.removeFromArray(this.characterData.selectedCharacter.preparedSpells, spell.name);
  }

  onRemoved(spell: Spell){
    
    if(this.characterData.selectedCharacter == undefined){
      return;
    }
    spell.removed = !spell.removed;
    if(spell.removed){
      this.showSpellListSnackBar(spell.name, 'deleted', 0, 0);
      this.removeSpellWithoutSavingChar(spell);
    }
    else{
      ArrayUtilities.removeFromArray(this.characterData.selectedCharacter.removedSpells, spell.name);
      this.showSpellListSnackBar(spell.name, 'restored from deleted spells', 0, 0);
    }
    this.characterData.selectedCharacter.save();

    if(!this.characterData.selectedCharacter.showRemoved && this.characterData.selectedCharacter.mode === ModeOption.AddRemove){
      this.onChange();
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
    }
    this.onChange();

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
    }
    this.onChange();

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
    }
    this.onChange();

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

    if(this.removedInsteadOfKnown){
      this.restoreAllRemoved();
    }
    else{
      this.addAllToKnown();
    }    
  }

  addAllToKnown(){
    //ask user
    this.disabled = true;

    var snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      duration: -1,
      data: {
        text: 'Add all currently shown spells to known list?',
        action: true,
        actionText: 'Yes',
        dismiss: true,
        dismissText: 'No',
      }
    });

    snackBarRef.instance.onAction.subscribe(() => {
      
      var char = this.characterData.selectedCharacter;
      if(char === undefined){
        return;
      }

      var spellCount: number = 0;

      for(var spell of this.spellsFiltered){
        var spellAlreadyKnown: boolean = spell.known;
        if(!spellAlreadyKnown && !spell.removed){
          spell.known = true;
          spellCount++;
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
      }
      this.onChange();

      //close snackbar
      snackBarRef.dismiss();
      //re-enable clicking
      this.disabled = false;

      //show result
      this.showSpellListSnackBar(spellCount.toString(), 'spells added', 0, 0);
    });

    snackBarRef.instance.onDismiss.subscribe(() => {
      //close snackbar
      snackBarRef.dismiss();
      //re-enable clicking
      this.disabled = false;
    });
  }

  restoreAllRemoved(){
    //ask user
    this.disabled = true;

    var snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      duration: -1,
      data: {
        text: 'Restore all currently shown deleted spells?',
        action: true,
        actionText: 'Yes',
        dismiss: true,
        dismissText: 'No',
      }
    });

    snackBarRef.instance.onAction.subscribe(() => {
      
      var char = this.characterData.selectedCharacter;
      if(char === undefined){
        return;
      }

      var spellCount: number = 0;

      for(var spell of this.spellsFiltered){
        if(spell.removed){
          ArrayUtilities.removeFromArray(char.removedSpells, spell.name);
          spell.removed = false;          
          spellCount++;
        }
      }
      char.save();

      if(char.knownOnTop){
        this.sortMasterSpells();
      }
      this.onChange();

      //close snackbar
      snackBarRef.dismiss();
      //re-enable clicking
      this.disabled = false;

      //show result
      this.showSpellListSnackBar(spellCount.toString(), 'spells restored', 0, 0);
    });

    snackBarRef.instance.onDismiss.subscribe(() => {
      //close snackbar
      snackBarRef.dismiss();
      //re-enable clicking
      this.disabled = false;
    });
  }

  onRemoveAll(){
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return;
    }

    if(this.removedInsteadOfKnown){
      this.addAllToRemoved();
    }
    else{
      this.removeAllFromKnown();
    }
  }

  removeAllFromKnown(){
    //ask user
    this.disabled = true;

    var snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      duration: -1,
      data: {
        text: 'Remove all currently shown spells from known list?',
        action: true,
        actionText: 'Yes',
        dismiss: true,
        dismissText: 'No',
      }
    });

    snackBarRef.instance.onAction.subscribe(() => {
      
      var char = this.characterData.selectedCharacter;
      if(char === undefined){
        return;
      }

      var spellCount: number = 0;

      for(var spell of this.spellsFiltered){
        var spellKnown: boolean = spell.known;
        spell.known = false;
        if(spellKnown){
          spellCount++;
          if(spell.level === 0){
            ArrayUtilities.removeFromArray(char.knownCantrips, spell.name);
            ArrayUtilities.removeFromArray(char.preparedCantrips, spell.name);
            spell.prepared = false;
          }
          else{
            ArrayUtilities.removeFromArray(char.knownSpells, spell.name);
            ArrayUtilities.removeFromArray(char.preparedSpells, spell.name);
            spell.prepared = false;
          }
        }
      }
      char.save();
  
      if(char.knownOnTop){
        this.sortMasterSpells();
      }
      this.onChange();

      //close snackbar
      snackBarRef.dismiss();
      //re-enable clicking
      this.disabled = false;

      //show result
      this.showSpellListSnackBar(spellCount.toString(), 'spells removed from known', 0, 0);

    });

    snackBarRef.instance.onDismiss.subscribe(() => {
      //close snackbar
      snackBarRef.dismiss();
      //re-enable clicking
      this.disabled = false;
    });
  }

  addAllToRemoved(){
    //ask user
    this.disabled = true;

    var snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      duration: -1,
      data: {
        text: 'Delete all currently shown spells?',
        action: true,
        actionText: 'Yes',
        dismiss: true,
        dismissText: 'No',
      }
    });

    snackBarRef.instance.onAction.subscribe(() => {
      
      var char = this.characterData.selectedCharacter;
      if(char === undefined){
        return;
      }

      var spellCount: number = 0;

      for(var spell of this.spellsFiltered){
        if(!spell.removed){
          this.removeSpellWithoutSavingChar(spell);
          spellCount++;
        }
      }
      char.save();
  
      if(char.knownOnTop){
        this.sortMasterSpells();
      }
      this.onChange();

      //close snackbar
      snackBarRef.dismiss();
      //re-enable clicking
      this.disabled = false;

      //show result
      this.showSpellListSnackBar(spellCount.toString(), 'spells deleted', 0, 0);

    });

    snackBarRef.instance.onDismiss.subscribe(() => {
      //close snackbar
      snackBarRef.dismiss();
      //re-enable clicking
      this.disabled = false;
    });
  }

  onUnprepareAll(){

    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return;
    }

    //ask user
    this.disabled = true;

    var snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      duration: -1,
      data: {
        text: 'Unprepare all spells?',
        action: true,
        actionText: 'Yes',
        dismiss: true,
        dismissText: 'No',
      }
    });

    snackBarRef.instance.onAction.subscribe(() => {
      
      var spellCount: number = this.unprepareAll();

      //close snackbar
      snackBarRef.dismiss();
      //re-enable clicking
      this.disabled = false;

      //show result
      this.showSpellListSnackBar(spellCount.toString(), 'spells unprepared', 0, 0);

    });

    snackBarRef.instance.onDismiss.subscribe(() => {
      //close snackbar
      snackBarRef.dismiss();
      //re-enable clicking
      this.disabled = false;
    });

  }

  unprepareAll() : number{
    var char = this.characterData.selectedCharacter;
    if(char === undefined){
      return 0;
    }

    var spellCount: number = 0;

    for(var spell of this.spells){
      var spellPrepared: boolean = spell.prepared;
      if(spellPrepared){
        spellCount++;
        if(spell.level === 0){
          ArrayUtilities.removeFromArray(char.preparedCantrips, spell.name);
          spell.prepared = false;
        }
        else{
          ArrayUtilities.removeFromArray(char.preparedSpells, spell.name);
          spell.prepared = false;
        }
      }
    }
    char.save();

    if(char.preparedOnTop){
      this.sortMasterSpells();
    }

    this.onChange();

    return spellCount;
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
      if(spell.limited && !spell.used){
        //spell is not used yet
        return false;
      }
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

      //highlight removed
      if(spell.removed){
        return '#DCDCDC'
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

  onCopyToClipboard() {

    if(this.spellsFiltered === undefined || this.spellsFiltered.length < 1){
      return;
    }

    var toCopy : string = "";

    for(var spell of this.spellsFiltered){
      if(toCopy.length > 0){
        toCopy += "\n";
      }
      toCopy += spell.ritual ? spell.name + ' (Ritual)' : spell.name;
    }

    console.log(toCopy);

    this.clipboard.copy(toCopy);

  }

  onPrint() {

    if(this.spellsFiltered === undefined || this.spellsFiltered.length < 1){
      return;
    }    

    var csvPrint : boolean = this.settings.dmMode;
    var printSpells = new Array();
    for(var spell of this.spellsFiltered){
      
      //join materials (if needed) and description in right language
      var matDescr = spell.translated ? spell.translation : spell.description;
      if(spell.hasMaterials){
        matDescr = '(' + spell.materials + ')' + matDescr; 
      }

      var spellToPrint;
      //decide depending on csv print or direct print
      if(csvPrint){
        spellToPrint = {
          level: spell.level,
          name: spell.ritual ? spell.name + ' (Ritual)' : spell.name,
          levelSchool: spell.levelSchool,
          castingTime: spell.castingTime,
          range: spell.range.displayTextComplete,
          components: spell.componentsDisplayList,
          duration: spell.duration,
          materialsAndDescription: matDescr,
          forWho: spell.sourceShortened
        };
      }
      else{
        spellToPrint = {
          level: spell.level,
          name: spell.name,
          levelSchool: spell.levelSchool,
          ritual: spell.ritual,
          castingTime: spell.castingTime,
          range: spell.range.displayTextComplete,
          components: spell.componentsDisplayList,
          attacksSaves: spell.attacksSavesDisplay === ' — ' ? '' : spell.attacksSavesDisplay,
          duration: spell.duration.replace('Concentration, ', ''),
          hasMaterials: spell.hasMaterials,
          materials: spell.materials,
          materialValue: spell.componentsValue,
          description: spell.translated ? spell.translation : spell.description,
          forWho: spell.sourceShortened,
          always: spell.always,
          ritualCast: spell.ritualCast,
          limited: spell.limited,
          concentration: spell.concentration,
        };
      }

      printSpells.push(spellToPrint);
    }

    if(csvPrint){
      var fileName = 'spells';
      if(this.characterData.selectedCharacter != undefined){
        fileName = fileName + this.characterData.selectedCharacter.name;
      }
  
      this.storageService.storeCsv(fileName + '.csv', printSpells, false);
    }
    else{
      
      //get print settings from character, if character mode
      var printSettings: PrintSettings = 
      {
        characterMode: false,
        name: '',
        backgroundColor: ColorPreset.GetDefaultBackground(),
        whiteFont: ColorPreset.GetDefaultFontIsWhite()
      }
      if(this.settings.characterMode && this.characterData.selectedCharacter != undefined){
        printSettings.characterMode = true;
        printSettings.name = this.characterData.selectedCharacter.name;
        //get color information
        printSettings.backgroundColor = this.characterData.selectedCharacter.cardColor;
        printSettings.whiteFont = this.characterData.selectedCharacter.cardFontWhite;
      }

      this.storageService.storeLocal('PrintSettings', JSON.stringify(printSettings));
      this.storageService.storeLocal('PrintSpells', JSON.stringify(printSpells));
      //window.open(this.router.serializeUrl(this.router.createUrlTree(['spells/print'])), '_blank');
      window.open(location.href + '/print');
    }


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

  loadSettings(){

    this.settings.showRandomControls = this.storageService.loadLocal('RandomControls') === 'true' ? true : false;
    this.settings.sortByName = this.storageService.loadLocal('SortByName') === 'true' ? true : false;
    this.settings.translateAll = this.storageService.loadLocal('TranslateAll') === 'true' ? true : false;
    this.settings.useGrittyRealism = this.storageService.loadLocal('UseGrittyRealism') === 'true' ? true : false;
    this.settings.showDuration = this.storageService.loadLocal('ShowDuration') === 'true' ? true : false;
    this.settings.characterMode = this.storageService.loadLocal('CharacterMode') === 'true' ? true : false;
    this.settings.onlyValueMaterials = this.storageService.loadLocal('OnlyValueMaterials') === 'true' ? true : false;
    this.settings.dmMode = this.storageService.loadLocal('DMMode') === 'true' ? true : false;
    this.settings.showPrint = this.storageService.loadLocal('ShowPrint') === 'true' ? true : false;

  }

  saveSettings(): void{ 

    this.storageService.storeLocal('RandomControls', String(this.settings.showRandomControls));
    this.storageService.storeLocal('SortByName', String(this.settings.sortByName));
    this.storageService.storeLocal('TranslateAll', String(this.settings.translateAll)); 
    this.storageService.storeLocal('UseGrittyRealism', String(this.settings.useGrittyRealism)); 
    this.storageService.storeLocal('ShowDuration', String(this.settings.showDuration)); 
    this.storageService.storeLocal('CharacterMode', String(this.settings.characterMode)); 
    this.storageService.storeLocal('OnlyValueMaterials', String(this.settings.onlyValueMaterials)); 
    this.storageService.storeLocal('DMMode', String(this.settings.dmMode)); 
    this.storageService.storeLocal('ShowPrint', String(this.settings.showPrint)); 

  }

  openInfoDialog(): void {
    this.dialog.open(SpellListInfoDialog);
  }

  openSettingsDialog(): void {

    const dialogRef = this.dialog.open(SpellListSettingsDialog, {
      //width: '250px',
      //height: '300px',
      //disableClose: true,
      autoFocus: 'dialog',
      data: this.settings,
    });

    dialogRef.componentInstance.onTranslate.subscribe(() => {
      this.translateAllMasterSpells();
    });

    dialogRef.componentInstance.onGritty.subscribe(() => {
      this.setDurationAllMasterSpells();
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
      autoFocus: 'dialog',
      data: this.characterData,
    });

    dialogRef.componentInstance.onCharacterChanged.subscribe(() => {
      
      //save selected char
      if(this.characterData.selectedCharacter === undefined){
        this.storageService.deleteLocal('SelectedCharacter');
      }
      else{
        this.storageService.storeLocal('SelectedCharacter', String(this.characterData.selectedCharacter.id));
      }
      
      //trigger
      this.applySelectedCharacterData();

    });

    dialogRef.componentInstance.onSortChanged.subscribe(() => {
      this.sortMasterSpells();
      this.onChange();  
    });
  }

  openBlueprintDialog(): void {

    const dialogRef = this.dialog.open(SpellListBlueprintDialog, {
      //width: '250px',
      //height: '300px',
      //disableClose: true,
      autoFocus: 'dialog',
      data: {char: this.characterData, masterSpells: this.spells}
    });
  
    dialogRef.componentInstance.onCharacterChanged.subscribe(() => {
      
      console.log('char save called');

      //save selected char
      if(this.characterData.selectedCharacter === undefined){
        this.storageService.deleteLocal('SelectedCharacter');
      }
      else{
        this.storageService.storeLocal('SelectedCharacter', String(this.characterData.selectedCharacter.id));
      }
  
    });
  
  }

}

@Component({
  selector: 'spell-list-info-dialog',
  templateUrl: 'spell-list-info-dialog.html',
  styleUrls: ['./spell-list.component.scss']
})
export class SpellListInfoDialog {
  constructor() {}
}

@Component({
  selector: 'spell-list-settings-dialog',
  templateUrl: 'spell-list-settings-dialog.html',
  styleUrls: ['../app.component.scss', './spell-list.component.scss']
})
export class SpellListSettingsDialog {
  
  onRandom = new EventEmitter();
  onTranslate = new EventEmitter();
  onGritty = new EventEmitter();
  onSort = new EventEmitter();
  onCharacter = new EventEmitter();
  onMaterials = new EventEmitter();
  images = imagePaths;
  
  constructor(
    public dialogRef: MatDialogRef<SpellListSettingsDialog>,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: SettingsData,
  ) {
    this.matIconRegistry.addSvgIcon('coins', this.domSanitizer.bypassSecurityTrustResourceUrl(this.images.spellCoinsBlue));
  }

  onRandomClick() {
    this.onRandom.emit();
  }

  onTranslateClick() {
    this.onTranslate.emit();
  }

  onGrittyClick() {
    this.onGritty.emit();
  }

  onSortClick() {
    this.onSort.emit();
  }

  onCharacterClick() {
    this.onCharacter.emit();
  }

  onMaterialsClick() {
    this.onMaterials.emit();
  }

}

@Component({
  selector: 'spell-list-character-dialog',
  templateUrl: 'spell-list-character-dialog.html',
  styleUrls: ['../app.component.scss', './spell-list.component.scss']
})
export class SpellListCharacterDialog {
  
  addMode: boolean = false;
  selectedPreset: Preset | undefined;
  importedCharacter: Character | undefined;
  newName: string | undefined;
  nameChangeMode: boolean = false;
  changedName: string = "";
  onCharacterChanged = new EventEmitter();
  onSortChanged = new EventEmitter();
  disabled: boolean = false;
  fileExtension: string = globals.characterFileExtension;
  colorPresets: ColorPreset[] = ColorPreset.GetDefaultPresets();

  constructor(
    public dialogRef: MatDialogRef<SpellListCharacterDialog>,
    private snackBar: MatSnackBar,
    private storageService: StorageService,
    private fileSaver: FileSaverService,
    @Inject(MAT_DIALOG_DATA) public data: CharacterData,
  ) {}

  onCharacterCreated() {

    if(this.newName != undefined && this.newName != ''){
      
      //create char
      var newChar = new Character(undefined, this.newName, this.data.characterList, this.storageService);

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
      this.importedCharacter = undefined;
      this.addMode = false;

      //trigger
      this.onCharacterChange();
    }

  }

  onImport(e: any){
    var file = e.target.files[0];

    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      var result = fileReader.result;
      
      if(result === undefined || result === null || result instanceof ArrayBuffer){
        this.showSnackBar('File not readable')
        return;
      }

      //create char
      var newChar = Character.fromSerialized(result, undefined, this.data.characterList, this.storageService);
      if(newChar === undefined){
        this.showSnackBar('File contains error or insufficent character data')
        return;
      }
      newChar.save();

      //select
      this.data.selectedCharacter = newChar;
      this.changedName = this.data.selectedCharacter.name;

      //trigger
      this.onCharacterChange();

      //success
      this.showSnackBar('\'' + this.changedName + '\' imported')
      
    }
    fileReader.readAsText(file);
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

  onPresetChosen(preset: ColorPreset): void{
    if(this.data.selectedCharacter === undefined){
      return;
    }
    this.data.selectedCharacter.cardColor = preset.backgroundColor;
    this.data.selectedCharacter.cardFontWhite = preset.whiteFont;
    this.onCharacterChange();
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

  onExport() {

    if(this.data.selectedCharacter === undefined){
      return;
    }

    var fileName = this.data.selectedCharacter.name.replace(/[^\w]/g,'') + globals.characterFileExtension;
    var data = this.data.selectedCharacter.serialize();
    this.storageService.storeJson(fileName, data);

  }

  private showSnackBar(text: string){
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: globals.snackBarDuration,
      data: {text: text}
    });
  }

  showNameWarning(): boolean{
    
    var selectedChar = this.data.selectedCharacter;
    if(selectedChar === undefined){
      return false;
    }

    for(var char of this.data.characterList){
      if(selectedChar.id != char.id && (selectedChar.name === char.name || this.changedName === char.name)){
        return true;
      }
    }

    return false;
  }

}



@Component({
  selector: 'spell-list-blueprint-dialog',
  templateUrl: 'spell-list-blueprint-dialog.html',
  styleUrls: ['../app.component.scss', './spell-list.component.scss']
})
export class SpellListBlueprintDialog {
  
  addMode: boolean = false;
  newName: string | undefined;
  nameChangeMode: boolean = false;
  changedName: string = "";
  selectedBlueprint: PreparedSpellsBlueprint | undefined;
  onCharacterChanged = new EventEmitter();
  disabled: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SpellListBlueprintDialog>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: {char: CharacterData, masterSpells: Spell[]},
  ) {}

  createBlueprintList(): PreparedSpellBlueprint[]{
    
    var tempBlueprint: PreparedSpellBlueprint[] = new Array();

    var char = this.data.char.selectedCharacter;
    if(char === undefined){
      return tempBlueprint;
    }
    
    
    for(var spell of this.data.masterSpells){
      if(spell.prepared){
        tempBlueprint.push({name: spell.name, level: spell.level});
      }
    }

    return tempBlueprint;
  }

  onBlueprintCreated() {

    if(this.newName != undefined && this.newName != '' && this.data.char.selectedCharacter != undefined){
      
      var char = this.data.char.selectedCharacter;

      //create blueprint
      var newBlueprint = new PreparedSpellsBlueprint(this.newName, this.createBlueprintList());

      //add blueprint to character
      char.preparedBlueprints.push(newBlueprint);      

      //save
      char.save();

      //select
      this.selectedBlueprint = newBlueprint;
      this.changedName = this.selectedBlueprint.name;

      //reset options
      this.newName = undefined;
      this.addMode = false;

      //trigger
      this.onBlueprintChange();
    }

  }

  onBlueprintDelete() {
    
    if(this.data.char.selectedCharacter === undefined || this.selectedBlueprint === undefined){
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
      
      if(this.data.char.selectedCharacter === undefined|| this.selectedBlueprint === undefined){
        return;
      }

      ArrayUtilities.removeFromArray(this.data.char.selectedCharacter.preparedBlueprints, this.selectedBlueprint);
      this.selectedBlueprint = undefined;

      //trigger
      this.onBlueprintChange();

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

  onBlueprintOverwrite() {
    
    if(this.data.char.selectedCharacter === undefined || this.selectedBlueprint === undefined){
      return;
    }

    //stop the user from clicking outside the dialog and disable clicks inside the dialog (until snackbar is interacted with)
    this.dialogRef.disableClose = true;
    this.disabled = true;

    var snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      duration: -1,
      data: {
        text: 'Overwrite existing template?',
        action: true,
        actionText: 'Yes',
        dismiss: true,
        dismissText: 'No',
      }
    });

    snackBarRef.instance.onAction.subscribe(() => {      
      
      if(this.selectedBlueprint === undefined){
        return;
      }

      this.selectedBlueprint.preparedSpells = this.createBlueprintList();

      //trigger
      this.onBlueprintChange();

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

  onBlueprintChange() {

    //save character
    this.data.char.selectedCharacter?.save();

    //trigger save event
    this.onCharacterChanged.emit();
  }

  onNameChangeCalled() {

    if(this.data.char.selectedCharacter === undefined || this.selectedBlueprint === undefined){
      return;
    }
    this.nameChangeMode = true;
    this.changedName = this.selectedBlueprint.name;

  }

  onNameChangeCanceled() {

    this.nameChangeMode = false;
    this.changedName = '';

  }

  onNameChangeDone() {

    if(this.data.char.selectedCharacter === undefined || this.selectedBlueprint === undefined || this.changedName === ''){
      return;
    }

    this.selectedBlueprint.name = this.changedName;

    //trigger
    this.onBlueprintChange();

    //reset
    this.onNameChangeCanceled();

  }

  showNameWarning(): boolean{
    
    var selectedChar = this.data.char.selectedCharacter;
    if(selectedChar === undefined || this.selectedBlueprint === undefined){
      return false;
    }

    var nameCounter = 0;
    for(var blueprint of selectedChar.preparedBlueprints){
      if(blueprint.name === this.selectedBlueprint.name){
        nameCounter++;
      }
    }

    return nameCounter > 1;
  }

  showSpellWarning(spell: PreparedSpellBlueprint): string{

    var selectedChar = this.data.char.selectedCharacter;
    if(selectedChar === undefined || this.selectedBlueprint === undefined){
      return '';
    }    

    if(selectedChar.knownCantrips.indexOf(spell.name) === -1 && selectedChar.knownSpells.indexOf(spell.name) === -1){
      
      if(selectedChar.alwaysSpells.indexOf(spell.name) > -1){
        return 'always known';
      }

      return 'not known';
    }

    return '';
  }

  getSpellLevelString(spell: PreparedSpellBlueprint): string{
    switch(spell.level) { 
      case 0: { return 'Can'; }
      case 1: { return '1st'; }
      case 2: { return '2nd'; }
      case 3: { return '3rd'; }
      case 4: { return '4th'; }
      case 5: { return '5th'; }
      case 6: { return '6th'; }
      case 7: { return '7th'; }
      case 8: { return '8th'; }
      case 9: { return '9th'; }
      default: { return 'N.N.'; } 
    }     
  }

}