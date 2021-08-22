import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.css']
})
export class NoDataComponent implements OnInit {

  @Input() type: string;
  @Input() text: string;
  @Input() actionText: string;

  constructor() {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
  }

  // tslint:disable-next-line:typedef
  onClick() {
    switch (this.type) {
      case 'releases':
        break;
      case 'card':
        break;
      case 'invoice':
        break;
    }
  }

}
