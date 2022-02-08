import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicProgressBarComponent } from './graphic-progress-bar.component';

describe('ProgressBarComponent', () => {
  let component: GraphicProgressBarComponent;
  let fixture: ComponentFixture<GraphicProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphicProgressBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
