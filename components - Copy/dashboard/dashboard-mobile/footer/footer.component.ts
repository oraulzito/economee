import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.s.less']
})
export class FooterComponent implements OnInit {

  @Output() idParent = new EventEmitter();
  id = 1;

  constructor() {
  }

  ngOnInit() {
  }

  changeMenu(id) {
    this.id = id;
    this.idParent.emit(id);
  }

}
