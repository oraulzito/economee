import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasesAddComponent } from './releases-add.component';

describe('ReleasesAddComponent', () => {
  let component: ReleasesAddComponent;
  let fixture: ComponentFixture<ReleasesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleasesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleasesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
