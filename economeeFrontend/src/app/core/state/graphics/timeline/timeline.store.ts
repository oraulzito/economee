import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Timeline } from './timeline.model';

export interface TimelineState extends EntityState<Timeline> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'timeline' })
export class TimelineStore extends EntityStore<TimelineState> {

  constructor() {
    super();
  }

}
