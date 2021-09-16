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
import {CardQuery} from '../card/card.query';

@Injectable({providedIn: 'root'})
export class ReleaseService {

  constructor(
    private uiService: UiService,
    private releaseStore: ReleaseStore,
    private cardQuery: CardQuery,
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
    return this.http.get<Release[]>('/api/release/', this.uiService.httpHeaderOptions()).subscribe(
      releases => this.releaseStore.set(releases),
      error => this.releaseStore.setError(error),
      () => this.releaseStore.setLoading(false),
    );
  }

  // tslint:disable-next-line:typedef
  getBalanceReleases() {
    this.releaseStore.setLoading(true);

    return this.http.get<Release[]>('/api/release/balance?balance_id=' + this.balanceQuery.getActive(),
      this.uiService.httpHeaderOptions()).subscribe(
      entities => this.releaseStore.set(entities),
      error => this.releaseStore.setError(error),
      () => this.releaseStore.setLoading(false),
    );
  }

  // tslint:disable-next-line:typedef
  getInvoiceReleases() {
    this.releaseStore.setLoading(true);

    return this.http.get<Release[]>('/api/release/invoice?invoice_id=' + this.invoiceQuery.getActive(),
      this.uiService.httpHeaderOptions()).subscribe(
      entities => this.releaseStore.set(entities),
      error => this.releaseStore.setError(error),
      () => this.releaseStore.setLoading(false),
    );
  }

  // tslint:disable-next-line:typedef
  getMonthReleases() {
    this.releaseStore.setLoading(true);

    return this.http.get<Release[]>('/api/release/date_reference?date_reference=' + this.balanceQuery.getActive().date_reference,
      this.uiService.httpHeaderOptions()).subscribe(
      entities => this.releaseStore.set(entities),
      error => this.releaseStore.setError(error),
      () => this.releaseStore.setLoading(false),
    );
  }

  // tslint:disable-next-line:typedef
  add(form, card) {
    this.releaseStore.setLoading(true);

    // FIXME if the date change it has to change the balance/invoice ID as well
    // FIXME send only changed values
    const body = {
      value: form.value,
      description: form.description,
      date_release: form.date_release,
      is_release_paid: form.is_release_paid,
      place: form.place,
      category_id: form.category_id,
      card_id: card ? this.cardQuery.getActive().id : null,
      type: form.type,
      date_repeat: form.date_release,
      account_id: this.accountQuery.getActiveId(),
      balance_id: this.balanceQuery.getActiveId(),
      repeat_times: form.repeat_times
    };

    return this.http.post<[Release]>('/api/release/', body, this.uiService.httpHeaderOptions());
  }

  // tslint:disable-next-line:typedef
  update(id, form) {
    this.releaseStore.setLoading(true);

    // FIXME if the date change it has to change the balance/invoice ID as well
    const body = {
      value: form.value,
      description: form.description,
      date_release: form.date_release,
      is_release_paid: form.is_release_paid,
      category_id: form.category_id,
      type: form.type,
      date_repeat: form.date_release,
      account_id: this.accountQuery.getActiveId(),
      repeat_times: form.repeat_times
    };

    return this.http.patch<number>('/api/release/' + id + '/', body, this.uiService.httpHeaderOptions()).subscribe(
      entities => entities === 1 ? this.releaseStore.update(id, body) : this.releaseStore.setError("Not updated"),
      error => this.releaseStore.setError(error),
      () => this.releaseStore.setLoading(false),
    );
  }

  // tslint:disable-next-line:typedef
  remove(id: ID) {
    this.releaseStore.setLoading(true);

    return this.http.delete<number>('/api/release/' + id + '/', this.uiService.httpHeaderOptions()).subscribe(
      entities => entities === 1 ? this.releaseStore.remove(id) : this.releaseStore.setError("Not removed"),
      error => this.releaseStore.setError(error),
      () => this.releaseStore.setLoading(false),
    );
  }
}
