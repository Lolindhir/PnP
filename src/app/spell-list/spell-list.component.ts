import { Component, OnInit, HostListener } from '@angular/core';
import { SpellProperties } from '@models/spell-properties.model';
import { Spell, RawSpell } from '@models/spell.model';
import { SpellService } from '@services/spell.service';
import spellsData from 'D:/OneDrive/D&D/Public/Quellen und Infos/Zauber/spells.json'; 
import spellPropertiesData from 'D:/OneDrive/D&D/Public/Quellen und Infos/Zauber/spellProperties.json'; 
import { SpellClass } from '@models/spell-class.model';

@Component({
  selector: 'app-spell-list',
  templateUrl: './spell-list.component.html',
  styleUrls: ['./spell-list.component.scss']
})
export class SpellListComponent implements OnInit {

  //all filters
  filterName: String = '';
  filterSource: String = '';
  filterClass: SpellClass;
  filterSubclass: SpellClass;

  //all options
  optionsSource: String[] = new Array();
  optionsClasses: SpellClass[] = new Array();
  optionsSubclasses: SpellClass[] = new Array();

  //spells lists
  spells: Spell[] = new Array();
  spellsFiltered: Spell[] = new Array();
  private spellReloadAmount: number = 30;
  spellsToShow: Spell[] = new Array();



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

      //build source options
      if(this.optionsSource.indexOf(rawSpell.source) < 0){
        this.optionsSource.push(rawSpell.source);
        //sort array descending
        this.sortArrayDescending(this.optionsSource);
      }
    });

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
    
    this.spellsFiltered = SpellService.filterSpells(this.spells, this.filterName, this.filterSource);
    this.spellsToShow = new Array();
    this.fetchMore();

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

  private sortArrayDescending(array: String[]): void {

    array.sort((a, b) => (a < b ? -1 : 1));

  }
}
