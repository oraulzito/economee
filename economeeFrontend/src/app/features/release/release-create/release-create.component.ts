import {Component, Input, OnInit} from '@angular/core';
import {Card} from "../../../core/state/card/card.model";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

import {ReleaseService} from "../../../core/state/release/release.service";
import {AccountQuery} from "../../../core/state/account/account.query";
import {ReleaseCategory} from "../../../core/state/release/category/release-category.model";
import {ReleaseCategoryQuery} from "../../../core/state/release/category/release-category.query";
import {Observable} from "rxjs";
import {CardQuery} from "../../../core/state/card/card.query";
import {ReleaseQuery} from "../../../core/state/release/release.query";


@Component({
  selector: 'app-release-create',
  templateUrl: './release-create.component.html',
  styleUrls: ['./release-create.component.less']
})
export class ReleaseCreateComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() card: Card;
  @Input() releaseType: number;

  currency: Observable<string | undefined>;
  releaseForm: FormGroup;
  categoriesLoading: boolean;
  categories: ReleaseCategory[];

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
      this.categories = this.releaseCategoryQuery.getAll();
    });

    this.releaseForm = this.fb.group({
      installment_value: new FormControl(),
      value: new FormControl(),
      description: new FormControl(),
      date_release: new FormControl(),
      is_paid: new FormControl(),
      category_id: new FormControl(),
      installment_times: new FormControl(),
      place: new FormControl(),
      type: new FormControl(),
      card_id: new FormControl(this.releaseType == 2 ? this.cardQuery.getActiveId() : null)
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
