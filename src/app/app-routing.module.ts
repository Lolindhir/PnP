import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ROUTES, Routes } from '@angular/router';

import { MarkdownContent } from '@models/markdown-content.model';
import { RulesContent } from '@models/rules-content.model';
import { CampaignInfo } from '@models/campaign-info.model';

import { HomeComponent } from './home/home.component';
import { SpellListComponent } from './spell-list/spell-list.component';
import { SpellDetailComponent } from './spell-detail/spell-detail.component';
import { SpellPrintComponent } from './spell-print/spell-print.component';
import { ItemListComponent } from './item-list/item-list.component';
import { FeatListComponent } from './feat-list/feat-list.component';
import { FeatDetailComponent } from './feat-detail/feat-detail.component';
import { MarkdownHomeComponent } from './markdown-home/markdown-home.component';
import { MarkdownArticleComponent } from './markdown-article/markdown-article.component';
import { CampaignsHomeComponent } from './campaigns-home/campaigns-home.component';


//Reihenfolge ist relevant: Allgemeine Seiten zum Schluss, spezielle Seiten an den Anfang
export const standardRoutes: Routes = [  
  //strahd article root
  { path: 'campaigns/strahd/:article', component: MarkdownArticleComponent, pathMatch: 'full', data: { type: 'campaign', campaign:'strahd' } },
  //strahd home
  { path: 'campaigns/strahd', component: MarkdownHomeComponent, pathMatch: 'full', data: { type: 'campaign', campaign:'strahd' } },
  //starter article root
  { path: 'campaigns/starter/:article', component: MarkdownArticleComponent, pathMatch: 'full', data: { type: 'campaign', campaign:'starter' } },
  //starter home
  { path: 'campaigns/starter', component: MarkdownHomeComponent, pathMatch: 'full', data: { type: 'campaign', campaign:'starter' } },
  //campaigns home
  { path: 'campaigns', component: CampaignsHomeComponent, pathMatch: 'full'},
  //rules article root
  { path: 'rules/:article', component: MarkdownArticleComponent, pathMatch: 'full', data: { type: 'rules' } },
  //rules home
  { path: 'rules', component: MarkdownHomeComponent, pathMatch: 'full', data: { type: 'rules' } },
  //feat detail
  { path:'feats/:id', component: FeatDetailComponent, pathMatch: 'full' },
  //feat list
  { path:'feats', component: FeatListComponent, pathMatch: 'full' },
  //spell print view
  { path:'spells-print', component: SpellPrintComponent, pathMatch: 'full' },
  //spell detail
  { path:'spells/:id', component: SpellDetailComponent, pathMatch: 'full' },
  //spell list
  { path:'spells', component: SpellListComponent, pathMatch: 'full' },
  //item list
  { path:'items', component: ItemListComponent, pathMatch: 'full' },
  //home
  { path:'home', component: HomeComponent, pathMatch: 'full'},
  //homepage
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  //default
  { path: '**', redirectTo: 'home' },
];

export const routingComponents = [
  HomeComponent,
  SpellListComponent,
  SpellPrintComponent,
  ItemListComponent,
  FeatListComponent,
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot([]),
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    {
      provide: ROUTES,
      useFactory: () => {
        let routes: Routes = [];

        //push rules content routes
        for(var route of MarkdownContent.getAllRoutes(RulesContent.getRulesContent())){
          routes.push({
            path: route,
            component: MarkdownArticleComponent,
            pathMatch: 'full',
            data: { type: 'rules' }
          }); 
        }        

        //push campaign content routes
        for(var campaign of CampaignInfo.getCampaignsContent()){
          for(var route of MarkdownContent.getAllRoutes(campaign.content)){
            routes.push({
              path: route,
              component: MarkdownArticleComponent,
              pathMatch: 'full',
              data: { 
                type: 'campaign',
                campaign: campaign.info.id 
              }
            });
          }
        }

        return [
          ...routes,
          ...standardRoutes
        ];
      },
      multi: true
    }
  ]
})
export class AppRoutingModule { }
