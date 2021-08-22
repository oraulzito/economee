import {Component, OnDestroy, OnInit} from '@angular/core';
import {SessionService} from '../../../../state/session/session.service';
import {Router} from '@angular/router';
import {AccountQuery} from '../../../../state/account/account.query';
import {BalanceQuery} from '../../../../state/balance/balance.query';
import {Balance} from '../../../../state/balance/balance.model';
import {Account} from '../../../../state/account/account.model';
import {Subscription} from 'rxjs';
import {DateTime} from 'luxon';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  account: Account;
  accountLoading = false;

  balance: Balance;
  balanceLoading = false;

  accountSubscription = new Subscription();
  accountLoadingSubscription = new Subscription();
  balanceSubscription = new Subscription();
  balanceLoadingSubscription = new Subscription();
  balanceAllSubscription = new Subscription();

  dateReference = new Date();
  minDate = new Date();
  maxDate = new Date();

  constructor(
    private sessionService: SessionService,
    private accountQuery: AccountQuery,
    private balanceQuery: BalanceQuery,
    private router: Router
  ) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.accountLoadingSubscription = this.accountQuery.selectLoading().subscribe(r => {
      this.accountLoading = r;
      if (!r) {
        this.accountSubscription = this.accountQuery.selectActive().subscribe(a => this.account = a);
      }
    });

    this.balanceLoadingSubscription = this.balanceQuery.selectLoading().subscribe(r => {
      this.balanceLoading = r;
      if (!r) {
        this.balanceSubscription = this.balanceQuery.selectActive().subscribe(b => {
          if (b) {
            this.balance = b;
            //FIXME
            this.dateReference = DateTime.fromSQL(b.date_reference);
            console.log(this.dateReference);
          }
        });

        this.balanceAllSubscription = this.balanceQuery.selectAll().subscribe(b => {
          //FIXME
          this.minDate = DateTime.fromSQL(b[0].date_reference);
          //FIXME
          this.maxDate = DateTime.fromSQL(b[b.length - 1].date_reference);
          console.log(this.minDate);
          console.log(this.maxDate);
        });
      }
    });
  }

  // tslint:disable-next-line:typedef
  logout() {
    // TODO add a logout message and the loader
    this.sessionService.logout().subscribe(
      () => this.router.navigate(['/']),
      (err) => alert(err)
    );
  }

  ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
    this.accountLoadingSubscription.unsubscribe();
    this.balanceSubscription.unsubscribe();
    this.balanceLoadingSubscription.unsubscribe();
    this.balanceAllSubscription.unsubscribe();
  }

  // tslint:disable-next-line:typedef
  changeBalance() {
    console.log(this);
  }
}
