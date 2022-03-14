import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ID, setLoading} from '@datorama/akita';
import {Release} from './release.model';
import {ReleaseStore} from './release.store';
import {ReleaseQuery} from './release.query';
import {UiService} from '../ui/ui.service';
import {BalanceQuery} from '../balance/balance.query';
import {InvoiceQuery} from '../invoice/invoice.query';
import {AccountQuery} from '../account/account.query';
import {CardQuery} from '../card/card.query';
import {catchError, shareReplay, tap} from "rxjs/operators";
import {throwError} from "rxjs";
import {Invoice} from "../invoice/invoice.model";

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
  getAll() {
    return this.http.get<Release[]>('/api/release', this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.releaseStore),
      tap(releases => this.releaseStore.set(releases)),
      catchError(error => throwError(error))
    );
  }

  // tslint:disable-next-line:typedef
  getBalanceReleases() {
    return this.http.get<Release[]>('/api/release?balance_id=' + this.balanceQuery.getActiveId(),
      this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.releaseStore),
      tap(entities => this.releaseStore.set(entities)),
      catchError(error => throwError(error))
    );
  }

  // tslint:disable-next-line:typedef
  getInvoiceReleases(invoice: Invoice) {
    return this.http.get<Release[]>('/api/release?invoice_id=' + invoice.id,
      this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.releaseStore),
      tap(entities => this.releaseStore.set(entities)),
      catchError(error => throwError(error))
    );
  }

  // TODO use this as a filter for releases between date and/or periods
  // tslint:disable-next-line:typedef
  // getMonthReleases(balance) {
  //   return this.http.get<Release[]>('/api/release?date_reference=' + balance.date_reference,
  //     this.uiService.httpHeaderOptions()).pipe(
  //     shareReplay(1),
  //     setLoading(this.releaseStore),
  //     tap(entities => {
  //       this.releaseStore.set(entities);
  //       console.log(entities);
  //     }),
  //     catchError(error => throwError(error))
  //   );
  // }

  // tslint:disable-next-line:typedef
  add(form) {
    const body = {
      date_release: form.date_release,
      description: form.description,
      is_paid: form.is_release_paid,
      place: form.place,
      installment_times: form.installment_times,
      type: form.type,
      value: form.value,
      account_id: this.accountQuery.getActiveId(),
      balance_id: this.balanceQuery.getActiveId(),
      card_id: form.card_id,
      category_id: form.category_id,
    };

    return this.http.post<[Release]>('/api/release/', body, this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      tap(entities => this.releaseStore.add(entities)),
      catchError(error => throwError(error))
    );
  }

  // tslint:disable-next-line:typedef
  update(id, form) {
    const body = {
      installment_value: form.installment_value,
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

    return this.http.patch('/api/release/' + id, body, this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      tap(entities => entities === 1 ? this.releaseStore.update(id, body) : this.releaseStore.setError("Not updated")),
      catchError(error => throwError(error))
    );
  }

  // tslint:disable-next-line:typedef
  pay(id, isPaid) {
    const body = {
      is_paid: isPaid
    };

    return this.http.patch('/api/release/pay/' + id, body, this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      tap(entities => entities === 1 ? this.releaseStore.update(id, body) : this.releaseStore.setError("Not updated")),
      catchError(error => throwError(error))
    );
  }

  // tslint:disable-next-line:typedef
  remove(id: ID) {
    return this.http.delete<number>('/api/release/' + id, this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      tap(entities => entities === 1 ? this.releaseStore.remove(id) : this.releaseStore.setError("Not removed")),
      catchError(error => throwError(error))
    );
  }
}