import { Component, NgModule, OnInit } from '@angular/core';
import { Spell } from '../../models/spell.model';
import studentsData from '../../students.json'; 

@Component({
  selector: 'app-spell-list',
  templateUrl: './spell-list.component.html',
  styleUrls: ['./spell-list.component.scss']
})
export class SpellListComponent implements OnInit {

  filterName: String = '';
  filterGender: String = '';

  students: Spell[] = studentsData;

  constructor() {

  }

  ngOnInit(): void {

  }

  // onKey(event: any) {
  //   console.log(this.filter);  
  // }
  
}
