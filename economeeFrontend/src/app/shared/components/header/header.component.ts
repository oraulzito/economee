import {Component, OnInit} from '@angular/core';
import {SessionService} from '../../../core/state/session/session.service';
import {Router} from '@angular/router';
import {SessionQuery} from '../../../core/state/session/session.query';
import {BalanceService} from '../../../core/state/balance/balance.service';
import {BalanceQuery} from "../../../core/state/balance/balance.query";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  isLogged$ = this.sessionQuery.isLoggedIn$;
  date = new Date();

  constructor(
    private balanceService: BalanceService,
    private balanceQuery: BalanceQuery,
    private sessionQuery: SessionQuery,
    private sessionService: SessionService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.balanceService.get().subscribe(
      () => this.balanceService.setBalanceMonth()
    );
  }

  // tslint:disable-next-line:typedef
  logout() {
    // TODO add a logout message and the loader
    // this.sessionService.logout().subscribe(
    //   () => this.router.navigate(['/']),
    //   (err) => alert(err)
    // );
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }
}
