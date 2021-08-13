import { Component, NgModule, OnInit } from '@angular/core';
import studentsData from '../../students.json'; 


interface Student {  
  id: Number;  
  name: String;  
  email: String;  
  gender: String;  
} 

@Component({
  selector: 'app-spell-list',
  templateUrl: './spell-list.component.html',
  styleUrls: ['./spell-list.component.scss']
})
export class SpellListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

  gender: string = '';
  name: string = '';

  names: string[] = ['Jack', 'Peter'];

  students: any[] = studentsData;
}
