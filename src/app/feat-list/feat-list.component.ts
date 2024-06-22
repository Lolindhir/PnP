//angular imports
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

//business imports
import { Feat } from '@models/feat.model';
import { FeatService } from '@services/feat.service';
import { StorageService } from '@shared/services/storage.service';
import { FeatCategory } from '@shared/models/feat-category.model';


@Component({
  selector: 'app-feat-list',
  templateUrl: './feat-list.component.html',
  styleUrls: ['../app.component.scss', './feat-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FeatListComponent implements OnInit {

  dataSource: MatTableDataSource<Feat>;
  feats: Feat[] = this.featService.allFeats;
  featsShown: Feat[] = new Array();
  columnsToDisplay = ['explanation'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedFeat: Feat | null;
  filterAll: string = "";
  defaultSort: string = "category";

  //filter
  selectedCategories: string[] = new Array();
  optionsCategory: string[] = new Array();

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private featService: FeatService,
    private storageService: StorageService
  ) {
   
    //load settings
    this.loadSettings()

    //get categories
    this.optionsCategory = Feat.getCategoryTexts();

    //set data source
    this.featsShown = this.feats;
    this.dataSource = new MatTableDataSource(this.featsShown);

    //filter data source
    this.filterFeats();

    //sort data source
    this.sortFeats(this.defaultSort);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  saveSettings(): void{ 
    this.storageService.storeLocal('FeatsSortBy', this.defaultSort);
    this.storageService.storeLocal('FeatsSelectedCategories', JSON.stringify(this.selectedCategories, null, 2));
  }

  loadSettings(){
    this.defaultSort = this.storageService.loadLocal('FeatsSortBy').length > 0  ? this.storageService.loadLocal('FeatsSortBy') : this.defaultSort;

    //get saved selected category storage
    try {
      this.selectedCategories = JSON.parse(this.storageService.loadLocal('FeatsSelectedCategories'));
    }
    catch (exception_var){
      console.log('Cannot load selectedCategories');
      return;
    }
  }  

  applyFilter() {
    this.dataSource.filter = this.filterAll.trim().toLowerCase();
  }

  onFilterCleared() {
    this.filterAll = '';
    this.applyFilter();
  }

  onAllCategoryFiltersRemoved() {
    this.selectedCategories = new Array();
    this.saveSettings();
    this.filterFeats();
  }

  onCategoryFilterChanged() {
    this.saveSettings();
    this.filterFeats();
  }

  onSortChanged(event: MatButtonToggleChange){
    this.sortFeats(event.value);
  }

  filterFeats(){

    //reset shown array
    this.featsShown = new Array();

    //push every feat matching the categories if selected categories aren't empty
    this.feats.forEach(feat => {
      if(this.selectedCategories.length === 0 || this.selectedCategories.includes(feat.categoryText)){
        this.featsShown.push(feat);
      }
    });

    //reset data source
    this.dataSource = new MatTableDataSource(this.featsShown);
  }

  sortFeats(sortArgument: string){
    
    //set and do sort
    switch(sortArgument) { 
      case "name": { 
        this.defaultSort = "name";
        this.featsShown.sort(Feat.compareName);
        break; 
      } 
      case "category": { 
        this.defaultSort = "category";
        this.featsShown.sort(Feat.compareBasic);
        break; 
      } 
      default: { 
        this.defaultSort = "category";
        this.featsShown.sort(Feat.compareBasic); 
        break; 
      } 
    }

    //reset data source
    this.dataSource = new MatTableDataSource(this.featsShown);

    //save settings
    this.saveSettings();
  }
  

}
