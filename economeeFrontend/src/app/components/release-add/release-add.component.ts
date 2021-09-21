import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ReleaseService} from '../../../state/release/release.service';
import {AccountQuery} from '../../../state/account/account.query';
import {ReleaseCategoryQuery} from '../../../state/release-category/release-category.query';
import {ReleaseCategory} from '../../../state/release-category/release-category.model';


@Component({
  selector: 'app-release-add',
  templateUrl: './release-add.component.html',
  styleUrls: ['./release-add.component.css']
})
export class ReleaseAddComponent implements OnInit {
  @Output() saved = new EventEmitter();
  @Input() card = false;

  currency: string;
  releaseForm: FormGroup;
  categories: ReleaseCategory[];
  categoriesLoading = true;

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
  }

  // tslint:disable-next-line:typedef
  save() {
    return this.releaseService.add(this.releaseForm.value, this.card).subscribe(
      r => {
        this.saved.emit('false');
        this.releaseCategoryQuery.selectAll().subscribe(c => this.categories = c);
      },
      (e) => this.saved.emit('true')
    );
  }

  // tslint:disable-next-line:typedef
  cancel() {
    this.saved.emit('true');
  }
}
