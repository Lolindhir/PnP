import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ROUTES, Routes } from '@angular/router';

import { RulesContent } from '@models/rules-content.model';

import { HomeComponent } from './home/home.component';
import { SpellListComponent } from './spell-list/spell-list.component';
import { SpellDetailComponent } from './spell-detail/spell-detail.component';
import { SpellPrintComponent } from './spell-print/spell-print.component';
import { ItemListComponent } from './item-list/item-list.component';
import { FeatListComponent } from './feat-list/feat-list.component';
import { FeatDetailComponent } from './feat-detail/feat-detail.component';
import { RuleArticleComponent } from './rule-article/rule-article.component';
import { RulesHomeComponent } from './rules-home/rules-home.component';


//Reihenfolge ist relevant: Allgemeine Seiten zum Schluss, spezielle Seiten an den Anfang
export const standardRoutes: Routes = [  
  //rules article root
  { path: 'rules/:article', component: RuleArticleComponent, pathMatch: 'full'},
  //rules home
  { path: 'rules', component: RulesHomeComponent, pathMatch: 'full'},
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
        for(var route of RulesContent.getAllRoutes()){
          routes.push({
            path: route,
            component: RuleArticleComponent,
            pathMatch: 'full'
          }); 
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
