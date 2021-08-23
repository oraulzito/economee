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
import {AccountQuery} from '../account/account.query';

@Injectable({providedIn: 'root'})
export class ReleaseService {

  constructor(
    private uiService: UiService,
    private releaseStore: ReleaseStore,
    private balanceQuery: BalanceQuery,
    private accountQuery: AccountQuery,
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
  add(form) {
    // FIXME if the date change it has to change the balance/invoice ID as well
    // FIXME send only changed values
    const body = {
      value: form.value,
      description: form.description,
      date_release: form.date_release,
      is_release_paid: form.is_release_paid,
      category_id: form.category_id,
      type: form.type,
      date_repeat: form.date_release,
      account_id: this.accountQuery.getActiveId()
    };

    return this.http.patch<number>('/api/release/', body, this.uiService.httpHeaderOptions()).pipe(
      tap(entities => {
        if (entities === 1) {
          this.get();
          // this.releaseStore.add(body);
        }
      }),
      shareReplay(1));
  }

  // tslint:disable-next-line:typedef
  update(id, form) {
    // FIXME if the date change it has to change the balance/invoice ID as well
    const body = {
      value: form.value,
      description: form.description,
      date_release: form.date_release,
      is_release_paid: form.is_release_paid,
      category_id: form.category_id,
      type: form.type,
      date_repeat: form.date_release,
      account_id: this.accountQuery.getActiveId()
    };

    return this.http.patch<number>('/api/release/' + id + '/', body, this.uiService.httpHeaderOptions()).pipe(
      tap(entities => {
        if (entities === 1) {
          this.releaseStore.update(id, body);
        }
      }),
      shareReplay(1));
  }

  // tslint:disable-next-line:typedef
  remove(id: ID) {
    return this.http.delete<number>('/api/release/' + id + '/', this.uiService.httpHeaderOptions()).pipe(
      tap(entities => {
        if (entities === 1) {
          this.releaseStore.remove(id);
        }
      }),
      shareReplay(1));
  }

}
