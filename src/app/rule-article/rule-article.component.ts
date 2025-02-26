import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RulesContent, RulesNavigationRouteSimple } from '@models/rules-content.model';
import { RulesMenuComponent } from '@components/rules-menu/rules-menu.component';
import { RulesIndexSearchComponent } from '@components/rules-index-search/rules-index-search.component';

@Component({
  selector: 'app-rule-article',
  templateUrl: './rule-article.component.html',
  styleUrls: ['../app.component.scss', './rule-article.component.scss'],
})
export class RuleArticleComponent {

  @ViewChild(RulesMenuComponent) rulesMenu: RulesMenuComponent;

  headline: string = 'Article not found';
  markDownSource: string = '';
  rulesContent: RulesContent | undefined = undefined;
  children: RulesContent[] = new Array();
  breadcrumbs: RulesNavigationRouteSimple[] = new Array();
  href: string = "";
  sidebarOpen: boolean = false;
  isMobile: boolean = true;
  needStartGap: boolean = false;
  isContentLoaded: boolean = false;
  
  constructor(private route: ActivatedRoute, public dialog: MatDialog) { }

  triggerResetMenu(): void {
    if (this.rulesMenu) {
      this.rulesMenu.resetMenuEvent.emit();
    }
  }

  openSearchDialog(): void {
    
    //close sidebar
    this.sidebarOpen = false;
    
    //open search dialog
    this.dialog.open(RulesIndexSearchComponent, {
      width: '80vw',
      height: '90vh',
      maxWidth: '600px',
      maxHeight: '90vh'
    });

  }

  ngOnInit(): void {
      var articleId: string | null = this.route.snapshot.paramMap.get('article'); 
      this.href = window.location.href;

      this.rulesContent = articleId != null ? RulesContent.getById(articleId) : undefined;
      if(this.rulesContent != undefined){

        this.headline = this.rulesContent.name;
        if(this.rulesContent.filename.length > 0){
          this.markDownSource = './assets/rules/' + this.rulesContent.filename;
        }
        else if (this.rulesContent.children.length === 0){
          this.markDownSource = './assets/rules/404.md';
        }

        //check if markdown file exists
        fetch(this.markDownSource)
          .then(response => {
            if (!response.ok) {
              this.markDownSource = './assets/rules/404.md';
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
                    this.markDownSource = './assets/rules/404.md';
                  }

                  //if markdown file doesn't starts with heading and the rule has children
                  if(!text.trim().startsWith('#') && (this.rulesContent != undefined && this.rulesContent.children.length > 0)){
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

        this.children = this.rulesContent.children;
        this.breadcrumbs = RulesContent.getBreadcrumb(this.rulesContent);
      }
  }

}
