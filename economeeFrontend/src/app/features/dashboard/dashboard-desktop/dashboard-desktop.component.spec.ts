import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDesktopComponent } from './dashboard-desktop.component';

describe('DashboardDesktopComponent', () => {
  let component: DashboardDesktopComponent;
  let fixture: ComponentFixture<DashboardDesktopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardDesktopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
