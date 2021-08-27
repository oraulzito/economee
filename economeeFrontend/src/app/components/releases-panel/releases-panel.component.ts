import {Component, Input, OnInit, Output} from '@angular/core';
import {Release} from '../../../state/release/release.model';
import {CardQuery} from '../../../state/card/card.query';
import {InvoiceQuery} from '../../../state/invoice/invoice.query';
import {ReleaseQuery} from '../../../state/release/release.query';
import {BalanceQuery} from '../../../state/balance/balance.query';
import {AccountQuery} from '../../../state/account/account.query';
import {Account} from '../../../state/account/account.model';
import {Balance} from '../../../state/balance/balance.model';
import {Card} from '../../../state/card/card.model';
import {Invoice} from '../../../state/invoice/invoice.model';
import {ReleaseService} from '../../../state/release/release.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-releases-panel',
  templateUrl: './releases-panel.component.html',
  styleUrls: ['./releases-panel.component.css']
})
export class ReleasesPanelComponent implements OnInit {

  @Input() title;
  @Input() id;
  releases: Release[];
  account: Account;
  balance: Balance;
  card: Card;
  invoice: Invoice;

  releaseAddForm: FormGroup;

  actionText: string;
  text: string;
  type: string;

  expensesPercentage = 0;
  balanceIncomes: number;

  @Output() add = true;
  hasData = true;
  loadingReleases = false;
  loadingBalance = false;
  loadingAccount = false;
  loadingCard = false;
  loadingInvoice = false;

  constructor(
    private fb: FormBuilder,
    private cardQuery: CardQuery,
    private invoiceQuery: InvoiceQuery,
    private releaseQuery: ReleaseQuery,
    private balanceQuery: BalanceQuery,
    private accountQuery: AccountQuery,
    private releaseService: ReleaseService,
  ) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.accountQuery.selectLoading().subscribe(la => this.loadingAccount = la);
    this.balanceQuery.selectLoading().subscribe(lb => this.loadingBalance = lb);
    this.releaseQuery.selectLoading().subscribe(lr => this.loadingReleases = lr);
    this.cardQuery.selectLoading().subscribe(lc => this.loadingCard = lc);
    this.invoiceQuery.selectLoading().subscribe(li => this.loadingInvoice = li);

    this.releaseAddForm = this.fb.group({
      value: new FormControl(),
      description: new FormControl(),
      date_release: new FormControl(),
      is_release_paid: new FormControl(),
      category_id: new FormControl(),
      type: new FormControl(),
    });

    this.accountQuery.selectActive().subscribe(a => this.account = a);

    switch (this.id) {
      case 1:
        this.getBalanceReleases();
        break;
      case 2:
        this.getCardReleases();
        break;
      case 3:
        this.hasData = false;
        this.type = 'planning';
        this.actionText = '';
        this.text = 'Não há lançamentos criados em sua conta, gráficos serão gerados com os dados de lançamentos.';
        break;
    }
  }

  // tslint:disable-next-line:typedef
  addRelease() {
    this.add = true;
  }

  // tslint:disable-next-line:typedef
  addEvent(result) {
    console.log(result);
    // this.add = false;
  }

  // tslint:disable-next-line:typedef
  getBalanceReleases() {
    // get balance releases
    this.releaseQuery.selectAll({
      filterBy: ({balance_id}) => balance_id === this.balanceQuery.getActiveId()
    }).subscribe(
      (rb) => {
        if (rb.length > 0) {
          this.releases = rb;
          this.hasData = true;
        } else {
          this.hasData = false;
          this.type = 'releases';
          this.actionText = 'Criar lançamentos';
          this.text = 'Não há lançamentos criados';
        }
      }
    );

    // Progress bar calc
    this.balanceQuery.selectActive().subscribe(b => {
      this.balance = b;
      if (b) {
        this.expensesPercentage = (b.total_releases_expenses * 100) / b.total_releases_incomes;
      }
    });
  }

  // tslint:disable-next-line:typedef
  getCardReleases() {
    this.cardQuery.selectActive().subscribe(c => {
      this.card = c;
      this.invoiceQuery.selectActive().subscribe(i => {
        this.invoice = i;
        if (this.invoice) {
          this.releaseQuery.selectAll({
            filterBy: ({invoice_id}) => invoice_id === this.invoiceQuery.getActiveId()
          }).subscribe(
            (ri) => {
              if (ri.length > 0) {
                this.releases = ri;
                this.hasData = true;
              } else {
                if (!this.invoiceQuery.hasActive()) {
                  this.hasData = false;
                  if (!this.cardQuery.hasActive()) {
                    this.type = 'card';
                    this.actionText = 'Criar Cartão';
                    this.text = 'Não há cartões criados em sua conta';
                  } else {
                    this.type = 'invoice';
                    this.actionText = 'Criar lançamentos';
                    this.text = 'Não há lançamentos nesta fatura do seu cartão';
                  }
                }
              }
            });

          this.expensesPercentage = (this.invoice.total_card_expenses * 100) / this.card.credit;
        }
      });
    });
  }
}
