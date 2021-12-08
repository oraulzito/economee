import {Component, HostListener, OnInit} from '@angular/core';
import {UiService} from '../../core/state/ui/ui.service';
import {UiQuery} from '../../core/state/ui/ui.query';
import {Observable} from 'rxjs';
import {UiState} from '../../core/state/ui/ui.store';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  mobile$: Observable<UiState>;

  constructor(
    private uiService: UiService,
    private uiQuery: UiQuery,
  ) {
  }

  ngOnInit(): void {
    this.mobile$ = this.uiQuery.isMobile$;
    this.onResize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.uiService.mobile();
  }
}
