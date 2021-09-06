import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseAddCardComponent } from './release-add-card.component';

describe('ReleaseAddCardComponent', () => {
  let component: ReleaseAddCardComponent;
  let fixture: ComponentFixture<ReleaseAddCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseAddCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseAddCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
