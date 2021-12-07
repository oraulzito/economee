import {Component, OnInit} from '@angular/core';
import {SessionService} from "../../../core/state/session/session.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  constructor(
    private sessionService: SessionService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  logout() {
    // TODO add a logout message and the loader
    // this.sessionService.logout().subscribe(
    //   () => this.router.navigate(['/']),
    //   (err) => alert(err)
    // );
  }
}
