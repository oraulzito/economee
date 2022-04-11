import {Component, Input, OnInit} from '@angular/core';
import {Card} from "../../../core/state/card/card.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

import {ReleaseService} from "../../../core/state/release/release.service";
import {AccountQuery} from "../../../core/state/account/account.query";
import {ReleaseCategoryQuery} from "../../../core/state/release/category/release-category.query";
import {Observable} from "rxjs";
import {CardQuery} from "../../../core/state/card/card.query";
import {ReleaseQuery} from "../../../core/state/release/release.query";
import {Release} from "../../../core/state/release/release.model";


@Component({
  selector: 'app-release-create',
  templateUrl: './release-create.component.html',
  styleUrls: ['./release-create.component.less']
})
export class ReleaseCreateComponent implements OnInit {
  @Input() card: Card;
  @Input() releaseType: number;
  @Input() isVisible: boolean;
  @Input() release: Release;

  currency: Observable<string | undefined>;
  releaseForm: FormGroup;
  categoriesLoading: boolean;
  categories = [];

  formItems = [
    {
      name: 'value',
      type: 'number',
      label: 'Valor',
      errorTip: {
        required: 'O valor é obrigatório',
        error: 'O valor deve ser maior que zero'
      },
      icon: 'dollar',
      size: {
        sm: 12
      },
    }, {
      name: 'installment_times',
      type: 'number',
      label: 'Parcelas',
      errorTip: {
        required: 'O número de parcelas é obrigatório',
        error: 'O número de parcelas deve ser maior que zero'
      },
      icon: 'retweet',
      size: {
        sm: 12
      },
    }, {
      name: 'description',
      type: 'text',
      label: 'Descrição',
      errorTip: {
        required: 'A descrição é obrigatória',
        error: 'A descrição deve ter no máximo 255 caracteres'
      },
      icon: 'info',
      size: {
        sm: 24
      },
    }, {
      name: 'place',
      type: 'text',
      label: 'Local',
      errorTip: {
        required: 'O local é obrigatório',
        error: 'O local deve ter no mínimo 3 caracteres',
      },
      icon: 'environment',
      size: {
        sm: 12
      },
    }, {
      name: 'date_release',
      type: 'date',
      label: 'Data',
      errorTip: {
        required: 'A data é obrigatória',
        error: 'Algo de errado ocorreu, verifique a data'
      },
      icon: 'calendar',
      size: {
        sm: 12
      },
    }, {
      name: 'category_id',
      type: 'dropdown',
      label: 'Categoria',
      errorTip: {
        required: 'A categoria é obrigatória',
        error: 'A categoria é obrigatória'
      },
      icon: '',
      size: {
        sm: 8
      },
      options: this.categories
    }, {
      name: 'type',
      type: 'dropdown',
      label: 'Tipo',
      errorTip: {
        required: 'A categoria é obrigatória',
        error: 'A categoria deve ser escolhida'
      },
      icon: '',
      size: {
        sm: 8
      },
      options: [
        {
          label: 'Receita',
          value: 1
        }, {
          label: 'Despesa',
          value: 0
        }
      ]
    }, {
      name: 'is_paid',
      type: 'dropdown',
      label: 'Está pago?',
      errorTip: {
        required: 'A categoria é obrigatória',
        error: 'A categoria deve ser escolhida'
      },
      icon: '',
      size: {
        sm: 8
      },
      options: [
        {
          label: 'Sim',
          value: true
        }, {
          label: 'Não',
          value: false
        }
      ]
    },
  ];

  constructor(
    private fb: FormBuilder,
    private cardQuery: CardQuery,
    private releaseQuery: ReleaseQuery,
    private releaseService: ReleaseService,
    private accountQuery: AccountQuery,
    private releaseCategoryQuery: ReleaseCategoryQuery
  ) {
  }

  //FIXME change R$ to this.currency
  parserDollar = (value: string): string => value.replace('R$ ', '');
  formatterInstallments = (value: number): string => `${value} X`;

  ngOnInit(): void {
    this.currency = this.accountQuery.currencySymbol$;

    this.releaseCategoryQuery.selectLoading().subscribe(cl => {
      this.categoriesLoading = cl;
    });

    this.releaseCategoryQuery.selectAll().subscribe(
      c => {
        c.map(item => {
          this.categories.push({
            label: item.name,
            value: item.id
          })
        });
      });

    this.releaseForm = this.fb.group({
      installment_value: new FormControl(),
      value: new FormControl(0, [Validators.required, Validators.min(0)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      date_release: new FormControl(new Date(), [Validators.required]),
      is_paid: new FormControl(),
      category_id: new FormControl(),
      installment_times: new FormControl(1, [Validators.required, Validators.min(1)]),
      place: new FormControl('', [Validators.required, Validators.minLength(3)]),
      type: new FormControl(),
      card_id: new FormControl(this.releaseType == 0 ? this.cardQuery.getActiveId() : null)
    });
  }

  // tslint:disable-next-line:typedef
  saveRelease() {
    return this.releaseService.add(this.releaseForm.value).subscribe(
      r => this.isVisible = false,
      e => alert(e)
    );
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
