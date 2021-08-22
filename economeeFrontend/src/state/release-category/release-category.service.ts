import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import {shareReplay, tap} from 'rxjs/operators';
import { ReleaseCategory } from './release-category.model';
import { ReleaseCategoryStore } from './release-category.store';
import {UiService} from "../ui/ui.service";

@Injectable({ providedIn: 'root' })
export class ReleaseCategoryService {

  constructor(
    private uiService: UiService,
    private releaseCategoryStore: ReleaseCategoryStore,
    private http: HttpClient
  ) {
  }

  // tslint:disable-next-line:typedef
  get() {
    return this.http.get<ReleaseCategory[]>('/api/releaseCategory', this.uiService.httpHeaderOptions()).pipe(tap(entities => {
      this.releaseCategoryStore.set(entities);
    }),
      shareReplay(1));
  }

  // tslint:disable-next-line:typedef
  add(releaseCategory: ReleaseCategory) {
    this.releaseCategoryStore.add(releaseCategory);
  }

  // tslint:disable-next-line:typedef
  update(id, releaseCategory: Partial<ReleaseCategory>) {
    this.releaseCategoryStore.update(id, releaseCategory);
  }

  // tslint:disable-next-line:typedef
  remove(id: ID) {
    this.releaseCategoryStore.remove(id);
  }

}
