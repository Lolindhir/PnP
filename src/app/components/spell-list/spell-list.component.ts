import { Component, OnInit } from '@angular/core';
import { Spell, RawSpell } from '@models/spell.model';
import spellsData from 'D:/OneDrive/D&D/Public/Quellen und Infos/Zauber/spells.json'; 

@Component({
  selector: 'app-spell-list',
  templateUrl: './spell-list.component.html',
  styleUrls: ['./spell-list.component.scss']
})
export class SpellListComponent implements OnInit {

  //all filters
  filterName: String = '';
  filterSource: String = '';

  //all options
  optionsSource: String[] = new Array();

  spells: Spell[] = new Array();

  constructor() {

    var rawSpells: RawSpell[] = spellsData;

    rawSpells.forEach(rawSpell => {
      
      //create spell
      this.spells.push(new Spell(rawSpell))

      //build source options
      if(this.optionsSource.indexOf(rawSpell.source) < 0){
        this.optionsSource.push(rawSpell.source);
        //Array absteigend sortieren
        this.sortArrayDescending(this.optionsSource);
      }

    });

  }

  ngOnInit(): void {
  }

  private sortArrayDescending(array: String[]): void {
    array.sort((a, b) => (a < b ? -1 : 1));
  }

  // onKey(event: any) {
  //   console.log(this.filter);  
  // }
  
}
