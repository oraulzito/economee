import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {DateTime} from 'luxon';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.s.less']
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
    private accountService: AccountService,
    private sessionService: SessionService,
    private accountQuery: AccountQuery,
    private balanceQuery: BalanceQuery,
    private releaseQuery: ReleaseQuery,
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

    this.releaseQuery.selectLoading().subscribe(r => {
        if (!r) {
          this.accountService.totalAvailable();
        }
      }
    );

    this.balanceLoadingSubscription = this.balanceQuery.selectLoading().subscribe(r => {
      this.balanceLoading = r;
      if (!r) {
        this.balanceSubscription = this.balanceQuery.selectActive().subscribe(b => {
          if (b) {
            this.balance = b;
            this.dateReference = DateTime.fromSQL(b.date_reference).toISODate();
          }
        });

        this.balanceAllSubscription = this.balanceQuery.selectAll().subscribe(b => {
          this.minDate = DateTime.fromSQL(b[0].date_reference).toISODate();
          this.maxDate = DateTime.fromSQL(b[b.length - 1].date_reference).toISODate();
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
