import { createStore, withProps } from '@ngneat/elf';
import { withEntities, selectAllEntities, setEntities, addEntities, updateEntities, deleteEntities, withUIEntities, withActiveId, selectActiveEntity, setActiveId, withActiveIds, selectActiveEntities, toggleActiveIds } from '@ngneat/elf-entities';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export interface CategoryUI {
  id: number;
}

export interface Category {
  id: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CategoryProps {
}

@Injectable({ providedIn: 'root' })
export class CategoryRepository {
  activeCategory$: Observable<Category[]>;
  activeCategory$: Observable<Category | undefined>;
  category$: Observable<Category[]>;

  private store;

  constructor() {
    this.store = this.createStore();
    this.category$ = this.store.pipe(selectAllEntities());
    this.activeCategory$ = this.store.pipe(selectActiveEntity());
    this.activeCategory$ = this.store.pipe(selectActiveEntities());
  }

  setCategory(category: Category[]) {
    this.store.update(setEntities(category));
  }

  addCategory(category: Category) {
    this.store.update(addEntities(category));
  }

  updateCategory(id: Category['id'], category: Partial<Category>) {
    this.store.update(updateEntities(id, category));
  }

  deleteCategory(id: Category['id']) {
    this.store.update(deleteEntities(id));
  }

  setActiveId(id: Category['id']) {
    this.store.update(setActiveId(id));
  }

  toggleActiveIds(ids: Array<Category['id']>) {
    this.store.update(toggleActiveIds(ids));
  }

  private createStore(): typeof store {
    const store = createStore({ name: 'category' }, withProps<CategoryProps>({}), withEntities<Category, 'id'>({ idKey: 'id' }), withUIEntities<CategoryUI, 'id'>({ idKey: 'id' }), withActiveId(), withActiveIds());

    return store;
  }
}
