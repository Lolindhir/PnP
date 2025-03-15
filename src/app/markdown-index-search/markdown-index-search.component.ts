import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MarkdownIndex } from '@shared/models/markdown-index.model';

@Component({
  selector: 'app-index-search',
  templateUrl: './markdown-index-search.component.html',
  styleUrls: ['../app.component.scss', './markdown-index-search.component.scss']
})
export class MarkdownIndexSearchComponent implements OnInit {
  completeIndex: MarkdownIndex[] | undefined = undefined;
  searchTerm: string = '';
  searchResults: MarkdownIndex[] = [];
  searchTitle: string = '';
  campaignId: string = '';

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<MarkdownIndexSearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {searchTitle: string, campaignId: string}
  ) 
  {
    //get data
    if(this.data != null){
      this.searchTitle = data.searchTitle != null ? data.searchTitle : '';
      this.campaignId = data.campaignId != null ? data.campaignId : '';
    }

    //get complete index
    if(this.campaignId != ''){
      this.completeIndex = MarkdownIndex.getCampaignIndex(this.campaignId);
    } 
    else {
      this.completeIndex = MarkdownIndex.getRulesIndex();
    } 

  }

  ngOnInit(): void {}

  onSearchChange(): void {
    if (this.searchTerm.length >= 2 && this.completeIndex != undefined) {

      this.searchResults = this.completeIndex.filter(indexPart =>
        indexPart.termAndCategory.toLowerCase().includes(this.searchTerm.toLowerCase())
      );

      console.log(this.searchResults);

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