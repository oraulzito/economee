import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {tap} from 'rxjs/operators';
import {Timeline} from './timeline.model';
import {TimelineStore} from './timeline.store';
import {AccountQuery} from "../../account/account.query";
import {UiService} from "../../ui/ui.service";

@Injectable({providedIn: 'root'})
export class TimelineService {

  constructor(
    private timelineStore: TimelineStore,
    private accountQuery: AccountQuery,
    private uiService: UiService,
    private http: HttpClient
  ) {
  }

  get() {
    return this.http.get<Timeline[]>('/api/release/graphics_timeline?account_id=' + this.accountQuery.getActiveId(),
      this.uiService.httpHeaderOptions()).pipe(
      tap(entities => {
        this.timelineStore.set(entities);
      }));
  }

}
