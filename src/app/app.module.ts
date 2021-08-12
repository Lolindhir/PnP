import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { MainHeaderComponent } from './main-header/main-header.component';

@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent    
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
