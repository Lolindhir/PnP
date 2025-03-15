import { Component } from '@angular/core';
import { CampaignInfo } from '@shared/models/campaign-info.model';


@Component({
  selector: 'app-campaigns-home',
  templateUrl: './campaigns-home.component.html',
  styleUrls: ['../app.component.scss', './campaigns-home.component.scss'],
})
export class CampaignsHomeComponent {

  campaigns: CampaignInfo[] = [];

  constructor() { } 
  
    ngOnInit(): void {

      this.campaigns = CampaignInfo.getCampaignInfo();

    }

}
