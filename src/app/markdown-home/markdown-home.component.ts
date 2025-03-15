import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MarkdownContent } from '@models/markdown-content.model';
import { MarkdownIndexSearchComponent } from '@components/markdown-index-search/markdown-index-search.component';
import { CampaignInfo } from '@shared/models/campaign-info.model';
import { RulesContent } from '@shared/models/rules-content.model';

@Component({
  selector: 'app-markdown-home',
  templateUrl: './markdown-home.component.html',
  styleUrls: ['../app.component.scss', './markdown-home.component.scss'],
})
export class MarkdownHomeComponent {

  markdownList: MarkdownContent[] = new Array;
  tocName: string = '';
  campaignId: string = '';
  handle: string | undefined = undefined;
  handleColor: string | undefined = undefined;
  handleTextColor: string | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { } 

  ngOnInit(): void {

    //get params
    var type: string | null = this.route.snapshot.data['type'];
    var campaignId: string | null = this.route.snapshot.data['campaign'];

    var allNavigation: MarkdownContent[] = [];

    if(type === 'rules'){
      this.markdownList = RulesContent.getRulesContent();
      this.tocName = 'Rules - Table of Content';
    }
    else if(type === 'campaign'){
      var campaign = campaignId != null ? CampaignInfo.getCampaignContent(campaignId) : undefined;
      if(campaign != undefined){
        var info = campaign.info
        this.campaignId = info.id;
        this.markdownList = campaign.content;
        this.tocName = info.name;
        this.handle = info.abbreviation;
        this.handleColor = info.color;
        this.handleTextColor = info.textColor;
      }
    }

    for(var ruleNav of allNavigation){
      this.markdownList.push(ruleNav);
    }

  }

  openSearchDialog(): void {
    //open search dialog
    this.dialog.open(MarkdownIndexSearchComponent, {
      width: '80vw',
      height: '90vh',
      maxWidth: '600px',
      maxHeight: '90vh',
      data: { 
        searchTitle: this.handle,
        campaignId: this.campaignId
      }
    });
  }

}
