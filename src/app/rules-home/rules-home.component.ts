import { Component } from '@angular/core';
import { RulesContent, RulesNavigationRoute } from '@models/rules-content.model';

@Component({
  selector: 'app-rules-home',
  templateUrl: './rules-home.component.html',
  styleUrls: ['../app.component.scss', './rules-home.component.scss'],
})
export class RulesHomeComponent {

  rulesList: RulesNavigationRoute[] = new Array;

  constructor() { } 

  ngOnInit(): void {

    var allRulesNavigation: RulesNavigationRoute[] = RulesContent.getAllNavigation();

    for(var ruleNav of allRulesNavigation){
      this.rulesList.push(ruleNav);
    }

  }

}
