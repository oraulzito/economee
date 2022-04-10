import {Component, Input, OnInit} from '@angular/core';
import {ReleaseCategoryQuery} from "../../../core/state/release/category/release-category.query";
import {ReleaseCategoryService} from "../../../core/state/release/category/release-category.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {UserQuery} from "../../../core/state/user/user.query";
import {ReleaseCategory} from "../../../core/state/release/category/release-category.model";
import {UiStore} from "../../../core/state/ui/ui.store";
import {Order} from "@datorama/akita";


@Component({
  selector: 'app-release-categories',
  templateUrl: './release-categories.component.html',
  styleUrls: ['./release-categories.component.less']
})
export class ReleaseCategoriesComponent implements OnInit {
  @Input()
  isVisible = false;

  categories: ReleaseCategory[];
  userId: number;

  editing = false;
  adding = false;

  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userQuery: UserQuery,
    private uiStore: UiStore,
    private releaseCategoriesQuery: ReleaseCategoryQuery,
    private releaseCategoryService: ReleaseCategoryService,
  ) {
    this.categoryForm = this.fb.group({
      name: new FormControl(''),
      owner_id: new FormControl(this.userQuery.getValue().id),
    });
  }

  ngOnInit(): void {
    this.userQuery.select().subscribe(user => this.userId = user.id);

    this.releaseCategoriesQuery.selectAll({
      sortBy: "owner_id",
      sortByOrder: Order.DESC
    }).subscribe(categories => {
      this.categories = categories;
    });
  }

  add() {
    this.adding = true;
  }

  saveCategory() {
    this.releaseCategoryService.add(this.categoryForm.value).subscribe();
    this.categoryForm.reset('name');
    this.adding = false;
  }

  cancelSave() {
    this.adding = false;
  }

  deleteCategory(id) {
    this.releaseCategoryService.remove(id).subscribe();
  }

  editCategory() {
    this.editing = true;
  }

  saveEditCategory(id) {
    this.releaseCategoryService.update(id, this.categoryForm.value).subscribe();
    this.categoryForm.reset('name');
    this.editing = false;
  }

  cancelEdit() {
    this.editing = false;
  }

  closeCategoriesModal() {
    this.uiStore.update({
      categoriesModalVisible: false
    });
  }

}
