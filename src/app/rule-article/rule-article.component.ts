import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RulesContent, RulesNavigationRouteSimple } from '@models/rules-content.model';

@Component({
  selector: 'app-rule-article',
  templateUrl: './rule-article.component.html',
  styleUrls: ['../app.component.scss', './rule-article.component.scss'],
})
export class RuleArticleComponent {

  headline: string = 'Artikel';
  markDownSource: string = '';
  children: RulesContent[] = new Array();
  breadcrumbs: RulesNavigationRouteSimple[] = new Array();
  href: string = "";
  
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
      var articleId: string | null = this.route.snapshot.paramMap.get('article'); 
      this.href = window.location.href;

      var rulesContent: RulesContent | undefined = articleId != null ? RulesContent.getById(articleId) : undefined;
      if(rulesContent != undefined){

        this.headline = rulesContent.name;
        if(rulesContent.filename.length > 0) this.markDownSource = './assets/rules/' + rulesContent.filename; 

        this.children = rulesContent.children;

        this.breadcrumbs = RulesContent.getPathFromRoot(rulesContent);
      }


  }

}
