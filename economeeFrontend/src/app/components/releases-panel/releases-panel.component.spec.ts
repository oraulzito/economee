import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasesPanelComponent } from './releases-panel.component';

describe('ReleasesPanelComponent', () => {
  let component: ReleasesPanelComponent;
  let fixture: ComponentFixture<ReleasesPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleasesPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleasesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
