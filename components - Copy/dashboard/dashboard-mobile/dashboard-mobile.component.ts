import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard-mobile',
  templateUrl: './dashboard-mobile.component.html',
  styleUrls: ['./dashboard-mobile.component.s.less']
})
export class DashboardMobileComponent implements OnInit {
  id = 1;

  constructor() {
  }

  ngOnInit(): void {
  }

  showComponent(id) {
    this.id = id;
  }
}
