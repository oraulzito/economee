import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticAccountGraphicComponent } from './statistic-account-graphic.component';

describe('StatisticAccountGraphicComponent', () => {
  let component: StatisticAccountGraphicComponent;
  let fixture: ComponentFixture<StatisticAccountGraphicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticAccountGraphicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticAccountGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
