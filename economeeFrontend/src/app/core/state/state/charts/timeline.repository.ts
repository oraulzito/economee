import { createStore, withProps } from '@ngneat/elf';
import { withEntities, selectAllEntities, setEntities, addEntities, updateEntities, deleteEntities, withUIEntities, withActiveId, selectActiveEntity, setActiveId, withActiveIds, selectActiveEntities, toggleActiveIds } from '@ngneat/elf-entities';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export interface TimelineUI {
  id: number;
}

export interface Timeline {
  id: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TimelineProps {
}

@Injectable({ providedIn: 'root' })
export class TimelineRepository {
  activeTimeline$: Observable<Timeline[]>;
  activeTimeline$: Observable<Timeline | undefined>;
  timeline$: Observable<Timeline[]>;

  private store;

  constructor() {
    this.store = this.createStore();
    this.timeline$ = this.store.pipe(selectAllEntities());
    this.activeTimeline$ = this.store.pipe(selectActiveEntity());
    this.activeTimeline$ = this.store.pipe(selectActiveEntities());
  }

  setTimeline(timeline: Timeline[]) {
    this.store.update(setEntities(timeline));
  }

  addTimeline(timeline: Timeline) {
    this.store.update(addEntities(timeline));
  }

  updateTimeline(id: Timeline['id'], timeline: Partial<Timeline>) {
    this.store.update(updateEntities(id, timeline));
  }

  deleteTimeline(id: Timeline['id']) {
    this.store.update(deleteEntities(id));
  }

  setActiveId(id: Timeline['id']) {
    this.store.update(setActiveId(id));
  }

  toggleActiveIds(ids: Array<Timeline['id']>) {
    this.store.update(toggleActiveIds(ids));
  }

  private createStore(): typeof store {
    const store = createStore({ name: 'timeline' }, withProps<TimelineProps>({}), withEntities<Timeline, 'id'>({ idKey: 'id' }), withUIEntities<TimelineUI, 'id'>({ idKey: 'id' }), withActiveId(), withActiveIds());

    return store;
  }
}
