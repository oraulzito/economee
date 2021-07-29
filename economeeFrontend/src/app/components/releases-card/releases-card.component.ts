import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-releases-card',
  templateUrl: './releases-card.component.html',
  styleUrls: ['./releases-card.component.css']
})
export class ReleasesCardComponent implements OnInit {

  @Input() title;
  @Input() sm;
  @Input() md;
  @Input() xl;

  constructor() {
  }

  ngOnInit() {
  }

}
