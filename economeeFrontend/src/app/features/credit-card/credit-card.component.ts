import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Card} from 'src/app/core/state/card/card.model';
import {UserQuery} from "../../core/state/user/user.query";
import {CardQuery} from "../../core/state/card/card.query";
import {CardService} from "../../core/state/card/card.service";
import {AccountQuery} from "../../core/state/account/account.query";
import {UiStore} from "../../core/state/ui/ui.store";

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.less']
})
export class CreditCardComponent implements OnInit {

  @Input()
  isVisible = false;

  cards: Card[];
  userId: number;

  editing: boolean[];
  adding = false;

  cardForm: FormGroup;

  formItems = [
    {
      name: 'name',
      type: 'text',
      label: 'Nome do cartão',
      errorTip: {
        required: 'O nome do cartão é obrigatório',
        error: 'O nome do cartão é obrigatório'
      },
      icon: 'credit-card',
      size: {
        sm: 24
      },
    }, {
      name: 'pay_date',
      type: 'date',
      label: 'Data de vencimento',
      errorTip: {
        required: 'A data de vencimento é obrigatória',
        error: 'A data de vencimento é obrigatória'
      },
      icon: 'calendar',
      size: {
        sm: 12
      },
    }, {
      name: 'credit',
      type: 'number',
      label: 'Valor de crédito',
      errorTip: {
        required: 'O valor de crédito deve ser maior que zero',
        error: 'O valor de crédito é obrigatório'
      },
      icon: 'dollar',
      size: {
        sm: 12
      },
    },
  ]

  constructor(
    private fb: FormBuilder,
    private userQuery: UserQuery,
    private uiStore: UiStore,
    private cardQuery: CardQuery,
    private cardService: CardService,
    private accountQuery: AccountQuery,
  ) {
  }

  ngOnInit(): void {
    this.cardQuery.selectAll().subscribe(cards => {
      this.cards = cards;
      this.editing = new Array(cards.length).fill(false);
    });
  }

  add() {
    this.adding = true;
    this.cardForm = this.fb.group({
      name: new FormControl(''),
      pay_date: new FormControl(new Date()),
      credit: new FormControl(0),
      account_id: new FormControl(this.accountQuery.getActiveId()),
    });
  }

  saveCard() {
    this.cardService.add(this.cardForm.value).subscribe();
    this.cardForm.reset();
    this.adding = false;
  }

  cancelSave() {
    this.adding = false;
    this.cardForm.reset();
  }

  deleteCard(id) {
    this.cardService.remove(id).subscribe();
  }

  editCard(index, card) {
    this.editing[index] = true;
    this.cardForm = this.fb.group({
      id: new FormControl(card.id),
      name: new FormControl(card.name),
      pay_date: new FormControl(card.pay_date),
      credit: new FormControl(card.credit),
      account_id: new FormControl(this.accountQuery.getActiveId()),
    });
  }

  saveEditCard(index, id) {
    this.cardService.update(id, this.cardForm.value).subscribe();
    this.cardForm.reset();
    this.editing[index] = false;
  }

  cancelEdit(index) {
    this.editing[index] = false;
    this.cardForm.reset();
  }

  closeCardsModal() {
    this.uiStore.update({
      cardsModalVisible: false
    });
  }

}
