import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotDataComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let component: NotDataComponent;
  let fixture: ComponentFixture<NotDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
