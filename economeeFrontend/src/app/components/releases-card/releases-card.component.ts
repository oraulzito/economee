import {Component, Input, OnInit} from '@angular/core';
import {Release} from '../../../state/release/release.model';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ReleaseService} from '../../../state/release/release.service';
import {ReleaseCategoryQuery} from '../../../state/release-category/release-category.query';
import {isEmpty} from '@datorama/akita';
import {ReleaseCategory} from '../../../state/release-category/release-category.model';
import {DateTime} from 'luxon';

@Component({
  selector: 'app-releases-card',
  templateUrl: './releases-card.component.html',
  styleUrls: ['./releases-card.component.css']
})
export class ReleasesCardComponent implements OnInit {

  @Input() release: Release;
  @Input() currency: string;

  releaseForm: FormGroup;

  categories: ReleaseCategory[];
  categoriesLoading = false;
  date_release = new Date();

  constructor(
    private fb: FormBuilder,
    private releaseService: ReleaseService,
    private releaseCategoryQuery: ReleaseCategoryQuery,
  ) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.date_release = DateTime.fromSQL(this.release.date_release).toISODate();
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
      type: new FormControl(),
    });

    if (isEmpty(this.release)) {
      this.release = new class implements Release {
        // tslint:disable-next-line:variable-name
        balance_id: 0;
        category: ReleaseCategory;
        // tslint:disable-next-line:variable-name
        date_release: '';
        // tslint:disable-next-line:variable-name
        date_repeat: '';
        description: '';
        id: 0;
        // tslint:disable-next-line:variable-name
        installment_number: 0;
        // tslint:disable-next-line:variable-name
        invoice_id: 0;
        // tslint:disable-next-line:variable-name
        is_release_paid: false;
        // tslint:disable-next-line:variable-name
        repeat_times: 0;
        type: '';
        value: 0;
      };
    }
  }

  // tslint:disable-next-line:typedef
  edit(id) {
    this.releaseService.update(id, this.releaseForm.value).subscribe();
  }

// tslint:disable-next-line:typedef
  delete(id) {
    this.releaseService.remove(id).subscribe();
  }

}
