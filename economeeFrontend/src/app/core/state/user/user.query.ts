import {Injectable} from '@angular/core';
import {Query} from '@datorama/akita';
import {UserState, UserStore} from './user.store';

@Injectable({providedIn: 'root'})
export class UserQuery extends Query<UserState> {
  userId$ = this.select(({user}) => user.id);

  constructor(protected store: UserStore) {
    super(store);
  }

}
