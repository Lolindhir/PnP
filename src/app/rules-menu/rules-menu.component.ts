import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { RulesContent, RulesNavigationRoute } from '@shared/models/rules-content.model';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';


@Component({
  selector: 'app-rules-menu',
  templateUrl: './rules-menu.component.html',
  styleUrls: ['../app.component.scss', './rules-menu.component.scss'],
})
export class RulesMenuComponent implements OnInit {
  treeControl = new NestedTreeControl<RulesNavigationRoute>(rule => rule.children);
  dataSource = new MatTreeNestedDataSource<RulesNavigationRoute>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    
    this.dataSource.data = RulesContent.getAllNavigation();
    
  }

  hasChild = (_: number, route: RulesNavigationRoute) => !!route.children && route.children.length > 0;

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

}