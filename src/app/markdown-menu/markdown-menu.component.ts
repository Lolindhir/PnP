import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MarkdownContent, MarkdownNavigationRoute } from '@shared/models/markdown-content.model';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';

@Component({
  selector: 'app-markdown-menu',
  templateUrl: './markdown-menu.component.html',
  styleUrls: ['../app.component.scss', './markdown-menu.component.scss'],
})
export class MarkdownMenuComponent implements OnInit {

  @Input() majorMode: boolean = false;
  @Input() allExpanded: boolean = false;
  @Input() mainMenu: MarkdownContent[] | undefined = undefined;
  @Input() subMenu: MarkdownContent | undefined = undefined;
  @Output() resetMenuEvent = new EventEmitter<void>();

  treeControl = new NestedTreeControl<MarkdownNavigationRoute>(markdown => markdown.children);
  dataSource = new MatTreeNestedDataSource<MarkdownNavigationRoute>();



  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    
    //depending on the subMenu input, set the dataSource to the correct data
    if (this.subMenu != undefined) {
      this.dataSource.data = MarkdownContent.getSingleNavigation(this.subMenu).children;
    }
    else if (this.mainMenu != undefined) {
      this.dataSource.data = MarkdownContent.getAllNavigation(this.mainMenu);
    }
    this.treeControl.dataNodes = this.dataSource.data;
    this.expandActiveNode();

    // Subscribe to the resetTreeEvent
    this.resetMenuEvent.subscribe(() => this.resetTree());
  }

  hasChild = (_: number, route: MarkdownNavigationRoute) => !!route.children && route.children.length > 0;

  navigateTo(route: string): void {  
    // reload the route to ensure same level navigation
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([route]);
    });
  }  

  resetTree(): void {
    //close all nodes
    this.treeControl.dataNodes.forEach(node => {
      this.resetTreeRecursively(node);
    });

    //re-open the active node
    this.expandActiveNode();
  }

  private resetTreeRecursively(node: MarkdownNavigationRoute): void {
    this.treeControl.collapse(node);
    node.children.forEach(child => {
      this.resetTreeRecursively(child);
    });
  }

  expandActiveNode(): void {
    this.treeControl.dataNodes.forEach(node => {
      this.expandActiveNodeRecursively(node);
    });
  }

  private expandActiveNodeRecursively(node: MarkdownNavigationRoute): void {
    
    //check if the node is active
    //if allExpanded ist active, expand all nodes without checking the active node
    if (this.allExpanded || this.isPartOfActiveNode(node.route)) {

      //expand the node
      this.treeControl.expand(node);

      //now check all children recursively
      node.children.forEach(child => {
        this.expandActiveNodeRecursively(child);
      });

    }

  }

  isPartOfActiveNode(path: string): boolean {
    return this.router.url.includes(path);
  }

  isActiveNode(path: string): boolean {
    return this.router.url === path;
  }
}