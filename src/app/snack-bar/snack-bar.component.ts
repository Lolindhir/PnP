import { Component, EventEmitter, Inject } from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

export interface SnackBarData{
  text: string,
  action: boolean,
  actionText: string,
  dismiss: boolean,
  dismissText: string,
}

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent {

  onAction = new EventEmitter();
  onDismiss = new EventEmitter();

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData) { }

  onActionClick() {
    this.onAction.emit();
  }

  onDismissClick() {
    this.onDismiss.emit();
  }
}
