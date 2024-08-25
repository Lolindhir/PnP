import { NgModule, SecurityContext } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, FormControl } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FileSaverModule } from 'ngx-filesaver';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule} from '@angular/material/input';
import { MatDividerModule} from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select'; 
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ScrollingModule } from '@angular/cdk/scrolling'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from './app.component';
import { MainHeaderComponent } from '@components/main-header/main-header.component';
import { SpellListComponent, SpellListSettingsDialog, SpellListCharacterDialog, SpellListBlueprintDialog, SpellListInfoDialog } from '@components/spell-list/spell-list.component';
import { SpellPrintComponent } from '@components/spell-print/spell-print.component';
import { SpellDetailComponent } from '@components/spell-detail/spell-detail.component';
import { RulesHomeComponent } from './rules-home/rules-home.component';
import { RuleArticleComponent } from './rule-article/rule-article.component';
import { SpellFilterPipe } from '@pipes/spell-filter.pipe';
import { ItemListComponent } from './item-list/item-list.component';
import { StorageService } from '@services/storage.service';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { FeatListComponent } from './feat-list/feat-list.component';
import { SnackBarComponent } from './snack-bar/snack-bar.component';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    SpellListComponent,
    SpellListSettingsDialog,
    SpellListCharacterDialog,
    SpellListBlueprintDialog,
    SpellListInfoDialog,
    SpellPrintComponent,
    SpellDetailComponent,
    RulesHomeComponent,
    RuleArticleComponent,
    SpellFilterPipe,
    ItemListComponent,
    HomeComponent,
    FeatListComponent,
    SnackBarComponent,
    ItemListComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    FileSaverModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatDividerModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatChipsModule,
    MatSelectModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatRadioModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule,
    MatTabsModule,
    MatCardModule,
    MatListModule,
    ScrollingModule,
    AppRoutingModule,
    MarkdownModule.forRoot({ markedOptions: {
      provide: MarkedOptions,
      useValue: {
        gfm: true,
        breaks: true
      }
    } }),
  ],
  providers: [
    CookieService,
    StorageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
