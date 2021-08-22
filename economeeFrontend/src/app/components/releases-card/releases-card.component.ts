import {Component, Input, OnInit} from '@angular/core';
import {Release} from "../../../state/release/release.model";

@Component({
  selector: 'app-releases-card',
  templateUrl: './releases-card.component.html',
  styleUrls: ['./releases-card.component.css']
})
export class ReleasesCardComponent implements OnInit {

  @Input() title;
  @Input() data: Release[];
  // @Input() sm;
  // @Input() md;
  // @Input() xl;

  constructor() {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
  }

}
