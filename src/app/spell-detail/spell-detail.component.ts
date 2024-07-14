import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Spell, SpellListCategory } from '@models/spell.model';
import { SpellService } from '@services/spell.service';
import { SpellClass } from '@models/spell-class.model';

import * as imagePaths from '@shared/imagePaths';


@Component({
  selector: 'app-spell-detail',
  templateUrl: './spell-detail.component.html',
  styleUrls: ['../app.component.scss', './spell-detail.component.scss', '../spell-list/spell-list.component.scss']
})
export class SpellDetailComponent {

  images = imagePaths;
  tooltipDelay = 500;
  spellLoaded: boolean;
  spell: Spell | undefined;
  spellIdName: string;

  constructor(
    private route: ActivatedRoute,
    private spellService: SpellService
  ) {
    this.route.params.subscribe(params => {
      var spellId: string = params['id'];
      this.spellIdName = decodeURI(spellId);
      this.spell = this.spellService.getSpellById(spellId);
      this.spellLoaded = this.spell != undefined;
    });
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

}
