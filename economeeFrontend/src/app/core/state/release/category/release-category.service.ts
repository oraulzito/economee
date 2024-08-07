import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ID, setLoading} from '@datorama/akita';
import {UiService} from '../../ui/ui.service';
import {throwError} from "rxjs";
import {catchError, shareReplay, tap} from "rxjs/operators";
import {ReleaseCategoryStore} from "./release-category.store";
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
    return this.http.get<ReleaseCategory[]>('/api/releaseCategory/', this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.releaseCategoryStore),
      tap(entities => this.releaseCategoryStore.set(entities)),
      catchError(error => throwError(error)),
    );
  }

  // tslint:disable-next-line:typedef
  add(body) {
    return this.http.post<ReleaseCategory>('/api/releaseCategory/', body, this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.releaseCategoryStore),
      tap(entities => this.releaseCategoryStore.add(entities)),
      catchError(error => throwError(error)),
    );
  }

  // tslint:disable-next-line:typedef
  update(id, body) {
    return this.http.patch<ReleaseCategory>('/api/releaseCategory/' + id + '/', body, this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.releaseCategoryStore),
      tap(entities => this.releaseCategoryStore.update(id, entities)),
      catchError(error => throwError(error)),
    );
  }

  // tslint:disable-next-line:typedef
  remove(id: ID) {
    return this.http.delete<number>('/api/releaseCategory/' + id + '/', this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.releaseCategoryStore),
      tap(entities => this.releaseCategoryStore.remove(id)),
      catchError(error => throwError(error)),
    );
  }

}
