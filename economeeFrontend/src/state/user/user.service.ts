import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { tap } from 'rxjs/operators';
import { User } from './user.model';
import { UserStore } from './user.store';
import {UiService} from "../ui/ui.service";

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(
    private uiService: UiService,
    private userStore: UserStore,
    private http: HttpClient
  ) {
  }


  get() {
    return this.http.get<User[]>('/api/user/', this.uiService.httpHeaderOptions()).pipe(tap(entities => {
      this.userStore.set(entities);
    }));
  }

  add(user: User) {
    this.userStore.add(user);
  }

  update(id, user: Partial<User>) {
    this.userStore.update(id, user);
  }

  remove(id: ID) {
    this.userStore.remove(id);
  }

}
