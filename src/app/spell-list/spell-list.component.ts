import { Component, OnInit, HostListener } from '@angular/core';
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
export class SpellListComponent implements OnInit {

  //filter stuff
  filters: SpellFilter[] = new Array();
  filterName: string = '';
  selectedFilter: SpellFilter;
  selectedFilters: SpellFilter[];
  // filterSource: string = '';
  // filterClass: SpellClass;
  // filterSubclass: SpellClass;

  //all filter options
  optionsLevel: SpellFilter[] = new Array();
  optionsSchool: SpellFilter[] = new Array();
  optionsSource: SpellFilter[] = new Array();
  optionsClasses: SpellClass[] = new Array();
  optionsSubclasses: SpellClass[] = new Array();

  //spell related stuff
  spells: Spell[] = new Array();
  spellsFiltered: Spell[] = new Array();
  spellsToShow: Spell[] = new Array();
  private spellReloadAmount: number = 30;


  constructor() {

    //get spell properties
    var spellProperties: SpellProperties = spellPropertiesData;

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

      // if(this.optionsSource.indexOf(rawSpell.source) < 0){
      //   this.optionsSource.push(rawSpell.source);
      //   //sort array descending
      //   ArrayUtilities.sortStringArrayDescending(this.optionsSource);
      // }
    });

    //build options
    this.optionsLevel = SpellService.getLevelFilterOptions();
    this.optionsSchool = SpellService.getSchoolFilterOptions();
    this.optionsSource = SpellService.getSourceFilterOptions(this.spells);

    //build class options
    spellProperties.allowedClasses.forEach(spellClass => {
      this.optionsClasses.push(new SpellClass(spellClass, false, true));
    });

    //build subclass options
    spellProperties.allowedSubclasses.forEach(spellSubclass => {
      this.optionsSubclasses.push(new SpellClass(spellSubclass, true, true));
    });

    //fill filtered spells with all spells, because nothing is yet filtered
    this.spellsFiltered = this.spells;
  }

  ngOnInit(): void {

    //add first spells to show list
    this.fetchMore();

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
    
    this.spellsFiltered = SpellService.filterSpells(this.spells, this.filterName, this.filters);
    this.spellsToShow = new Array();
    this.fetchMore();

  }

  onFilterRemoved(removedFilter: SpellFilter){

    removedFilter.choosen = false;
    ArrayUtilities.removeFromArray(this.filters, removedFilter);
    this.filters.sort(SpellFilter.compare);

    if(removedFilter.type === SpellFilterType.School){
      
      var newSelectedFilters : SpellFilter[] = new Array();
      this.filters.forEach( filter => {
        if(filter.type == SpellFilterType.School){
          newSelectedFilters.push(filter);
        }
      })

      //ArrayUtilities.removeFromArray(this.selectedFilters, removedFilter);
      this.selectedFilters = newSelectedFilters;

    }

    //get relevant array
    var relevantFilterArray = this.getRelevantFilterArray(removedFilter);
    
    //relevantFilterArray.push(removedFilter);
    //relevantFilterArray.sort(SpellFilter.compare);
    this.onChange();

  }

  addFilter() {
    
    this.selectedFilter.choosen = true;
    this.filters.push(this.selectedFilter);
    this.filters.sort(SpellFilter.compare);

    //get relevant array
    var relevantFilterArray = this.getRelevantFilterArray(this.selectedFilter);
    
    //remove filter
    //ArrayUtilities.removeFromArray(relevantFilterArray, this.selectedFilter);
    this.onChange();
    this.selectedFilter = new SpellFilter(SpellFilterType.None, '');
  }


  addFilterMulti() {
    
    console.log(this.selectedFilters);

    this.optionsSchool.forEach(schoolFilter => {

      if(!this.selectedFilters.includes(schoolFilter) && !this.filters.includes(schoolFilter)){
        return;
      }

      if(this.selectedFilters.includes(schoolFilter) && this.filters.includes(schoolFilter)){
        return;
      }

      if(this.selectedFilters.includes(schoolFilter) && !this.filters.includes(schoolFilter)){
        this.filters.push(schoolFilter);
        this.filters.sort(SpellFilter.compare);
      }

      if(!this.selectedFilters.includes(schoolFilter) && this.filters.includes(schoolFilter)){
        ArrayUtilities.removeFromArray(this.filters, schoolFilter);
        this.filters.sort(SpellFilter.compare);
      }

    });

    //get relevant array
    //var relevantFilterArray = this.getRelevantFilterArray(this.selectedFilter);
    
    //remove filter
    //ArrayUtilities.removeFromArray(relevantFilterArray, this.selectedFilter);
    this.onChange();
  }


  getRelevantFilterArray(filter: SpellFilter): SpellFilter[]{
    var relevantFilterArray: SpellFilter[] = new Array();
    switch(filter.type){
      case SpellFilterType.School: {
        var relevantFilterArray = this.optionsSchool;
        break;
      }
      case SpellFilterType.Level: {
        var relevantFilterArray = this.optionsLevel;
        break;
      }
      case SpellFilterType.Source: {
        var relevantFilterArray = this.optionsSource
        break;
      }
    }
    return relevantFilterArray;
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
  }

}
