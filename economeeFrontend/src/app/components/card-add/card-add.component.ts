import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AccountQuery} from "../../../state/account/account.query";
import {CardService} from "../../../state/card/card.service";
import {CardQuery} from "../../../state/card/card.query";

@Component({
  selector: 'app-card-add',
  templateUrl: './card-add.component.html',
  styleUrls: ['./card-add.component.css']
})
export class CardAddComponent implements OnInit {
  @Output() saved = new EventEmitter();

  currency: string;
  cardForm: FormGroup;
  error = false;

  constructor(
    private fb: FormBuilder,
    private cardService: CardService,
    private accountQuery: AccountQuery,
    private cardQuery: CardQuery,
  ) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.cardQuery.selectError().subscribe(r => this.error = r);

    this.accountQuery.selectActive().subscribe(r => {
      if (r) {
        this.currency = r.currency.symbol;
      }
    });

    this.cardForm = this.fb.group({
      name: new FormControl(),
      credit: new FormControl(),
      pay_date: new FormControl(),
    });
  }

  // tslint:disable-next-line:typedef
  save() {
    return this.cardService.add(this.cardForm.value).subscribe(
      r => this.saved.emit('false'),
      (e) => this.saved.emit('true')
    );
  }

  // tslint:disable-next-line:typedef
  cancel() {
    this.saved.emit('true');
  }
}
