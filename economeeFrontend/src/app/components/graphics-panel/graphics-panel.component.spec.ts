import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicsPanelComponent } from './graphics-panel.component';

describe('GraphicsPanelComponent', () => {
  let component: GraphicsPanelComponent;
  let fixture: ComponentFixture<GraphicsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphicsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
