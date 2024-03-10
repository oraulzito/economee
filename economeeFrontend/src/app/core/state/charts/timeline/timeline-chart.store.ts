import {Injectable} from '@angular/core';
import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {TimelineChart} from './timeline-chart.model';

export interface TimelineChartState extends EntityState<TimelineChart> {
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'timeline', idKey: 'reference_date'})
export class TimelineChartStore extends EntityStore<TimelineChartState> {

  constructor() {
    super();
  }

}
