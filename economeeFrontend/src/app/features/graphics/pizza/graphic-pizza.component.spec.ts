import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicPizzaComponent } from './graphic-pizza.component';

describe('GraphicPizzaComponent', () => {
  let component: GraphicPizzaComponent;
  let fixture: ComponentFixture<GraphicPizzaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphicPizzaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicPizzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
