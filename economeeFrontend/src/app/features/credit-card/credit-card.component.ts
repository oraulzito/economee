import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AccountQuery} from "../../core/state/account/account.query";

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.less']
})
export class CreditCardComponent implements OnInit {
  creditCardForm: FormGroup;

  formItems = [
    {
      name: 'name',
      type: 'text',
      label: 'Nome do cartão',
      errorTip: {
        required: 'O nome do cartão é obrigatório',
        error: 'O nome do cartão deve conter no máximo 20 caracteres'
      },
      icon: 'credit_card',
      size: {
        sm: 24
      },
    },
    {
      name: 'credit',
      type: 'number',
      label: 'Valor do crédito',
      errorTip: {
        required: 'O valor do crédito é obrigatório',
        error: 'O valor do crédito deve ser um número'
      },
      icon: 'dollar',
      size: {
        sm: 24
      },
    },
    {
      name: 'pay_date',
      type: 'date',
      label: 'Data de pagamento',
      errorTip: {
        required: 'A data de pagamento é obrigatória',
        error: 'A data de pagamento deve ser uma data válida'
      },
      icon: '',
      size: {
        sm: 24
      },
    }
  ];

  constructor(
    private fb: FormBuilder,
    private accountQuery: AccountQuery,
  ) {
  }

  ngOnInit(): void {
    this.creditCardForm = this.fb.group({
      name: new FormControl(),
      credit: new FormControl(),
      pay_date: new FormControl(),
      account_id: new FormControl(this.accountQuery.getActiveId()),
    });
  }

}
