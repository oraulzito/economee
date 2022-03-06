import {Component, OnInit} from '@angular/core';
import {MonthlyGraphicService} from "../../../core/state/graphics/monthly/monthly-graphic.service";
import {MonthlyGraphicQuery} from "../../../core/state/graphics/monthly/monthly-graphic.query";
import {AccountQuery} from "../../../core/state/account/account.query";

@Component({
  selector: 'app-graphic-timeline',
  templateUrl: './graphic-timeline.component.html',
  styleUrls: ['./graphic-timeline.component.less']
})
export class GraphicTimelineComponent implements OnInit {

  constructor(
    private monthlyGraphicService: MonthlyGraphicService,
    private monthlyGraphicQuery: MonthlyGraphicQuery,
    private accountQuery: AccountQuery,
  ) {
  }

  ngOnInit() {
    this.accountQuery.selectActive().subscribe(
      (a) => {},
      () => {
      },
      () => {
        this.monthlyGraphicService.getMonthlyGraphic().subscribe();
      },
    );
  }

}
