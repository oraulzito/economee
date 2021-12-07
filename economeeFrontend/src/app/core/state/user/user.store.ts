import {Injectable} from '@angular/core';
import {EntityState, Store, StoreConfig} from '@datorama/akita';
import {User} from './user.model';

export interface UserState extends EntityState<User> {
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'user', idKey: 'username'})
export class UserStore extends Store<UserState> {

  constructor() {
    super(
      {
        id: '',
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        dob: '',
        gender: '',
        photo: '',
      }
    );
  }

}
