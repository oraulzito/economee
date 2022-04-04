import {Component, Input, OnInit} from '@angular/core';
import {Release} from "../../../core/state/release/release.model";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

import {ReleaseService} from "../../../core/state/release/release.service";
import {AccountQuery} from "../../../core/state/account/account.query";
import {ReleaseCategoryQuery} from "../../../core/state/release/category/release-category.query";
import {Observable} from "rxjs";
import {CardQuery} from "../../../core/state/card/card.query";
import {ReleaseQuery} from "../../../core/state/release/release.query";


@Component({
  selector: 'app-release-edit',
  templateUrl: './release-edit.component.html',
  styleUrls: ['./release-edit.component.less']
})
export class ReleaseEditComponent implements OnInit {
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
      name: 'place',
      type: 'text',
      label: 'Local',
      errorTip: {
        required: 'O local é obrigatório',
        error: 'O local deve ter no mínimo 3 caracteres',
      },
      icon: 'map-pin',
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

  ngOnInit() {
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
      installment_value: new FormControl(this.release.installment_value),
      value: new FormControl(this.release.value),
      description: new FormControl(this.release.description),
      date_release: new FormControl(this.release.date_release),
      is_paid: new FormControl(this.release.is_paid),
      category_id: new FormControl(this.release.category_id),
      installment_times: new FormControl(this.release.installment_times),
      place: new FormControl(this.release.place),
      type: new FormControl(this.release.type),
      invoice_id: new FormControl(this.release.invoice_id)
    });
  }

  // tslint:disable-next-line:typedef
  editRelease() {
    this.releaseService.update(this.release.release_id, this.releaseForm.value).subscribe(
      r => this.isVisible = false,
      e => alert(e)
    );
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
