import {Component, OnInit} from '@angular/core';
import {SessionService} from '../../../../state/session/session.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
  }

  // tslint:disable-next-line:typedef
  logout() {
    this.sessionService.logout();
    return this.router.navigate(['/']);
  }

}
