import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {tap} from 'rxjs/operators';
import {TimelineChart} from './timeline-chart.model';
import {TimelineChartStore} from './timeline-chart.store';
import {AccountQuery} from "../../account/account.query";
import {UiService} from "../../ui/ui.service";

@Injectable({providedIn: 'root'})
export class TimelineChartService {

  constructor(
    private timelineStore: TimelineChartStore,
    private accountQuery: AccountQuery,
    private uiService: UiService,
    private http: HttpClient
  ) {
  }

  get() {
    return this.http.get<TimelineChart[]>('/api/charts/timeline?account_id=' + this.accountQuery.getActiveId(),
      this.uiService.httpHeaderOptions()).pipe(
      tap(entities => {
        this.timelineStore.set(entities);
      }));
  }

}
