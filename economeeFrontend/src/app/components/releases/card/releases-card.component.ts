import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Release} from '../../../../state/release/release.model';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ReleaseService} from '../../../../state/release/release.service';
import {ReleaseCategoryQuery} from '../../../../state/release-category/release-category.query';
import {ReleaseCategory} from '../../../../state/release-category/release-category.model';
import {DateTime} from 'luxon';
import {AccountQuery} from '../../../../state/account/account.query';
import {Currency} from "../../../../state/currency/currency.model";

@Component({
  selector: 'app-releases-card',
  templateUrl: './releases-card.component.html',
  styleUrls: ['./releases-card.component.css']
})
export class ReleasesCardComponent implements OnInit {

  @Output() saved = new EventEmitter();

  @Input() add: boolean;
  @Input() release: Release;
  @Input() card;

  currency: Currency;

  releaseForm: FormGroup;

  categories: ReleaseCategory[];
  categoriesLoading = false;
  // tslint:disable-next-line:variable-name
  date_release = new Date();
  // TODO make this configurable
  maxRepeatTimes = [12];
  isVisibile = false;

  constructor(
    private fb: FormBuilder,
    private releaseService: ReleaseService,
    private accountQuery: AccountQuery,
    private releaseCategoryQuery: ReleaseCategoryQuery,
  ) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.accountQuery.selectActive().subscribe(r => {
      if (r) {
        this.currency = r.currency
      }
    });

  }

  showModal() {
    this.isVisibile = true;
  }

  modalAction(r) {
    this.isVisibile = r;
  }
}
