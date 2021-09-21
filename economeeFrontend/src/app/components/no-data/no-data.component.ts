import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.css']
})
export class NoDataComponent implements OnInit {

  @Input() id: number;
  @Input() type: string;
  @Input() text: string;
  @Input() actionText: string;
  @Output() buttonClick = new EventEmitter();

  constructor() {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
  }

  // tslint:disable-next-line:typedef
  onClick() {
    this.buttonClick.emit(this.id);
  }

}
