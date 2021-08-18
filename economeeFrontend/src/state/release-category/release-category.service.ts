import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { tap } from 'rxjs/operators';
import { ReleaseCategory } from './release-category.model';
import { ReleaseCategoryStore } from './release-category.store';

@Injectable({ providedIn: 'root' })
export class ReleaseCategoryService {

  constructor(private releaseCategoryStore: ReleaseCategoryStore, private http: HttpClient) {
  }


  get() {
    return this.http.get<ReleaseCategory[]>('https://api.com').pipe(tap(entities => {
      this.releaseCategoryStore.set(entities);
    }));
  }

  add(releaseCategory: ReleaseCategory) {
    this.releaseCategoryStore.add(releaseCategory);
  }

  update(id, releaseCategory: Partial<ReleaseCategory>) {
    this.releaseCategoryStore.update(id, releaseCategory);
  }

  remove(id: ID) {
    this.releaseCategoryStore.remove(id);
  }

}
