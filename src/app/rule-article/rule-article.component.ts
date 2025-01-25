import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RulesContent, RulesNavigationRouteSimple } from '@models/rules-content.model';

@Component({
  selector: 'app-rule-article',
  templateUrl: './rule-article.component.html',
  styleUrls: ['../app.component.scss', './rule-article.component.scss'],
})
export class RuleArticleComponent {

  headline: string = 'Article not found';
  markDownSource: string = '';
  children: RulesContent[] = new Array();
  breadcrumbs: RulesNavigationRouteSimple[] = new Array();
  href: string = "";
  sidebarOpen: boolean = false;
  isMobile: boolean = true;
  
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
      var articleId: string | null = this.route.snapshot.paramMap.get('article'); 
      this.href = window.location.href;

      var rulesContent: RulesContent | undefined = articleId != null ? RulesContent.getById(articleId) : undefined;
      if(rulesContent != undefined){

        this.headline = rulesContent.name;
        if(rulesContent.filename.length > 0) this.markDownSource = './assets/rules/' + rulesContent.filename; 

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

        this.children = rulesContent.children;

        this.breadcrumbs = RulesContent.getBreadcrumb(rulesContent);
      }


  }

}
