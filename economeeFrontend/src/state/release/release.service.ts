import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { tap } from 'rxjs/operators';
import { Release } from './release.model';
import { ReleaseStore } from './release.store';

@Injectable({ providedIn: 'root' })
export class ReleaseService {

  constructor(private releaseStore: ReleaseStore, private http: HttpClient) {
  }


  get() {
    return this.http.get<Release[]>('https://api.com').pipe(tap(entities => {
      this.releaseStore.set(entities);
    }));
  }

  add(release: Release) {
    this.releaseStore.add(release);
  }

  update(id, release: Partial<Release>) {
    this.releaseStore.update(id, release);
  }

  remove(id: ID) {
    this.releaseStore.remove(id);
  }

}
