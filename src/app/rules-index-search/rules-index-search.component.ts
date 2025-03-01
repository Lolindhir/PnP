import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { RulesIndex } from '@shared/models/rules-index.model';

@Component({
  selector: 'app-index-search',
  templateUrl: './rules-index-search.component.html',
  styleUrls: ['../app.component.scss', './rules-index-search.component.scss']
})
export class RulesIndexSearchComponent implements OnInit {
  searchTerm: string = '';
  searchResults: RulesIndex[] = [];

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<RulesIndexSearchComponent>
  ) {}

  ngOnInit(): void {}

  onSearchChange(): void {
    if (this.searchTerm.length >= 2) {
      this.searchResults = RulesIndex.getAllRules().filter(rule =>
        rule.termAndCategory.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.searchResults = [];
    }
  }

  navigateTo(route: string): void {  
    // Close the dialog before navigating
    this.dialogRef.close();    

    // reload the route to ensure same level navigation
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([route]);
    });
  }  

}