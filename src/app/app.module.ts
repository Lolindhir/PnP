import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input'

import { AppComponent } from './app.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { MainBodyComponent } from './components/main-body/main-body.component';
import { SpellListComponent } from './components/spell-list/spell-list.component';
import { SpellTableFilterPipe } from './components/spell-list/spell-table-filter.pipe';
import { SpellFilterPipe } from './components/spell-list/spell-filter.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    MainBodyComponent,
    SpellListComponent,
    SpellTableFilterPipe,
    SpellFilterPipe
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    FormsModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
