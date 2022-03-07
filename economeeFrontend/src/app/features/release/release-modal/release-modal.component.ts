import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Card} from "../../../core/state/card/card.model";
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
  selector: 'app-release-modal',
  templateUrl: './release-modal.component.html',
  styleUrls: ['./release-modal.component.less']
})
export class ReleaseModalComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() card: Card;
  @Input() release?: Release;
  @Input() releaseType: number;
  @Output() saved = new EventEmitter();

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
  formatterCurrency = (value: number): string => `R$ ${value}`;
  formatterInstallments = (value: number): string => `${value} X`;

  ngOnInit() {
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
      card_id: new FormControl(this.releaseType == 2 ? this.cardQuery.getActive() : null)
    });
  }

  // tslint:disable-next-line:typedef
  editRelease(id) {
    this.releaseService.update(id, this.releaseForm.value).subscribe();
  }

  // tslint:disable-next-line:typedef
  deleteRelease(id) {
    this.releaseService.remove(id);
  }

  // tslint:disable-next-line:typedef
  saveRelease() {
    return this.releaseService.add(this.releaseForm.value).subscribe(
      r => console.log(r),
      (e) => this.saved.emit(true),
      () => this.isVisible = false
    );
  }

  // tslint:disable-next-line:typedef
  cancelRelease() {
    this.saved.emit(true);
  }

  handleOk(): void {

    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
