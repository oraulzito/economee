import {Injectable} from '@angular/core';
import {EntityState, Store, StoreConfig} from '@datorama/akita';
import {Session} from './session.model';

export interface SessionState extends EntityState<Session> {
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'session', idKey: 'key'})
export class SessionStore extends Store<SessionState> {

  constructor() {
    super({
      key: ''
    });
  }

}
