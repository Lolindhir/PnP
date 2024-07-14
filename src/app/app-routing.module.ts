import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SpellListComponent } from './spell-list/spell-list.component';
import { SpellDetailComponent } from './spell-detail/spell-detail.component';
import { SpellPrintComponent } from './spell-print/spell-print.component';
import { ItemListComponent } from './item-list/item-list.component';
import { FeatListComponent } from './feat-list/feat-list.component';


//Reihenfolge ist relevant: Allgemeine Seiten zum Schluss, spezielle Seiten an den Anfang
export const routes: Routes = [  
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
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule { }
