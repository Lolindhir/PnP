import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MarkdownMenuComponent } from '@components/markdown-menu/markdown-menu.component';
import { MarkdownIndexSearchComponent } from '@components/markdown-index-search/markdown-index-search.component';
import { RulesContent } from '@models/rules-content.model';
import { CampaignMarkdownContent, MarkdownContent } from '@models/markdown-content.model';
import { CampaignInfo } from '@models/campaign-info.model';

@Component({
  selector: 'app-markdown-article',
  templateUrl: './markdown-article.component.html',
  styleUrls: ['../app.component.scss', './markdown-article.component.scss'],
})
export class MarkdownArticleComponent implements OnInit {

  @ViewChild(MarkdownMenuComponent) rulesMenu: MarkdownMenuComponent;

  headline: string = 'Article not found';
  markDownSource: string = '';
  content: MarkdownContent | undefined = undefined;
  completeContent: MarkdownContent[] = [];
  campaign: CampaignMarkdownContent | undefined = undefined;
  campaignId: string = '';
  children: MarkdownContent[] = [];
  breadcrumbs: any[] = [];
  breadcrumbRootRoute: string = '';
  breadcrumbRootName: string = '';
  handle: string | undefined = undefined;
  handleColor: string | undefined = undefined;
  handleTextColor: string | undefined = undefined;
  handleTooltip: string = '';
  tocName: string = '';
  href: string = "";
  sidebarOpen: boolean = false;
  isMobile: boolean = true;
  needStartGap: boolean = false;
  isContentLoaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  triggerResetMenu(): void {
    if (this.rulesMenu) {
      this.rulesMenu.resetMenuEvent.emit();
    }
  }

  openSearchDialog(): void {
    
    //close sidebar
    this.sidebarOpen = false;
    
    //open search dialog
    this.dialog.open(MarkdownIndexSearchComponent, {
      width: '80vw',
      height: '90vh',
      maxWidth: '600px',
      maxHeight: '90vh',
      data: { 
        searchTitle: this.tocName,
        campaignId: this.campaignId
      }
    });

  }

  ngOnInit(): void {
    var markdownRootPath: string = './assets/';

    //get params
    var type: string | null = this.route.snapshot.data['type'];
    var campaignId: string | null = this.route.snapshot.data['campaign'];
    var articleId: string | null = this.route.snapshot.paramMap.get('article');
    this.href = window.location.href;


    if(type === 'rules'){
      this.completeContent = RulesContent.getRulesContent();
      this.content = articleId != null ? MarkdownContent.searchById(articleId, this.completeContent) : undefined;
      markdownRootPath += 'rules/';
      this.breadcrumbRootRoute = '/rules';
      this.breadcrumbRootName = 'Rules';
      this.tocName = 'Rules';
    }
    else if(type === 'campaign'){
      this.campaign = campaignId != null ? CampaignInfo.getCampaignContent(campaignId) : undefined;
      markdownRootPath += 'campaigns/';
      if(this.campaign != undefined){
        var info = this.campaign.info;
        this.campaignId = info.id;
        this.completeContent = this.campaign.content;
        this.content = articleId != null ? MarkdownContent.searchById(articleId, this.campaign.content) : undefined;
        markdownRootPath += info.directory + '/';
        this.handle = info.abbreviation;
        this.handleColor = info.color;
        this.handleTextColor = info.textColor;
        this.handleTooltip = info.name;
        this.breadcrumbRootRoute = '/campaigns/' + info.id;
        this.breadcrumbRootName = info.breadcrumb;
        this.tocName = info.abbreviation;
      }
    }

    if(this.content != undefined){

      this.headline = this.content.name;
      if(this.content.filename.length > 0){
        this.markDownSource = markdownRootPath + this.content.filename;
      }
      else if (this.content.children.length === 0){
        this.markDownSource = markdownRootPath + '404.md';
      }

      //check if markdown file exists
      fetch(this.markDownSource)
        .then(response => {
          if (!response.ok) {
            this.markDownSource = markdownRootPath + '404.md';
            // Set content loaded to true
            this.isContentLoaded = true;
          }
          else{
            //check markdown file
            fetch(this.markDownSource)
              .then(response => response.text())
              .then(text => {
                
                //if markdown file is empty
                if(text.length == 0){
                  this.markDownSource = markdownRootPath + '404.md';
                }

                //if markdown file doesn't starts with heading and the rule has children
                if(!text.trim().startsWith('#') && (this.content != undefined && this.content.children.length > 0)){
                  this.needStartGap = true;
                }

                // Set content loaded to true after all checks
                this.isContentLoaded = true;
              });
          }
        })
        .catch(error => {
          console.error('Error:', error);
      });

      this.children = this.content.children;
      this.breadcrumbs = MarkdownContent.getBreadcrumb(this.content);
    }

  }
}