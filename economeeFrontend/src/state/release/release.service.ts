import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ID} from '@datorama/akita';
import {shareReplay, tap} from 'rxjs/operators';
import {Release} from './release.model';
import {ReleaseStore} from './release.store';
import {ReleaseQuery} from './release.query';
import {UiService} from '../ui/ui.service';
import {BalanceQuery} from '../balance/balance.query';
import {InvoiceQuery} from '../invoice/invoice.query';

@Injectable({providedIn: 'root'})
export class ReleaseService {

  constructor(
    private uiService: UiService,
    private releaseStore: ReleaseStore,
    private balanceQuery: BalanceQuery,
    private invoiceQuery: InvoiceQuery,
    private releaseQuery: ReleaseQuery,
    private http: HttpClient
  ) {
  }

  // tslint:disable-next-line:typedef
  get() {
    this.releaseStore.setLoading(true);
    return this.http.get<Release[]>('/api/release/', this.uiService.httpHeaderOptions()).pipe(tap(entities => {
      this.releaseStore.set(entities);
      this.releaseStore.setLoading(false);
    }));
  }

  // tslint:disable-next-line:typedef
  getBalanceReleases() {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Release[]>('/api/release?balance_id=' + this.balanceQuery.getActive(), this.uiService.httpHeaderOptions()).pipe(tap(entities => {
      this.releaseStore.set(entities);
    }));
  }

  // tslint:disable-next-line:typedef
  getInvoiceReleases() {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Release[]>('/api/release?invoice_id=' + this.invoiceQuery.getActive(), this.uiService.httpHeaderOptions()).pipe(tap(entities => {
        this.releaseStore.set(entities);
      }),
      shareReplay(1));
  }

  // tslint:disable-next-line:typedef
  add(release: Release) {
    this.releaseStore.add(release);
  }

  // tslint:disable-next-line:typedef
  update(id, release: Partial<Release>) {
    this.releaseStore.update(id, release);
  }

  // tslint:disable-next-line:typedef
  remove(id: ID) {
    this.releaseStore.remove(id);
  }



}
