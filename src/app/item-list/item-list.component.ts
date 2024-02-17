//angular imports
import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

//business imports
import { Item } from '@models/item.model';
import { ItemService } from '@services/item.service';


@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ItemListComponent implements OnInit {

  dataSource: MatTableDataSource<Item>;
  items: Item[] = this.itemService.allItems;
  columns = [
    {
      columnDef: 'name',
      class: 'column-bold',
      header: 'Name',
      cell: (item: Item) => `${item.name}`,
    },
    {
      columnDef: 'rarity',
      class: 'column-normal',
      header: 'Rarity',
      cell: (item: Item) => `${item.rarity}`,
    }, 
    {
      columnDef: 'type',
      class: 'column-normal',
      header: 'Type',
      cell: (item: Item) => `${item.type}`,
    },
    {
      columnDef: 'subtype',
      class: 'column-normal',
      header: 'Subtype',
      cell: (item: Item) => `${item.subtype}`,
    },   
    {
      columnDef: 'value',
      class: 'column-normal',
      header: 'Value',
      cell: (item: Item) => `${item.valueDisplay}`,
    },
  ];
  columnsToDisplay = this.columns.map(c => c.columnDef);
  columnsToDisplayWithExpand = ['select', ...this.columnsToDisplay, 'expand'];
  expandedItem: Item | null;
  filterAll: string = "";
  selection = new SelectionModel<Item>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private itemService: ItemService
  ) {
    this.dataSource = new MatTableDataSource(this.items);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter() {
    this.dataSource.filter = this.filterAll.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onFilterCleared() {
    this.filterAll = '';
    this.applyFilter();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Item): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.orderNumber + 1}`;
  }

}
