//angular imports
import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ArrayUtilities } from '@utilities/array.utilities';

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
  selectedAttributes: string[] = new Array();
  optionsAttribute: string[] = new Array();
  onlyStarter: boolean = false;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private featService: FeatService,
    private storageService: StorageService
  ) {
   
    //load settings
    this.loadSettings()

    //get categories
    this.optionsCategory = Feat.getCategoryTexts();
    //get attributes
    this.optionsAttribute.push('Strength 13+');
    this.optionsAttribute.push('Dexterity 13+');
    this.optionsAttribute.push('Constitution 13+');
    this.optionsAttribute.push('Intelligence 13+');
    this.optionsAttribute.push('Wisdom 13+');
    this.optionsAttribute.push('Charisma 13+');

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
    this.storageService.storeLocal('FeatsSelectedAttributes', JSON.stringify(this.selectedAttributes, null, 2));
  }

  loadSettings(){
    this.defaultSort = this.storageService.loadLocal('FeatsSortBy').length > 0  ? this.storageService.loadLocal('FeatsSortBy') : this.defaultSort;

    //get saved selected category and attributes storage
    try {
      this.selectedCategories = JSON.parse(this.storageService.loadLocal('FeatsSelectedCategories'));
      this.selectedAttributes = JSON.parse(this.storageService.loadLocal('FeatsSelectedAttributes'));
    }
    catch (exception_var){
      console.log('Cannot load selectedCategories or selectedAttributes!');
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

  onAllFiltersRemoved() {
    this.selectedCategories = new Array();
    this.selectedAttributes = new Array();
    this.saveSettings();
    this.filterFeats();
  }

  onCategoryFilterRemoved(category: string){
    ArrayUtilities.removeFromArray(this.selectedCategories, category);
    var tempArray = this.selectedCategories;
    this.selectedCategories = new Array();
    tempArray.forEach(tempEntry => {
      this.selectedCategories.push(tempEntry);
    })
    this.saveSettings();
    this.filterFeats();
  }

  onAttributeFilterRemoved(attribute: string){
    ArrayUtilities.removeFromArray(this.selectedAttributes, attribute);
    var tempArray = this.selectedAttributes;
    this.selectedAttributes = new Array();
    tempArray.forEach(tempEntry => {
      this.selectedAttributes.push(tempEntry);
    })
    this.saveSettings();
    this.filterFeats();
  }

  onFilterChanged() {
    this.saveSettings();
    this.filterFeats();
  }

  onSortChanged(event: MatButtonToggleChange){
    this.sortFeats(event.value);
  }

  filterFeats(){

    //reset shown array
    this.featsShown = new Array();

    //push every feat:
    //matching the categories if selected categories aren't empty
    //matching the attributes if selected attributes aren't empty
    //matching starter attribute, if true
    this.feats.forEach(feat => {
      
      if(this.onlyStarter && !feat.starter){
        return;
      }

      if(this.selectedCategories.length > 0 && !this.selectedCategories.includes(feat.categoryText)){
        return;
      }

      if(this.selectedAttributes.length > 0 && 
        (
          feat.prerequisite.toLowerCase().includes('strength')
        ||feat.prerequisite.toLowerCase().includes('dexterity')
        ||feat.prerequisite.toLowerCase().includes('constitution')
        ||feat.prerequisite.toLowerCase().includes('intelligence')
        ||feat.prerequisite.toLowerCase().includes('wisdom')
        ||feat.prerequisite.toLowerCase().includes('charisma')
        )
      ){
        
        var dontPush: boolean = true;
        
        if((feat.prerequisite.toLowerCase().includes('strength') && this.selectedAttributes.includes('Strength 13+'))) dontPush = false;
        if((feat.prerequisite.toLowerCase().includes('dexterity') && this.selectedAttributes.includes('Dexterity 13+'))) dontPush = false;
        if((feat.prerequisite.toLowerCase().includes('constitution') && this.selectedAttributes.includes('Constitution 13+'))) dontPush = false;
        if((feat.prerequisite.toLowerCase().includes('intelligence') && this.selectedAttributes.includes('Intelligence 13+'))) dontPush = false;
        if((feat.prerequisite.toLowerCase().includes('wisdom') && this.selectedAttributes.includes('Wisdom 13+'))) dontPush = false;
        if((feat.prerequisite.toLowerCase().includes('charisma') && this.selectedAttributes.includes('Charisma 13+'))) dontPush = false;        

        if(dontPush) return;
      }

      this.featsShown.push(feat);
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
