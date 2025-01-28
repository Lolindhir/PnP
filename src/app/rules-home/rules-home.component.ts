import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RulesContent, RulesNavigationRoute } from '@models/rules-content.model';
import { RulesIndexSearchComponent } from '@components/rules-index-search/rules-index-search.component';

@Component({
  selector: 'app-rules-home',
  templateUrl: './rules-home.component.html',
  styleUrls: ['../app.component.scss', './rules-home.component.scss'],
})
export class RulesHomeComponent {

  rulesList: RulesNavigationRoute[] = new Array;

  constructor(public dialog: MatDialog) { } 

  ngOnInit(): void {

    var allRulesNavigation: RulesNavigationRoute[] = RulesContent.getAllNavigation();

    for(var ruleNav of allRulesNavigation){
      this.rulesList.push(ruleNav);
    }

  }

  openSearchDialog(): void {
    //open search dialog
    this.dialog.open(RulesIndexSearchComponent, {
      width: '80vw',
      height: '90vh',
      maxWidth: '600px',
      maxHeight: '90vh'
    });
  }

}
