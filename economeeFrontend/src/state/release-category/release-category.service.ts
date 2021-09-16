import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ID} from '@datorama/akita';
import {ReleaseCategoryStore} from './release-category.store';
import {UiService} from '../ui/ui.service';
import {ReleaseCategory} from "./release-category.model";

@Injectable({providedIn: 'root'})
export class ReleaseCategoryService {

  constructor(
    private uiService: UiService,
    private releaseCategoryStore: ReleaseCategoryStore,
    private http: HttpClient
  ) {
  }

  // tslint:disable-next-line:typedef
  get() {
    this.releaseCategoryStore.setLoading(true);
    return this.http.get<ReleaseCategory[]>('/api/releaseCategory/', this.uiService.httpHeaderOptions()).subscribe(
      entities => this.releaseCategoryStore.set(entities),
      error => this.releaseCategoryStore.setError(error),
      () => this.releaseCategoryStore.setLoading(false)
    );
  }

  // tslint:disable-next-line:typedef
  add(form) {
    this.releaseCategoryStore.setLoading(true);

    const body = {
      name: form.name,
      color: form.color,
    };

    return this.http.post<ReleaseCategory>('/api/releaseCategory/', body, this.uiService.httpHeaderOptions()).subscribe(
      entities => this.releaseCategoryStore.add(entities),
      error => this.releaseCategoryStore.setError(error),
      () => this.releaseCategoryStore.setLoading(false),
    );
  }

  // tslint:disable-next-line:typedef
  update(id, form) {
    this.releaseCategoryStore.setLoading(true);

    const body = {
      name: form.name,
      color: form.color,
    };

    return this.http.patch<ReleaseCategory>('/api/releaseCategory/' + id + '/', body, this.uiService.httpHeaderOptions()).subscribe(
      entities => this.releaseCategoryStore.update(id, entities),
      error => this.releaseCategoryStore.setError(error),
      () => this.releaseCategoryStore.setLoading(false),
    );
  }

  // tslint:disable-next-line:typedef
  remove(id: ID) {
    this.releaseCategoryStore.setLoading(true);

    return this.http.delete<number>('/api/releaseCategory/' + id + '/', this.uiService.httpHeaderOptions()).subscribe(
      entities => entities === 1 ? this.releaseCategoryStore.remove(id) : this.releaseCategoryStore.setError("Not removed"),
      error => this.releaseCategoryStore.setError(error),
      () => this.releaseCategoryStore.setLoading(false),
    );
  }

}
