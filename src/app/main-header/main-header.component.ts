import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss', '../app.component.scss']
})
export class MainHeaderComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ){ }

  ngOnInit(): void {
  }

  isCurrentRouteHome(): boolean {
    if (this.router.url.includes('/home')) {
      return true;
    }
    return false;
  }

}
