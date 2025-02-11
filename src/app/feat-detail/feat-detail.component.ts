import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

//business imports
import { Feat } from '@models/feat.model';
import { FeatService } from '@services/feat.service';
import { FeatCategory } from '@shared/models/feat-category.model';



@Component({
  selector: 'app-feat-detail',
  templateUrl: './feat-detail.component.html',
  styleUrls: ['../app.component.scss', './feat-detail.component.scss', '../feat-list/feat-list.component.scss']
})
export class FeatDetailComponent {

  tooltipDelay = 500;
  featLoaded: boolean;
  feat: Feat | undefined;
  featIdName: string;

  constructor(
    private route: ActivatedRoute,
    private featService: FeatService,
    private router: Router // Inject the Router
  ) {
    
    //get
    this.route.params.subscribe(params => {
      var featId: string = params['id'];
      this.featIdName = decodeURI(featId);
      this.feat = this.featService.getFeatById(featId);
      this.featLoaded = this.feat != undefined;
    });

    //if spell couldn't be loaded, go to spell list page
    // If spell couldn't be loaded, navigate to spell list page
    if (!this.featLoaded) {
      var goToRoute: string = '/feats';

      // reload the route to ensure same level navigation
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([goToRoute]);
      });

    }
  }


}
