import {Injectable} from '@angular/core';
import {QueryEntity} from '@datorama/akita';
import {ReleaseState, ReleaseStore} from './release.store';
import {CardQuery} from "../card/card.query";

@Injectable({providedIn: 'root'})
export class ReleaseQuery extends QueryEntity<ReleaseState> {

  constructor(
    protected store: ReleaseStore,
    protected cardQuery: CardQuery
  ) {
    super(store);
  }

}
