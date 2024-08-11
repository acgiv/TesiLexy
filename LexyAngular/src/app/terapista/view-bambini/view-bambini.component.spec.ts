import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBambiniComponent } from './view-bambini.component';

describe('ViewBambiniComponent', () => {
  let component: ViewBambiniComponent;
  let fixture: ComponentFixture<ViewBambiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBambiniComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewBambiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
