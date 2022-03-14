import {Component, OnInit} from '@angular/core';
import {AccountQuery} from "../../../core/state/account/account.query";
import {TimelineService} from "../../../core/state/graphics/timeline/timeline.service";
import {TimelineQuery} from "../../../core/state/graphics/timeline/timeline.query";


@Component({
  selector: 'app-graphic-timeline',
  templateUrl: './graphic-timeline.component.html',
  styleUrls: ['./graphic-timeline.component.less']
})
export class GraphicTimelineComponent implements OnInit {
  graph = {
    data: [],
    layout: {}
  };
  date_reference: string[];
  total_expenses: number[];
  total_incomes: number[];

  constructor(
    private timelineService: TimelineService,
    private timelineQuery: TimelineQuery,
    private accountQuery: AccountQuery,
  ) {
  }

  ngOnInit() {
    this.accountQuery.selectActive().subscribe(
      a => {
        if (a)
          this.timelineService.get().subscribe()
      }
    );
  }

  constructGraphic() {
    this.timelineQuery.selectAll().subscribe(
      (values) => {
        values.map(value => {
          this.date_reference.push(value.date_reference);
          this.total_expenses.push(value.total_expenes);
          this.total_incomes.push(value.total_incomes);
        });

        let trace1 = {
          x: this.date_reference,
          y: this.total_expenses,
          name: "Gastos",
          type: "bar"
        };

        let trace2 = {
          x: this.date_reference,
          y: this.total_incomes,
          name: "Ganhos",
          type: "bar"
        };

        let data = [trace1, trace2];

        let layout = {barmode: "group"};

        this.graph = {
          data,
          layout
        }
      }
    )

  }

}
