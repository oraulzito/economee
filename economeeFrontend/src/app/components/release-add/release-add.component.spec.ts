import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseAddComponent } from './release-add.component';

describe('ReleaseAddCardComponent', () => {
  let component: ReleaseAddComponent;
  let fixture: ComponentFixture<ReleaseAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
