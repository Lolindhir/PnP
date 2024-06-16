//angular imports
import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

//business imports
import { Feat } from '@models/feat.model';
import { FeatService } from '@services/feat.service';
import { StorageService } from '@shared/services/storage.service';


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
  columnsToDisplay = ['explanation'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedFeat: Feat | null;
  filterAll: string = "";
  defaultSort: string = "category";

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private featService: FeatService,
    private storageService: StorageService
  ) {
   
    //load settings
    this.loadSettings()

    //set data source
    this.dataSource = new MatTableDataSource(this.feats);

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
  }

  loadSettings(){
    this.defaultSort = this.storageService.loadLocal('FeatsSortBy').length > 0  ? this.storageService.loadLocal('FeatsSortBy') : this.defaultSort;
  }  

  applyFilter() {
    this.dataSource.filter = this.filterAll.trim().toLowerCase();
  }

  onFilterCleared() {
    this.filterAll = '';
    this.applyFilter();
  }

  onSortChanged(event: MatButtonToggleChange){
    this.sortFeats(event.value);
  }

  sortFeats(sortArgument: string){
    
    //set and do sort
    switch(sortArgument) { 
      case "name": { 
        this.defaultSort = "name";
        this.feats.sort(Feat.compareName);
        break; 
      } 
      case "category": { 
        this.defaultSort = "category";
        this.feats.sort(Feat.compareBasic);
        break; 
      } 
      default: { 
        this.defaultSort = "category";
        this.feats.sort(Feat.compareBasic); 
        break; 
      } 
    }

    //reset data source
    this.dataSource = new MatTableDataSource(this.feats);

    //save settings
    this.saveSettings();
  }
  

}
