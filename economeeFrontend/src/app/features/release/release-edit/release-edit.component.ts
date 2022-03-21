import {Component, Input, OnInit} from '@angular/core';
import {Release} from "../../../core/state/release/release.model";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

import {ReleaseService} from "../../../core/state/release/release.service";
import {AccountQuery} from "../../../core/state/account/account.query";
import {ReleaseCategory} from "../../../core/state/release/category/release-category.model";
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

  ngOnInit() {
    this.currency = this.accountQuery.currencySymbol$;

    this.releaseCategoryQuery.selectLoading().subscribe(cl => {
      this.categoriesLoading = cl;
      this.categories = this.releaseCategoryQuery.getAll();
    });

    this.releaseForm = this.fb.group({
      installment_value: new FormControl(this.release.installment_value),
      value: new FormControl(this.release.value),
      description: new FormControl(this.release.description),
      date_release: new FormControl(this.release.date_release),
      is_paid: new FormControl(this.release.is_paid),
      category_id: new FormControl(this.release.category.id),
      installment_times: new FormControl(this.release.installment_times),
      place: new FormControl(this.release.place),
      type: new FormControl(this.release.type),
      invoice_id: new FormControl(this.release.invoice_id)
    });
  }

  // tslint:disable-next-line:typedef
  editRelease() {
    this.releaseService.update(this.release.id, this.releaseForm.value).subscribe(
      r => this.isVisible = false,
      e => alert(e)
    );
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
