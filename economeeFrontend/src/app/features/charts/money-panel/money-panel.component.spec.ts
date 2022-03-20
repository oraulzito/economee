import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyPanelComponent } from './money-panel.component';

describe('StatisticAccountChartComponent', () => {
  let component: MoneyPanelComponent;
  let fixture: ComponentFixture<MoneyPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoneyPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
