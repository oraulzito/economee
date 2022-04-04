import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseCategoriesComponent } from './release-categories.component';

describe('ReleaseCategoriesComponent', () => {
  let component: ReleaseCategoriesComponent;
  let fixture: ComponentFixture<ReleaseCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReleaseCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
