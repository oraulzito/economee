import {Component, Input, OnInit} from '@angular/core';
import {Release} from '../../../state/release/release.model';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ReleaseService} from '../../../state/release/release.service';
import {ReleaseCategoryQuery} from '../../../state/release-category/release-category.query';
import {ReleaseCategory} from '../../../state/release-category/release-category.model';
import {DateTime} from 'luxon';
import {AccountQuery} from '../../../state/account/account.query';

@Component({
  selector: 'app-releases-card',
  templateUrl: './releases-card.component.html',
  styleUrls: ['./releases-card.component.css']
})
export class ReleasesCardComponent implements OnInit {

  @Input() add: boolean;
  @Input() release: Release;

  currency: string;

  releaseForm: FormGroup;

  categories: ReleaseCategory[];
  categoriesLoading = false;
  // tslint:disable-next-line:variable-name
  date_release = new Date();

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
        this.currency = r.currency.symbol;
      }
    });

    this.releaseCategoryQuery.selectLoading().subscribe(cl => {
      this.categoriesLoading = cl;
      if (!cl) {
        this.releaseCategoryQuery.selectAll().subscribe(c => this.categories = c);
      }
    });

    this.releaseForm = this.fb.group({
      value: new FormControl(),
      description: new FormControl(),
      date_release: new FormControl(),
      is_release_paid: new FormControl(),
      category_id: new FormControl(),
      repeat_times: new FormControl(),
      place: new FormControl(),
      type: new FormControl(),
    });

    if (!this.add) {
      this.date_release = DateTime.fromSQL(this.release.date_release).toISODate();
    }
  }


  // tslint:disable-next-line:typedef
  edit(id) {
    this.releaseService.update(id, this.releaseForm.value);
  }

  // tslint:disable-next-line:typedef
  delete(id) {
    this.releaseService.remove(id);
  }

}
