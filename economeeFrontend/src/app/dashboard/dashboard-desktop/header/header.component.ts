import {Component, OnInit} from '@angular/core';
import {SessionService} from '../../../../state/session/session.service';
import {Router} from '@angular/router';
import {AccountQuery} from "../../../../state/account/account.query";
import {BalanceQuery} from "../../../../state/balance/balance.query";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private sessionService: SessionService,
    private accountQuery: AccountQuery,
    private balanceQuery: BalanceQuery,
    private router: Router
  ) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
  }

  // tslint:disable-next-line:typedef
  logout() {
    // TODO add a logout message and the loader
    this.sessionService.logout().subscribe(
      () => this.router.navigate(['/']),
      (err) => alert(err)
    );
  }

}
