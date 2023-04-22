import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SpellListComponent } from './spell-list/spell-list.component';
import { SpellPrintComponent } from './spell-print/spell-print.component';
import { FeatListComponent } from './feat-list/feat-list.component';


//Reihenfolge ist relevant: Allgemeine Seiten zum Schluss, spezielle Seiten an den Anfang
export const routes: Routes = [  
  //feat list
  { path:'feats', component: FeatListComponent, pathMatch: 'full' },
  //spell print view
  { path:'spells/print', component: SpellPrintComponent, pathMatch: 'full' },
  //spell list
  { path:'spells', component: SpellListComponent, pathMatch: 'full' },
  //homepage
  { path: '', redirectTo: 'spells', pathMatch: 'full'},
  //default
  { path: '**', redirectTo: 'spells' },
];

export const routingComponents = [
  HomeComponent,
  SpellListComponent,
  SpellPrintComponent,
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
