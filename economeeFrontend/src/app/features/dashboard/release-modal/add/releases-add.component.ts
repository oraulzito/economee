import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Card} from "../../../../core/state/card/card.model";
import {Release} from "../../../../core/state/release/release.model";
import {Currency} from "../../../../core/state/currency/currency.model";
import {ReleaseCategory} from "../../../../core/state/release-category/release-category.model";
import {ReleaseService} from "../../../../core/state/release/release.service";
import {AccountQuery} from "../../../../core/state/account/account.query";
import {ReleaseCategoryQuery} from "../../../../core/state/release-category/release-category.query";

@Component({
  selector: 'app-releases-add',
  templateUrl: './releases-add.component.html',
  styleUrls: ['./releases-add.component.s.less']
})
export class ReleasesAddComponent implements OnInit {

  @Input() card: Card;
  @Input() release?: Release;
  @Output() saved = new EventEmitter();

  currency: Currency;
  releaseForm: FormGroup;
  categoriesLoading: boolean;
  categories: ReleaseCategory[];

  constructor(
    private fb: FormBuilder,
    private releaseService: ReleaseService,
    private accountQuery: AccountQuery,
    private releaseCategoryQuery: ReleaseCategoryQuery
  ) {
  }

  ngOnInit() {
    this.accountQuery.selectActive().subscribe(r => {
      if (r) {
        this.currency = r.currency
      }
    });

    this.releaseCategoryQuery.selectLoading().subscribe(cl => {
      this.categoriesLoading = cl;
      if (!cl) {
        this.releaseCategoryQuery.selectAll().subscribe(c => this.categories = c);
      }
    });

    this.releaseForm = this.fb.group({
      installment_value: new FormControl(),
      value: new FormControl(),
      description: new FormControl(),
      date_release: new FormControl(),
      is_release_paid: new FormControl(),
      category_id: new FormControl(),
      repeat_times: new FormControl(),
      place: new FormControl(),
      type: new FormControl(),
      card: new FormControl(this.card)
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
    return this.releaseService.add(this.releaseForm.value, this.card).subscribe(
      r => {
        this.saved.emit(false);
      },
      (e) => this.saved.emit(true)
    );
  }

  // tslint:disable-next-line:typedef
  cancelRelease() {
    this.saved.emit(true);
  }

}
