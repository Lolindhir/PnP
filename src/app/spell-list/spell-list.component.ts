import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SpellProperties } from '@models/spell-properties.model';
import { Spell, RawSpell } from '@models/spell.model';
import { SpellService } from '@services/spell.service';
import { SpellClass } from '@models/spell-class.model';
import { SpellFilter, SpellFilterType } from '@models/spell-filter.model';
import { ArrayUtilities } from '@utilities/array.utilities';
import spellsData from 'D:/OneDrive/D&D/Public/Quellen und Infos/Zauber/spells.json'; 
import spellPropertiesData from 'D:/OneDrive/D&D/Public/Quellen und Infos/Zauber/spellProperties.json'; 

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
  selectedFiltersSubclass: SpellFilter[] = new Array();
  selectedFiltersCastingTime: SpellFilter[] = new Array();
  selectedFiltersDuration: SpellFilter[] = new Array();
  selectedFiltersDamageType: SpellFilter[] = new Array();
  selectedFiltersSource: SpellFilter[] = new Array();
  selectedFiltersConcentration: string[] = new Array();
  selectedFiltersRitual: string[] = new Array();
  selectedFiltersComponentV: string[] = new Array();
  selectedFiltersComponentS: string[] = new Array();
  selectedFiltersComponentM: string[] = new Array();
  selectedFiltersMaterialValue: string[] = new Array();
  selectedFiltersMaterialConsumed: string[] = new Array();
  selectedFiltersUpcastable: string[] = new Array();

  //all filter options
  optionsLevel: SpellFilter[] = new Array();
  optionsSchool: SpellFilter[] = new Array();
  optionsSource: SpellFilter[] = new Array();
  optionsClass: SpellFilter[] = new Array();
  optionsSubclass: SpellFilter[] = new Array();
  optionsCastingTime: SpellFilter[] = new Array();
  optionsDuration: SpellFilter[] = new Array();
  optionsDamageType: SpellFilter[] = new Array();
  optionsConcentration: SpellFilter[] = new Array();
  optionsRitual: SpellFilter[] = new Array();
  optionsComponentV: SpellFilter[] = new Array();
  optionsComponentS: SpellFilter[] = new Array();
  optionsComponentM: SpellFilter[] = new Array();
  optionsMaterialValue: SpellFilter[] = new Array();
  optionsMaterialConsumed: SpellFilter[] = new Array();
  optionsUpcastable: SpellFilter[] = new Array();

  //spell related stuff
  spells: Spell[] = new Array();
  spellsFiltered: Spell[] = new Array();
  spellsToShow: Spell[] = new Array();
  private spellReloadAmount: number = 30;

  //other global stuff
  expandedPanelIndex: number = -1;
  expansionPanelWidth: number = 0;
  showAdvancedFilters: boolean = false;
  tooltipDelay = 500;
  screenWidth: number = -1;
  screenSm: boolean = false;
  screenMd: boolean = false;
  screenLg: boolean = false;
  screenXl: boolean = false;


  @ViewChild('expansionAccordion')
  expansionAccordion: ElementRef;


  constructor() {

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

    //build options
    this.optionsLevel = SpellService.getLevelFilterOptions(spellProperties);
    this.optionsSchool = SpellService.getSchoolFilterOptions(spellProperties);
    this.optionsClass = SpellService.getClassFilterOptions(spellProperties);
    this.optionsSubclass = SpellService.getSubclassFilterOptions(spellProperties);
    this.optionsSchool = SpellService.getSchoolFilterOptions(spellProperties);
    this.optionsSource = SpellService.getSourceFilterOptions(this.spells, spellProperties);
    this.optionsCastingTime = SpellService.getCastingTimeFilterOptions(spellProperties);
    this.optionsDuration = SpellService.getDurationFilterOptions(spellProperties);
    this.optionsDamageType = SpellService.getDamageTypeFilterOptions(spellProperties);
    this.optionsConcentration = SpellService.getConcentrationFilterOptions(spellProperties);
    this.optionsRitual = SpellService.getRitualFilterOptions(spellProperties);
    this.optionsComponentV = SpellService.getComponentVerbalFilterOptions(spellProperties);
    this.optionsComponentS = SpellService.getComponentSomanticFilterOptions(spellProperties);
    this.optionsComponentM = SpellService.getComponentMaterialFilterOptions(spellProperties);
    this.optionsMaterialValue = SpellService.getMaterialValueFilterOptions(spellProperties);
    this.optionsMaterialConsumed = SpellService.getMaterialConsumedFilterOptions(spellProperties);
    this.optionsUpcastable = SpellService.getUpcastableFilterOptions(spellProperties);

    //fill filtered spells with all spells, because nothing is yet filtered
    this.spellsFiltered = this.spells;
  }

  ngOnInit(): void {

    //add first spells to show list
    this.fetchMore();

  }

  ngAfterViewInit(): void {
    this.setSize();
    this.setPanelSize();
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
  
  onChange() {
    
    this.expandedPanelIndex = -1;
    this.spellsFiltered = SpellService.filterSpells(this.spells, this.filterName, this.filters);
    this.spellsToShow = new Array();
    this.fetchMore();
    this.setPanelSize();

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
      case SpellFilterType.CastingTime: {
        this.selectedFiltersCastingTime = newSelectedFilters;
        break;
      }
      case SpellFilterType.Duration: {
        this.selectedFiltersDuration = newSelectedFilters;
        break;
      }
      case SpellFilterType.DamageType: {
        this.selectedFiltersDamageType = newSelectedFilters;
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
      case SpellFilterType.ComponentVerbal:{
        this.selectedFiltersComponentV = newSelectedStrings;
        break;
      }
      case SpellFilterType.ComponentSomantic:{
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
    this.setPanelSize();
  }

  @HostListener('window:resize', ['$event'])
    onResize(event: any) {
    this.setSize();
    this.setPanelSize();
  }

  async setSize(){  
    
    await this.delay(100);

    this.screenWidth = window.innerWidth;
    this.screenSm = this.screenWidth >= 600 ? true : false;
    this.screenMd = this.screenWidth >= 730 ? true : false;
    this.screenLg = this.screenWidth >= 900 ? true : false;
    this.screenXl = this.screenWidth >= 1280 ? true : false;
  }

  async setPanelSize(){
    
    await this.delay(100);

    if(this.expansionAccordion === undefined){
      this.expansionPanelWidth = 100;
    }
    else {
      this.expansionPanelWidth = this.expansionAccordion.nativeElement.offsetWidth;
    }
  }

  private delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
