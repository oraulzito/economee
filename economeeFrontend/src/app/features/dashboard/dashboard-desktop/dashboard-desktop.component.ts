import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard-desktop',
  templateUrl: './dashboard-desktop.component.html',
  styleUrls: ['./dashboard-desktop.component.less']
})
export class DashboardDesktopComponent implements OnInit {
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
