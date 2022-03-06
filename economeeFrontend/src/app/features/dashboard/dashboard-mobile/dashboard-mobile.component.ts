import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard-mobile',
  templateUrl: './dashboard-mobile.component.html',
  styleUrls: ['./dashboard-mobile.component.less']
})
export class DashboardMobileComponent implements OnInit {
  @Input()
  totalAvailableValue: number;
  @Input()
  totalExpensesValue: number;
  @Input()
  totalIncomesValue: number;

  constructor() {
  }

  ngOnInit(): void {
  }

}
