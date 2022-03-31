import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { MatDividerModule} from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select'; 
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ScrollingModule } from '@angular/cdk/scrolling'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from './app.component';
import { MainHeaderComponent } from '@components/main-header/main-header.component';
import { MainBodyComponent } from '@components/main-body/main-body.component';
import { SpellListComponent } from '@components/spell-list/spell-list.component';
import { SpellFilterPipe } from '@pipes/spell-filter.pipe';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { FeatListComponent } from './feat-list/feat-list.component';

@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    MainBodyComponent,
    SpellListComponent,
    SpellFilterPipe,
    HomeComponent,
    FeatListComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatIconModule,
    MatToolbarModule,
    MatChipsModule,
    MatSelectModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTooltipModule,
    ScrollingModule,
    AppRoutingModule,
  ],
  providers: [
    CookieService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
