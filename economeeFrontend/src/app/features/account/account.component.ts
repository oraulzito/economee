import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserQuery} from "../../core/state/user/user.query";
import {UiStore} from "../../core/state/ui/ui.store";
import {AccountQuery} from "../../core/state/account/account.query";
import {AccountService} from "../../core/state/account/account.service";
import {getEntityType, HashMap, Order} from "@datorama/akita";;
import {Account} from "../../core/state/account/account.model";
import {AccountState} from "../../core/state/account/account.store";
import {CurrencyQuery} from "../../core/state/currency/currency.query";
import {Currency} from "../../core/state/currency/currency.model";
import {Observable} from "rxjs";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.less']
})
export class AccountComponent implements OnInit {
  @Input()
  isVisible = false;

  currencies = [];
  accounts: getEntityType<AccountState>[];
  userId: Observable<any>;

  editing = false;
  adding = false;

  accountForm: FormGroup;
  formItems = [
    {
      name: 'totalAvailable',
      type: 'number',
      label: 'Total Disponível',
      errorTip: {
        required: 'O valor é obrigatório',
        error: 'O valor deve ser maior que zero'
      },
      icon: 'dollar',
      size: {
        sm: 12
      },
    }, {
      name: 'name',
      type: 'text',
      label: 'Nome',
      errorTip: {
        required: 'O nome é obrigatório',
        error: 'O Nome deve ter no máximo 255 caracteres'
      },
      icon: 'info',
      size: {
        sm: 24
      },
    }, {
      name: 'isMainAccount',
      type: 'boolean',
      label: 'Conta Principal?',
      errorTip: {
        required: 'Está é a conta principal?',
        error: 'Marque uma opção'
      },
      icon: 'info',
      size: {
        sm: 24
      }
    }, {
      name: 'Account_id',
      type: 'dropdown',
      label: 'Moeda',
      errorTip: {
        required: 'A moeda é obrigatória',
        error: 'A moeda é obrigatória'
      },
      icon: 'coin',
      size: {
        sm: 8
      },
      options: this.currencies
    },
  ]

  constructor(
    private fb: FormBuilder,
    private userQuery: UserQuery,
    private currencyQuery: CurrencyQuery,
    private accountQuery: AccountQuery,
    private accountService: AccountService,
    private uiStore: UiStore,
  ) {
  }

  ngOnInit(): void {
    this.userQuery.select().subscribe(user => this.userId = user.id);
    this.currencies = this.currencyQuery.getAll();
    this.accountQuery.selectAll({
      sortBy: "is_main_account",
      sortByOrder: Order.DESC
    }).subscribe(accounts => {
      this.accounts = accounts;
    });
  }

  add() {
    this.adding = true;
  }

  saveAccount() {
    this.accountService.add(this.accountForm.value).subscribe();
    this.accountForm.reset('name');
    this.adding = false;
  }

  cancelSave() {
    this.adding = false;
  }

  deleteAccount(id) {
    this.accountService.remove(id).subscribe();
  }

  editAccount() {
    this.editing = true;
  }

  saveEditAccount(id) {
    this.accountService.update(id, this.accountForm.value).subscribe();
    this.accountForm.reset('name');
    this.editing = false;
  }

  cancelEdit() {
    this.editing = false;
  }

  closeAccountsModal() {
    this.uiStore.update({
      accountsModalVisible: false
    });
  }


}
