import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Spell, RawSpell } from '@models/spell.model';
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

@Component({
  selector: 'app-spell-list',
  templateUrl: './spell-list.component.html',
  styleUrls: ['./spell-list.component.scss']
})
export class SpellListComponent implements OnInit, AfterViewInit {

  //filter stuff
  advancedFiltersPanelOpen: boolean = false;
  filters: SpellFilter[] = new Array();
  filtersAsString: string = '';
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
  spells: Spell[] = new Array();
  spellsFiltered: Spell[] = new Array();
  spellsToShow: Spell[] = new Array();
  numberOfRandomSpells: number = 0;
  stringOfRandomSpells: string = 'Random spells';
  private spellReloadAmount: number = 30;

  //other global stuff
  images = imagePaths;
  highlightColor: string = 'lightgrey';
  highlightFilter: boolean = false;
  sortByName: boolean = false;
  translateAll: boolean = false;
  loading: boolean = true;
  expandedPanelIndex: number = -1;
  assetNotLoadedIndex: number = -1;
  showAdvancedFilters: boolean = false;
  showRandomControls: boolean = false;
  showTags: boolean = true;
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


  constructor(private httpClient: HttpClient, private cookieService: CookieService) {

    //test for read of local file
    //this.httpClient.get<RawSpell[]>(this.spellPresetPath).pipe(retry(1), catchError(this.handleError)).subscribe(data => { this.test = data });

    //get screen width
    this.screenWidth = window.innerWidth;
    this.setSize();

    //get spell properties
    var spellProperties = spellPropertiesData;

    //fill spells with raw spell data from json
    //and build sort options
    var rawSpells: RawSpell[] = spellsData;
    rawSpells.forEach(rawSpell => {
      
      //only allowed spells
      if(!rawSpell.allowed){
        return;
      }

      //create spell
      this.spells.push(new Spell(rawSpell, spellProperties))

    });

    //sort spells
    this.sortMasterSpells();

    //fill filtered spells with all spells, because nothing is yet filtered
    this.spellsFiltered = this.spells;

    //build options
    this.optionsLevel = SpellService.getLevelFilterOptions(spellProperties);
    this.optionsSchool = SpellService.getSchoolFilterOptions(spellProperties);
    this.optionsClass = SpellService.getClassFilterOptions(spellProperties);
    this.optionsSingleClass = SpellService.getSingleClassFilterOptions(spellProperties);
    this.optionsMustClass = SpellService.getMustClassFilterOptions(spellProperties);
    this.optionsNotClass = SpellService.getNotClassFilterOptions(spellProperties);
    this.optionsSubclass = SpellService.getSubclassFilterOptions(spellProperties);
    this.optionsSchool = SpellService.getSchoolFilterOptions(spellProperties);
    this.optionsSource = SpellService.getSourceFilterOptions(this.spells, spellProperties);
    this.optionsSourceGroups = SpellService.getSourceGroupFilterOptions(this.optionsSource, spellProperties);
    this.optionsCastingTime = SpellService.getCastingTimeFilterOptions(spellProperties);
    this.optionsDuration = SpellService.getDurationFilterOptions(spellProperties);
    this.optionsRange = SpellService.getRangeFilterOptions(spellProperties);
    this.optionsDamageType = SpellService.getDamageTypeFilterOptions(spellProperties);
    this.optionsCondition = SpellService.getConditionFilterOptions(spellProperties);
    this.optionsSave = SpellService.getSaveFilterOptions(spellProperties);
    this.optionsAttackType = SpellService.getAttackTypeFilterOptions(spellProperties);
    this.optionsAttackSave = SpellService.getAttackSaveFilterOptions(spellProperties);
    this.optionsAffectedTargets = SpellService.getAffectedTargetsFilterOptions(spellProperties);
    this.optionsTag = SpellService.getTagFilterOptions(spellProperties);
    this.optionsSingleTag = SpellService.getSingleTagFilterOptions(spellProperties);
    this.optionsMustTag = SpellService.getMustTagFilterOptions(spellProperties);
    this.optionsNotTag = SpellService.getNotTagFilterOptions(spellProperties);
    this.optionsPreset = SpellService.getPresetFilterOptions(spellProperties);
    this.optionsConcentration = SpellService.getConcentrationFilterOptions(spellProperties);
    this.optionsRitual = SpellService.getRitualFilterOptions(spellProperties);
    this.optionsTargetCaster = SpellService.getTargetCasterFilterOptions(spellProperties);
    this.optionsComponentV = SpellService.getComponentVerbalFilterOptions(spellProperties);
    this.optionsComponentS = SpellService.getComponentSomaticFilterOptions(spellProperties);
    this.optionsComponentM = SpellService.getComponentMaterialFilterOptions(spellProperties);
    this.optionsMaterialValue = SpellService.getMaterialValueFilterOptions(spellProperties);
    this.optionsMaterialConsumed = SpellService.getMaterialConsumedFilterOptions(spellProperties);
    this.optionsUpcastable = SpellService.getUpcastableFilterOptions(spellProperties);
    this.optionsSpellMod = SpellService.getSpellModFilterOptions(spellProperties);

    this.onChange();
  }

  ngOnInit(): void {

    console.log("ngOnInit called");    

    //load cookies
    if(this.cookieService.get('TranslateAll') === 'true'){
      this.onTranslateAll();
    }
    if(this.cookieService.get('SortByName') === 'true'){
      this.onSortOnlyByAlphabet();
    }

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

    if(this.sortByName){
      this.spells.sort(Spell.compareNameFirst);
    }
    else{
      this.spells.sort(Spell.compareLevelFirst);
    }
  }

  onChange() {
    
    //set cookies

    this.cookieService.set('Filters', 'Test');

    this.expandedPanelIndex = -1;
    this.spellsFiltered = SpellService.filterSpells(this.spells, this.filterName, this.filters);

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


  onSpellExpansionPanelClosed(index: number){

    if(this.expandedPanelIndex == index){
      this.expandedPanelIndex = -1;
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

  onTranslateAll(){

    console.log('onTranslateAll called')

    //change global variable
    this.translateAll = !this.translateAll;
    this.cookieService.set('TranslateAll', String(this.translateAll), 365);

    for(var spell of this.spells){

      if(this.translateAll && spell.translatable && !spell.translated){
        spell.translated = true;
        spell.descriptionDisplay = spell.translation;
      }

      if(!this.translateAll && spell.translated){
        spell.translated = false;
        spell.descriptionDisplay = spell.description;
      }

    }    

  }

  onSortOnlyByAlphabet(){

    //change global variable
    this.sortByName = !this.sortByName;
    this.cookieService.set('SortByName', String(this.sortByName), 365);

    this.sortMasterSpells();
   
    this.onChange();
    
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

}
