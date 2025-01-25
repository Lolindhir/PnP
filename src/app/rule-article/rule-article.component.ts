import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RulesContent, RulesNavigationRouteSimple } from '@models/rules-content.model';
import { RulesMenuComponent } from '@components/rules-menu/rules-menu.component';

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
  
  constructor(private route: ActivatedRoute) { }

  triggerResetMenu(): void {
    if (this.rulesMenu) {
      this.rulesMenu.resetMenuEvent.emit();
    }
  }

  ngOnInit(): void {
      var articleId: string | null = this.route.snapshot.paramMap.get('article'); 
      this.href = window.location.href;

      this.rulesContent = articleId != null ? RulesContent.getById(articleId) : undefined;
      if(this.rulesContent != undefined){

        this.headline = this.rulesContent.name;
        if(this.rulesContent.filename.length > 0) this.markDownSource = './assets/rules/' + this.rulesContent.filename; 

        //check if markdown file exists
        fetch(this.markDownSource)
          .then(response => {
            if (!response.ok) {
              this.markDownSource = './assets/rules/404.md';
              //this.headline = '404 - Article not found';
            }
            else{
              //check if markdown file is empty
              fetch(this.markDownSource)
                .then(response => response.text())
                .then(text => {
                  if(text.length == 0){
                    this.markDownSource = './assets/rules/404.md';
                    //this.headline = '404 - Article not found';
                  }
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
