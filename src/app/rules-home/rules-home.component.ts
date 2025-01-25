import { Component, ViewChild } from '@angular/core';
import { RulesContent, RulesNavigationRoute } from '@models/rules-content.model';
import { RulesMenuComponent } from '@components/rules-menu/rules-menu.component';

@Component({
  selector: 'app-rules-home',
  templateUrl: './rules-home.component.html',
  styleUrls: ['../app.component.scss', './rules-home.component.scss'],
})
export class RulesHomeComponent {

  @ViewChild(RulesMenuComponent) rulesMenu: RulesMenuComponent

  rulesList: RulesNavigationRoute[] = new Array;

  constructor() { } 

  ngOnInit(): void {

    var allRulesNavigation: RulesNavigationRoute[] = RulesContent.getAllNavigation();

    for(var ruleNav of allRulesNavigation){
      this.rulesList.push(ruleNav);
    }

    this.rulesMenu.majorMode = true;
  }

}
