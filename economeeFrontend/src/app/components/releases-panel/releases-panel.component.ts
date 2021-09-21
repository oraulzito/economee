import {Component, Input, OnInit} from '@angular/core';
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
import {FormBuilder} from '@angular/forms';
import {MonthByMonthService} from '../../../state/graphics/month-by-month/month-by-month.service';
import {CategoryReleasesService} from '../../../state/graphics/category-release/category-releases.service';
import {MonthByMonthQuery} from '../../../state/graphics/month-by-month/month-by-month.query';
import {CategoryReleasesQuery} from '../../../state/graphics/category-release/category-releases.query';

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
  dataMonthbyMonth: {};
  dataCategory: {};

  actionText: string;
  text: string;
  type: string;

  expensesPercentage = 0;
  balanceIncomes: number;
  layoutCategory = {};
  gDataCategory = [];
  layoutMonth = {};
  gDataMonth = [];
  addRelease = false;
  addCard = false;
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
    private monthByMonthService: MonthByMonthService,
    private monthByMonthQuery: MonthByMonthQuery,
    private categoryReleasesQuery: CategoryReleasesQuery,
    private categoryReleasesService: CategoryReleasesService,
  ) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.accountQuery.selectLoading().subscribe(la => this.loadingAccount = la);
    this.balanceQuery.selectLoading().subscribe(lb => this.loadingBalance = lb);
    this.cardQuery.selectLoading().subscribe(lc => this.loadingCard = lc);
    this.invoiceQuery.selectLoading().subscribe(li => this.loadingInvoice = li);

    this.accountQuery.selectActive().subscribe(a => {
      if (a) {
        this.account = a;
      }
    });

    this.releaseQuery.selectLoading().subscribe(lr => {
      this.loadingReleases = lr;
      if (lr === false) {
        switch (this.id) {
          case 1:
            this.getBalanceReleases();
            break;
          case 2:
            this.getCardReleases();
            break;
          case 3:
            if (this.accountQuery.hasActive()) {
              this.monthByMonthService.get();

              this.monthByMonthQuery.select().subscribe(r => {
                  if (r) {
                    const totalER = r.expenses.map(e => e.total);
                    const totalIR = r.incomes.map(i => i.total);

                    // tslint:disable-next-line:variable-name
                    const datesER = r.expenses.map(e => e.date_reference);
                    // tslint:disable-next-line:variable-name
                    const datesIR = r.incomes.map(i => i.date_reference);

                    this.gDataMonth = [
                      {x: datesER, y: totalER, type: 'bar', name: 'Gastos'},
                      {x: datesIR, y: totalIR, type: 'bar', name: 'Ganhos'}
                    ];

                    this.layoutMonth = {title: 'Mês após mês', height: 400};
                  }
                }
              );

              this.categoryReleasesService.get()

              this.categoryReleasesQuery.selectAll().subscribe(
                r => {
                  if (r) {

                    const total = r.map(e => e.total);
                    const names = r.map(e => e.name);

                    this.gDataCategory = [
                      {values: total, labels: names, type: 'pie'},
                    ];

                    this.layoutCategory = {title: 'Gastos por categoria', height: 350};
                  }
                }
              );
            }


            if (this.gDataMonth.length === 0 || this.gDataCategory.length === 0) {
              this.hasData = false;
              this.type = 'planning';
              this.actionText = '';
              this.text = 'Sem dados para a criação de gráficos.';
            }
            break;
        }
      }
    });
  }

  // tslint:disable-next-line:typedef
  showAddCard(r: string) {
    this.addCard = r === 'false';
  }

  // tslint:disable-next-line:typedef
  showAddRelease(r: string) {
    this.addRelease = r === 'false';
  }

  showAdd(r: number) {
    switch (r) {
      case 1:
        this.addRelease = !this.addRelease;
        break;
      case 2:
        this.addCard = !this.addCard;
        break;
    }
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

          // Progress bar calc
          this.balanceQuery.selectActive().subscribe(b => {
            this.balance = b;
            if (b) {
              this.expensesPercentage = (b.total_releases_expenses * 100) / b.total_releases_incomes;
            }
          });
        } else {
          this.hasData = false;
          this.type = 'releases';
          this.actionText = 'Criar lançamentos';
          this.text = 'Não há lançamentos criados';
        }
      }
    );
  }

  // tslint:disable-next-line:typedef
  getCardReleases() {
    this.cardQuery.selectActive().subscribe(c => {
      this.card = c;
      if (!this.card) {
        this.hasData = false;
        this.type = 'card';
        this.actionText = 'Criar Cartão';
        this.text = 'Não há cartões criados em sua conta';
      } else {
        this.invoiceQuery.selectActive().subscribe(i => {
          this.invoice = i;
          if (!this.invoice) {
            this.type = 'invoice';
            this.actionText = 'Sem fatura para este mês';
            this.text = 'Não há uma fatura para este mês';
          } else {
            this.releaseQuery.selectAll({
              filterBy: ({invoice_id}) => invoice_id === this.invoiceQuery.getActiveId()
            }).subscribe(
              (ri) => {
                if (ri.length > 0) {
                  this.releases = ri;
                  this.hasData = true;
                  this.expensesPercentage = (this.invoice.total_card_expenses * 100) / this.card.credit;
                } else {
                  this.hasData = false;
                  this.type = 'invoice';
                  this.actionText = 'Criar lançamentos';
                  this.text = 'Não há lançamentos nesta fatura do seu cartão';
                }
              });
          }
        });
      }
    });
  }
}
