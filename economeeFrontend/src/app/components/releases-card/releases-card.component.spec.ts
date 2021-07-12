import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasesCardComponent } from './releases-card.component';

describe('ReleasesCardComponent', () => {
  let component: ReleasesCardComponent;
  let fixture: ComponentFixture<ReleasesCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleasesCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleasesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
