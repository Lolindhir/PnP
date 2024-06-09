//angular imports
import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

//business imports
import { Feat } from '@models/feat.model';
import { FeatService } from '@services/feat.service';

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
  // columns = [
  //   {
  //     columnDef: 'name',
  //     header: 'Name',
  //     class: '',
  //     cell: (feat: Feat) => `${feat.name}`,
  //   },
  //   {
  //     columnDef: 'category',
  //     header: 'Category',
  //     class: '',
  //     cell: (feat: Feat) => `${feat.categoryText}`,
  //   }, 
  //   {
  //     columnDef: 'prerequisite',
  //     header: 'Prerequisite',
  //     class: '',
  //     cell: (feat: Feat) => `${feat.prerequisite}`,
  //   },
  //   {
  //     columnDef: 'explanation',
  //     header: 'Explanation',
  //     class: '',
  //     cell: (feat: Feat) => `${feat.explanation}`,
  //   },   
  // ];
  columnsToDisplay = ['name', 'explanation'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedFeat: Feat | null;
  filterAll: string = "";

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private featService: FeatService
  ) {
    this.dataSource = new MatTableDataSource(this.feats);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter() {
    this.dataSource.filter = this.filterAll.trim().toLowerCase();
  }

  onFilterCleared() {
    this.filterAll = '';
    this.applyFilter();
  }

}
